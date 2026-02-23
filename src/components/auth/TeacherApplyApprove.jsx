// import React from "react";
// import { PropTypes, instanceOf } from "prop-types";
// import { Auth, API } from "aws-amplify";
// import { withCookies, Cookies } from "react-cookie";
// import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
//
//
// import config from "../../config.js";
//
// import InputAdornment from "@material-ui/core/InputAdornment";
// import Icon from "@material-ui/core/Icon";
// import Code from "@material-ui/icons/Code";
//
// import Wizard from "components/Wizard/Wizard.jsx";
// import Button from "components/CustomButtons/Button.jsx";
// import GridContainer from "components/Grid/GridContainer.jsx";
// import GridItem from "components/Grid/GridItem.jsx";
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import Card from "components/Card/Card.jsx";
// import CardBody from "components/Card/CardBody.jsx";
// import CardHeader from "components/Card/CardHeader.jsx";
// import CardFooter from "components/Card/CardFooter.jsx";
//
// import { Numeric9PlusBox, Email } from "mdi-material-ui";
//
// import withStyles from "@material-ui/core/styles/withStyles";
// import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
// // import Profile from "./AddProfile";
// // import Address from "./AddAddress";
//
// class LoginPage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       cardAnimation: "cardHidden",
//       isLoginFormShown: true,
//       isConfirmationFormShown: false,
//       isChangePasswordFormShown: false,
//       isForgotPasswordFormShown: false,
//       isForgotPasswordSubmitFormShown: false,
//       isProfileFormShown: false,
//       loginErrorMessage: "",
//       confirmErrorMessage: "",
//       changePasswordErrorMessage: "",
//       forgotPasswordErrorMessage: "",
//       forgotPasswordSubmitErrorMessage: "",
//       addProfileErrorMessage: "",
//       loginForm: {
//         email: "",
//         password: ""
//       },
//       confirmForm: {
//         code: ""
//       },
//       changePasswordForm: {
//         newPassword: "",
//         newPasswordAgain: ""
//       },
//       forgotPasswordForm: {
//         email: ""
//       },
//       forgotPasswordSubmitForm: {
//         code: "",
//         newPassword: "",
//         newPasswordAgain: ""
//       }
//     };
//     this.validateLoginForm = this.validateLoginForm.bind(this);
//     this.validateConfirmForm = this.validateConfirmForm.bind(this);
//     this.validateChangePasswordForm = this.validateChangePasswordForm.bind(this);
//     this.validateForgotPasswordForm = this.validateForgotPasswordForm.bind(this);
//     this.validateForgotPasswordSubmitForm = this.validateForgotPasswordSubmitForm.bind(this);
//     this.handleLoginChange = this.handleLoginChange.bind(this);
//     this.handleConfirmChange = this.handleConfirmChange.bind(this);
//     this.handleChangePasswordChange = this.handleChangePasswordChange.bind(this);
//     this.handleForgotPasswordChange = this.handleForgotPasswordChange.bind(this);
//     this.handleForgotPasswordSubmitChange = this.handleForgotPasswordSubmitChange.bind(this);
//     this.handleSignIn = this.handleSignIn.bind(this);
//     this.handleConfirm = this.handleConfirm.bind(this);
//     this.handleChangePassword = this.handleChangePassword.bind(this);
//     this.handleForgotPassword = this.handleForgotPassword.bind(this);
//     this.handleForgotPasswordSubmit = this.handleForgotPasswordSubmit.bind(this);
//     this.handleProfile = this.handleProfile.bind(this);
//     this.createAddress = this.createAddress.bind(this);
//     this.createTeacher = this.createTeacher.bind(this);
//   }
//   showForgotPasswordForm = () => {
//     this.setState({
//       isLoginFormShown: false,
//       isConfirmationFormShown: false,
//       isChangePasswordFormShown: false,
//       isForgotPasswordFormShown: true,
//       isForgotPasswordSubmitFormShown: false
//     });
//   };
//   validateLoginForm() {
//     return (
//       this.state.loginForm.email.length > 0 &&
//       this.state.loginForm.password.length > 0
//     );
//   }
//   validateConfirmForm() {
//     return this.state.confirmForm.code.length > 0;
//   }
//   validateChangePasswordForm() {
//     return (
//       this.state.changePasswordForm.newPassword.length > 0 &&
//       this.state.changePasswordForm.newPasswordAgain.length > 0 &&
//       this.state.changePasswordForm.newPassword ===
//       this.state.changePasswordForm.newPasswordAgain
//     );
//   }
//   validateForgotPasswordForm() {
//     return (
//       this.state.forgotPasswordForm.email.length > 0
//     );
//   }
//   validateForgotPasswordSubmitForm() {
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//     return (
//       this.state.forgotPasswordSubmitForm.code.length > 0 &&
//       this.state.forgotPasswordSubmitForm.newPassword.length > 0 &&
//       passwordRegex.test(this.state.forgotPasswordSubmitForm.newPassword) &&
//       this.state.forgotPasswordSubmitForm.newPassword === this.state.forgotPasswordSubmitForm.newPasswordAgain
//     );
//   }
//   handleLoginChange = event => {
//     const { loginForm } = this.state;
//     this.setState({
//       loginForm: {
//         ...loginForm,
//         [event.target.id]: event.target.value
//       }
//     });
//   };
//   handleConfirmChange = event => {
//     const { confirmForm } = this.state;
//     this.setState({
//       confirmForm: {
//         ...confirmForm,
//         [event.target.id]: event.target.value
//       }
//     });
//   };
//   handleChangePasswordChange = event => {
//     const { changePasswordForm } = this.state;
//     this.setState({
//       changePasswordForm: {
//         ...changePasswordForm,
//         [event.target.id]: event.target.value
//       }
//     });
//   };
//   handleForgotPasswordChange = event => {
//     const { forgotPasswordForm } = this.state;
//     this.setState({
//       forgotPasswordForm: {
//         ...forgotPasswordForm,
//         [event.target.id]: event.target.value
//       }
//     });
//   };
//   handleForgotPasswordSubmitChange = event => {
//     const { forgotPasswordSubmitForm } = this.state;
//     this.setState({
//       forgotPasswordSubmitForm: {
//         ...forgotPasswordSubmitForm,
//         [event.target.id]: event.target.value
//       }
//     });
//   };
//   handleSignIn = async event => {
//     event.preventDefault();
//
//     try {
//       await Auth.signIn(
//         this.state.loginForm.email,
//         this.state.loginForm.password)
//         .then(user => {
//           if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
//             this.setState({
//               loginErrorMessage: "Please choose a new password."
//             });
//           } else {
//             this.props.history.push("/");
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           if (err.code === "UserNotConfirmedException") {
//             this.setState({
//               isLoginFormShown: false,
//               isConfirmationFormShown: true,
//               isProfileFormShown: false,
//               isChangePasswordFormShown: false
//             });
//           } else {
//             this.setState({
//               loginErrorMessage: err.message
//             });
//           }
//         });
//       this.props.checkAuthState();
//     } catch (e) {
//       this.setState({
//         loginErrorMessage: e.message
//       });
//     }
//   };
//   handleConfirm = async event => {
//     event.preventDefault();
//
//     try {
//       await Auth.confirmSignUp(
//         this.state.loginForm.email,
//         this.state.confirmForm.code
//       )
//         .then(data => {
//           if (this.props.cookies.get("selfsignup")) {
//             this.props.cookies.set("selfsignup", false, {
//               domain: config.domain.name,
//               secure: config.domain.secure
//             });
//             this.props.checkAuthState();
//             this.setState({
//               isLoginFormShown: false,
//               isConfirmationFormShown: false,
//               isProfileFormShown: true,
//               isChangePasswordFormShown: false
//             });
//           } else {
//             this.setState({
//               isLoginFormShown: false,
//               isConfirmationFormShown: false,
//               isProfileFormShown: false,
//               isChangePasswordFormShown: true
//             });
//           }
//         })
//         .catch(err => this.setState({ confirmErrorMessage: err.message }));
//     } catch (e) {
//       this.setState({ confirmErrorMessage: e.message });
//     }
//   };
//   handleChangePassword = async event => {
//     event.preventDefault();
//
//     try {
//       await Auth.signIn(
//         this.state.loginForm.email,
//         this.state.loginForm.password
//       )
//         .then(user => {
//           Auth.changePassword(
//             user,
//             this.state.loginForm.password,
//             this.state.changePasswordForm.newPassword
//           );
//         })
//         .catch(err => {
//           this.setState({
//             changePasswordErrorMessage: err.message
//           });
//         });
//       this.props.checkAuthState();
//       this.props.history.push("/");
//     } catch (e) {
//       this.setState({
//         changePasswordErrorMessage: e.message
//       });
//     }
//   };
//   handleForgotPassword = async event => {
//     event.preventDefault();
//     await Auth.forgotPassword(this.state.forgotPasswordForm.email)
//       .then(data => {
//         this.setState({
//           isLoginFormShown: false,
//           isConfirmationFormShown: false,
//           isChangePasswordFormShown: false,
//           isForgotPasswordFormShown: false,
//           isForgotPasswordSubmitFormShown: true
//         });
//       })
//       .catch(err => {
//         this.setState({
//           forgotPasswordErrorMessage: err.message
//         });
//       });
//   };
//   handleForgotPasswordSubmit = async event => {
//     event.preventDefault();
//     await Auth.forgotPasswordSubmit(
//       this.state.forgotPasswordForm.email,
//       this.state.forgotPasswordSubmitForm.code,
//       this.state.forgotPasswordSubmitForm.newPassword)
//       .then(data => {
//         this.setState({
//           isLoginFormShown: true,
//           isConfirmationFormShown: false,
//           isChangePasswordFormShown: false,
//           isForgotPasswordFormShown: false,
//           isForgotPasswordSubmitFormShown: false
//         });
//       })
//       .catch(err => {
//         this.setState({
//           forgotPasswordSubmitErrorMessage: err.message
//         });
//       });
//   };
//   handleProfile = async allStates => {
//     const about = allStates.about;
//     const address = allStates.address;
//     const userSub = this.props.cookies.get("userSub");
//     let body = {
//       userId: userSub,
//       teacherName: about.teacherName,
//       phone: about.phone,
//       weChatId: about.weChatId,
//       curriculums: about.curriculums
//     };
//     if (about.englishName) {
//       body.englishName = about.englishName;
//     }
//     this.createTeacher(body);
//
//     let addressBody = {
//       userId: userSub,
//       country: address.country,
//       postCode: address.postCode,
//       state: address.state,
//       city: address.city,
//       addressLine1: address.addressLine1
//     };
//     if (address.addressLine2) {
//       addressBody.addressLine2 = address.addressLine2;
//     }
//     if (address.addressLine3) {
//       addressBody.addressLine3 = address.addressLine3;
//     }
//     this.createAddress(addressBody);
//     this.props.checkAuthState();
//     this.props.history.push("/");
//   };
//   createAddress(body) {
//     return API.post("addresses", "/addresses", {
//       body: body
//     });
//   }
//   createTeacher(body) {
//     return API.post("teachers", "/teachers", {
//       body: body
//     });
//   }
//   componentDidMount() {
//     // we add a hidden class to the card and after 700 ms we delete it and the transition appears
//     this.timeOutFunction = setTimeout(
//       function() {
//         this.setState({ cardAnimation: "" });
//       }.bind(this),
//       700
//     );
//   }
//   componentWillUnmount() {
//     clearTimeout(this.timeOutFunction);
//     this.timeOutFunction = null;
//   }
//   render() {
//     const { classes } = this.props;
//     const {
//       isLoginFormShown,
//       isConfirmationFormShown,
//       isProfileFormShown,
//       isChangePasswordFormShown,
//       isForgotPasswordFormShown,
//       isForgotPasswordSubmitFormShown,
//       loginErrorMessage,
//       confirmErrorMessage,
//       changePasswordErrorMessage,
//       forgotPasswordErrorMessage,
//       forgotPasswordSubmitErrorMessage
//     } = this.state;
//     return (
//       <div className={classes.container}>
//         <GridContainer justify="center">
//           <GridItem xs={12} sm={6} md={6}>
//             {isLoginFormShown ? (
//               <form onSubmit={this.handleSignIn}>
//                 <Card login className={classes[this.state.cardAnimation]}>
//                   <CardHeader
//                     className={`${classes.cardHeader} ${classes.textCenter}`}
//                     color="rose"
//                   >
//                     <h4 className={classes.cardTitle}>Log in</h4>
//                   </CardHeader>
//                   <CardBody>
//                     <CustomInput
//                       labelText="Email..."
//                       id="email"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Email className={classes.inputAdornmentIcon} />
//                           </InputAdornment>
//                         ),
//                         onChange: this.handleLoginChange,
//                         value: this.state.loginForm.email
//                       }}
//                     />
//                     <CustomInput
//                       labelText="Password"
//                       id="password"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Icon className={classes.inputAdornmentIcon}>
//                               lock_outline
//                             </Icon>
//                           </InputAdornment>
//                         ),
//                         type: "password",
//                         onChange: this.handleLoginChange,
//                         value: this.state.loginForm.password
//                       }}
//                     />
//                     <p>
//                       <a className={classes.forgotPasswordLink} onClick={this.showForgotPasswordForm}>
//                         Forgot Password?
//                       </a>
//                     </p>
//                     <p>{loginErrorMessage}</p>
//                   </CardBody>
//                   <CardFooter className={classes.justifyContentCenter}>
//                     <Button
//                       color="rose"
//                       simple
//                       size="lg"
//                       block
//                       disabled={!this.validateLoginForm()}
//                       type="submit"
//                     >
//                       Login
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </form>
//             ) : null}
//             {isConfirmationFormShown ? (
//               <form onSubmit={this.handleConfirm}>
//                 <Card login className={classes[this.state.cardAnimation]}>
//                   <CardHeader
//                     className={`${classes.cardHeader} ${classes.textCenter}`}
//                     color="rose"
//                   >
//                     <h4 className={classes.cardTitle}>Confirmation</h4>
//                   </CardHeader>
//                   <CardBody>
//                     <CustomInput
//                       labelText="Code"
//                       id="code"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Numeric9PlusBox
//                               className={classes.inputAdornmentIcon}
//                             />
//                           </InputAdornment>
//                         ),
//                         onChange: this.handleConfirmChange,
//                         value: this.state.confirmForm.code
//                       }}
//                     />
//                     <p>
//                       <a className={classes.resendCodeLink} onClick={this.resendConfirmationCode}>
//                         Resend Confirmation Code
//                       </a>
//                     </p>
//                     <p>{confirmErrorMessage}</p>
//                   </CardBody>
//                   <CardFooter className={classes.justifyContentCenter}>
//                     <Button
//                       color="rose"
//                       simple
//                       size="lg"
//                       block
//                       disabled={!this.validateConfirmForm()}
//                       type="submit"
//                     >
//                       Confirm
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </form>
//             ) : null}
//             {isChangePasswordFormShown ? (
//               <form onSubmit={this.handleChangePassword}>
//                 <Card login className={classes[this.state.cardAnimation]}>
//                   <CardHeader
//                     className={`${classes.cardHeader} ${classes.textCenter}`}
//                     color="rose"
//                   >
//                     <h4 className={classes.cardTitle}>Change Password</h4>
//                   </CardHeader>
//                   <CardBody>
//                     <CustomInput
//                       labelText="New Password"
//                       id="newPassword"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Icon className={classes.inputAdornmentIcon}>
//                               lock_outline
//                             </Icon>
//                           </InputAdornment>
//                         ),
//                         type: "password",
//                         onChange: this.handleChangePasswordChange,
//                         value: this.state.changePasswordForm.newPassword
//                       }}
//                     />
//                     <CustomInput
//                       labelText="New Password Again"
//                       id="newPasswordAgain"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Icon className={classes.inputAdornmentIcon}>
//                               lock_outline
//                             </Icon>
//                           </InputAdornment>
//                         ),
//                         type: "password",
//                         onChange: this.handleChangePasswordChange,
//                         value: this.state.changePasswordForm.newPasswordAgain
//                       }}
//                     />
//                     <p>{changePasswordErrorMessage}</p>
//                   </CardBody>
//                   <CardFooter className={classes.justifyContentCenter}>
//                     <Button
//                       color="rose"
//                       simple
//                       size="lg"
//                       block
//                       disabled={!this.validateChangePasswordForm()}
//                       type="submit"
//                     >
//                       Confirm
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </form>
//             ) : null}
//             {isForgotPasswordFormShown ? (
//               <form onSubmit={this.handleForgotPassword}>
//                 <Card className={classes[this.state.cardAnimation]}>
//                   <CardHeader
//                     className={`${classes.cardHeader} ${classes.textCenter}`}
//                     color="rose"
//                   >
//                     <h4 className={classes.cardTitle}>Forgot Password</h4>
//                   </CardHeader>
//                   <CardBody>
//                     <CustomInput
//                       labelText="Email..."
//                       id="email"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Email className={classes.inputAdornmentIcon} />
//                           </InputAdornment>
//                         ),
//                         onChange: this.handleForgotPasswordChange,
//                         value: this.state.forgotPasswordForm.email
//                       }}
//                     />
//                     <p>{forgotPasswordErrorMessage}</p>
//                   </CardBody>
//                   <CardFooter className={classes.justifyContentCenter}>
//                     <Button
//                       color="rose"
//                       simple
//                       size="lg"
//                       block
//                       disabled={!this.validateForgotPasswordForm()}
//                       type="submit"
//                     >
//                       Send Code to My Email
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </form>
//             ) : null}
//             {isForgotPasswordSubmitFormShown ? (
//               <form onSubmit={this.handleForgotPasswordSubmit}>
//                 <Card className={classes[this.state.cardAnimation]}>
//                   <CardHeader
//                     className={`${classes.cardHeader} ${classes.textCenter}`}
//                     color="rose"
//                   >
//                     <h4 className={classes.cardTitle}>Reset Password</h4>
//                   </CardHeader>
//                   <CardBody>
//                     <CustomInput
//                       labelText="Code"
//                       id="code"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Code className={classes.inputAdornmentIcon} />
//                           </InputAdornment>
//                         ),
//                         onChange: this.handleForgotPasswordSubmitChange,
//                         value: this.state.forgotPasswordSubmitForm.code
//                       }}
//                     />
//                     <CustomInput
//                       labelText="New Password"
//                       id="newPassword"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Icon className={classes.inputAdornmentIcon}>
//                               lock_outline
//                             </Icon>
//                           </InputAdornment>
//                         ),
//                         type: "password",
//                         onChange: this.handleForgotPasswordSubmitChange,
//                         value: this.state.forgotPasswordSubmitForm.newPassword
//                       }}
//                     />
//                     <CustomInput
//                       labelText="New Password Again"
//                       id="newPasswordAgain"
//                       formControlProps={{
//                         fullWidth: true
//                       }}
//                       inputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <Icon className={classes.inputAdornmentIcon}>
//                               lock_outline
//                             </Icon>
//                           </InputAdornment>
//                         ),
//                         type: "password",
//                         onChange: this.handleForgotPasswordSubmitChange,
//                         value: this.state.forgotPasswordSubmitForm.newPasswordAgain
//                       }}
//                     />
//                     <p>{forgotPasswordSubmitErrorMessage}</p>
//                   </CardBody>
//                   <CardFooter className={classes.justifyContentCenter}>
//                     <Button
//                       color="rose"
//                       simple
//                       size="lg"
//                       block
//                       disabled={!this.validateForgotPasswordSubmitForm()}
//                       type="submit"
//                     >
//                       Submit
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </form>
//             ) : null}
//             {isProfileFormShown ? (
//               <Wizard
//                 validate
//                 finishButtonText="Finish"
//                 finishButtonClick={this.handleProfile}
//                 steps={[
//                   { stepName: "About", stepComponent: Profile, stepId: "about" },
//                   { stepName: "Address", stepComponent: Address, stepId: "address" }
//                 ]}
//                 title="Build Your Profile"
//                 subtitle="This information will let us know more about you."
//               />
//             ) : null}
//           </GridItem>
//         </GridContainer>
//       </div>
//     );
//   }
// }
//
// LoginPage.propTypes = {
//   classes: PropTypes.object.isRequired,
//   checkAuthState: PropTypes.func,
//   cookies: instanceOf(Cookies).isRequired,
//   history: PropTypes.object
// };
//
// export default withStyles(loginPageStyle)(withCookies(LoginPage));
