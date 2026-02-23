// core libraries
import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import plugin from "moment-timezone";
import * as Sentry from "@sentry/browser";
import config from "../../../config";
import DateTime from "react-datetime";

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
import FormControl from "@material-ui/core/FormControl";

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
  constructor(props) {
    super(props);
    this.state = {
      month: undefined,
    };
  }
  render() {
    const { classes, teacherInfo, userInfo } = this.props;
    const timeZone = userInfo.teacher.teacherTimezone;
    console.log("timeZone: ",  timeZone);
    let sortedLessons = teacherInfo.lessons.sort((a,b) => {
      a.unix = moment.utc(a.parts[0].startDateTime).unix();
      b.unix = moment.utc(b.parts[0].startDateTime).unix();
      return b.unix - a.unix
    });
    sortedLessons = sortedLessons.map(lesson => {
      // sort parts
      lesson.parts.sort((a,b) => {
        return moment.utc(a.startDateTime).unix() - moment.utc(b.startDateTime).unix()
      });
      // create UTC moments from lesson
      let startDateTime = moment.utc(lesson.parts[0].startDateTime);
      let endDateTime = moment.utc(lesson.parts[lesson.parts.length -1].endDateTime);
      // convert to user timeZone
      let startTime = startDateTime.tz(timeZone).format("HH:mm");
      let endTime = endDateTime.tz(timeZone).format("HH:mm");
      let date = startDateTime.tz(timeZone).format("YYYY-MM-DD");
      return {
        ...lesson,
        startDateTime: startDateTime,
        endDateTime:endDateTime,
        startTime: startTime,
        endTime: endTime,
        date: date
      }
    });
    let filteredLessons = sortedLessons.filter(lesson =>
      moment(lesson.date).isSame(this.state.month, 'month')
    );
    const tableData = filteredLessons.map(lesson => {
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
        lesson.date,
        lesson.startTime,
        lesson.endTime,
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
            <p>Month:</p>
            <FormControl>
              <DateTime
                timeFormat={false}
                utc={true}
                dateFormat={"MMMM"}
                viewMode={'months'}
                closeOnSelect={true}
                inputProps={{ placeholder: "Date Picker Here" }}
                onChange={selection => this.setState({month: selection})}
              />
            </FormControl>
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
