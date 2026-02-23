import React from "react";
import { createAddress } from "../../libs/ilingu-libs/address";
import { createTeacher } from "../../libs/ilingu-libs/teacher";

import Wizard from "../Wizard/Wizard.jsx";

import Profile from "./AddProfile";
import Address from "./AddAddress";

class TeacherProfileWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimation: "cardHidden",
      addProfileErrorMessage: ""
    };
    this.handleProfile = this.handleProfile.bind(this);
  }
  handleProfile = async allStates => {
    const about = allStates.about;
    const address = allStates.address;
    const userSub = this.props.cookies.get("userSub");
    let body = {
      userId: userSub,
      teacherName: about.teacherName,
      phone: about.phone,
      weChatId: about.weChatId,
      curriculums: about.curriculums
    };
    if (about.englishName) {
      body.englishName = about.englishName;
    }
    createTeacher(body);

    let addressBody = {
      userId: userSub,
      country: address.country,
      postCode: address.postCode,
      state: address.state,
      city: address.city,
      addressLine1: address.addressLine1
    };
    if (address.addressLine2) {
      addressBody.addressLine2 = address.addressLine2;
    }
    if (address.addressLine3) {
      addressBody.addressLine3 = address.addressLine3;
    }
    createAddress(addressBody);
    this.props.checkAuthState();
    this.props.history.push("/");
  };
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function() {
        this.setState({ cardAnimation: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeOutFunction);
    this.timeOutFunction = null;
  }
  render() {
    return (
      <Wizard
        validate
        finishButtonText="Finish"
        finishButtonClick={this.handleProfile}
        steps={[
          { stepName: "About", stepComponent: Profile, stepId: "about" },
          { stepName: "Address", stepComponent: Address, stepId: "address" }
        ]}
        title="Build Your Profile"
        subtitle="This information will let us know more about you."
      />
    );
  }
}

export default TeacherProfileWizard;
