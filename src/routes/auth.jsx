import asyncComponent from "../components/Routes/AsyncComponent";

// @material-ui/icons
import Fingerprint from "@material-ui/icons/Fingerprint";

const AsyncLoginPage = asyncComponent(() => import("../views/Auth/LoginPage"));
const AsyncSignUpTeacher = asyncComponent(() => import("../views/Auth/SignUpTeacher"));

const authRoutes = [
  {
    path: "/auth/login",
    name: "Login Page",
    short: "Login",
    mini: "LP",
    icon: Fingerprint,
    component: AsyncLoginPage
  },

  {
    path: "/auth/toast",
    name: "Teacher Self Sign Up",
    short: "SignUp",
    mini: "TU",
    icon: Fingerprint,
    component: AsyncSignUpTeacher
  }
];

export default authRoutes;
