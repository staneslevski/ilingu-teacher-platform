import React from "react";

// Core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import connect from "react-redux/es/connect/connect";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditProfileForm from "./EditProfileForm";

// styles
import withStyles from "@material-ui/core/styles/withStyles";
import userProfileStyles from "../../../assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";
import PropTypes from "prop-types";

// redux-actions
import {updateTeacher} from "../../../redux/actions/userInfo";


const style = {
  ...userProfileStyles,
  formControl: {
    marginTop: "11px"
  }
};

class EditProfile extends React.Component {
  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={10}>
          {this.props.userInfo.isLoadingTeacher
            || this.props.userInfo.teacher.teacherName === undefined ? (
            <CircularProgress />
            ) : (
            <Card>
              <EditProfileForm />
            </Card>
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
  };
};

EditProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  profile: PropTypes.object
};

export default connect(
  mapStateToProps,
  {
    updateTeacher,
  }
)(withStyles(style)(EditProfile));

