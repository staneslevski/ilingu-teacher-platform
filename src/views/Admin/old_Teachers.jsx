import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { API } from "aws-amplify";
import ReactTable from "react-table";

import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import { cardTitle } from "../../assets/jss/material-dashboard-pro-react.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "../../components/CustomButtons/Button.jsx";

import withStyles from "@material-ui/core/styles/withStyles";
import Assignment from "@material-ui/icons/Assignment";
import {
  CheckCircleOutline,
  CloseCircleOutline,
  CheckDecagram
} from "mdi-material-ui";

import ConfirmApproveTeacher from "./old_ConfirmApproveTeacher";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  rightBtn: {
    float: "right"
  }
};

class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      teachers: [],
      pages: 1,
      currentPage: 0,
      LastEvaluatedKeys: [],
      isApproveDialogShown: false,
      approvingUserId: undefined
    };
    this.getTeachersCount = this.getTeachersCount.bind(this);
    this.getTeachers = this.getTeachers.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.resetPagination = this.resetPagination.bind(this);
    this.approveTeacher = this.approveTeacher.bind(this);
    this.closeApproveDialog = this.closeApproveDialog.bind(this);
  }
  componentDidMount() {
    this.getTeachersCount();
  }
  getTeachersCount() {
    API.get("teachers", "/teachers", {
      queryStringParameters: {
        Select: "COUNT"
      }
    }).then(counter => {
      this.setState({
        pages: Math.ceil(counter.Count / process.env.REACT_APP_PAGE_SIZE)
      });
    });
  }
  getTeachers(pageSize, startToken) {
    return API.get("teachers", "/teachers", {
      queryStringParameters: {
        pageSize: pageSize,
        startToken: startToken
      }
    });
  }
  async resetPagination() {
    await this.getTeachersCount();
    this.setState({
      currentPage: 0,
      LastEvaluatedKeys: []
    });
  }
  async fetchData(state, instance) {
    this.setState({
      loading: true
    });
    let statePage;
    if (state === undefined) {
      statePage = 0;
    } else {
      statePage = state.page;
    }
    let startToken = JSON.stringify(this.state.LastEvaluatedKeys[statePage-1]);
    const teachers = await this.getTeachers(process.env.REACT_APP_PAGE_SIZE, startToken);
    let LastEvaluatedKeys = this.state.LastEvaluatedKeys;
    if (statePage >= this.state.currentPage) {
      LastEvaluatedKeys.push(teachers.LastEvaluatedKey);
    }
    this.setState({
      currentPage: statePage,
      teachers: teachers.Items.map(t => {
        return {
          ...t,
          actions: (
            <div>
              {!t.approved ? (
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    this.showApproveDialog(t.userId, t.email);
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
      }),
      LastEvaluatedKeys: LastEvaluatedKeys,
      loading: false
    });
  }
  closeApproveDialog() {
    this.setState({
      isApproveDialogShown: false
    });
  }
  showApproveDialog(userId, email) {
    this.setState({
      isApproveDialogShown: true,
      approvingUserId: userId,
      teacherEmail: email,
    });
  }
  approveTeacher() {
    this.setState({
      loading: true
    });
    API.put("teachers", "/teachers/approve", {
      body: {
        userId: this.state.approvingUserId,
        teacherEmail: this.state.teacherEmail,
      }
    }).then(() => {
      this.setState({
        loading: false
      });
      this.closeApproveDialog();
      this.fetchData();
    });
  }
  render() {
    const { classes } = this.props;
    const { isApproveDialogShown } = this.state;
    return (
      <Fragment>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Teachers
                  {this.state.loading ? (
                    <CircularProgress color="secondary" />
                  ) : null}
                </h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  manual
                  onFetchData={this.fetchData}
                  showPageSizeOptions={false}
                  showPageJump={false}
                  pages={this.state.pages}
                  data={this.state.teachers}
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
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
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

export default withStyles(styles)(Teachers);
