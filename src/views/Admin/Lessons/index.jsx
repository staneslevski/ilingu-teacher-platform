// core libraries
import React, {Fragment} from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import moment from "moment";
import * as Sentry from "@sentry/browser";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
// import Button from "../../../components/CustomButtons/Button.jsx";
import ReactTable from "react-table";
// import LessonForm from "./LessonForm";

// icons
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
// import Dvr from "@material-ui/icons/Dvr";

// styles
import Assignment from "@material-ui/icons/Assignment";

import config from "../../../config";

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
      lessons: [],
      pages: 1,
      currentPage: 0,
      LastEvaluatedKeys: [],
      isFormShown: false,
      editingItem: {}
    };
  }
  fadeForm(fade) {
    this.setState({
      isFormShown: fade,
      editingItem: {}
    });
  }
  render() {
    const { classes, adminInfo } = this.props;
    return (
      <Fragment>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Lessons</h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  showPagination={true}
                  showPageSizeOptions={false}
                  showPageJump={true}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                  filterable
                  data={adminInfo.lessons.map(lesson => {
                    let startMoment = moment.utc(lesson.parts[0].startDateTime);
                    let courseName, teacher, teacherName, student, studentName;
                    try {
                      courseName = adminInfo.coursesById[lesson.courseId].courseName;
                      console.log(adminInfo.coursesById[lesson.courseId].courseName);
                    } catch (e) {
                      Sentry.captureException(e);
                      courseName = lesson.courseId;
                    }
                    try {
                      teacher = adminInfo.teachersById[lesson.teacherId];
                      teacherName = teacher.teacherName;
                    } catch (e) {
                      Sentry.captureException(e);
                      teacherName = lesson.teacherId;
                    }
                    try {
                      student = adminInfo.studentsById[lesson.studentId];
                      studentName = student.studentName;
                    } catch (e) {
                      Sentry.captureException(e);
                      studentName = lesson.studentId
                    }
                    return {
                      courseName: courseName,
                      teacher: teacherName,
                      student: studentName,
                      startDate: startMoment.format("YYYY MMM DD"),
                      startTime: startMoment.format("HH:mm"),
                      duration: lesson.parts.length,
                      actions: "",
                    }
                  })}
                  columns={[
                    {
                      Header: "Course Name",
                      accessor: "courseName"
                    },
                    {
                      Header: "Teacher",
                      accessor: "teacher"
                    },
                    {
                      Header: "Student",
                      accessor: "student"
                    },
                    {
                      Header: "Date",
                      accessor: "startDate"
                    },
                    {
                      Header: "Start Time",
                      accessor: "startTime"
                    },
                    {
                      Header: "Duration",
                      accessor: "duration"
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      maxWidth: 120
                    }
                  ]}

                />
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
    adminInfo: state.adminInfo,
  }
};

export default connect(
  mapStateToProps
)(withStyles(styles)(Lessons));
