import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import userInfo from "./userInfo";
import messageInfo from "./messageInfo";
import financeInfo from "./financeInfo";
import courseInfo from "./courseInfo";
import studentInfo from "./studentInfo";
import adminInfo from "./adminInfo";
import teacherInfo from "./teacherInfo";

export default history =>
  combineReducers({
      adminInfo,
      userInfo,
      studentInfo,
      messageInfo,
      financeInfo,
      courseInfo,
      teacherInfo,
      router: connectRouter(history)
  });
