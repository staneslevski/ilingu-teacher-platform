// core libraries
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { API } from "aws-amplify";
import ReactTable from "react-table";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import * as Sentry from "@sentry/browser"

// core components
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "../../../components/CustomButtons/Button.jsx";
import AdminEditTeacherForm from "./AdminEditTeacherForm"

import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';

// actions
import ConfirmApproveTeacher from "./ConfirmApproveTeacher";

// icons
import Assignment from "@material-ui/icons/Assignment";
import Build from "@material-ui/icons/Build";
import {
  CheckCircleOutline,
  CloseCircleOutline,
  CheckDecagram
} from "mdi-material-ui";
import Check from '@material-ui/icons/Check';
// core components

//styles
import checkBoxStyles from "../../../assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";

import config from "../../../config";

const styles = {
  ...checkBoxStyles,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  rightBtn: {
    float: "right"
  }
};

Sentry.init(config.sentry);

export function SimpleCollapse({...props}) {
  let {classes} = props;
  return (
    <div className={classes.root}>
      <FormControlLabel
        control={<Switch checked={props.showForm} onChange={props.toggleShowForm} />}
        label="Show"
      />
      <div className={classes.container}>
        <Collapse in={props.showForm}>
          {props.teacher !== null ? (
            <AdminEditTeacherForm
              profile={props.teacher}
            />
          ) : (
            <p>Please select a teacher and try again</p>
          )}
        </Collapse>
      </div>
    </div>
  );
}


class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      teachers: [],
      isApproveDialogShown: false,
      selectedTeacher: null,
      approvingUserId: undefined,
      approvedOnly: true,
      showForm: false,
    };
  }
  toggleApprovedOnly = () => {
    let {approvedOnly} = this.state;
    this.setState({approvedOnly: !approvedOnly})
  };
  toggleShowForm = () => {
    let {showForm} = this.state;
    this.setState({showForm: !showForm})
  };
  closeApproveDialog = () => {
    this.setState({
      isApproveDialogShown: false
    });
  };
  showApproveDialog(userId, email) {
    this.setState({
      isApproveDialogShown: true,
      approvingUserId: userId,
      teacherEmail: email,
    });
  }
  approveTeacher = () => {
    this.setState({
      loading: true
    });
    API.put("teachers", "/teachers/approve", {
      body: {
        userId: this.state.approvingUserId,
        teacherEmail: this.state.teacherEmail,
      }
    }).then(() => {
      // todo: refresh state here
      this.setState({
        loading: false
      });
      this.closeApproveDialog();
    });
  };
  handleShowEditTeacherForm(teacher) {
    this.setState({showForm: true, selectedTeacher: teacher})
  }
  render() {
    const { classes, adminInfo } = this.props;
    let {teachers} = adminInfo;
    const { isApproveDialogShown, approvedOnly } = this.state;
    if (approvedOnly) {
      teachers = teachers.filter(teacher => teacher.approved === true)
    }
    return (
      <Fragment>
        <GridContainer>
          <GridItem xs={12}>
            <SimpleCollapse
              classes={this.props.classes}
              showForm={this.state.showForm}
              toggleShowForm={this.toggleShowForm}
              teacher={this.state.selectedTeacher}
            />
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Teachers
                  {this.props.adminInfo.isLoadingTeachers ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <div className={classes.checkboxAndRadio + " " + classes.checkboxAndRadioHorizontal}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            data-cy={"approved_only_checkbox"}
                            tabIndex={-1}
                            onClick={this.toggleApprovedOnly}
                            checked={approvedOnly}
                            checkedIcon={<Check className={classes.checkedIcon} />}
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot
                            }}
                          />
                        }
                        classes={{label: classes.label}}
                        label="Only show approved teachers"
                      />
                    </div>
                  )}
                </h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  className="-striped -highlight"
                  defaultPageSize={10}
                  showPaginationBottom
                  showPageSizeOptions={false}
                  showPageJump={true}
                  filterable
                  data={teachers.map(teacher => {
                    return {
                      ...teacher,
                      actions: (
                        <div
                        data-cy={"teacher_list_actions_section"}
                        >
                          <Button
                            justIcon
                            round
                            simple
                            onClick={() => this.handleShowEditTeacherForm(teacher)}
                            color={"primary"}
                            className={"like"}
                          >
                            <Build />
                          </Button>
                          {!teacher.approved ? (
                            <Button
                              justIcon
                              round
                              simple
                              onClick={() => {
                                this.showApproveDialog(teacher.userId, teacher.email);
                              }}
                              color="info"
                              className="like"
                            >
                              <CheckDecagram />
                            </Button>
                          ) : null}
                        </div>
                      )
                    };
                  })}
                  columns={[
                    {
                      Header: "Teacher Name",
                      accessor: "teacherName"
                    },
                    {
                      Header: "English Name",
                      accessor: "englishName"
                    },
                    {
                      Header: "Joined Date",
                      accessor: "joinedDate"
                    },
                    {
                      Header: "Phone",
                      accessor: "phone"
                    },
                    {
                      Header: "Email",
                      accessor: "email"
                    },
                    {
                      Header: "WeChat ID",
                      accessor: "weChatId"
                    },
                    {
                      Header: "Approved",
                      id: "approved",
                      accessor: d =>
                        d.approved ? (
                          <CheckCircleOutline />
                        ) : (
                          <CloseCircleOutline />
                        )
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      sortable: false,
                      filterable: false
                    }
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <ConfirmApproveTeacher
          isOpen={isApproveDialogShown}
          handleClose={this.closeApproveDialog}
          approveTeacher={this.approveTeacher}
        />
      </Fragment>
    );
  }
}

Teachers.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    adminInfo: state.adminInfo,
  }
};

export default connect(mapStateToProps)(withStyles(styles)(Teachers));
