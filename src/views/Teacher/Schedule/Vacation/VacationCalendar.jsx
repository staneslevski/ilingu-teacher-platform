// core packages
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import thisIsJustAPlugin from "moment-timezone";
import FullCalendar from "fullcalendar-reactwrapper";
import connect from "react-redux/es/connect/connect";

// redux actions
import { updateTeacher } from "../../../../redux/actions/userInfo";

// local libs
import { userTzToUtc} from "../../../../libs/ilingu-libs/user/helpers/dateTime";

// core components
import GridContainer from "../../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../../components/Grid/GridItem.jsx";
import Card from "../../../../components/Card/Card.jsx";
import CardBody from "../../../../components/Card/CardBody.jsx";
import CardFooter from "../../../../components/Card/CardFooter.jsx";
import Button from "../../../../components/CustomButtons/Button.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import SweetAlert from "react-bootstrap-sweetalert";
import Tooltip from "@material-ui/core/Tooltip";

// styles
import withStyles from "@material-ui/core/styles/withStyles";
import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
import dashboardStyle from "../../../../assets/jss/material-dashboard-pro-react/views/dashboardStyle";
import sweetAlertStyle from "../../../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

const styles = {
  // ...tooltip,
  ...dashboardStyle,
  ...sweetAlertStyle,
  circularProgress: {
    display: "flex",
    justifyContent: "center"
  }
};

const validRange = {
  start: moment().subtract(1, 'year').format("YYYY-MM-DD"),
  end: moment().add(2, "month").format("YYYY-MM-DD")
};


class VacationCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vacationTimes: [],
      lessonEvents: [],
      loading: false,
      alert: null,
      defaultDate: moment.utc().tz(this.props.userInfo.student.studentTimezone),
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    VacationCalendar.isOverlap = VacationCalendar.isOverlap.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    // this.state.events should be a list of standard events in UTC time zone.
    // events will be rendered to correct timezone in render method
    this.setState({lessonEvents: this.props.teacherInfo.lessons.map(lesson => {
      return {
        ...lesson,
        start: moment.utc(lesson.parts[0].startDateTime),
        end: moment.utc(lesson.parts[lesson.parts.length - 1].endDateTime),
      }
    })});
    if (this.props.userInfo.teacher.hasOwnProperty("vacationTimes")) {
      this.setState({vacationTimes: this.props.userInfo.teacher.vacationTimes.map(vacationTime => {
        return {
          ...vacationTime,
          start: moment.utc(vacationTime.start),
          end: moment.utc(vacationTime.end),
        }
      })})
    }
  }

  hideAlert() {
    this.setState({
      alert: null
    });
  }

  showLessonConflictAlert() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Lesson conflict!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          You cannot book a vacation slot when you already have a lesson booked
          at that time. You must first go to your lessons page and cancel the
          lesson, and then try to book the vacation time.
        </SweetAlert>
      )
    });
  }

  handleSelect(start, end) {
    const timeZone = this.props.userInfo.teacher.teacherTimezone;
    this.setState({defaultDate: moment(start).format("YYYY-MM-DD")});
    if ((end - start) % (60 * 60 * 1000) !== 0 //at least 1 hour
    ) {
      return;
    }
    let event = {
      start: moment.utc(start),
      end: moment.utc(end)
    };
    let utcEvent = {
      start: userTzToUtc(event.start, timeZone),
      end: userTzToUtc(event.end, timeZone),
    };
    let basicLessonEvents = this.state.lessonEvents.map(event => {
      return {
        start: moment.utc(event.start),
        end: moment.utc(event.end)
      }
    });
    let basicVacationTimes = this.state.vacationTimes.map(vacationTime => {
      return {
        start: moment.utc(vacationTime.start),
        end: moment.utc(vacationTime.end)
      }
    });
    let events = [
      ...basicLessonEvents,
      ...basicVacationTimes,
      utcEvent,
      ];
    if (VacationCalendar.isOverlap(events)) {
      this.showLessonConflictAlert()
    } else {
      this.setState({
        vacationTimes: [
          ...this.state.vacationTimes,
          utcEvent,
        ]
      });
    }

  }

  async handleEventClick(EventObj) {
    this.setState({
      loading: true
    });
    console.log("EventObj: ", EventObj);
    let events  = [
      ...this.state.vacationTimes,
      ];
    let newEvents = events.filter(event => {
      return !EventObj.start.utc().isSame(event.start);
    });
    this.setState({
      vacationTimes: newEvents,
      loading: false,
    });
  }

  /**
   *
   * Takes a list of events and returns true if any two events overlap.
   *
   * @param events - must be an array of full calendar style events with start and end keys. start and end keys should be moment objects.
   * @returns {boolean}
   */
  static isOverlap(events) {
    if (events.length < 2) {
      return false;
    }
    let sortedEvents = [];
    while (events.length > 0) {
      let toBeSorted = events.shift();
      toBeSorted.start = moment.utc(toBeSorted.start);
      toBeSorted.end = moment.utc(toBeSorted.end);
      // console.log("toBeSorted: ", toBeSorted);
      let insertionIndex;
      if (sortedEvents.length === 0) {
        insertionIndex = 0
      } else if (toBeSorted.start.isSameOrAfter(moment.utc(sortedEvents[sortedEvents.length - 1].start))) {
        insertionIndex = sortedEvents.length;
      } else {
        for (let i = 0; i < sortedEvents.length; i++) {
          if (toBeSorted.start.isBefore(sortedEvents[i].start)) {
            insertionIndex = i;
            break
          }
        }
        sortedEvents.splice(insertionIndex, 0, toBeSorted);
      }
    }
    for (
      let currentIndex = 0;
      currentIndex < sortedEvents.length - 1;
      currentIndex++
    ) {
      if (
        sortedEvents[currentIndex].end.isAfter(sortedEvents[currentIndex + 1].start)
      ) {
        return true;
      }
    }
    return false;
  }

  async handleSubmit() {
    let events = [
      ...this.state.vacationTimes,
      ...this.state.lessonEvents
    ];
    if (VacationCalendar.isOverlap(events)) {
      this.showLessonConflictAlert();
    } else {
      console.log("no conflict?");
      this.setState({
        loading: true
      });
      try {
        // needs to be an object containing a list called availability slots
        // 1. make a list
        // build either one or two availability slots for each event
        //2. make an object and create a field in the object called availabilitySlots ...
        // ... with data as (the array) availability slots
        let updateData = {
          vacationTimes: this.state.vacationTimes
        };
        await this.props.updateTeacher(this.props.userInfo.teacher.userId, updateData);
      } catch (e) {
        console.log(e);
      }
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const { isLoadingTeacher } = this.props.userInfo;
    const timeZone = this.props.userInfo.teacher.teacherTimezone;
    const renderedVacationTimes = this.state.vacationTimes.map(vacationTime => {
      return {
        ...vacationTime,
        start: moment.tz(vacationTime.start, timeZone),
        end: moment.tz(vacationTime.end, timeZone)
      };
    });
    const renderedLessonEvents = this.state.lessonEvents.map(lessonEvent => {
      return {
        ...lessonEvent,
        start: moment.tz(lessonEvent.start, timeZone),
        end: moment.tz(lessonEvent.end, timeZone),
        rendering: "background"
      }
    });
    const renderedEvents = [
      ...renderedLessonEvents,
      ...renderedVacationTimes,
    ];
    return (
      <Fragment>
        {(
          isLoadingTeacher
          || !this.props.userInfo.teacher.userId
        ) ? (
          <CircularProgress color="secondary"/>
        ) : (
          <div>
            {this.state.alert}
            <GridItem sm={12} md={8}>
              <p>Your time zone:
                <Tooltip
                  id="tooltip-top"
                  title="Can be changed in profile"
                  placement="top"
                  // classes={{ tooltip: classes.tooltip }}
                >
                  <strong>{this.props.userInfo.teacher.teacherTimezone}</strong>
                </Tooltip>
              </p>
              <p>This page allows you to select your vacation times.</p>
              <p>These are times which you are <strong>not</strong> available
                to teach.</p>
              <p>You can select as much time as you want, with no penalty.</p>
              <p>The times marked below will be combined with times which you
                have marked as 'available hours' such that <strong>a student will be
                able to book a lesson with you at any time which
                  is marked as available and is also not marked as vacation</strong>.</p>
            </GridItem>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={10}>
                <Card>
                  <CardBody calendar>
                    <FullCalendar
                      id="schedule-availability"
                      defaultView={"agendaWeek"}
                      allDaySlot={false}
                      header={{ right: "prev,next" }}
                      columnFormat="ddd Do"
                      editable={false}
                      eventLimit={true}
                      events={renderedEvents}
                      contentHeight="auto"
                      slotDuration="01:00:00"
                      selectable={true}
                      select={this.handleSelect}
                      eventClick={this.handleEventClick}
                      selectOverlap={false}
                      validRange={validRange}
                      defaultDate={this.state.defaultDate}
                    />
                    <CardFooter>
                      {(
                        this.state.loading
                        || !this.props.userInfo.teacher.userId
                      ) ? (
                        <CircularProgress color="secondary"/>
                      ) : (
                        <Button color="rose" onClick={this.handleSubmit}>
                          Submit
                        </Button>
                      )}
                    </CardFooter>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        )}
      </Fragment>
    )
  }
}

VacationCalendar.propTypes = {
  // classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
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
    // redux based methods go here
    updateTeacher,
  },
)(
  withStyles(styles)(VacationCalendar)
)
