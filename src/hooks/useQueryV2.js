import { useState, useRef } from 'react';
import AxiosApiClient from '../service/AxiosApiClient';

const apiClient = new AxiosApiClient();

const useQueryV2 = (option) => {
  const [query, updateQuery] = useState(option.payload.query || option.payload || {});
  const [header] = useState(option.header || {});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(option.data || {});
  const cancelFn = useRef({ cancel: () => { } });

  const payload = {
    query,
  };

  const setQuery = (newState) => {
    updateQuery({
      ...query,
      ...newState,
    });
  };

  async function fetchFn(newPayload = {}) {
    const request = apiClient[option.method](option.url, { ...query, ...newPayload }, header);
    cancelFn.current = request;
    const response = await request.send();
    return response.data;
  }

  async function exec(newPayload = {}) {
    let newData = option.data;
    try {
      setIsLoading(true);
      const response = await fetchFn(newPayload);
      setData(response);
      newData = response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
    return newData;
  }

  function getError() {
    return error ? JSON.parse(error) : {};
  }

  const cancel = () => (cancelFn.current && cancelFn.current.cancel ? cancelFn.current.cancel() : () => { });

  return {
    query,
    setQuery,
    payload,
    isLoading,
    data,
    error,
    exec,
    getError,
    cancel,
    setData,
  };
};

export default useQueryV2;
