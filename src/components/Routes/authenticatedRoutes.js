import React from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";

import AppliedRoute from "./AppliedRoute.js";

import adminRoutes from "../../routes/appRoutes/adminIndex.jsx";

const Routes = ({ childProps }) => {
  let routes = adminRoutes;
  return (
    <Switch>
      {routes.map((prop, key) => {
        return (
          <AppliedRoute
            path={prop.path}
            component={prop.component}
            key={key}
            props={childProps}
          />
        );
      })}
    </Switch>
  );
};

Routes.propTypes = {
  childProps: PropTypes.object.isRequired
};

export default Routes;