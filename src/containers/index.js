import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '~store/userStroe';
import useQueryV2 from '~hooks/useQueryV2';
import { getData } from '~service/api';
import About from './About/About';

const Main = () => {
  const { t } = useTranslation();
  const { userData: { name } } = useUserStore();
  const userListQuery = useQueryV2(getData);
  useEffect(() => {
    console.log('componentDidMount');
    userListQuery.exec();
  }, []);
  console.log(userListQuery.data.result);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{t(`Welcome ${name}`)}</h1>
      <h2>Hello, I`m ReactMaker.</h2>
      {
        userListQuery.isLoading ? <div> loading ...</div> : <p>{userListQuery.data.email}</p>
      }
      <p>To get started, edit containers/index.js</p>
      <About />
    </div>
  );
};

export default hot(Main);
