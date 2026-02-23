// core libraries
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { API } from "aws-amplify";
import withStyles from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import * as Sentry from "@sentry/browser"
import moment from "moment";

// core components
import GridContainer from "../../../components/Grid/GridContainer.jsx";
import GridItem from "../../../components/Grid/GridItem.jsx";
import Card from "../../../components/Card/Card.jsx";
import CardBody from "../../../components/Card/CardBody.jsx";
import CardIcon from "../../../components/Card/CardIcon.jsx";
import CardHeader from "../../../components/Card/CardHeader.jsx";
import ReactTable from "react-table";

// styles
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.jsx";

// icons
import Assignment from "@material-ui/icons/Assignment";

// actions

import config from "../../../config";

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

const PAGE_SIZE = 5;

Sentry.init(config.sentry);

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      pages: 1,
      currentPage: 0,
      LastEvaluatedKeys: [],
      isFormShown: false
    };
    this.getStudentsCount = this.getStudentsCount.bind(this);
    this.getStudents = this.getStudents.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.getStudentsCount();
  }
  getStudentsCount() {
    API.get("students", "/students", {
      queryStringParameters: {
        Select: "COUNT"
      }
    }).then(counter => {
      this.setState({
        pages: Math.ceil(counter.Count / PAGE_SIZE)
      });
    });
  }
  getStudents(pageSize, startToken) {
    return API.get("students", "/students", {
      queryStringParameters: {
        pageSize: pageSize,
        startToken: startToken
      }
    });
  }
  async fetchData(state, instance) {
    let statePage;
    if (state === undefined) {
      statePage = 0;
    } else {
      statePage = state.page;
    }
    let startToken = JSON.stringify(this.state.LastEvaluatedKeys[statePage-1]);
    const students = await this.getStudents(PAGE_SIZE, startToken);
    let LastEvaluatedKeys = this.state.LastEvaluatedKeys;
    if (statePage >= this.state.currentPage) {
      LastEvaluatedKeys.push(students.LastEvaluatedKey);
    }
    this.setState({
      currentPage: statePage,
      students: students.Items,
      LastEvaluatedKeys: LastEvaluatedKeys
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="primary" icon>
                <CardIcon color="primary">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Students</h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  className="-striped -highlight"
                  defaultPageSize={10}
                  showPaginationBottom
                  showPageSizeOptions={false}
                  showPageJump
                  filterable
                  data={this.props.adminInfo.students.map(student => {
                    let createdDate;
                    try {
                      createdDate = moment.utc(student.createdAtMS, 'x').format("YYYY MMM DD");
                      if (createdDate === 'Invalid date') {
                        if (student.hasOwnProperty('createDate')) {
                          createdDate = student.createDate
                        } else {
                          createdDate = "...?"
                        }
                      }
                    } catch (e) {
                      Sentry.captureException(e);
                      createdDate = "...?"
                    }
                    return {
                      studentName: student.studentName,
                      createdDate: createdDate,
                      phone: student.phone,
                      email: student.email,
                    }
                  })}
                  columns={[
                    {
                      Header: "Student Name",
                      accessor: "studentName"
                    },
                    {
                      Header: "Joined Date",
                      accessor: "createdDate"
                    },
                    {
                      Header: "Phone",
                      accessor: "phone"
                    },
                    {
                      Header: "Email",
                      accessor: "email"
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Fragment>
    );
  }
}

Students.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    adminInfo: state.adminInfo
  }
};

export default connect(
  mapStateToProps
)(withStyles(styles)(Students));
