import React from "react";
import { API } from "aws-amplify";

import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

import GridContainer from "../Grid/GridContainer.jsx";
import GridItem from "../Grid/GridItem.jsx";
import CustomInput from "../CustomInput/CustomInput.jsx";
import { Account, AccountPlus, Phone, Wechat } from "mdi-material-ui";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  },
  selectCurriculum: {
    margin: "25px 0"
  }
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherName: "",
      teacherNameState: "",
      englishName: "",
      englishNameState: "",
      phone: "",
      phoneState: "",
      weChatId: "",
      weChatIdState: "",
      curriculums: [],
      allCurriculums: []
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.getCurriculums = this.getCurriculums.bind(this);
  }
  async getCurriculums() {
    await API.get("curriculums", "/curriculums", {
      queryStringParameters: {
        pageSize: 500,
        startToken: null
      }
    }).then(data =>
      this.setState({
        allCurriculums: data.Items
      })
    );
  }
  componentDidMount() {
    this.getCurriculums();
  }
  sendState() {
    return this.state;
  }
  change(event, stateName, length) {
    if (event.target.value.length >= length[0] && event.target.value.length <= length[1]) {
      this.setState({ [stateName + "State"]: "success" });
    } else {
      this.setState({ [stateName + "State"]: "error" });
    }
    this.setState({ [stateName]: event.target.value });
  }
  handleSelect(event) {
    const value = event.target.value;
    switch (event.target.name) {
      case "curriculums":
        this.setState({
          curriculums: value
        });
        break;
      default:
        throw new Error("Change switches has not found a case.");
    }
  }
  isValidated() {
    if (
      this.state.teacherNameState === "success" &&
      this.state.phoneState === "success" &&
      this.state.weChatIdState === "success"
    ) {
      return true;
    } else {
      if (this.state.teacherNameState !== "success") {
        this.setState({ teacherNameState: "error" });
      }
      if (this.state.phoneState !== "success") {
        this.setState({ phoneState: "error" });
      }
      if (this.state.weChatIdState !== "success") {
        this.setState({ weChatIdState: "error" });
      }
    }
    return false;
  }
  render() {
    const { classes } = this.props;
    const profileFields = [
      {
        key: "1",
        id: "teacherName",
        type: "text",
        icon: Account,
        label: "Name",
        length: [2, 32]
      },
      {
        key: "2",
        id: "englishName",
        type: "text",
        icon: AccountPlus,
        label: "English Name(optional)",
        length: [0, 32]
      },
      {
        key: "3",
        id: "phone",
        type: "phone",
        icon: Phone,
        label: "Phone",
        length: [7, 16]
      },
      {
        key: "4",
        id: "weChatId",
        type: "weChatId",
        icon: Wechat,
        label: "WeChat Id",
        length: [3, 32]
      }
    ];
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} lg={10}>
          {profileFields.map(prop => {
            return (
              <CustomInput
                key={prop.key}
                success={this.state.firstnameState === "success"}
                error={this.state.firstnameState === "error"}
                labelText={prop.label}
                id={prop.id}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => this.change(event, prop.id, prop.length),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <prop.icon className={classes.inputAdornmentIcon} />
                    </InputAdornment>
                  )
                }}
              />
            );
          })}
          <Select
            multiple
            fullWidth
            value={this.state.curriculums}
            onChange={event => this.handleSelect(event)}
            inputProps={{
              name: "curriculums",
              id: "curriculums"
            }}
            className={classes.selectCurriculum}
          >
            {this.state.allCurriculums.map((curr, key) => {
              return (
                <MenuItem key={key} value={curr.curriculumId}>
                  {curr.Name}
                </MenuItem>
              );
            })}
          </Select>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(style)(Profile);
