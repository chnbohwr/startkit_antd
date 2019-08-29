import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { useUserStore } from "~store/userStroe";
import useQueryV2 from "~hooks/useQueryV2";
import { getData, login } from "~service/api";

const Home = ({ history }) => {
  const { t } = useTranslation();
  const {
    userData: { name, token },
    setUserData
  } = useUserStore();
  const userListQuery = useQueryV2(getData);
  const useLogin = useQueryV2(login);
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
      {userListQuery.isLoading ? (
        <div> loading ...</div>
      ) : (
        <p>{userListQuery.data.email}</p>
      )}
      <Button type="primary" onClick={() => onClickLogin()}>
        Login in
      </Button>
      <p>{useLogin.data.token}</p>
    </div>
  );
};

export default Home;
