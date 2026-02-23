import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "../../assets/jss/material-dashboard-pro-react/views/dashboardStyle";

class Student extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <h3 className={classes.test}>I am a Student</h3>
      </div>
    );
  }
}

Student.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

export default withStyles(dashboardStyle)(Student);
