import React from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";

import AppliedRoute from "./AppliedRoute.js";

import {unAuthenticatedIndexRoutes} from "../../routes/unAuthenticatedIndex";

const Routes = ({ childProps }) => (
  <Switch>
    {unAuthenticatedIndexRoutes.map((prop, key) => {
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

Routes.propTypes = {
  childProps: PropTypes.object.isRequired
};

export default Routes;
