// core
import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { CookiesProvider } from "react-cookie";
import Amplify from "aws-amplify";
import { Provider } from "react-redux";

// components
import App from "./App.js";

// other libs
// import * as Sentry from "@sentry/browser";
import store from "./redux/store";

// styles
import "assets/scss/material-dashboard-pro-react.css?v=1.3.0";

//config
import config from "./config.js";

let hist = createBrowserHistory();

Amplify.configure({
  Auth: config.amplify.Auth,
  Storage: config.amplify.Storage,
  API: {
    endpoints: [
      ...config.amplify.API.endpoints,
      {
        name: "products",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "courses",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "lessons",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "teachers",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "students",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "curriculums",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "addresses",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "posts",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "tags",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      },
      {
        name: "image",
        endpoint: config.amplify.API.endpoints[0].endpoint,
        region: config.amplify.API.endpoints[0].region
      }
    ]
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={hist}>
      <CookiesProvider>
        <App hist={hist} />
      </CookiesProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
