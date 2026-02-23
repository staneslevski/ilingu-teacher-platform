import React from "react";
import { PropTypes, instanceOf } from "prop-types";
import { Auth } from "aws-amplify";
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { withCookies, Cookies } from "react-cookie";
import config from "../../config";
import { createTeacher } from "../../libs/ilingu-libs/teacher";
import { createStudent } from "../../libs/ilingu-libs/student";


import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { Check, Email, LockQuestion, Onepassword } from "mdi-material-ui";

import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import Code from "@material-ui/icons/Code";

import registerPageStyle from "../../assets/jss/material-dashboard-pro-react/views/registerPageStyle";

const styles = {
  ...registerPageStyle,
  errorMsg: {
    color: "#f44336"
  }
};

class SignUpTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: "RegisterForm",
      isRegisterFormShown: true,
      isConfirmationFormShown: false,
      payload: {},
      confirmForm: {
        code: ""
      },
      agreeTerms: false
    };
    this.change = this.change.bind(this);
    this.handleTerms = this.handleTerms.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }
  componentDidMount() {
    Auth.signOut();
  }
  change(event) {
    const payload = { ...this.state.payload };
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const value = event.target.value;
    this.setState({
      payload: {
        ...payload,
        [event.target.id]: event.target.value
      }
    });
    switch (event.target.id) {
      case "email":
        if (value && emailRegex.test(value)) {
          this.setState({ emailState: "success" });
        } else {
          this.setState({ emailState: "error" });
        }
        break;
      case "password":
        if (value && passwordRegex.test(value)) {
          this.setState({ passwordState: "success" });
        } else {
          this.setState({ passwordState: "error" });
        }
        break;
      case "confirmPassword":
        if (value && value === this.state.payload.password) {
          this.setState({ confirmPasswordState: "success" });
        } else {
          this.setState({ confirmPasswordState: "error" });
        }
        break;
      case "teacherName":
        if (value) {
          this.setState({ teacherNameState: "success" });
        } else {
          this.setState({ teacherNameState: "error" });
        }
        break;
      case "phone":
        if (value) {
          this.setState({ phoneState: "success" });
        } else {
          this.setState({ phoneState: "error" });
        }
        break;
      default:
        console.log("SignUpTeacher Switch failed to find a case")
    }
  }
  handleTerms() {
    this.setState({
      agreeTerms: !this.state.agreeTerms
    });
  }
  signIn = async () => {
    try {
      await Auth.signIn(this.state.payload.email, this.state.payload.password)
        .catch(err => {
          if (err.code === "UserNotConfirmedException") {
            this.setState({
              isRegisterFormShown: false,
              isConfirmationFormShown: true,
              visible: "ConfirmationForm"
            });
          }
        });
      this.props.checkAuthState();
    } catch (e) {
      this.setState({
        loginErrorMessage: e.message
      });
    }
  };
  handleSignUp = async event => {
    event.preventDefault();
    try {
      await Auth.signUp({
        username: this.state.payload.email,
        password: this.state.payload.password
      })
        .then(data => {
          this.props.cookies.set("userSub", data.userSub, {
            domain: config.domain.name,
            secure: config.domain.secure
          });
          let userId = data.userSub;
          let body = {
            userId: userId,
            email: this.state.payload.email,
            teacherName: this.state.payload.teacherName,
            phone: this.state.payload.phone,
            weChatId: this.state.payload.weChatId,
            englishName: this.state.payload.englishName
          };
          let studentBody = JSON.parse(JSON.stringify(body));
          if (studentBody.englishName) {
            studentBody.studentName = studentBody.englishName;
            delete studentBody.englishName;
          } else {
            studentBody.studentName = studentBody.teacherName;
          }
          studentBody.chineseName = studentBody.teacherName;
          delete studentBody.teacherName;
          createStudent(studentBody);
          createTeacher(body).then(() =>
            this.setState({
              visible: "ConfirmationForm",
              isRegisterFormShown: false,
              isConfirmationFormShown: true
            })
          );
        })
        .catch(err => this.setState({ authErrorMessage: err.message }));
      this.props.cookies.set("selfsignup", true, {
        domain: config.domain.name,
        secure: config.domain.secure
      });
    } catch (e) {
      this.setState({
        authErrorMessage: e.message
      });
    }
  };
  handleConfirmChange = event => {
    const { confirmForm } = this.state;
    this.setState({
      confirmForm: {
        ...confirmForm,
        [event.target.id]: event.target.value
      }
    });
  };
  validateConfirmForm() {
    return this.state.confirmForm.code.length > 0;
  }
  handleConfirm = async () => {
    try {
      await Auth.confirmSignUp(
        this.state.payload.email,
        this.state.confirmForm.code
      )
        .then(data => {
          this.signIn().then((data => window.location.reload()));
        })
        .catch(err => this.setState({ confirmErrorMessage: err.message }));
    } catch (e) {
      this.setState({ confirmErrorMessage: e.message });
    }
  };
  handleResendCodeResult(err, result) {
    if (err) {
      this.setState({
        resendConfirmationResult: err.message
      });
      return;
    }
    this.setState({
      resendConfirmationResult: "New Confirmation Code Sent"
    });
  }
  resendConfirmationCode = () => {
    this.setState({
      resendConfirmationResult: ""
    });
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const cognitoUser = new CognitoUser({
      Username: this.state.payload.email,
      Pool: userPool
    });
    cognitoUser.resendConfirmationCode(this.handleResendCodeResult);
  };
  render() {
    const { classes } = this.props;
    const { isRegisterFormShown, isConfirmationFormShown, confirmErrorMessage } = this.state;
    const fields = [
      {
        key: "1",
        id: "email",
        type: "email",
        icon: Email,
        placeholder: "Email..."
      },
      {
        key: "2",
        id: "password",
        type: "password",
        icon: LockQuestion,
        placeholder: "Password..."
      },
      {
        key: "3",
        id: "confirmPassword",
        type: "password",
        icon: Onepassword,
        placeholder: "Confirm Password..."
      },
      {
        key: "4",
        id: "teacherName",
        type: "text",
        icon: Email,
        placeholder: "Teacher Name..."
      },
      {
        key: "5",
        id: "phone",
        type: "text",
        icon: Email,
        placeholder: "Phone..."
      },
      {
        key: "6",
        id: "englishName",
        type: "text",
        icon: Email,
        placeholder: "English Name(Optional)..."
      },
      {
        key: "7",
        id: "weChatId",
        type: "text",
        icon: Email,
        placeholder: "WeChat ID(Optional)..."
      }
    ];
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10}>
            <Card className={classes.cardSignup}>
              <h2 className={classes.cardTitle}>Register</h2>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={8} md={5}>
                    {isRegisterFormShown ? (
                      <form className={classes.form}>
                        {fields.map(prop => {
                          return (
                            <CustomInput
                              key={prop.key}
                              id={prop.id}
                              formControlProps={{
                                fullWidth: true,
                                className: classes.customFormControlClasses
                              }}
                              inputProps={{
                                startAdornment: (
                                  <InputAdornment
                                    position="start"
                                    className={classes.inputAdornment}
                                  >
                                    <prop.icon className={classes.inputAdornmentIcon} />
                                  </InputAdornment>
                                ),
                                placeholder: prop.placeholder,
                                onChange: event => this.change(event),
                                type: prop.type,
                                value: this.state.payload[prop.id] || ""
                              }}
                            />
                          );
                        })}
                        <div className={classes.center}>
                          {this.state.authErrorMessage ? (
                            <p className={classes.errorMsg}>
                              {this.state.authErrorMessage}
                            </p>
                          ) : null}
                          {this.state.emailState === "error" ? (
                            <p className={classes.errorMsg}>
                              Email is incorrect.
                            </p>
                          ) : this.state.teacherNameState === "error" ? (
                            <p className={classes.errorMsg}>
                              Teacher name is incorrect.
                            </p>
                          ) : this.state.phoneState === "error" ? (
                            <p className={classes.errorMsg}>
                              Phone is incorrect.
                            </p>
                          ) : this.state.passwordState === "error" ? (
                            <p className={classes.errorMsg}>
                              Password must contains uppercase letter, lowercase
                              letter, and number, at least 8 characters.
                            </p>
                          ) : this.state.confirmPasswordState === "error" ? (
                            <p className={classes.errorMsg}>
                              Confirm password is not equal to password.
                            </p>
                          ) : null}
                        </div>
                        <FormControlLabel
                          classes={{
                            root: classes.checkboxLabelControl,
                            label: classes.checkboxLabel
                          }}
                          control={
                            <Checkbox
                              checked={this.state.agreeTerms}
                              value="Agree Terms"
                              onClick={() => this.handleTerms()}
                              checkedIcon={
                                <Check className={classes.checkedIcon} />
                              }
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{
                                checked: classes.checked
                              }}
                            />
                          }
                          label={
                            <span>
                              I agree to the
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://ilingu.com/terms"
                              >
                                iLingu terms and conditions
                              </a>.
                            </span>
                          }
                        />
                        <div className={classes.center}>
                          <Button
                            round
                            color="primary"
                            disabled={
                              this.state.emailState !== "success" ||
                              this.state.passwordState !== "success" ||
                              this.state.confirmPasswordState !== "success" ||
                              !this.state.agreeTerms
                            }
                            type="submit"
                            onClick={this.handleSignUp}
                          >
                            Get started
                          </Button>
                        </div>
                      </form>
                    ) : null}
                    {isConfirmationFormShown ? (
                      <form className={classes.form} onSubmit={this.handleConfirm}>
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
                        <p>
                          <a className={classes.resendCodeLink} onClick={this.resendConfirmationCode}>
                            Resend Confirmation Code
                          </a>
                        </p>
                        <p className={classes.resendResult}>
                          {confirmErrorMessage}
                          {this.state.resendConfirmationResult}
                        </p>
                        <Button
                          onClick={this.handleConfirm}
                          round
                          color="primary"
                          disabled={!this.validateConfirmForm()}
                        >
                          Confirm
                        </Button>
                      </form>
                    ) : null}
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

SignUpTeacher.propTypes = {
  classes: PropTypes.object.isRequired,
  checkAuthState: PropTypes.func,
  cookies: instanceOf(Cookies).isRequired,
  history: PropTypes.object
};

export default withStyles(styles)(withCookies(SignUpTeacher));
