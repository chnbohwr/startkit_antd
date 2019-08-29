import React from "react";
import { Button, DatePicker } from "antd";
import * as Style from "./style";
import { useUserStore } from "~store/userStroe";

const About = ({history}) => {
  const {
    userData: { name, age, token },
    setUserData
  } = useUserStore();
  const onClickLogOut = async () => {
    // if (useLogin.data.token) {
    setUserData({ name: "", age: "", token: "" });
    //   console.log(token);
    history.push("/");
    // }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <DatePicker />
      <Style.Text>this is about page</Style.Text>
      <p>{name}</p>
      <p>{age}</p>
      <p>{token}</p>
      <Button type="primary" onClick={() => onClickLogOut()}>
        Login in
      </Button>
    </div>
  );
};

export default About;
