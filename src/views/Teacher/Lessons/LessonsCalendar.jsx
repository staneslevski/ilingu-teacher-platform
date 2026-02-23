import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import FullCalendar from "fullcalendar-reactwrapper";

import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
import "../../../assets/fullCalendarEventPointer.css"
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import LessonDetailDialog from "../../../components/LessonWidgets/LessonDetailDialog";

const style = {
  outerContainer: {
    margin: "auto",
    marginTop: "100px"
  }
};

const validRange = {
  start: moment().format("YYYY-MM-DD"),
  end: moment().add(1, "month").format("YYYY-MM-DD")
};

class LessonsCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // events: [],
      showLessonDetailDialog: false,
      lessonEvent: {},
    };
  }
  // componentDidMount() {
  //   let timeZone = this.props.userInfo.teacher.teacherTimezone;
  //   let { lessons } = this.props.userInfo;
  //   let events = lessons.map(lesson => {
  //     lesson.parts.sort((a,b) => {
  //       a.unix = moment.utc(a.startDatetime).unix;
  //       b.unix = moment.utc(b.startDatetime).unix;
  //       return a.unix - b.unix
  //     });
  //     return {
  //       ...lesson,
  //       start: moment.utc(lesson.parts[0].startDateTime).tz(timeZone),
  //       end: moment.utc(lesson.parts[lesson.parts.length -1].endDateTime).tz(timeZone),
  //       color: moment(lesson.parts[0].startDateTime).isBefore(moment())
  //         ? "#A9A9A9"
  //         : "#378006",
  //     }
  //   });
  //   this.setState({
  //     events: events,
  //   })
  // }
  handleOpenLessonDialog(event) {
    this.setState({
      showLessonDetailDialog: true,
      lessonEvent: event,
    })
  }
  handleCloseLessonDialog = () => {
    this.setState({
      showLessonDetailDialog: false
    })
  };

  render() {
    let {userInfo, teacherInfo} = this.props;
    let timeZone = userInfo.teacher.teacherTimezone;
    let { lessons } = this.props.teacherInfo;
    let events = lessons.map(lesson => {
      lesson.parts.sort((a,b) => {
        a.unix = moment.utc(a.startDatetime).unix;
        b.unix = moment.utc(b.startDatetime).unix;
        return a.unix - b.unix
      });
      return {
        ...lesson,
        start: moment.utc(lesson.parts[0].startDateTime).tz(timeZone),
        end: moment.utc(lesson.parts[lesson.parts.length -1].endDateTime).tz(timeZone),
        color: moment(lesson.parts[0].startDateTime).isBefore(moment())
          ? "#A9A9A9"
          : "#378006",
      }
    });
    return (
      <Fragment>
        <p>Dates and times are displayed in your default time zone: {this.props.userInfo.teacher.teacherTimezone}</p>
        <FullCalendar
          id="student-lessons"
          defaultView={"agendaWeek"}
          allDaySlot={false}
          header={{ right: "prev,next" }}
          columnFormat="ddd Do"
          editable={false}
          contentHeight="auto"
          slotDuration="01:00:00"
          selectable={true}
          events={events}
          eventClick={(event) => this.handleOpenLessonDialog(event)}
        />
        {this.state.showLessonDetailDialog ? (
          <LessonDetailDialog
          open={this.state.showLessonDetailDialog}
          lessonEvent={this.state.lessonEvent}
          handleClose={this.handleCloseLessonDialog}
          />
          ) : (null)}
      </Fragment>
    );
  }
}

LessonsCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  courseInfo: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    teacherInfo: state.teacherInfo,
  };
};

export default connect(mapStateToProps)(withStyles(style)(LessonsCalendar));
