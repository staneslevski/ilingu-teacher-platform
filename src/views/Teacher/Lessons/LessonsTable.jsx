// core libraries
import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import plugin from "moment-timezone";
import * as Sentry from "@sentry/browser";
import config from "../../../config";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
// import Button from "../../../components/CustomButtons/Button.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "../../../components/Table/Table";

// styles
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

// icons
import Assignment from "@material-ui/icons/Assignment";

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
  render() {
    const { classes, teacherInfo, userInfo } = this.props;
    const timeZone = userInfo.teacher.teacherTimezone;
    console.log("userInfo: ", userInfo);
    console.log("timeZone: ",  timeZone);
    let sortedLessons = teacherInfo.lessons.sort((a,b) => {
      a.unix = moment.utc(a.parts[0].startDateTime).unix();
      b.unix = moment.utc(b.parts[0].startDateTime).unix();
      return b.unix - a.unix
    });
    const tableData = sortedLessons.map(lesson => {
      // sort parts
      lesson.parts.sort((a,b) => {
        return a.startDateTime - b.startDateTime
      });
      // create UTC moments from lesson
      let startDateTime = moment.utc(lesson.parts[0].startDateTime);
      let endDateTime = moment.utc(lesson.parts[lesson.parts.length -1].endDateTime);
      // convert to user timeZone
      let startTime = startDateTime.tz(timeZone).format("HH:mm");
      let endTime = endDateTime.tz(timeZone).format("HH:mm");
      let date = startDateTime.format("YYYY-MM-DD");
      let duration = lesson.parts.length;
      let studentName;
      try {
        studentName = teacherInfo.studentsById[lesson.studentId].studentName;
      } catch (e) {
        Sentry.captureException(e);
        console.log(e);
        studentName = "..."
      }
      return [
        date,
        startTime,
        endTime,
        studentName,
        "content goes here",
        duration,
        "Space for buttons..."
        ]
    });
    return (
      <Fragment>
        <GridContainer>
          <GridItem xs={12}>
            <h4>All times are displayed in your current time zone: <strong>{timeZone}</strong></h4>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Lessons</h4>
              </CardHeader>
              <CardBody>
                {this.props.userInfo.isLoadingTeacherData ? (
                  <CircularProgress />
                ) : (
                  <Table
                    tableHead={["Date", "Start Time", "End Time", "Student", "Content", "Duration", "Actions"]}
                    tableData={tableData}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Fragment>
    );
  }
}

Lessons.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    teacherInfo: state.teacherInfo,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Lessons));
