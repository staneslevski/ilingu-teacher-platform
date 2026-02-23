import asyncComponent from "../../components/Routes/AsyncComponent";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import ViewList from "@material-ui/icons/ViewList";

const AsyncAdmin = asyncComponent(() => import("../../views/Admin/Home"));
const AsyncProducts = asyncComponent(() => import("../../views/Admin/Products"));
const AsyncCourses = asyncComponent(() => import("../../views/Admin/Courses"));
const AsyncLessons = asyncComponent(() => import("../../views/Admin/Lessons"));
const AsyncTeachers = asyncComponent(() => import("../../views/Admin/Teachers"));
const AsyncStudents = asyncComponent(() => import("../../views/Admin/Students"));
const AsyncPostEditor = asyncComponent(() => import("../../views/Admin/PostEditor"));
const AsyncPostList = asyncComponent(() => import("../../views/Admin/PostList"));
const AsyncTeacherProfile = asyncComponent(() => import("../../views/Teacher/Profile"));
const AsyncEditTeacherProfile = asyncComponent(() => import("../../views/Teacher/Profile/EditProfile.jsx"));


const adminRoutes = [
  {
    path: "/dashboard",
    name: "Admin",
    icon: DashboardIcon,
    component: AsyncAdmin
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
  // blog routes
  {
    collapse: true,
    isMenuItem: true,
    path: "/posteditor",
    name: "Posts",
    icon: ViewList,
    state: "openPosts",
    views: [
      {
        path: "/posts",
        name: "Post List",
        mine: "PL",
        component: AsyncPostList
      },
      {
        path: "/posteditor",
        name: "Post Editor",
        mine: "PL",
        component: AsyncPostEditor
      }
    ]
  },
  // products routes
  {
    collapse: true,
    isMenuItem: true,
    path: "/products",
    name: "Products",
    state: "openProducts",
    icon: ViewList,
    views: [
      {
        path: "/products/list",
        name: "Product List",
        mini: "PL",
        component: AsyncProducts
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
      }
    ]
  },
  {
    collapse: true,
    isMenuItem: true,
    path: "/teachers",
    name: "Teachers",
    state: "openTeachers",
    icon: ViewList,
    views: [
      {
        path: "/teachers/list",
        name: "Teacher List",
        mini: "TL",
        component: AsyncTeachers
      }
    ]
  },
  {
    collapse: true,
    isMenuItem: true,
    path: "/students",
    name: "Students",
    state: "openStudents",
    icon: ViewList,
    views: [
      {
        path: "/students/list",
        name: "Student List",
        mini: "SL",
        component: AsyncStudents
      }
    ]
  },
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Admin" }
];

export default adminRoutes;
