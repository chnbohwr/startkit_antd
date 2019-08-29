/* eslint-disable no-unsafe-finally */
import { useState } from "react";
import Axios from 'axios';

const defaultConfig = {
  baseURL: 'https://some-domain.com/api/', // 以後會從 env 進來
  headers: { Authorization: sessionStorage.token },
};

const useAxios = (axiosConfig, useDefaultConfig = true) => {
  const axios = Axios.create(useDefaultConfig ? defaultConfig : {});
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(axiosConfig.response);
  const [error, setError] = useState();

  const exec = async (newConfig = {}) => {
    let responseData = axiosConfig.response;
    setIsLoading(true);
    try {
      const config = { ...newConfig, ...axiosConfig };
      const { data } = await axios(config);
      responseData = data;
      setResponse(responseData);
    } catch (e) {
      setError(e);
      console.error(e);
    } finally {
      setIsLoading(false);
      return responseData;
    }
  };

  return ({
    isLoading,
    response,
    exec,
    error,
  });
};

export default useAxios;
