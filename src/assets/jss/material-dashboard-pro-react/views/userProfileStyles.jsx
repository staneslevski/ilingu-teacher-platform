import { cardTitle } from "../../material-dashboard-pro-react.jsx";
const userProfileStyles = {
  cardTitle,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
    "& small": {
      fontSize: "80%",
      fontWeight: "400"
    }
  },
  cardCategory: {
    marginTop: "10px",
    color: "#999999 !important",
    textAlign: "center"
  },
  description: {
    color: "#999999"
  },
  aboutMe: {
    color: "black",
    fontSize: "16px",
    width: "50%",
    textAlign: "justify",
    margin: "10px auto"
  },
  updateProfileButton: {
    float: "right"
  }
};
export default userProfileStyles;
