import React, { Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import moment from "moment";
import momentPlugin from "moment-timezone"
// core components
import Tooltip from "@material-ui/core/Tooltip";
import Table from "../Table/Table";
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardFooter from "../Card/CardFooter";
import Primary from "../Typography/Primary";
// icons
import Redeem from "@material-ui/icons/Redeem";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
// styles
import { cardLink, cardSubtitle, cardTitle } from "../../assets/jss/ilingu/cardStyles";
import coursesInfoCardStyle from "../../assets/jss/ilingu/components/coursesInfoStyle";
import modalStyle from "../../assets/jss/material-dashboard-pro-react/modalStyle.jsx";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../components/CustomButtons/Button.jsx";
import Accordion from "../Accordion/Accordion";
import CustomInput from "../CustomInput/CustomInput";
import Danger from "../Typography/Danger";


const style = {
  ...modalStyle,
  ...coursesInfoCardStyle,
  cardTitle,
  cardSubtitle,
  cardLink,
  outerContainer: {
    marginTop: "100px"
  },
};
const gridItemStyle = {
  display: "inline-block",
};
const pointerStyle = {
  cursor: "pointer",
};
const disabledStyle = {
  cursor: "no-drop",
};

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 1
    }}
  />
);

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const CoursesInfoCard = ({...props}) => {
  const { classes, adminInfo, course, timeZone } = props;
  let courseTeacher = adminInfo.teachersById[course.defaultTeacherId];
  let totalLessons = 0;
  let attendedLessons = 0;
  let bookedLessons = 0;
  let remainingLessons = 0;
  let nextLesson;
  if (course.enrolments.length > 0) {
    let allLessons = adminInfo.lessons.filter(lesson =>
      lesson.courseId === course.courseId
    );
    if (allLessons.length > 0) {
      allLessons.sort((a,b) => {
        a.unix = moment.utc(a.parts[0].startDateTime).format('x');
        b.unix = moment.utc(b.parts[0].startDateTime).format('x');
        return a.unix - b.unix
      });
    nextLesson = allLessons[0];
    } else {
      nextLesson = null;
    }
    course.enrolments.forEach((enrolment) => {
      totalLessons += enrolment.purchasedLessons;
      attendedLessons += enrolment.attendedLessons;
      bookedLessons += (enrolment.bookedLessons);
      remainingLessons = (totalLessons - allLessons.length);
    });
  }
  const courseDescription = () => {
    try {
      return adminInfo.productsById[course.productId].longDescription
    } catch (e) {
      return "..."
    }
  };
  let nextLessonText;
  try {
    if (nextLesson !== null && nextLesson !== undefined) {
      if (timeZone === undefined) {
        nextLessonText = moment.utc(nextLesson.parts[0].startDateTime).format('YYYY MMM DD HH:mm')
      } else {
        nextLessonText = moment.utc(nextLesson.parts[0].startDateTime).tz(timeZone).format('YYYY MMM DD HH:mm')
      }
    } else {

    }
    } catch (e) {
      console.log(e);
      return "..."
    }

  return (
    <Fragment>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-slide-title"
        aria-describedby="modal-slide-description">
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}>
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={props.handleClose}
          >
            <Close className={classes.modalClose} />
          </Button>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={classes.modalBody}
        >
          <CardBody>
            <h3 className={classes.cardTitle}>{course.courseName}</h3>
            <p>
              {courseDescription()}
            </p>
            <GridContainer>
              <GridItem md={12} sm={12} xs={12} style={gridItemStyle}>
                <div className={classes.lessonsCard}>
                  <p>Course description should go here</p>
                </div>
                <div className={classes.nextLesson}>
                  <h6 className={classes.cardSubtitle}>Next Lesson</h6>
                  <p>{nextLessonText}{timeZone === undefined ? (" (GMT)") : (null)}</p>
                  {nextLesson !== undefined && nextLesson !== null ? (
                    <Tooltip
                      title="See lesson info"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <span
                        style={pointerStyle}
                      >
                    <Primary>
                      details...
                    </Primary>
                  </span>
                    </Tooltip>
                  ) : (
                    null
                  )}
                </div>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12}>
                <Accordion
                  data-cy={"admin_course_info_accordion"}
                  collapses={[
                    {
                      title: ("Gift Lessons"),
                      content: (
                        <GridContainer>
                          <GridItem lg={8} md={12}>
                            <div className={classes.buttonGroup}>
                              <Button
                                color="info"
                                size="sm"
                                round
                                className={classes.firstButton}
                                onClick={() => props.decrementQtyLessons()}
                              >
                                <Remove />
                              </Button>
                              <span className={classes.giftQty}>{props.giftLessonsQuantity}</span>
                              <Button
                                color="info"
                                size="sm"
                                round
                                className={classes.lastButton}
                                onClick={() => props.incrementQtyLessons()}
                              >
                                <Add />
                              </Button>
                            </div>
                          </GridItem>
                          <GridItem lg={4} md={12}>
                            {props.giftLessonsQuantity > 0 ? (
                              <span
                                style={pointerStyle}
                                onClick={props.handleGiftLessons}
                              >
                              <Card color={"rose"} className={classes.textCenter}>
                                <CardBody color>
                                  <h5>Gift Lessons</h5>
                                </CardBody>
                              </Card>
                              </span>
                            ) :(
                              <span
                              style={disabledStyle}
                              >
                              <Card color={"rose"} className={classes.textCenter}>
                                <CardBody color>
                                  <h5>Gift Lessons</h5>
                                </CardBody>
                              </Card>
                              </span>)}

                          </GridItem>
                        </GridContainer>
                      )
                    },
                    {
                      title: ("Arrange a second teacher"),
                      content: (
                        <Fragment>
                        <p>I'm afraid this feature is not yet enabled. 请稍后</p>
                        {remainingLessons > 0 ? (
                          <span
                            style={pointerStyle}
                          >
                            <Card color={"info"}>
                              <CardBody color>
                                <h3>Book Lesson</h3>
                                <p>{`${remainingLessons} remaining`}</p>
                              </CardBody>
                            </Card>
                          </span>
                        ) : (
                          <Tooltip
                            title="Renew course first"
                            placement="top"
                            classes={{ tooltip: classes.tooltip }}
                          >
                            <span
                              style={disabledStyle}
                            >
                              <Card color={"info"}>
                                <CardBody color>
                                  <h3>Book Lesson</h3>
                                  <p>{`${remainingLessons} remaining`}</p>
                                </CardBody>
                              </Card>
                            </span>
                          </Tooltip>
                        )}
                        </Fragment>
                      )
                    },
                    {
                      title: ("Destructive course actions"),
                      content: (
                        <Fragment>
                          <span>
                            <Button
                              data-cy={"admin_delete_course_button"}
                              onClick={() => props.deleteCourse()}
                            >
                            <Danger>
                              Delete Course?
                            </Danger>
                            </Button>
                            <h4>Do not press this button unless you really mean it!</h4>
                          </span>
                        </Fragment>
                      )
                    }
                  ]}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter className={classes.textMuted}>Started Course: {course.startDate}</CardFooter>
        </DialogContent>
      </Dialog>
      <ColoredLine color={"info"} />
    </Fragment>
  );
};

CoursesInfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  courseInfo: PropTypes.object,
  deleteCourse: PropTypes.func.isRequired,
};

export default withStyles(style)(CoursesInfoCard);
