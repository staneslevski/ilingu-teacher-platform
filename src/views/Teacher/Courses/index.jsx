// core libraries
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

// core components
import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";

// custom components
import CoursesTable from "./CoursesTable";

import withStyles from "@material-ui/core/styles/withStyles";
import { CircularProgress } from "@material-ui/core";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  rightBtn: {
    float: "right"
  }
};

class Courses extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.adminInfo.isLoadingStudents ? (
          <CircularProgress />
        ) : (
          <CoursesTable />
        )}
      </Fragment>
    );
  }
}

Courses.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    adminInfo: state.adminInfo,
  }
};

export default connect(
  mapStateToProps
)(withStyles(styles)(Courses));
