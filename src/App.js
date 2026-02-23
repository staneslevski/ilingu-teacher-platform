import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";

import AuthenticatedRoutes from "./components/Routes/authenticatedRoutes";
import UnAuthenticatedRoutes from "./components/Routes/unAuthenticatedRoutes";
import withStyles from "@material-ui/core/styles/withStyles";

import style from "assets/scss/material-dashboard-pro-react.css?v=1.3.0";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  fetchUserGroups,
  fetchTeacher,
  fetchStudent,
  fetchTeacherData
} from "./redux/actions/userInfo";

import {
  listCoursesByTeacherId,
  listLessonsByTeacherId,
  getStudent,
} from "./redux/actions/teacherInfo";

import {
  listStudents,
  listCourses,
  listTeachers,
  listEnrolments,
  listLessons,
  listProducts,
} from "./redux/actions/adminInfo";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      userRole: "",
      isAuthenticating: true,
      profile: undefined,
      avatarURL: undefined
    };
  }

  userHasRole = role => {
    this.setState({ userRole: role });
  };

  checkAuthState = async () => {
    await Auth.currentSession()
      .then(async () => {
        this.userHasAuthenticated(true);
        if (this.state.isAuthenticated) {
          await this.props.fetchUserGroups();
          await this.props.fetchStudent();
          await this.props.fetchTeacher();
          try {
            if (this.props.userInfo.userGroups.includes("Admin")) {
              this.setState({
                profile: this.props.userInfo.teacher,
                userRole: "Admin",
              });
              this.props.listStudents();
              this.props.listTeachers();
              this.props.listLessons();
              this.props.listCourses();
              this.props.listProducts();
              // this.props.listEnrolments();
            } else if (this.props.userInfo.userGroups.includes("Teacher")) {
              let {userId} = this.props.userInfo.teacher;
              this.props.listCoursesByTeacherId(userId).then(() => {
                this.props.teacherInfo.courses.forEach(course => {
                  this.props.getStudent(course.studentId)
                })
              });
              this.props.listLessonsByTeacherId(userId);
              this.setState({
                profile: this.props.userInfo.teacher,
                userRole: "Teacher",
              });
              await this.props.fetchTeacherData(this.props.userInfo.teacher.userId);
            } else if (this.props.userInfo.userGroups.includes("Student")) {
              this.setState({
                profile: this.props.userInfo.student,
                userRole: "Student",
              })
            }
          } catch (e) {
            console.log(e);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ isAuthenticating: false });
  };

  async componentDidMount() {
    await this.checkAuthState();
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async () => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/");
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userRole: this.state.userRole,
      profile: this.state.profile,
      avatarURL: this.state.avatarURL,
      checkAuthState: this.checkAuthState,
      handleLogout: this.handleLogout,
      userHasRole: this.userHasRole,
    };

    return this.state.isAuthenticated ? (
      <AuthenticatedRoutes childProps={childProps} />
    ) : !this.state.isAuthenticating ? (
      <UnAuthenticatedRoutes childProps={childProps} />
    ) : (
      ""
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {
    messageInfo: state.messageInfo,
    userInfo: state.userInfo,
    studentInfo: state.studentInfo,
    adminInfo: state.adminInfo,
    teacherInfo: state.teacherInfo,
    // courseInfo: state.courseInfo,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchTeacher,
      fetchStudent,
      fetchUserGroups,
      fetchTeacherData,
      listLessons,
      listCourses,
      listStudents,
      listTeachers,
      listEnrolments,
      listProducts,
      listCoursesByTeacherId,
      listLessonsByTeacherId,
      getStudent,
    }
  )(
    withStyles(style)(App)
  )
);
