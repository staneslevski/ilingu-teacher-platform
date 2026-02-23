import asyncComponent from "../../components/Routes/AsyncComponent";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import ViewList from "@material-ui/core/SvgIcon/SvgIcon";

const AsyncTeacher = asyncComponent(() => import("../../views/Teacher/Teacher.jsx"));
const AsyncTeacherProfile = asyncComponent(() => import("../../views/Teacher/Profile"));
const AsyncEditTeacherProfile = asyncComponent(() => import("../../views/Teacher/Profile/EditProfile.jsx"));
const AsyncScheduleAvailable = asyncComponent(() => import("../../views/Teacher/Schedule"));
const AsyncScheduleVacation = asyncComponent(() => import("../../views/Teacher/Schedule/Vacation"));
const AsyncCourses = asyncComponent(() => import("../../views/Teacher/Courses"));
const AsyncLessons = asyncComponent(() => import("../../views/Teacher/Lessons"));
const AsyncLessonsSummary = asyncComponent(() => import("../../views/Teacher/Courses/LessonsSummary"));


const teacherRoutes = [
  // profile routes - not shown in menu, but links hardcoded into sidebar component
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
  // menu routes start here
  {
    collapse: true,
    isMenuItem: true,
    path: "/schedule",
    name: "Schedule",
    state: "openSchedule",
    icon: DashboardIcon,
    views: [
      {
        path: "/schedule/available",
        name: "Available Hours",
        mini: "AH",
        component: AsyncScheduleAvailable,
      },
      {
        path: "/schedule/vacation",
        name: "Teacher Vacation Times",
        mini: "假期",
        component: AsyncScheduleVacation,
      }
    ]
  },
  // courses routes
  {
    collapse: true,
    isMenuItem: true,
    path: "/courses",
    name: "Courses",
    state: "openCourses",
    icon: ViewList,
    views: [
      {
        path: "/courses/list",
        name: "Course List",
        mini: "CL",
        component: AsyncCourses
      },
      {
        path: "/lessons/list",
        name: "Lesson List",
        mini: "LL",
        component: AsyncLessons
      },
      {
        path: "/lessons/Summary",
        name: "Lessons Summary",
        mini: "LS",
        component: AsyncLessonsSummary
      }
    ]
  },
  {
    path: "/",
    isMenuItem: false,
    name: "Home",
    icon: DashboardIcon,
    component: AsyncTeacher
  },
  { redirect: true, path: "/", pathTo: "/", name: "Teacher" }
];
export default teacherRoutes;
