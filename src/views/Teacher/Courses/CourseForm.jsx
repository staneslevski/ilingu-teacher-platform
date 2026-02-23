import React, { Fragment } from "react";
import _ from "lodash";
import { API } from "aws-amplify";
import PropTypes from "prop-types";
import Datetime from "react-datetime";
import moment from "moment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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

class CourseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: !_.isEmpty(this.props.editingItem),
      teachers: [],
      products: [],
      course: {
        teacherPool: []
      },
      lessonsState: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createCourse = this.createCourse.bind(this);
    this.editCourse = this.editCourse.bind(this);
    this.getCourse = this.getCourse.bind(this);
    this.getTeachers = this.getTeachers.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
  }
  componentDidMount() {
    this.getOptions();
    if (this.state.isEdit) {
      const course = this.getCourse();
      this.setState({
        course: course
      });
    }
  }
  async getOptions() {
    try {
      const teachers = await this.getTeachers();
      const products = await this.getProducts();
      this.setState({
        teachers: teachers.Items,
        products: products.Items
      });
    } catch (e) {
      console.log(e);
    }
  }
  async getCourse() {
    const { teacherUserId, courseId } = this.props.editingItem;
    await API.get("courses", `/courses/${teacherUserId}/${courseId}`, {}).then(
      course => {
        this.setState({
          course: course
        });
      }
    );
  }
  createCourse(body) {
    return API.post("courses", "/courses", {
      body: body
    });
  }
  async editCourse() {
    const { teacherUserId, courseId } = this.props.editingItem;
    await API.put("courses", `/courses/${teacherUserId}/${courseId}`, {
      body: this.state.course
    });
  }
  handleSubmit = async () => {
    try {
      if(_.isEmpty(this.props.editingItem)) {
        await this.createCourse(this.state.course);
        this.props.resetPagination();
      } else {
        await this.editCourse();
      }
      this.props.fetchData();
      this.props.fadeForm(false);
    } catch (e) {
      console.log(e);
    }
  };
  change(event) {
    const course = { ...this.state.course };
    const numberRex = new RegExp("^[0-9]+$");
    const value = event.target.value;
    this.setState({
      course: {
        ...course,
        [event.target.id]: event.target.value
      }
    });
    switch (event.target.id) {
      case "lessons":
        if (value && numberRex.test(value) && value > 0) {
          this.setState({ lessonsState: "success" });
        } else {
          this.setState({ lessonsState: "error" });
        }
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  handleSelect(event) {
    const value = event.target.value;
    let optionValue;
    let optionText;
    let productId;
    let productName;
    let productShortDescription;
    switch (event.target.name) {
      case "teacher":
        [optionValue, optionText] = value.split(",");
        this.setState({
          course: {
            ...this.state.course,
            teacherUserId: optionValue,
            teacherUserName: optionText
          }
        });
        break;
      case "product":
        [productId, productName, productShortDescription] = value.split(",");
        this.setState({
          course: {
            ...this.state.course,
            productId: productId,
            productName: productName,
            productShortDescription: productShortDescription
          }
        });
        break;
      case "level":
        this.setState({
          course: {
            ...this.state.course,
            level: value
          }
        });
        break;
      case "teacherPool":
        this.setState({
          course: {
            ...this.state.course,
            teacherPool: value
          }
        });
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  handleDatePicker(m) {
    if (moment.isMoment(m)) {
      this.setState({
        course: {
          ...this.state.course,
          startDate: m.format("YYYY-MM-DD")
        }
      });
    }
  }
  render() {
    const { classes, fadeForm, editingItem } = this.props;
    const fields = [
      {
        key: "5",
        label: "Lessons",
        validateState: this.state.lessonsState,
        id: "lessons",
        helpText: "positive number"
      }
    ];
    return (
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                {_.isEmpty(editingItem)
                  ? "Add Course"
                  : `Edit Course - ${editingItem.productShortDescription} - ${editingItem.level}`}
              </h4>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Start Date
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Datetime
                        timeFormat={false}
                        dateFormat="YYYY-MM-DD"
                        className={classes.datePicker}
                        closeOnSelect
                        onChange={this.handleDatePicker}
                        value={this.state.course.startDate || ""}
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
                              value: this.state.course[prop.id] || ""
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
                        Product
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Select
                        fullWidth
                        value={this.state.course.productId + "," + this.state.course.productName + "," + this.state.course.productShortDescription}
                        onChange={event => this.handleSelect(event)}
                        inputProps={{
                          name: "product",
                          id: "product"
                        }}
                        className={classes.customSelect}
                      >
                        {this.state.products.map((product, key) => {
                          return (
                            <MenuItem
                              key={key}
                              value={`${product.productId},${product.productName},${product.shortDescription}`}>
                              {product.productName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>Select a Product</code>
                      </FormLabel>
                    </GridItem>
                  </Fragment>
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Level
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Select
                        fullWidth
                        value={this.state.course.level}
                        onChange={event => this.handleSelect(event)}
                        inputProps={{
                          name: "level",
                          id: "level"
                        }}
                        className={classes.customSelect}
                      >
                        {[1, 2, 3, 4, 5, 6].map((l) => {
                          return (
                            <MenuItem key={l} value={l}>
                              {l}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>Select a Level</code>
                      </FormLabel>
                    </GridItem>
                  </Fragment>
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Teacher Pool
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Select
                        multiple
                        fullWidth
                        value={this.state.course.teacherPool}
                        onChange={event => this.handleSelect(event)}
                        inputProps={{
                          name: "teacherPool",
                          id: "teacherPool"
                        }}
                        className={classes.customSelect}
                      >
                        {this.state.teachers.map((teacher, key) => {
                          return (
                            <MenuItem key={key} value={teacher.userId}>
                              {teacher.teacherName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>{_.isEmpty(editingItem) ? "Select Teachers" : "Make sure main teacher be selected"}</code>
                      </FormLabel>
                    </GridItem>
                  </Fragment>
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Main Teacher
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Select
                        fullWidth
                        value={this.state.course.teacherUserId + "," + this.state.course.teacherUserName}
                        onChange={event => this.handleSelect(event)}
                        inputProps={{
                          name: "teacher",
                          id: "teacher"
                        }}
                        className={classes.customSelect}
                        disabled={!_.isEmpty(editingItem)}
                      >
                        {this.state.teachers
                          .filter(t =>
                            this.state.course.teacherPool.includes(t.userId)
                          )
                          .map((teacher, key) => {
                            return (
                              <MenuItem
                                key={key}
                                value={`${teacher.userId},${teacher.teacherName}`}>
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
                onClick={() => fadeForm(false)}
                className={classes.actionBtn}
              >
                Close
              </Button>
              <Button
                color="rose"
                disabled={
                  this.state.course.startDate === undefined ||
                  this.state.course.productName === undefined ||
                  this.state.course.level === undefined ||
                  this.state.course.teacherUserName === undefined ||
                  this.state.course.teacherPool.length === 0 ||
                  this.state.course.lessons === undefined ||
                  !this.state.course.teacherPool.includes(this.state.course.teacherUserId) ||
                  this.state.lessonsState === "error"
                }
                onClick={this.handleSubmit}
              >
                {_.isEmpty(editingItem) ? "Add" : "Edit"}
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

CourseForm.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchData: PropTypes.func,
  resetPagination: PropTypes.func,
  fadeForm: PropTypes.func,
  editingItem: PropTypes.object
};

export default withStyles(styles)(CourseForm);
