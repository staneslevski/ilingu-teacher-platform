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
import Button from "../CustomButtons/Button.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";
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
        .then(() => {
          this.signIn().then((() => window.location.reload()));
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
      Username: this.props.email,
      Pool: userPool
    });
    cognitoUser.resendConfirmationCode(this.handleResendCodeResult);
  };
  render() {
    const { classes } = this.props;
    const { confirmErrorMessage } = this.state;
    return (
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
