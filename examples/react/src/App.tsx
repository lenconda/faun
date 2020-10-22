import React, { lazy, Suspense } from 'react';
import styles from './App.less';
import history from './utils/route';
import { Router, Switch, Route, Link } from 'react-router-dom';

import HomePage from './pages/home';

const FooPage = lazy(() => import('./pages/foo'));
const BarPage = lazy(() => import('./pages/bar'));

const App: React.FC = () => {
  return (
    <Router history={history}>
      <h1 className={styles.title}>React.js App</h1>
      <img src="/react.png" alt="" width="200" />
      <div>
        <Link to="/react/foo">/foo</Link>&nbsp;&nbsp;
        <Link to="/react/bar">/bar</Link>
      </div>
      <Switch>
        <Suspense fallback={null}>
          <Route path="/" component={HomePage} exact />
          <Route path="/react/foo" component={FooPage} />
          <Route path="/react/bar" component={BarPage} />
        </Suspense>
      </Switch>
    </Router>
  );
};

export default App;
