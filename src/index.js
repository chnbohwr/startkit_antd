import React from 'react';
import { render } from 'react-dom';
import Main from '~containers/';
import { UserContextProvider } from '~store/userStroe';
import '~theme/antd.less';
import './locales/i18n';

const App = () => (
  <UserContextProvider>
    <Main />
  </UserContextProvider>
);

render(<App />, document.getElementById('app'));
