import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { useUserStore } from "~store/userStroe";
// import useQueryV2 from "~hooks/useQueryV2";
import useAxios from '~hooks/useAxios';
import { getData, login } from "~service/api";

const Home = ({ history }) => {
  const { t } = useTranslation();
  const {
    userData: { name, token },
    setUserData
  } = useUserStore();
  const userListQuery = useAxios(getData, false);
  const useLogin = useAxios(login);
  useEffect(() => {
    if (token) {
      history.push("/about");
    } else {
      console.log("componentDidMount");
      userListQuery.exec();
    }
  }, []);

  const onClickLogin = async () => {
    console.log("logIn");
    const data = await useLogin.exec();
    // if (useLogin.data.token) {
    setUserData({ name: "Bill", token: data.token });
    //   console.log(token);
    history.push("/about");
    // }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1>{t(`Welcome ${name}`)}</h1>
      <h2>Hello, I`m ReactMaker.</h2>
      {userListQuery.isLoading
        ? (
          <div> loading ...</div>
        )
        : (
          <p>{userListQuery.response.email}</p>
        )}
      <Button type="primary" onClick={() => onClickLogin()}>
        Login in
      </Button>
      <p>{useLogin.response.token}</p>
    </div>
  );
};

export default Home;
