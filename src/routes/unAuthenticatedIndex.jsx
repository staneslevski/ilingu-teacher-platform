import Auth from "../layouts/Auth.jsx";
import Pages from "../layouts/Pages.jsx";

export const unAuthenticatedIndexRoutes = [
  { path: "/auth", name: "Auth", component: Auth },
  { path: "/", name: "Home", component: Pages }
];