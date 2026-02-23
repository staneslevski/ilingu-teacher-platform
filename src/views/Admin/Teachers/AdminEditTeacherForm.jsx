import React, {Fragment} from "react";
import * as Sentry from "@sentry/browser"
import config from "../../../config";

// Core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Clearfix from "../../../components/Clearfix/Clearfix.jsx";
import Select from "react-select"
import connect from "react-redux/es/connect/connect";
import CircularProgress from "@material-ui/core/CircularProgress";
// import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Image, Transformation } from "cloudinary-react";

// Custom Components
import { MenuList, options } from "../../../components/TimeZone/TimeZoneMenuList";

// styles
import withStyles from "@material-ui/core/styles/withStyles";
import userProfileStyles from "../../../assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";
import PropTypes from "prop-types";
import Assignment from "@material-ui/icons/Assignment";
import AccountCircleOutlined from "@material-ui/icons/AccountCircleOutlined";

// redux-actions
import { updateTeacher } from "../../../redux/actions/adminInfo";

Sentry.init(config.sentry);
Sentry.configureScope(scope => {
  scope.setTag("file", "src/views/Admin/Teachers/AdminEditTeacherForm.jsx")
});


const style = {
  ...userProfileStyles,
  formControl: {
    marginTop: "11px"
  }
};

const aboutMeStyle = {
  marginTop: "20px",
};

class AdminEditTeacherForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        teacherName: "",
        englishName: "",
        phone: "",
        aboutMe: "",
        hobbies: "",
        interests: "",
        languages: "",
        weChatId: "",
        country: "",
        teacherTimezone: "",
        avatar: "",
      },
      avatarFile: null,
      uploading: false,
      uploadingAvatar: false,
      adding: false
    };
  }
  loadProfileToState = () => {
    let teacherProfile = this.props.profile;
    console.log("teacherProfile: ", teacherProfile);
    this.setState({
      profile: {
        ...teacherProfile,
        teacherName: AdminEditTeacherForm.testEmpty(teacherProfile.teacherName),
        englishName: AdminEditTeacherForm.testEmpty(teacherProfile.englishName),
        phone: AdminEditTeacherForm.testEmpty(teacherProfile.phone),
        aboutMe: AdminEditTeacherForm.testEmpty(teacherProfile.aboutMe),
        hobbies: AdminEditTeacherForm.testEmpty(teacherProfile.hobbies),
        interests: AdminEditTeacherForm.testEmpty(teacherProfile.interests),
        languages: AdminEditTeacherForm.testEmpty(teacherProfile.languages),
        weChatId: AdminEditTeacherForm.testEmpty(teacherProfile.weChatId),
        country: AdminEditTeacherForm.testEmpty(teacherProfile.country),
        teacherTimezone: AdminEditTeacherForm.testEmpty(teacherProfile.teacherTimezone),
        avatar: teacherProfile.avatar
      },
      avatarURL: this.props.userInfo.teacher.avatarURL
    });
  };
  componentDidMount() {
    this.loadProfileToState();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.profile.userId !== this.props.profile.userId) {
      this.loadProfileToState();
    }
  }
  static testEmpty(val) {
    if (val === ( "-" || "--" || "---" )) {
      return ""
    } else {
      return val
    }
  }
  change(event) {
    const profile = { ...this.state.profile };
    this.setState({
      profile: {
        ...profile,
        [event.target.id || event.target.name]: event.target.value
      }
    });
  }
  selectTimezone(selectedTZ) {
    this.setState({
      profile: {
        ...this.state.profile,
        teacherTimezone: selectedTZ.value
      }
    })
  }
  isInvalid() {
    const { profile } = this.state;
    if (
      (profile && !profile.teacherName) ||
      (profile && !profile.englishName) ||
      (profile && !profile.phone) ||
      (profile && !profile.weChatId)
    ) {
      return true;
    }
  }
  handleUploadProfile = () => {
    const { profile } = this.state;
    this.props.updateTeacher(profile.userId, profile);
  };
  handleOpenWidget = (uploadTeacherAvatarWidget) => {
    uploadTeacherAvatarWidget.open()
  };

  render() {
    const { classes } = this.props;
    const { profile } = this.state;
    let uploading = this.props.adminInfo.isLoadingUpdateTeacher;
    const uploadTeacherAvatarWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: config.cloudinary.cloud_name,
        uploadPreset: "ilingu-teacher-profile",
        sources: ['local', 'camera', 'facebook', 'instagram'],
        multiple: false,
        cropping:true,
        croppingAspectRatio: 1,
        croppingCoordinatesMode: "face",
        singleUploadAutoClose: false,
        clientAllowedFormats: ["png","gif", "jpeg"],
        maxFileSize: 1500000,
        minImageWidth: 200,
        minImageHeight: 200,
        croppingValidateDimensions: true,
      },
      (error, result) => {
        if (error) {
          console.log("error: ", error);
          Sentry.withScope(scope => {
            scope.setTag("function", "uploadTeacherAvatarWidget");
            Sentry.captureException(error);
          })
        } else {
          if (result && result.event === "success") {
            // do something
            if (result.info.hasOwnProperty('secure_url')) {
              this.setState({
                profile: {
                  ...this.state.profile,
                  avatarURL: result.info.secure_url,
                  avatar: result.info,
                }
              });
              try {
                this.handleUploadProfile()
              } catch (error) {
                console.log(error);
                Sentry.withScope(scope => {
                  scope.setTag("function", "uploadTeacherAvatarWidget");
                  Sentry.captureException(error);
                })
              }
            } else {
              console.log("return param has no 'secure_url' key")
            }
            console.log("success result.info: ", result.info);
          }
        }
      });
    return (
      <Fragment>
        <GridContainer>
          <GridItem  xs={12} lg={6}>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Edit Profile - <small>Complete your profile</small>
              </h4>
            </CardHeader>
            <p>UserId: {JSON.stringify(profile.userId)}
            </p>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Name"
                    id="teacherName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.teacherName,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="English Name"
                    id="englishName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.englishName,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Phone"
                    id="phone"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.phone,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="WeChat ID"
                    id="weChatId"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.weChatId,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Languages"
                    id="languages"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.languages,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Interests"
                    id="interests"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.interests,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Hobbies"
                    id="hobbies"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.hobbies,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Current Location (country)"
                    id="country"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: profile.country,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                  <InputLabel htmlFor="teacherTimezone">Timezone</InputLabel>
                  {/*<FormControl fullWidth className={classes.formControl}>*/}
                  <Select
                    components={{ MenuList }}
                    options={options}
                    onChange={selectedTZ => this.selectTimezone(selectedTZ)}
                    value={profile.teacherTimezone}
                    placeholder={profile.teacherTimezone}
                  />
                  {/*</FormControl>*/}
                </GridItem>
                <GridItem xs={12} sm={12} md={12} style={aboutMeStyle}>
                  <InputLabel style={{ color: "#AAAAAA" }}>
                    About me
                  </InputLabel>
                  <CustomInput
                    labelText="Please provide some information to let students know about you."
                    id="aboutMe"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                      value: profile.aboutMe,
                      onChange: event => this.change(event)
                    }}
                  />
                </GridItem>
              </GridContainer>
              {uploading ? (
                <CircularProgress className={classes.updateProfileButton} color="primary" />
              ) : (
                <Button
                  color="rose"
                  className={classes.updateProfileButton}
                  disabled={this.isInvalid()}
                  onClick={this.handleUploadProfile}
                >
                  Update Profile
                </Button>
              )}
              <Clearfix />
            </CardBody>
          </GridItem>
          <GridItem xs={12} md={6}>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <AccountCircleOutlined />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Profile Photo - <small>Upload a new profile picture</small>
              </h4>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} sm={12} md={8}>
                <legend>Avatar</legend>
                {profile.hasOwnProperty('avatar') && (profile.avatar !== "-") ? (
                  <Fragment>
                    <p>cloudname: {config.cloudinary.cloud_name}</p>
                    <p>public id: {profile.avatar.public_id}</p>
                  <Image
                    cloudName={config.cloudinary.cloud_name}
                    publicId={profile.avatar.public_id}
                  >
                    <Transformation width="150" height="150" gravity="face" radius="20" crop="thumb" />
                  </Image>
                  </Fragment>
                ) : null}
                <Button
                  color="rose"
                  onClick={() => this.handleOpenWidget(uploadTeacherAvatarWidget)}
                >Upload new Profile Photo
                </Button>
              </GridItem>
              <Clearfix />
            </CardBody>
          </GridItem>
        </GridContainer>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    adminInfo: state.adminInfo,

  };
};

AdminEditTeacherForm.propTypes = {
  classes: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,

};

export default connect(
  mapStateToProps,
  {
    updateTeacher,
  }
)(withStyles(style)(AdminEditTeacherForm));

