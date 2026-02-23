import React, {Fragment} from "react";
import { PropTypes, instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import Code from "@material-ui/icons/Code";

// core components
import GridContainer from "../Grid/GridContainer.jsx";
import GridItem from "../Grid/GridItem.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";
import Button from "../CustomButtons/Button.jsx";
import Card from "../Card/Card.jsx";
import CardBody from "../Card/CardBody.jsx";
import CardHeader from "../Card/CardHeader.jsx";
import CardFooter from "../Card/CardFooter.jsx";

import loginPageStyle from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

class AuthButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden",
      isLoginFormShown: true,
      isConfirmationFormShown: false,
      isChangePasswordFormShown: false,
      isForgotPasswordFormShown: false,
      isForgotPasswordSubmitFormShown: false,
      open: false
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  showForgotPasswordForm = () => {
    this.setState({
      isLoginFormShown: false,
      isConfirmationFormShown: false,
      isChangePasswordFormShown: false,
      isForgotPasswordFormShown: true,
      isForgotPasswordSubmitFormShown: false
    });
  };
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount(){
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  render() {
    const { classes } = this.props;
    const {
      isLoginFormShown,
      isConfirmationFormShown,
      isChangePasswordFormShown,
      isForgotPasswordFormShown,
      isForgotPasswordSubmitFormShown,
      loginErrorMessage,
      confirmErrorMessage,
      changePasswordErrorMessage,
      forgotPasswordErrorMessage,
      forgotPasswordSubmitErrorMessage
    } = this.state;
    return (
      <Fragment>
        <Button round onClick={this.handleClickOpen} color="primary" size="sm">Login</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12}>
                  {isLoginFormShown ? (
                    <form onSubmit={this.handleSignIn}>
                      <Card className={classes[this.state.cardAnimaton]}>
                        <CardHeader
                          className={`${classes.cardHeader} ${classes.textCenter}`}
                          color="rose"
                        >
                          <h4 className={classes.cardTitle}>Log in</h4>
                        </CardHeader>
                        <CardBody>
                          <CustomInput
                            labelText="Email..."
                            id="emailAsName"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Email className={classes.inputAdornmentIcon} />
                                </InputAdornment>
                              ),
                              onChange: this.handleLoginChange,
                              value: this.state.loginForm.emailAsName
                            }}
                          />
                          <CustomInput
                            labelText="Password"
                            id="password"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputAdornmentIcon}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              type: "password",
                              onChange: this.handleLoginChange,
                              value: this.state.loginForm.password
                            }}
                          />
                          <p>
                            <a className={classes.forgotPasswordLink} onClick={this.showForgotPasswordForm}>
                              Forgot Password?
                            </a>
                          </p>
                          <p>{loginErrorMessage}</p>
                        </CardBody>
                        <CardFooter className={classes.justifyContentCenter}>
                          <Button
                            color="rose"
                            simple
                            size="lg"
                            block
                            disabled={!this.validateLoginForm()}
                            type="submit"
                          >
                            Login
                          </Button>
                        </CardFooter>
                      </Card>
                    </form>
                  ) : null}
                  {isConfirmationFormShown ? (
                    <form onSubmit={this.handleConfirm}>
                      <Card className={classes[this.state.cardAnimaton]}>
                        <CardHeader
                          className={`${classes.cardHeader} ${classes.textCenter}`}
                          color="rose"
                        >
                          <h4 className={classes.cardTitle}>Confirmation</h4>
                          <p>
                            You have been sent a verification code to the email address you used to register.
                            <br/>
                            Please input the code below.</p>
                        </CardHeader>
                        <CardBody>
                          <CustomInput
                            labelText="Code"
                            id="code"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Code className={classes.inputAdornmentIcon} />
                                </InputAdornment>
                              ),
                              onChange: this.handleConfirmChange,
                              value: this.state.confirmForm.code
                            }}
                          />
                          <p>{confirmErrorMessage}</p>
                        </CardBody>
                        <CardFooter className={classes.justifyContentCenter}>
                          <Button
                            color="rose"
                            simple
                            size="lg"
                            block
                            disabled={!this.validateConfirmForm()}
                            type="submit"
                          >
                            Confirm
                          </Button>
                        </CardFooter>
                      </Card>
                    </form>
                  ) : null}
                  {isChangePasswordFormShown ? (
                    <form onSubmit={this.handleChangePassword}>
                      <Card login className={classes[this.state.cardAnimaton]}>
                        <CardHeader
                          className={`${classes.cardHeader} ${classes.textCenter}`}
                          color="rose"
                        >
                          <h4 className={classes.cardTitle}>Change Password</h4>
                        </CardHeader>
                        <CardBody>
                          <CustomInput
                            labelText="New Password"
                            id="newPassword"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputAdornmentIcon}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              type: "password",
                              onChange: this.handleChangePasswordChange,
                              value: this.state.changePasswordForm.newPassword
                            }}
                          />
                          <CustomInput
                            labelText="New Password Again"
                            id="newPasswordAgain"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputAdornmentIcon}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              type: "password",
                              onChange: this.handleChangePasswordChange,
                              value: this.state.changePasswordForm.newPasswordAgain
                            }}
                          />
                          <p>{changePasswordErrorMessage}</p>
                        </CardBody>
                        <CardFooter className={classes.justifyContentCenter}>
                          <Button
                            color="rose"
                            simple
                            size="lg"
                            block
                            disabled={!this.validateChangePasswordForm()}
                            type="submit"
                          >
                            Confirm
                          </Button>
                        </CardFooter>
                      </Card>
                    </form>
                  ) : null}
                  {isForgotPasswordFormShown ? (
                    <form onSubmit={this.handleForgotPassword}>
                      <Card className={classes[this.state.cardAnimaton]}>
                        <CardHeader
                          className={`${classes.cardHeader} ${classes.textCenter}`}
                          color="rose"
                        >
                          <h4 className={classes.cardTitle}>Forgot Password</h4>
                        </CardHeader>
                        <CardBody>
                          <CustomInput
                            labelText="Email..."
                            id="email"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Email className={classes.inputAdornmentIcon} />
                                </InputAdornment>
                              ),
                              onChange: this.handleForgotPasswordChange,
                              value: this.state.forgotPasswordForm.email
                            }}
                          />
                          <p>{forgotPasswordErrorMessage}</p>
                        </CardBody>
                        <CardFooter className={classes.justifyContentCenter}>
                          <Button
                            color="rose"
                            simple
                            size="lg"
                            block
                            disabled={!this.validateForgotPasswordForm()}
                            type="submit"
                          >
                            Send Code to My Email
                          </Button>
                        </CardFooter>
                      </Card>
                    </form>
                  ) : null}
                  {isForgotPasswordSubmitFormShown ? (
                    <form onSubmit={this.handleForgotPasswordSubmit}>
                      <Card className={classes[this.state.cardAnimaton]}>
                        <CardHeader
                          className={`${classes.cardHeader} ${classes.textCenter}`}
                          color="rose"
                        >
                          <h4 className={classes.cardTitle}>Reset Password</h4>
                        </CardHeader>
                        <CardBody>
                          <CustomInput
                            labelText="Code"
                            id="code"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Code className={classes.inputAdornmentIcon} />
                                </InputAdornment>
                              ),
                              onChange: this.handleForgotPasswordSubmitChange,
                              value: this.state.forgotPasswordSubmitForm.code
                            }}
                          />
                          <CustomInput
                            labelText="New Password"
                            id="newPassword"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputAdornmentIcon}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              type: "password",
                              onChange: this.handleForgotPasswordSubmitChange,
                              value: this.state.forgotPasswordSubmitForm.newPassword
                            }}
                          />
                          <CustomInput
                            labelText="New Password Again"
                            id="newPasswordAgain"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className={classes.inputAdornmentIcon}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              type: "password",
                              onChange: this.handleForgotPasswordSubmitChange,
                              value: this.state.forgotPasswordSubmitForm.newPasswordAgain
                            }}
                          />
                          <p>{forgotPasswordSubmitErrorMessage}</p>
                        </CardBody>
                        <CardFooter className={classes.justifyContentCenter}>
                          <Button
                            color="rose"
                            simple
                            size="lg"
                            block
                            disabled={!this.validateForgotPasswordSubmitForm()}
                            type="submit"
                          >
                            Submit
                          </Button>
                        </CardFooter>
                      </Card>
                    </form>
                  ) : null}
                </GridItem>
              </GridContainer>
            </div>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

AuthButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  checkAuthState: PropTypes.func,
  cookies: instanceOf(Cookies).isRequired,
  history: PropTypes.object
};

export default withStyles(loginPageStyle)(withCookies(AuthButtons));
