import imagesStyles from "../imageStyles";
import buttonGroupStyle from "../buttonGroupStyle"

const coursesInfoStyle = {
  ...buttonGroupStyle,
  ...imagesStyles,
  leftContainer: {
    marginTop: "30px",
  },
  nextLesson: {
    marginTop: "30px",
    padding: "20px",
  },
  lessonsCard: {
    margin: "0 0 0 0",
    padding: "20px",
  },
  buttonGroup: {
    ...buttonGroupStyle.buttonGroup,
    margin: "16% 0 0 20%"
  },
  giftQty: {
    padding: "3rem"
  }
};

export default coursesInfoStyle;
