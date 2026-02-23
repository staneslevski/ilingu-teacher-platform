import asyncComponent from "components/Routes/AsyncComponent";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import ViewList from "@material-ui/core/SvgIcon/SvgIcon";

const AsyncStudent = asyncComponent(() => import("views/Student/Student.jsx"));
const AsyncTeacherProfile = asyncComponent(() => import("views/Teacher/Profile"));
const AsyncEditTeacherProfile = asyncComponent(() => import("views/Teacher/Profile/EditProfile.jsx"));

var studentRoutes = [
  {
    collapse: true,
    isMenuItem: true,
    path: "/apply-teacher",
    name: "Teacher Application",
    icon: ViewList,
    state: "openStudentLinks",
    views: [
      {
        path: "/my-teacher-profile",
        name: "Teacher Profile",
        isMenuItem: true,
        component: AsyncTeacherProfile
      },
      {
        path: "/edit-teacher-profile",
        name: "Edit Teacher Profile",
        isMenuItem: true,
        component: AsyncEditTeacherProfile
      },
    ]
  },
  {
    path: "/my-profile",
    isMenuItem: false,
    component: AsyncTeacherProfile
  },
  {
    path: "/edit-profile",
    isMenuItem: false,
    component: AsyncEditTeacherProfile
  },
  {
    path: "/",
    name: "Student",
    icon: DashboardIcon,
    component: AsyncStudent
  },

  { redirect: true, path: "/", pathTo: "/", name: "Student" }
];
export default studentRoutes;
