import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import admin from "./admin";
import { Spin } from "antd";

const App = ({ match }) => (
  <div className="gx-main-content-wrapper" style={{ padding: "0px 32px" }}>
    <Suspense
      fallback={
        <Spin
          style={{
            position: "fixed",
            top: "50%",
            left: "60%",
            transform: "translate(-50%, -50%)",
          }}
        />
      }
    >
      <Switch>
        <Route path={`${match.url}`} component={admin} />
      </Switch>
    </Suspense>
  </div>
);

export default App;
