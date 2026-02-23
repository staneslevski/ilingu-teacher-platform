// core libraries
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import moment from "moment";
import * as Sentry from "@sentry/browser";
import config from "../../../config";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "../../../components/CustomButtons/Button";

// custom components
import AdminCourseDetailDialog from "../../../components/Courses/AdminCourseDetailDialog"

// icons
import Assignment from "@material-ui/icons/Assignment";
// import Dvr from "@material-ui/icons/Dvr";

// styles
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";
import sweetAlertStyle from "../../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";


// redux
import {createEnrolment, listCourses, deleteCourse} from "../../../redux/actions/adminInfo";
import { CircularProgress } from "@material-ui/core";

Sentry.init(config.sentry);

const styles = {
  ...sweetAlertStyle,
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
      alert: null,
      selectedCourse: null,
      displayModal: false,
      giftLessonsQuantity: 0,
    }
  }
  handleCourseDialogClose = () => {
    this.setState({displayModal: false})
  };
  handleCourseDialogOpen = (course) => {
    console.log("props: ", this.props);
    this.setState({
      selectedCourse: course,
      displayModal: true,
    })
  };
  giftLessonsConfirmationAlert = () => {
    let studentName;
    try {
      studentName = this.props.adminInfo.studentsById[this.state.selectedCourse.studentId].studentName
    } catch (e) {
      Sentry.captureException(e);
      studentName = this.state.selectedCourse.studentId
    }
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.createFreeEnrolment()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
          confirmBtnText="Yes, create enrolment!"
          cancelBtnText="Cancel"
          showCancel
        >
          You are about to gift {this.state.giftLessonsQuantity} lessons to
          {studentName}. Are you absolutely sure?
        </SweetAlert>
      )
    });
  };
  hideAlert() {
    this.setState({
      alert: null
    });
  }
  deleteCourseAlert = () => {
    let studentName, teacherName;
    try {
      studentName = this.props.adminInfo.studentsById[this.state.selectedCourse.studentId].studentName
    } catch (e) {
      Sentry.withScope(scope => {
        scope.setTag("file", "src/views/Admin/Courses/index.jsx");
        scope.setTag("function", "deleteCourseAlert");
        scope.setExtra("Note", "cannot find student in studentsById");
        Sentry.captureException(e);
      });
      studentName = this.state.selectedCourse.studentId
    }
    try {
      teacherName = this.props.adminInfo.teachersById[this.state.selectedCourse.defaultTeacherId].teacherName
    } catch (e) {
      Sentry.withScope(scope => {
        scope.setTag("file", "src/views/Admin/Courses/index.jsx");
        scope.setTag("function", "deleteCourseAlert");
        scope.setExtra("Note", "cannot find teacher in teachersById");
        Sentry.captureException(e);
      });
    }
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={this.handleDeleteCourse}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
          confirmBtnText="Yes, I want it gone!"
          cancelBtnText="Cancel"
          showCancel
        >
          You are about to delete the course between the teacher {teacherName}
          and the student {studentName}. This cannot be undone.
          Are you absolutely sure?
        </SweetAlert>
      )
    });
  };
  handleDeleteCourse = () => {
    let {courseId} = this.state.selectedCourse;
    this.props.deleteCourse(courseId).then(() => {
      this.setState({displayModal: false});
      this.hideAlert();
    });
  };
  createFreeEnrolment = () => {
    let {selectedCourse, giftLessonsQuantity} = this.state;
    let enrolment, currency;
     currency = "GBP";
     enrolment = {
       studentId: selectedCourse.studentId,
       courseId: selectedCourse.courseId,
       productId: selectedCourse.productId,
       purchasedLessons: giftLessonsQuantity,
       paymentMethod: "gift",
     };
     this.hideAlert();
     this.props.createEnrolment(enrolment, currency).then(() => {
       this.props.listCourses().then(() => {
         this.setState({displayModal: false})
       })
    })
  };
  render() {
    const { classes, adminInfo, userInfo } = this.props;
    return (
      <Fragment>
        {this.state.alert}
        {adminInfo.isLoadingEnrolments || adminInfo.isLoadingCourses ? (
          <CircularProgress />
        ) : (
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
                <ReactTable
                  className="-striped -highlight"
                  showPagination={true}
                  showPageSizeOptions={false}
                  showPageJump={true}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  filterable
                  data={adminInfo.courses.map(course => {
                    // student name
                    let studentName;
                    try {
                      studentName = adminInfo.studentsById[course.studentId].studentName
                    } catch (e) {
                      Sentry.captureException(e);
                      studentName = course.studentId
                    }
                    // total lessons
                    let totalLessonsArray = course.enrolments.map(enrolment => {
                      return enrolment.purchasedLessons
                    });
                    let totalLessons;
                    try {
                      if (totalLessonsArray.length <1) {
                        totalLessons = 0
                      } else {
                        totalLessons = totalLessonsArray.reduce((acc, val) => acc + val);
                      }
                    } catch (e) {
                      Sentry.captureException(e);
                      totalLessons = 0
                    }
                    // attended lessons
                    let attendedLessonsArray = adminInfo.lessons.filter(lesson => (
                      lesson.courseId === course.courseId
                      && moment.utc().isSameOrAfter(moment.utc(lesson.parts[0].startDateTime))
                    ));
                    let attendedLessons;
                    try {
                      if (attendedLessonsArray.length < 1) {
                        attendedLessons = 0;
                      } else {
                        attendedLessons = attendedLessonsArray.map(lesson => {
                          return lesson.parts.length
                        }).reduce((acc, val) => acc + val);
                      }
                    } catch (e) {
                      Sentry.captureException(e);
                      attendedLessons = 0
                    }
                    // booked Lessons
                    let bookedLessons;
                    let bookedLessonsArray = adminInfo.lessons.filter(lesson => (
                      lesson.courseId === course.courseId
                      && moment.utc().isBefore(moment.utc(lesson.parts[0].startDateTime))
                    ));
                    try {
                      if (bookedLessonsArray.length < 1) {
                        bookedLessons = 0
                      } else {
                        bookedLessons = bookedLessonsArray.map(lesson => {
                          return lesson.parts.length
                        }).reduce((acc, val) => acc + val);
                      }
                    } catch (e) {
                      Sentry.captureException(e);
                      bookedLessons = 0
                    }
                    // remaining lessons
                    let remainingLessons;
                    const _bookedLessons = course.enrolments.map(enrolment => {
                      return enrolment.bookedLessons
                    }).reduce((acc, val) => acc + val);
                    const _attendedLessons = course.enrolments.map(enrolment => {
                      return enrolment.attendedLessons
                    }).reduce((acc, val) => acc + val);
                    remainingLessons = totalLessons - _bookedLessons - _attendedLessons;
                    // let allLessonsArray = adminInfo.lessons.filter(lesson => (
                    //   lesson.courseId === course.courseId
                    // ));
                    // try {
                    //   if (allLessonsArray.length < 1) {
                    //     remainingLessons = totalLessons
                    //   } else {
                    //     let calcAllLessons = allLessonsArray.map(lesson => {
                    //       return lesson.parts.length
                    //     }).reduce((acc, val) => acc + val);
                    //     remainingLessons = totalLessons - calcAllLessons;
                    //   }
                    // } catch (e) {
                    //   Sentry.captureException(e);
                    //   remainingLessons = 0
                    // }
                    const courseName = (course) => {
                      return (
                        <Button
                          onClick={() => this.handleCourseDialogOpen(course)}
                          data-cy="course_testing_anchor"
                        >
                          {course.courseName}
                        </Button>
                      )
                      // return course.courseName
                    };
                    return ({
                      courseName: courseName(course),
                      startDate: moment.utc(course.createdAtMs, 'x').format('YYYY MMM DD'),
                      studentName: studentName,
                      totalLessons: totalLessons,
                      attendedLessons: attendedLessons,
                      bookedLessons: bookedLessons,
                      remainingLessons: remainingLessons
                    })
                  })}
                  columns={[
                    {
                      Header: "Course Name",
                      accessor: "courseName"
                    },
                    {
                      Header: "Start Date",
                      accessor: "startDate"
                    },
                    {
                      Header: "Student Name",
                      accessor: "studentName"
                    },
                    {
                      Header: "Total Lessons",
                      accessor: "totalLessons"
                    },
                    {
                      Header: "Attended Lessons",
                      accessor: "attendedLessons"
                    },
                    {
                      Header: "Booked Lessons",
                      accessor: "bookedLessons"
                    },
                    {
                      Header: "Remaining Lessons",
                      accessor: "remainingLessons",
                    }
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
          {this.state.selectedCourse !== null ?  (
            <AdminCourseDetailDialog
              adminInfo={adminInfo}
              timeZone={userInfo.teacher.teacherTimezone}
              course={this.state.selectedCourse}
              open={this.state.displayModal === true}
              handleClose={this.handleCourseDialogClose}
              giftLessonsQuantity={this.state.giftLessonsQuantity}
              handleGiftLessons={this.giftLessonsConfirmationAlert}
              incrementQtyLessons={() => {
                if (this.state.giftLessonsQuantity < 10) {
                  this.setState({
                    giftLessonsQuantity: this.state.giftLessonsQuantity += 1
                  })
                }
              }}
              decrementQtyLessons={() => {
                if (this.state.giftLessonsQuantity > 0) {
                  this.setState({
                    giftLessonsQuantity: this.state.giftLessonsQuantity -= 1
                  })
                }
              }}
              deleteCourse={this.deleteCourseAlert}
            />
          ) : null}
        </GridContainer>
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
    userInfo: state.userInfo,
  }
};

export default connect(
  mapStateToProps,
  {
    createEnrolment,
    listCourses,
    deleteCourse,
  }
)(withStyles(styles)(Courses));
