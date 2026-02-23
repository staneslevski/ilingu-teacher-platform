import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import { City, HomeMapMarker, Map, MapMarker, ZipBox } from "mdi-material-ui";

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
  }
};

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressLine1: "",
      addressLine1State: "",
      addressLine2: "",
      addressLine2State: "",
      addressLine3: "",
      addressLine3State: "",
      city: "",
      cityState: "",
      state: "",
      stateState: "",
      postCode: "",
      postCodeState: "",
      country: "",
      countryState: ""
    };
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
  isValidated() {
    if (
      this.state.addressLine1State === "success" &&
      this.state.cityState === "success" &&
      this.state.stateState === "success" &&
      this.state.postCodeState === "success" &&
      this.state.countryState === "success"
    ) {
      return true;
    } else {
      if (this.state.addressLine1State !== "success") {
        this.setState({ addressLine1State: "error" });
      }
      if (this.state.cityState !== "success") {
        this.setState({ cityState: "error" });
      }
      if (this.state.stateState !== "success") {
        this.setState({ stateState: "error" });
      }
      if (this.state.postCodeState !== "success") {
        this.setState({ postCodeState: "error" });
      }
      if (this.state.countryState !== "success") {
        this.setState({ countryState: "error" });
      }
    }
    return false;
  }
  render() {
    const { classes } = this.props;
    const profileFields = [
      {
        key: "5",
        id: "addressLine1",
        type: "text",
        icon: HomeMapMarker,
        label: "Address Line 1",
        length: [3, 128]
      },
      {
        key: "6",
        id: "addressLine2",
        type: "text",
        icon: HomeMapMarker,
        label: "Address Line 2(optional)",
        length: [0, 128]
      },
      {
        key: "7",
        id: "addressLine3",
        type: "text",
        icon: HomeMapMarker,
        label: "Address Line 3(optional)",
        length: [0, 128]
      },
      {
        key: "8",
        id: "city",
        type: "text",
        icon: City,
        label: "City",
        length: [2, 32]
      },
      {
        key: "9",
        id: "state",
        type: "text",
        icon: MapMarker,
        label: "State / Country",
        length: [2, 32]
      },
      {
        key: "10",
        id: "postCode",
        type: "text",
        icon: ZipBox,
        label: "Zip Code / Post Code",
        length: [2, 32]
      },
      {
        key: "11",
        id: "country",
        type: "text",
        icon: Map,
        label: "Country",
        length: [2, 32]
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
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(style)(Address);
