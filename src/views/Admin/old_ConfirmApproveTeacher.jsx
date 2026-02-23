import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "../../components/CustomButtons/Button.jsx";

import modalStyle from "../../assets/jss/material-dashboard-pro-react/modalStyle.jsx";
import PropTypes from "prop-types";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ConfirmApproveTeacher extends React.Component{
  render() {
    const { classes, isOpen, approveTeacher, handleClose } = this.props;
    return (
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal
        }}
        open={isOpen}
        transition={Transition}
        keepMounted
        onClose={() => handleClose()}
        aria-labelledby="modal-slide-title"
        aria-describedby="modal-slide-description">
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={() => handleClose()}
          >
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>Approve Teacher</h4>
        </DialogTitle>
        <DialogContent
          id="modal-slide-description"
          className={classes.modalBody}>
          <h5>Are you sure you want to do this?</h5>
        </DialogContent>
        <DialogActions
          className={classes.modalFooter + " " + classes.modalFooterCenter}>
          <Button onClick={() => handleClose()} color="simple">
            Close
          </Button>
          <Button onClick={() => approveTeacher()} color="successNoBackground">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmApproveTeacher.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  approveTeacher: PropTypes.func
};

export default withStyles(modalStyle)(ConfirmApproveTeacher);
