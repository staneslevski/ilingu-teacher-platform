// import libraries
import React from "react";
import { Auth } from "aws-amplify";
import { createAddress } from "../../libs/ilingu-libs/address";
import { createTeacher } from "../../libs/ilingu-libs/teacher";
import { Email } from "mdi-material-ui";

// import config
import config from "../../config.js";

// import icons
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// import stock components
import Button from "../CustomButtons/Button.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";
import Card from "../Card/Card.jsx";
import CardBody from "../Card/CardBody.jsx";
import CardHeader from "../Card/CardHeader.jsx";
import CardFooter from "../Card/CardFooter.jsx";

// import styles
import loginPageStyle from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import {withCookies} from "react-cookie";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimation: "cardHidden",
      visible: "",
      isLoginFormShown: true,
      isConfirmationFormShown: false,
      isChangePasswordFormShown: false,
      isForgotPasswordFormShown: false,
      isForgotPasswordSubmitFormShown: false,
      isProfileFormShown: false,
      loginErrorMessage: "",
      confirmErrorMessage: "",
      changePasswordErrorMessage: "",
      forgotPasswordErrorMessage: "",
      forgotPasswordSubmitErrorMessage: "",
      addProfileErrorMessage: "",
      loginForm: {
        email: "",
        password: ""
      },
      confirmForm: {
        code: ""
      },
      changePasswordForm: {
        newPassword: "",
        newPasswordAgain: ""
      },
      forgotPasswordForm: {
        email: ""
      },
      forgotPasswordSubmitForm: {
        code: "",
        newPassword: "",
        newPasswordAgain: ""
      }
    };
    this.validateLoginForm = this.validateLoginForm.bind(this);
    this.validateConfirmForm = this.validateConfirmForm.bind(this);
    this.validateChangePasswordForm = this.validateChangePasswordForm.bind(this);
    this.validateForgotPasswordForm = this.validateForgotPasswordForm.bind(this);
    this.validateForgotPasswordSubmitForm = this.validateForgotPasswordSubmitForm.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.handleChangePasswordChange = this.handleChangePasswordChange.bind(this);
    this.handleForgotPasswordChange = this.handleForgotPasswordChange.bind(this);
    this.handleForgotPasswordSubmitChange = this.handleForgotPasswordSubmitChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.handleForgotPasswordSubmit = this.handleForgotPasswordSubmit.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
  }

  showForgotPasswordForm = () => {
    this.setState({
      isLoginFormShown: false,
      isConfirmationFormShown: false,
      isChangePasswordFormShown: false,
      isForgotPasswordFormShown: true,
      isForgotPasswordSubmitFormShown: false
    });
  };

  validateLoginForm() {
    return (
      this.state.loginForm.email.length > 0 &&
      this.state.loginForm.password.length > 0
    );
  }

  validateConfirmForm() {
    return this.state.confirmForm.code.length > 0;
  }

  validateChangePasswordForm() {
    return (
      this.state.changePasswordForm.newPassword.length > 0 &&
      this.state.changePasswordForm.newPasswordAgain.length > 0 &&
      this.state.changePasswordForm.newPassword ===
      this.state.changePasswordForm.newPasswordAgain
    );
  }

  validateForgotPasswordForm() {
    return (
      this.state.forgotPasswordForm.email.length > 0
    );
  }

  validateForgotPasswordSubmitForm() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return (
      this.state.forgotPasswordSubmitForm.code.length > 0 &&
      this.state.forgotPasswordSubmitForm.newPassword.length > 0 &&
      passwordRegex.test(this.state.forgotPasswordSubmitForm.newPassword) &&
      this.state.forgotPasswordSubmitForm.newPassword === this.state.forgotPasswordSubmitForm.newPasswordAgain
    );
  }

  handleLoginChange = event => {
    const {loginForm} = this.state;
    this.setState({
      loginForm: {
        ...loginForm,
        [event.target.id]: event.target.value
      }
    });
  };
  handleConfirmChange = event => {
    const {confirmForm} = this.state;
    this.setState({
      confirmForm: {
        ...confirmForm,
        [event.target.id]: event.target.value
      }
    });
  };
  handleChangePasswordChange = event => {
    const {changePasswordForm} = this.state;
    this.setState({
      changePasswordForm: {
        ...changePasswordForm,
        [event.target.id]: event.target.value
      }
    });
  };
  handleForgotPasswordChange = event => {
    const {forgotPasswordForm} = this.state;
    this.setState({
      forgotPasswordForm: {
        ...forgotPasswordForm,
        [event.target.id]: event.target.value
      }
    });
  };
  handleForgotPasswordSubmitChange = event => {
    const {forgotPasswordSubmitForm} = this.state;
    this.setState({
      forgotPasswordSubmitForm: {
        ...forgotPasswordSubmitForm,
        [event.target.id]: event.target.value
      }
    });
  };
  handleSignIn = async event => {
    event.preventDefault();
    try {
      await Auth.signIn(
        this.state.loginForm.email,
        this.state.loginForm.password)
        .then(user => {
          if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
            this.setState({
              loginErrorMessage: "Please choose a new password."
            });
          } else {
            this.props.history.push("/");
          }
        })
        .catch(err => {
          console.log(err);
          if (err.code === "UserNotConfirmedException") {
            this.setState({
              isLoginFormShown: false,
              isConfirmationFormShown: true,
              isProfileFormShown: false,
              isChangePasswordFormShown: false
            });
          } else {
            this.setState({
              loginErrorMessage: err.message
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
  handleConfirm = async event => {
    event.preventDefault();

    try {
      await Auth.confirmSignUp(
        this.state.loginForm.email,
        this.state.confirmForm.code
      )
        .then(data => {
          if (this.props.cookies.get("selfsignup")) {
            this.props.cookies.set("selfsignup", false, {
              domain: config.domain.name,
              secure: config.domain.secure
            });
            this.props.checkAuthState();
            this.setState({
              isLoginFormShown: false,
              isConfirmationFormShown: false,
              isProfileFormShown: true,
              isChangePasswordFormShown: false
            });
          } else {
            this.setState({
              isLoginFormShown: false,
              isConfirmationFormShown: false,
              isProfileFormShown: false,
              isChangePasswordFormShown: true
            });
          }
        })
        .catch(err => this.setState({confirmErrorMessage: err.message}));
    } catch (e) {
      this.setState({confirmErrorMessage: e.message});
    }
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
            this.state.loginForm.password,
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
  handleForgotPassword = async event => {
    event.preventDefault();
    await Auth.forgotPassword(this.state.forgotPasswordForm.email)
      .then(data => {
        this.setState({
          isLoginFormShown: false,
          isConfirmationFormShown: false,
          isChangePasswordFormShown: false,
          isForgotPasswordFormShown: false,
          isForgotPasswordSubmitFormShown: true
        });
      })
      .catch(err => {
        this.setState({
          forgotPasswordErrorMessage: err.message
        });
      });
  };
  handleForgotPasswordSubmit = async event => {
    event.preventDefault();
    await Auth.forgotPasswordSubmit(
      this.state.forgotPasswordForm.email,
      this.state.forgotPasswordSubmitForm.code,
      this.state.forgotPasswordSubmitForm.newPassword)
      .then(data => {
        this.setState({
          isLoginFormShown: true,
          isConfirmationFormShown: false,
          isChangePasswordFormShown: false,
          isForgotPasswordFormShown: false,
          isForgotPasswordSubmitFormShown: false
        });
      })
      .catch(err => {
        this.setState({
          forgotPasswordSubmitErrorMessage: err.message
        });
      });
  };
  handleProfile = async allStates => {
    const about = allStates.about;
    const address = allStates.address;
    const userSub = this.props.cookies.get("userSub");
    let body = {
      userId: userSub,
      teacherName: about.teacherName,
      phone: about.phone,
      weChatId: about.weChatId,
      curriculums: about.curriculums
    };
    if (about.englishName) {
      body.englishName = about.englishName;
    }
    createTeacher(body);

    let addressBody = {
      userId: userSub,
      country: address.country,
      postCode: address.postCode,
      state: address.state,
      city: address.city,
      addressLine1: address.addressLine1
    };
    if (address.addressLine2) {
      addressBody.addressLine2 = address.addressLine2;
    }
    if (address.addressLine3) {
      addressBody.addressLine3 = address.addressLine3;
    }
    try {
      createAddress(addressBody);
    } catch (e) {
      console.log(e)
    }

    this.props.checkAuthState();
    this.props.history.push("/");
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function () {
        this.setState({cardAnimation: ""});
      }.bind(this),
      700
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }

  render() {
    const {classes} = this.props;
    const {
      loginErrorMessage,
    } = this.state;
    return (
      <form onSubmit={this.handleSignIn}>
        <Card login className={classes[this.state.cardAnimation]}>
          <CardHeader
            className={`${classes.cardHeader} ${classes.textCenter}`}
            color="rose"
          >
            <h4 className={classes.cardTitle}>Log in</h4>
          </CardHeader>
          <CardBody>
            <CustomInput
              labelText="Email..."
              id="login_email"
              data-cy="login_form_email_input"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Email className={classes.inputAdornmentIcon}/>
                  </InputAdornment>
                ),
                onChange: this.handleLoginChange,
                value: this.state.loginForm.email
              }}
            />
            <CustomInput
              labelText="Password"
              id="password"
              data-cy={"login_form_password_input"}
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
              data-cy={"login_form_submit_button"}
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
    )
  }
}

export default withStyles(loginPageStyle)(withCookies(LoginForm));
