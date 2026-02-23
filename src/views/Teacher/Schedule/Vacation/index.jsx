// core packages
import React, { Fragment } from "react";
import PropTypes from "prop-types";

import connect from "react-redux/es/connect/connect";

// core components
import ScheduleVacation from "./VacationCalendar";
import CircularProgress from "@material-ui/core/CircularProgress";

class ScheduleIndex extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }
  render() {
    const {isLoadingTeacher} = this.props.userInfo.isLoadingTeacher;
    return (
      <Fragment>
        {(
          isLoadingTeacher
          || !this.props.userInfo.teacher.userId
          || this.props.userInfo.isLoadingTeacherData
        ) ? (
          <CircularProgress color="secondary"/>
        ) : (
          <ScheduleVacation />
        )}
      </Fragment>
    )
  }
}

ScheduleIndex.propTypes = {
  // classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(ScheduleIndex)
