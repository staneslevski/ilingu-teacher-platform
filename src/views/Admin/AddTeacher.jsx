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

const styles = {
  ...validationFormsStyle,
  actionBtn: {
    marginRight: "15px"
  }
};

class AddTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teacher: {},
      teacherNameState: "",
      englishNameState: "",
      phoneState: "",
      emailState: "",
      weChatIdState: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  change(event) {
    const teacher = { ...this.state.teacher };
    const emailRegex = /\S+@\S+\.\S+/;
    const value = event.target.value;
    this.setState({
      teacher: {
        ...teacher,
        [event.target.id]: event.target.value
      }
    });
    switch (event.target.id) {
      case "teacherName":
        if (value && value.length >= 2 && value.length <= 32) {
          this.setState({ teacherNameState: "success" });
        } else {
          this.setState({ teacherNameState: "error" });
        }
        break;
      case "englishName":
        if (value && value.length >= 3 && value.length <= 16) {
          this.setState({ englishNameState: "success" });
        } else {
          this.setState({ englishNameState: "error" });
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
  createTeacher(body) {
    return API.post("teachers", "/teachers", {
      body: body
    });
  }
  handleSubmit = async () => {
    try {
      await this.createTeacher(this.state.teacher);
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
        label: "Chinese Name",
        validateState: this.state.teacherNameState,
        id: "teacherName",
        helpText: "2 to 32 length"
      },
      {
        key: "2",
        label: "English Name",
        validateState: this.state.englishNameState,
        id: "englishName",
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
              <h4 className={classes.cardIconTitle}>Add Teacher</h4>
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
                  this.state.teacher.teacherName === undefined ||
                  this.state.teacher.englishName === undefined ||
                  this.state.teacher.phone === undefined ||
                  this.state.teacher.email === undefined ||
                  this.state.teacher.weChatId === undefined ||
                  this.state.teacherNameState === "error" ||
                  this.state.englishNameState === "error" ||
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

AddTeacher.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchData: PropTypes.func,
  resetPagination: PropTypes.func,
  fadeForm: PropTypes.func
};

export default withStyles(styles)(AddTeacher);
