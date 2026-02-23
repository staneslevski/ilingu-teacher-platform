import React, { Fragment } from "react";
import _ from "lodash";
import { API } from "aws-amplify";
import PropTypes from "prop-types";

import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import CustomInput from "../../../components/CustomInput/CustomInput.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardFooter from "../../../components/Card/CardFooter.jsx";

import withStyles from "@material-ui/core/styles/withStyles";
import validationFormsStyle from "../../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import FormLabel from "@material-ui/core/FormLabel";
import Assignment from "@material-ui/icons/Assignment";
import Datetime from "react-datetime";
import moment from "moment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const styles = {
  ...validationFormsStyle,
  customSelect: {
    marginTop: "26px",
    marginBottom: "10px"
  },
  datePicker: {
    marginTop: "26px",
    marginBottom: "10px"
  },
  actionBtn: {
    marginRight: "15px"
  }
};

class LessonForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: !_.isEmpty(this.props.editingItem),
      lesson: {},
      teacherPool: [],
      teachers: [],
      durationState: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editLesson = this.editLesson.bind(this);
    this.getLesson = this.getLesson.bind(this);
    this.getTeacherPool = this.getTeacherPool.bind(this);
    this.getTeachers = this.getTeachers.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  async componentDidMount() {
    await this.getTeacherPool();
    await this.getTeachers();
    const lesson = this.getLesson();
    this.setState({
      lesson: lesson
    });
  }
  getTeachers() {
    API.get("teachers", "/teachers", {
      queryStringParameters: {
        pageSize: 500,
        startToken: null
      }
    }).then(teachers => {
      teachers = teachers.Items;
      teachers = teachers.filter(teacher =>
        this.state.teacherPool.includes(teacher.userId)
      );
      this.setState({
        teachers: teachers
      });
    });
  }
  async getLesson() {
    const { courseId, lessonId } = this.props.editingItem;
    await API.get("lessons", `/lessons/${courseId}/${lessonId}`, {}).then(
      lesson => {
        this.setState({
          lesson: lesson
        });
      }
    );
  }
  getTeacherPool() {
    const { courseId } = this.props.editingItem;
    return API.get("courses", `/teacher-pool/${courseId}`, {}).then(
      teacherPool => {
        this.setState({
          teacherPool: teacherPool.map(p => p.teacherUserId)
        });
      }
    );
  }
  async editLesson() {
    const { courseId, lessonId } = this.props.editingItem;
    await API.put("lessons", `/lessons/${courseId}/${lessonId}`, {
      body: this.state.lesson
    });
  }
  handleSubmit = async () => {
    try {
      await this.editLesson();
      this.props.fetchData();
      this.props.fadeForm(false);
    } catch (e) {
      console.log(e);
    }
  };
  change(event) {
    const lesson = { ...this.state.lesson };
    const numberRex = new RegExp("^[0-9]+$");
    const value = event.target.value;
    this.setState({
      lesson: {
        ...lesson,
        [event.target.id]: event.target.value
      }
    });
    switch (event.target.id) {
      case "duration":
        if (value && numberRex.test(value) && value > 0) {
          this.setState({ hoursState: "success" });
        } else {
          this.setState({ hoursState: "error" });
        }
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  handleDatePicker(m) {
    if (moment.isMoment(m)) {
      this.setState({
        lesson: {
          ...this.state.lesson,
          startDatetime: m.format("YYYY-MM-DD HH:mm")
        }
      });
    }
  }
  handleSelect(event) {
    const value = event.target.value;
    let optionValue;
    let optionText;
    switch (event.target.name) {
      case "teacher":
        [optionValue, optionText] = value.split(",");
        this.setState({
          lesson: {
            ...this.state.lesson,
            teacherUserId: optionValue,
            teacherName: optionText
          }
        });
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  render() {
    const { classes, fadeForm, editingItem } = this.props;
    const fields = [
      {
        key: "1",
        label: "Duration",
        validateState: this.state.durationState,
        id: "duration",
        helpText: "positive number"
      }
    ];
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                {`Edit Lesson - ${editingItem.courseName} - ${editingItem.startDatetime}`}
              </h4>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Start Datetime
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Datetime
                        timeFormat="HH:mm"
                        dateFormat="YYYY-MM-DD"
                        className={classes.datePicker}
                        closeOnSelect
                        onChange={this.handleDatePicker}
                        value={this.state.lesson.startDatetime || ""}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>e.g. `2018-09-26`</code>
                      </FormLabel>
                    </GridItem>
                  </Fragment>
                  {fields.map(prop => {
                    return (
                      <Fragment key={prop.key}>
                        <GridItem xs={12} sm={2}>
                          <FormLabel className={classes.labelHorizontal}>
                            {prop.label}
                          </FormLabel>
                        </GridItem>
                        <GridItem xs={12} sm={7}>
                          <CustomInput
                            success={prop.validateState === "success"}
                            error={prop.validateState === "error"}
                            id={prop.id}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: event => this.change(event),
                              type: "text",
                              value: this.state.lesson[prop.id] || ""
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={3}>
                          <FormLabel className={classes.labelLeftHorizontal}>
                            <code>{prop.validateState === "error" ? "Please correct this value" : prop.helpText}</code>
                          </FormLabel>
                        </GridItem>
                      </Fragment>
                    );
                  })}
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Teacher
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Select
                        fullWidth
                        value={this.state.lesson.teacherUserId + "," + this.state.lesson.teacherName}
                        onChange={event => this.handleSelect(event)}
                        inputProps={{
                          name: "teacher",
                          id: "teacher"
                        }}
                        className={classes.customSelect}
                      >
                        {this.state.teachers.map((teacher, key) => {
                          return (
                            <MenuItem
                              key={key}
                              value={`${teacher.userId},${teacher.teacherName}`}
                            >
                              {teacher.teacherName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>Select a Teacher</code>
                      </FormLabel>
                    </GridItem>
                  </Fragment>
                </GridContainer>
              </form>
            </CardBody>
            <CardFooter className={classes.justifyContentCenter}>
              <Button
                onClick={e => fadeForm(false)}
                className={classes.actionBtn}
              >
                Close
              </Button>
              <Button
                color="rose"
                disabled={
                  this.state.lesson.duration === undefined ||
                  this.state.durationState === "error"
                }
                onClick={this.handleSubmit}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

LessonForm.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchData: PropTypes.func,
  fadeForm: PropTypes.func,
  editingItem: PropTypes.object
};

export default withStyles(styles)(LessonForm);
