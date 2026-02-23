import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

class Teacher extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <h3 className={classes.test}>I am a Teacher</h3>
      </div>
    );
  }
}

Teacher.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

export default withStyles(dashboardStyle)(Teacher);
