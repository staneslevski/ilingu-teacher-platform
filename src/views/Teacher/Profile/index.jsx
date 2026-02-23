// core libs
import React, { Fragment } from "react";
import connect from "react-redux/es/connect/connect";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardAvatar from "../../../components/Card/CardAvatar.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
// import { Image } from "cloudinary-react";

import withStyles from "@material-ui/core/styles/withStyles";
import userProfileStyles from "../../../assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";
import PropTypes from "prop-types";

// images
// import defaultAvatar from "../../../assets/img/default_avatar.png"

class MyProfile extends React.Component {
  render() {
    const { classes, userInfo } = this.props;
    const profile = userInfo.teacher;
    const avatarURL = this.props.userInfo.teacher.avatarURL;
    // console.log("profile/index this.props: ", this.props);
    return (
      <Fragment>
        {userInfo.isLoadingTeacher ? (
        <CircularProgress height={30} />) : (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {profile ? (
              <Card profile>
                <CardAvatar profile>
                  <a href="#" onClick={e => e.preventDefault()}>
                    <img src={avatarURL} alt={profile.teacherName} />
                  </a>
                </CardAvatar>
                <CardBody profile>
                  <h6 className={classes.cardCategory}>{profile.englishName} | {profile.email}</h6>
                  <h4 className={classes.cardTitle}>{profile.teacherName}</h4>
                  <p className={classes.description}>
                    Joined at: {profile.joinedDate} | Phone: {profile.phone} |
                    WeChat ID: {profile.weChatId}
                  </p>
                  <p className={classes.aboutMe}>{profile.aboutMe}</p>
                </CardBody>
              </Card>
            ) : (
              <CircularProgress color="primary" />
            )}
          </GridItem>
        </GridContainer>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
  }
};

MyProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  profile: PropTypes.object
};

export default connect(
  mapStateToProps,
)(withStyles(userProfileStyles)(MyProfile));
