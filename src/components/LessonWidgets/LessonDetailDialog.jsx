// core libraries
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";

// material-ui and kit components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SweetAlert from "react-bootstrap-sweetalert";

// custom components
import Button from "../CustomButtons/Button";
import Card from "../Card/Card.jsx";
import CardBody from "../Card/CardBody.jsx";

// actions
import cancelLesson from "../../libs/ilingu-libs/teacher/helpers/cancelLesson";

import {
  listLessonsByTeacherId,
  listCoursesByTeacherId
} from "../../redux/actions/teacherInfo";

// styles
import withStyles from "@material-ui/core/styles/withStyles";
import sweetAlertStyle from "../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";


const style = {
  ...sweetAlertStyle,
  textCenter: {
    textAlign: "center"
  },
  textMuted: {
    color: "#6c757d"
  },
  textStrong: {
    fontFamily: "Tahoma",
    fontWeight: "600",
    fontSize: "1.5em",
    color: "#4caf50"
  },
  ButtonWrapper: {
    display: "inline",
    padding: "0 20px 10px 0"
  }
};

const inlineButtonStyle = {
  margin: 0,
  paddingTop: 0,
  paddingRight: 2,
  paddingBottom: 0,
  paddingLeft: 2,
};

class LessonDetailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "LessonDetail"
    };
  };
  fetchTeacherData = () => {
    let {userId} = this.props.userInfo.teacher.userId;
    this.props.listLessonsByTeacherId(userId);
    this.props.listCoursesByTeacherId(userId);
  };
  handleDeleteLessonConfirm = async () => {
    try {
      let result = await cancelLesson(this.props.lessonEvent.lessonId);
      console.log("result: ", result);
      if (result === "deleted") {
        this.successDelete()
      } else if (result.hasOwnProperty("message")) {
        this.failedToDelete(result.message)
      } else {
        this.failedToDelete()
      }
      this.successDelete()
    } catch (e) {
      console.log("e: ", e);
      this.failedToDelete("Ooops. It might be that that lesson has already " +
        "been deleted. Please refresh your page and if you still get an error, " +
        "contact iLingu Support. We'll be happy to look into this for you.")
    }
  };

  warningWithConfirmMessage() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.handleDeleteLessonConfirm()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
          confirmBtnText="Yes, cancel it!"
          cancelBtnText="Do nothing"
          showCancel
        >
          You can cancel 3 lessons per month free of charge.
          It is your responsibility to manage your time.
          If you cancel over 3 lessons in a month, you will be charged a fee.
        </SweetAlert>
      )
    });
  }
  successDelete() {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Lesson deleted!"
          onConfirm={() => this.fetchTeacherData().then(this.hideAlert())}
          onCancel={() => this.fetchTeacherData().then(this.hideAlert())}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          Your lesson has been cancelled and deleted.
          It will not be shown in the system and your student will
          need to re-book the lesson at another time.
        </SweetAlert>
      )
    });
  }
  failedToDelete(errorText) {
    this.setState({
      alert: (
        <SweetAlert
          danger
          style={{ display: "block", marginTop: "-100px" }}
          title="Ooops, that didn't work"
          onConfirm={() => this.fetchTeacherData().then(this.hideAlert())}
          onCancel={() => this.fetchTeacherData().then(this.hideAlert())}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          {errorText !== undefined ? errorText : "Your request to delete the " +
            "lesson has failed. It is possible it was already deleted. " +
            "Please refresh the page and try again. If you continue to " +
            "receive an error, please contact iLingu Support. Thank you"}
        </SweetAlert>
      )
    });
  }
  hideAlert() {
    this.setState({
      alert: null
    });
  }

  render() {
    let { classes, open, handleClose, lessonEvent, teacherInfo } = this.props;
    let studentName;
    try {
      studentName = teacherInfo.studentsById[lessonEvent.studentId].studentName;
    } catch (e) {
      studentName = "..."
    }
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="lesson-detail-dialog"
      >
        {this.state.alert}
        <DialogTitle id="lesson-detail-dialog">
          Lesson Details
          <Button onClick={() => handleClose()} color="primary" simple>
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          <Card style={{ minWidth: "32rem", minHeight: "18rem" }}>
            <CardBody>
              <h4 className={classes.cardTitle}>Details</h4>
              <p><strong>Date: </strong>{lessonEvent.start.format("YYYY年 MM月 DD日")}</p>
              <p><strong>Student: </strong>{studentName}</p>
              <p><strong>Start: </strong>{lessonEvent.start.format("HH:mm")}</p>
              <p><strong>End: </strong>{lessonEvent.end.format("HH:mm")}</p>
              <p>(Duration: {lessonEvent.parts.length} lesson{lessonEvent.parts.length ===1 ? null : "s"})</p>
              <br/>
              <p><strong>Teacher URL: </strong><a target="_blank" href={lessonEvent.zoomMeeting.start_url}>Click here to start lesson</a></p>
              <p><strong>Student URL: </strong>{lessonEvent.zoomMeeting.join_url}</p>
            </CardBody>
          </Card>
        </DialogContent>
        <DialogActions>
          <p className={classes.ButtonWrapper}>
            If you are unable to take this lesson and you need to cancel, you can
            <Button
              style={inlineButtonStyle}
              onClick={() => this.warningWithConfirmMessage()}
              color="danger"
              simple
              size="sm"
              disabled={moment.utc().add(24, "hours").isAfter(lessonEvent.start)}
            >
              cancel
            </Button>
            the lesson up to 24 hours in advance of the start time.
          </p>
        </DialogActions>
      </Dialog>
    )
  }
}

LessonDetailDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    teacherInfo: state.teacherInfo,
  }
};

export default connect(mapStateToProps,{
  listLessonsByTeacherId,
  listCoursesByTeacherId,
})(withStyles(style)(LessonDetailDialog));