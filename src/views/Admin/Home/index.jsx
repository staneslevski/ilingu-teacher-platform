import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
// redux libs
import connect from "react-redux/es/connect/connect";

// react plugin for creating charts
import ChartistGraph from "react-chartist";
// core components
import { roundedLineChart } from "../../../variables/charts.jsx";


import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "../../../assets/jss/material-dashboard-pro-react/views/dashboardStyle";


class Admin extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    try {
      return this.props.adminInfo.lessons !== nextProps.adminInfo.lesons;
    } catch (e) {
      return true
    }
  }

  render() {
    const { classes, adminInfo } = this.props;
    let data = {
      labels: [],
      series: [[], []]
    };
    let nMonths = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let high = 0;
    nMonths.forEach(n => {
      let monthMoment = moment();
      monthMoment = monthMoment.subtract(n, "months");
      data.labels.unshift(monthMoment.format('MMM'));
      let monthTotalArray = adminInfo.lessons.filter(lesson =>
        moment(lesson.parts[0].startDateTime).format('MMM') === monthMoment.format('MMM')
      );
      let val = monthTotalArray.length;
      if (val > high) {
        high = val * 1.5
      }
      data.series[0].unshift(val);
      data.series[1].unshift(350)
    });
    roundedLineChart.options.high = high;
    return (
      <div>
        <h3 className={classes.test}>You are logged in as an admin user</h3>
        <h1>Lessons</h1>
        {/*<p>{JSON.stringify(data)}</p>*/}
        <ChartistGraph
          className="ct-chart"
          data={data}
          type="Line"
          options={roundedLineChart.options}
          listener={roundedLineChart.animation}
        />
      </div>
    );
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    studentInfo: state.studentInfo,
    adminInfo: state.adminInfo,
  };
};

export default connect(mapStateToProps)(withStyles(dashboardStyle)(Admin));
