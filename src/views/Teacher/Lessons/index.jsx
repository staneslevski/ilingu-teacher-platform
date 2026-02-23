// core libraries
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as Sentry from "@sentry/browser";
import config from "../../../config";

// custom components
import LessonsTable from "./LessonsTable";
import LessonsCalendar from "./LessonsCalendar";
import NavPills from "../../../components/NavPills/NavPills.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";

// styles
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

Sentry.init(config.sentry);

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

class Lessons extends React.Component {
  renderCalendar() {
    if (this.props.userInfo.isLoadingTeacherData) {
      return <CircularProgress />
    } else {
      return <LessonsCalendar />
    }
  }
  render() {
    return (
      <NavPills
        color="warning"
        tabs={[
          {
            tabButton: "Recent Lessons",
            tabContent: (
              <LessonsTable />
            )
          },
          {
            tabButton: "Calendar View",
            tabContent: (this.renderCalendar())
          },

        ]}
      />
    );
  }
}

Lessons.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
  }
};

export default connect(mapStateToProps)(withStyles(styles)(Lessons));
