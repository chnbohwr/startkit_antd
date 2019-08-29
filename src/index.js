import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "~containers/";
import { UserContextProvider } from "~store/userStroe";
import "~theme/antd.less";
import "./locales/i18n";

const App = () => (
  <Router>
    <UserContextProvider>
      <Main />
    </UserContextProvider>
  </Router>
);

render(<App />, document.getElementById("app"));
