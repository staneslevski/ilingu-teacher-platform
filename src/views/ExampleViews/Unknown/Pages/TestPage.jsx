import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimation: "cardHidden"
    };
  }
  render() {
    return (
      <h1>Test Page Test Page Test Page Test Page Test Page</h1>
    );
  }
}

TestPage.propTypes = {
  classes: PropTypes.object.isRequired,
  userHasAuthenticated: PropTypes.func
};

export default withStyles(loginPageStyle)(TestPage);
