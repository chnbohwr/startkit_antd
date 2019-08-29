import React, { lazy, Suspense } from "react";
import { hot } from "react-hot-loader/root";
import { Route, Switch, Link } from "react-router-dom";

const Home = lazy(() => import("./Home/Home"));
const About = lazy(() => import("./About/About"));

const Main = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Suspense fallback={<div>Module loading....</div>}>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
        </Suspense>
      </Switch>
    </div>
  );
};

export default hot(Main);
