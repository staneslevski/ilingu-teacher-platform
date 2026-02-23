// core packages
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import thisIsJustAPlugin from "moment-timezone";
import FullCalendar from "fullcalendar-reactwrapper";
import connect from "react-redux/es/connect/connect";

// redux actions
import { updateTeacher } from "../../../redux/actions/userInfo";

// local libs
import { userTzToUtc} from "../../../libs/ilingu-libs/user/helpers/dateTime";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardFooter from "../../../components/Card/CardFooter.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import SweetAlert from "react-bootstrap-sweetalert";
import Tooltip from "@material-ui/core/Tooltip";

// styles
import withStyles from "@material-ui/core/styles/withStyles";
import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
import dashboardStyle from "../../../assets/jss/material-dashboard-pro-react/views/dashboardStyle";
import sweetAlertStyle from "../../../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
// import { tooltip } from "../../../assets/jss/material-dashboard-pro-react.jsx";


const styles = {
  // ...tooltip,
  ...dashboardStyle,
  ...sweetAlertStyle,
  circularProgress: {
    display: "flex",
    justifyContent: "center"
  }
};

class ScheduleAvailable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilitySlots: [],
      events: [],
      loading: false,
      alert: null
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    ScheduleAvailable.isOverlap = this.isOverlap.bind(this);
    ScheduleAvailable.sortEvents = ScheduleAvailable.sortEvents.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
      // this.state.events should be a list of standard events in UTC time zone.
      // events will be rendered to correct timezone in render method
      let basicEvents = this.props.userInfo.teacher.availabilitySlots.map(slot => { // availabilitySlots are stored in UTC
        // day of week must be an array but in our application only contains one value
        let formattedSlot = {
          start: `${slot.dow} ${slot.start}`,
          end: `${slot.dow} ${slot.end}`,
        };
        return {
          start: moment.utc(formattedSlot.start, "d HH:mm"),
          end: moment.utc(formattedSlot.end, "d HH:mm")
        };
      });
      // fiddle with the times so they're shifted for the time zone so they all
      // display on one agenda view
      basicEvents.forEach(event => {
        let startMin = moment.tz("0 00:00", 'd HH:mm', this.props.userInfo.teacher.teacherTimezone);
        let startMax = startMin.clone().add(1, "week");
        if (event.start.isSameOrAfter(startMax)) {
          event.start = event.start.subtract(1, "week");
          event.end = event.end.subtract(1, "week");
        } else if (event.start.isBefore(startMin)) {
          event.start = event.start.add(1, "week");
          event.end = event.end.add(1, "week");
        }
      });
      let sortedEvents = ScheduleAvailable.sortEvents(basicEvents);
      sortedEvents.forEach(event => {
        if (event.end.format('mm') === "59") {
          event.end = event.end.clone().add(1, "minute");
        }
      });
      let events = [];
      while (sortedEvents.length > 0) {
        let thisEvent = sortedEvents.shift();
        let eventEnd;
        if ( // event end is same as start of next event?
          sortedEvents.length > 0
          && thisEvent.end.isSame(sortedEvents[0].start)
        ) {
          //FIXME: Bad code. This should be recursive
          let nextEvent = sortedEvents.shift();
          eventEnd = nextEvent.end;
        } else {
          eventEnd = thisEvent.end;
        }
        events = [
          ...events,
          { start: thisEvent.start, end: eventEnd }
        ]
      }
    this.setState({
      events: events
    })
  }

  hideAlert() {
    this.setState({
      alert: null
    });
  }

  showAlert() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Please take breaks!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          Whilst you can make yourself available for many lessons back to back,
          we strongly recommend that you don&#39;t do this. Make sure that you allow yourself enough time
          to relax and that you are able to properly prepare for each lesson.
          You should be aware that if the quality of your lessons is not good enough your account may be frozen
          and you may be unable to continue teaching with us. Lesson quality is very important. Please take breaks.
        </SweetAlert>
      )
    });
  }

  handleSelect(start, end) {
    const timeZone = this.props.userInfo.teacher.teacherTimezone;
    if ((end - start) % (60 * 60 * 1000) !== 0 //at least 1 hour
    ) {
      return;
    }
    let adjustedEnd;
    if (end - start > 60 * 60 * 1000 * 4) {
      this.showAlert();
      adjustedEnd = moment.utc(start).add(4, 'hours');
    } else {
      adjustedEnd = moment.utc(end);
    }
    let event = {
      start: moment.utc(start),
      end: adjustedEnd
    };
    let utcEvent = {
      start: userTzToUtc(event.start, timeZone),
      end: userTzToUtc(event.end, timeZone)
    };
    let { events } = this.state;
    events.push(utcEvent);
    this.setState({
      events: events
    });
  }



  async handleEventClick(EventObj) {
    this.setState({
      loading: true
    });
    let { events } = this.state;
    let newEvents = events.filter(event => {
      return !EventObj.start.utc().isSame(event.start);
    });
    this.setState({
      events: newEvents,
      loading: false,
    });
  }

  static sortEvents(events) {
    return events.sort((previous, current) => {
      if (previous.start.isBefore(current.start)) {
        return -1;
      } else if (previous.start.isSame(current.start)) {
        return 0;
      } else {
        return 1;
      }
    });
  }

  isOverlap() {
    let { events } = this.state.events;
    events = ScheduleAvailable.sortEvents(events || []);
    if (events.length < 2) {
      return false;
    }
    for (
      let currentIndex = 0;
      currentIndex < events.length - 1;
      currentIndex++
    ) {
      if (
        events[currentIndex].end.getTime() >
        events[currentIndex + 1].start.getTime()
      ) {
        return true;
      }
    }
    return false;
  }

  async handleSubmit() {
    if (this.isOverlap()) {
      return;
    }
    // let timeZone = this.props.userInfo.teacher.teacherTimezone;
    this.setState({
      loading: true
    });
    try {
      // needs to be an object containing a list called availability slots
      // 1. make a list
      let availabilitySlots = [];
      // build either one or two availability slots for each event
      this.state.events.forEach(event => {
        if (event.start.format('d')!==event.end.format('d')) {
          // if startDay and endDay are not the same return two slots (one for each day)
          // 1. for start day start at startTime and end at midnight
          availabilitySlots = [
            ...availabilitySlots,
            {
              dow: event.start.format('d'),
              start: event.start.format('HH:mm'),
              end: "23:59"
            },
            {
              dow: event.end.format('d'),
              start: "00:00",
              end: event.end.format('HH:mm')
            }
          ];
        } else {
          // create one availability slot on one UTC day
          availabilitySlots = [
            ...availabilitySlots,
            {
              dow: event.start.format('d'),
              start: event.start.format('HH:mm'),
              end: event.end.format('HH:mm')
            }
          ];
        }
      });
      // //2. make an object and create a field in the object called availabilitySlots ...
      // // ... with data as (the array) availability slots
      let updateData = {
        availabilitySlots: availabilitySlots
      };
      await this.props.updateTeacher(this.props.userInfo.teacher.userId, updateData);
    } catch (e) {
      console.log(e);
    }
    this.setState({
      loading: false
    })
  }

  render() {
    // const { classes } = this.props;
    const { isLoadingTeacher } = this.props.userInfo;
    const timeZone = this.props.userInfo.teacher.teacherTimezone;
    const renderedEvents = this.state.events.map(event => {
      const renderedEvent = {
        start: moment.tz(event.start, timeZone),
        end: moment.tz(event.end, timeZone)
      };
      return renderedEvent;
    });
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
              <p>The hours selected below are hours that you guarantee you are
                available to teach.</p>
              <p>Students will be able to book a lesson with you during these
                hours and it will be immediately confirmed. This means you MUST
                be available during these times.</p>
              <p>Students will be able to book lessons up to 3 days in advance.
                This means a student cannot book a time slot less than three
                days in the future, even if it is marked below.
                This means you will not be surprised by a last minute booking,
                and will always have enough time to prepare.</p>
              <p>You should remember these times, and if you are unable to
                teach during a certain time, you should mark that time as
                vacation, or remove that time slot from your calendar below.</p>
            </GridItem>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={10}>
                <Card>
                  <CardBody calendar>
                    <FullCalendar
                      id="schedule-availability"
                      defaultView={"agendaWeek"}
                      allDaySlot={false}
                      header={false}
                      columnFormat="ddd"
                      editable={false}
                      eventLimit={true}
                      events={renderedEvents}
                      contentHeight="auto"
                      slotDuration="01:00:00"
                      selectable={true}
                      select={this.handleSelect}
                      eventClick={this.handleEventClick}
                      selectOverlap={false}
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

ScheduleAvailable.propTypes = {
  // classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
  };
};

export default connect(
  mapStateToProps,
  {
    // redux based methods go here
    updateTeacher,
  },
)(
  withStyles(styles)(ScheduleAvailable)
)
