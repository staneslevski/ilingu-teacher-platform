// DON'T NEED THIS FEATURE NOW.
import React, { Fragment } from "react";
import { API } from "aws-amplify";
import PropTypes from "prop-types";

import Button from "../../components/CustomButtons/Button.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import withStyles from "@material-ui/core/styles/withStyles";
import validationFormsStyle from "../../assets/jss/material-dashboard-pro-react/views/validationFormsStyle.jsx";
import Assignment from "@material-ui/icons/Assignment";
import FormLabel from "@material-ui/core/FormLabel";
import Datetime from "react-datetime";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const styles = {
  ...validationFormsStyle,
  actionBtn: {
    marginRight: "15px"
  }
};

class AddStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {},
      userIdState: "",
      studentNameState: "",
      phoneState: "",
      emailState: "",
      weChatIdState: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  change(event) {
    const student = { ...this.state.student };
    const emailRegex = /\S+@\S+\.\S+/;
    const value = event.target.value;
    if (value) {
      this.setState({
        student: {
          ...student,
          [event.target.id]: event.target.value
        }
      });
    }
    switch (event.target.id) {
      case "userId":
        if (value && value.length >= 6 && value.length <= 32) {
          this.setState({ userIdState: "success" });
        } else {
          this.setState({ userIdState: "error" });
        }
        break;
      case "studentName":
        if (value && value.length >= 3 && value.length <= 32) {
          this.setState({ studentNameState: "success" });
        } else {
          this.setState({ studentNameState: "error" });
        }
        break;
      case "phone":
        if (value && value.length >= 7 && value.length <= 16) {
          this.setState({ phoneState: "success" });
        } else {
          this.setState({ phoneState: "error" });
        }
        break;
      case "email":
        if (value && emailRegex.test(value)) {
          this.setState({ emailState: "success" });
        } else {
          this.setState({ emailState: "error" });
        }
        break;
      case "weChatId":
        if (value && value.length >= 3 && value.length <= 32) {
          this.setState({ weChatIdState: "success" });
        } else {
          this.setState({ weChatIdState: "error" });
        }
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  createStudent(body) {
    return API.post("students", "/students", {
      body: body
    });
  }
  handleSubmit = async () => {
    try {
      await this.createStudent(this.state.student);
      this.props.resetPagination();
      this.props.fetchData();
      this.props.fadeForm(false);
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    const { classes, fadeForm } = this.props;
    const fields = [
      {
        key: "1",
        label: "User Id",
        validateState: this.state.userIdState,
        id: "userId",
        helpText: "6 to 32 length"
      },
      {
        key: "2",
        label: "Name",
        validateState: this.state.studentNameState,
        id: "studentName",
        helpText: "3 to 32 length"
      },
      {
        key: "3",
        label: "Phone",
        validateState: this.state.phoneState,
        id: "phone",
        helpText: "7 to 16 length"
      },
      {
        key: "4",
        label: "Email",
        validateState: this.state.emailState,
        id: "email",
        helpText: "email address"
      },
      {
        key: "5",
        label: "WeChat ID",
        validateState: this.state.weChatIdState,
        id: "weChatId",
        helpText: "WeChat ID"
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
              <h4 className={classes.cardIconTitle}>Add Student</h4>
            </CardHeader>
            <CardBody>
              <form>
                <GridContainer>
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
                              type: "text"
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
                        Gender
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Select
                        fullWidth
                        value={this.state.student.gender}
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
                        Birthday
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Datetime timeFormat={false} dateFormat="YYYY-MM-DD" className={classes.datePicker} closeOnSelect onChange={this.handleDatePicker} />
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>e.g. `2018-09-26`</code>
                      </FormLabel>
                    </GridItem>
                  </Fragment>
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Create Date
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <Datetime timeFormat={false} dateFormat="YYYY-MM-DD" className={classes.datePicker} closeOnSelect onChange={this.handleDatePicker} />
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>e.g. `2018-09-26`</code>
                      </FormLabel>
                    </GridItem>
                  </Fragment>
                  <Fragment>
                    <GridItem xs={12} sm={2}>
                      <FormLabel className={classes.labelHorizontal}>
                        Remark
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={7}>
                      <CustomInput
                        id="remark"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => this.change(event),
                          type: "text",
                          multiline: true
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelLeftHorizontal}>
                        <code>optional remark info</code>
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
                onClick={this.handleSubmit}
                disabled={
                  this.state.student.userId === undefined ||
                  this.state.student.studentName === undefined ||
                  this.state.student.phone === undefined ||
                  this.state.student.email === undefined ||
                  this.state.student.weChatId === undefined ||
                  this.state.userIdState === "error" ||
                  this.state.studentNameState === "error" ||
                  this.state.phoneState === "error" ||
                  this.state.emailState === "error" ||
                  this.state.weChatIdState === "error"
                }
              >
                Add
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

AddStudent.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchData: PropTypes.func,
  resetPagination: PropTypes.func,
  fadeForm: PropTypes.func
};

export default withStyles(styles)(AddStudent);
