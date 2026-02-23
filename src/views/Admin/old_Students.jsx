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

import withStyles from "@material-ui/core/styles/withStyles";
import Assignment from "@material-ui/icons/Assignment";

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
                  manual
                  onFetchData={this.fetchData}
                  showPageSizeOptions={false}
                  showPageJump={false}
                  pages={this.state.pages}
                  data={this.state.students}
                  columns={[
                    {
                      Header: "Student Name",
                      accessor: "studentName"
                    },
                    {
                      Header: "Gender",
                      accessor: "gender"
                    },
                    {
                      Header: "Birthday",
                      accessor: "birthday"
                    },
                    {
                      Header: "Create Date",
                      accessor: "createDate"
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
      </Fragment>
    );
  }
}

Students.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Students);
