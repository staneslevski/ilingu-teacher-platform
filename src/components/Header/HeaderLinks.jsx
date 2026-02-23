import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";

// @material-ui/icons
import ExitToApp from "@material-ui/icons/ExitToApp";

// core components
import Button from "../CustomButtons/Button.jsx";

import headerLinksStyle from "../../assets/jss/material-dashboard-pro-react/components/headerLinksStyle";

class HeaderLinks extends React.Component {
  state = {
    open: false
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes, isAuthenticated, handleLogout } = this.props;
    const wrapper = classNames({
      [classes.wrapperRTL]: false
    });
    return (
      <div className={wrapper}>
        {isAuthenticated ? (
          <Button
            color="transparent"
            aria-label="Person"
            justIcon
            className={classes.buttonLink}
            onClick={() => handleLogout()}
          >
            <ExitToApp className={classes.headerLinksSvg + " " + classes.links} />
            <Hidden mdUp implementation="css">
              <span className={classes.linkText}>Logout</span>
            </Hidden>
          </Button>
        ) : null}
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  handleLogout: PropTypes.func
};

export default withStyles(headerLinksStyle)(HeaderLinks);
