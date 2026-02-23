// core libraries
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import moment from "moment";
// import plugin from "moment-timezone";
import * as Sentry from "@sentry/browser";
import config from "../../../config";

// core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "../../../components/Table/Table"
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";

// icons
import Assignment from "@material-ui/icons/Assignment";

// redux
import {getStudent} from "../../../redux/actions/teacherInfo";

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

class Courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseRows: [],
      pages: 1,
      currentPage: 0,
      LastEvaluatedKeys: [],
      isFormShown: false
    };
  }
  render() {
    const { classes, teacherInfo } = this.props;
    // const timeZone = this.props.userInfo.teacher.teacherTimezone;
    const tableData = teacherInfo.courses.map(course => {
      let studentName;
      try {
        studentName = teacherInfo.studentsById[course.studentId].studentName
      } catch (e) {

        Sentry.captureException(e);
        studentName = <CircularProgress />
      }
      let startDate = course.startDate;
      let totalLessons = 0;
      let attendedLessons = 0;
      let bookedLessons = 0;
      course.enrolments.forEach((enrolment) => {
        totalLessons += enrolment.purchasedLessons;
        attendedLessons += enrolment.attendedLessons;
        bookedLessons += (enrolment.bookedLessons);
      });
      return [
        studentName,
        startDate,
        totalLessons,
        attendedLessons,
        bookedLessons,
        "Space for buttons..."
      ]
    });
    return (
      <Fragment>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Courses</h4>
              </CardHeader>
              <CardBody>
                {this.props.teacherInfo.isLoadingCourses ? (
                  <CircularProgress/>
                  ) : (
                  <Table
                    tableHead={["Student", "Start Date", "Total Lessons", "Attended", "Booked", "Actions"]}
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

Courses.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    teacherInfo: state.teacherInfo,
  };
};

export default connect(
  mapStateToProps,
  {
    getStudent,
  }
)(withStyles(styles)(Courses));
