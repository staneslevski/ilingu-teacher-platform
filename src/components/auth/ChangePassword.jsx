import React from "react";
import { PropTypes, instanceOf } from "prop-types";
import { Auth } from "aws-amplify";
import { withCookies, Cookies } from "react-cookie";

import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

import Button from "../CustomButtons/Button.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";
import Card from "../card/Card.jsx";
import CardBody from "../Card/CardBody.jsx";
import CardHeader from "../Card/CardHeader.jsx";
import CardFooter from "../Card/CardFooter.jsx";

import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimation: "cardHidden",
      message: "",
      changePasswordForm: {
        oldPassword: "",
        newPassword: "",
        newPasswordAgain: ""
      },
    };
    this.validateConfirmForm = this.validateConfirmForm.bind(this);
    this.validateChangePasswordForm = this.validateChangePasswordForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }
  validateChangePasswordForm() {
    return (
      this.state.changePasswordForm.newPassword.length > 0 &&
      this.state.changePasswordForm.newPasswordAgain.length > 0 &&
      (
        this.state.changePasswordForm.newPassword ===
        this.state.changePasswordForm.newPasswordAgain
      )
    );
  }
  handleChange = event => {
    const { changePasswordForm } = this.state;
    this.setState({
      changePasswordForm: {
        ...changePasswordForm,
        [event.target.id]: event.target.value
      }
    });
  };
  handleChangePassword = async event => {
    event.preventDefault();
    try {
      await Auth.signIn(
        this.state.loginForm.email,
        this.state.loginForm.password
      )
        .then(user => {
          Auth.changePassword(
            user,
            this.state.changePasswordForm.oldPassword,
            this.state.changePasswordForm.newPassword
          );
        })
        .catch(err => {
          this.setState({
            changePasswordErrorMessage: err.message
          });
        });
      this.props.checkAuthState();
      this.props.history.push("/");
    } catch (e) {
      this.setState({
        changePasswordErrorMessage: e.message
      });
    }
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimation: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  render() {
    const { classes } = this.props;
    const {
      changePasswordErrorMessage,
    } = this.state;
    return (
      <form onSubmit={this.handleChangePassword}>
        <Card login className={classes[this.state.cardAnimation]}>
          <CardHeader
            className={`${classes.cardHeader} ${classes.textCenter}`}
            color="rose"
          >
            <h4 className={classes.cardTitle}>Change Password</h4>
          </CardHeader>
          <CardBody>
            <CustomInput
              labelText="Old Password"
              id="oldPassword"
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
                onChange: this.handleChange,
                value: this.state.changePasswordForm.oldPassword
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
                onChange: this.handleChange,
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
                onChange: this.handleChange,
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
    );
  }
}

ChangePasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  checkAuthState: PropTypes.func,
  cookies: instanceOf(Cookies).isRequired,
  history: PropTypes.object
};

export default withStyles(loginPageStyle)(withCookies(ChangePasswordForm));
