// export default useQueryV2;
import { useState, useRef } from "react";
import AxiosApiClient from "../service/AxiosApiClient";

const apiClient = new AxiosApiClient();

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10
  // total: 1,
};

const SORTER_ABBR = {
  descend: "desc",
  ascend: "asc"
};

const DEFAULT_SORTER = {
  sortField: "",
  sortType: SORTER_ABBR.descend
};

const useQueryV2 = (option) => {
  const [query, updateQuery] = useState(
    option.payload.query || option.payload || {}
  );
  const [pagination, updatePagination] = useState({
    ...DEFAULT_PAGINATION,
    ...(option.pagination || {})
  });
  const [sorter, updateSorter] = useState({
    ...DEFAULT_SORTER,
    ...(option.sorter || {})
  });
  const [header] = useState(option.header || {});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(option.data);
  const [total, setTotal] = useState(0);
  const [updater, setUpdater] = useState(Math.random());
  const cancelFn = useRef({ cancel: () => {} });

  const payload = {
    query,
    pagination,
    sorter
  };

  const setQuery = (newState) => {
    updateQuery({
      ...query,
      ...newState
    });
  };

  const setPagination = (newState) => {
    const filteredState = Object.keys(newState).reduce((obj, stateKey) => {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_PAGINATION, stateKey)) {
        return {
          ...obj,
          [stateKey]: newState[stateKey]
        };
      }
      return obj;
    }, {});
    updatePagination({
      ...pagination,
      ...filteredState
    });
    setUpdater(Math.random());
  };
  const setSorter = (newState) => {
    updateSorter(newState);
    setUpdater(Math.random());
  };

  async function fetchFn(newPayload = {}) {
    const request = apiClient[option.method](
      option.url,
      { ...query, ...newPayload },
      header
    );
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
      // if (response) {
      //   setData(response.data || option.data);
      //   newData = response.data || option.data;
      // }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
    return newData;
  }

  async function execForForm(newPayload = {}) {
    let newData = option.data;
    try {
      setIsLoading(true);

      const newQuery = {
        ...query,
        ...newPayload
      };

      let ret = "";
      for (const it in newQuery) {
        if (ret !== "") ret += "&";
        if (it === "data") {
          ret +=
            encodeURIComponent(it) +
            "=" +
            encodeURIComponent(JSON.stringify(newQuery[it]));
        } else {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(newQuery[it]);
        }
      }

      const request = apiClient[option.method](option.url, ret, header);
      cancelFn.current = request;
      const response = await request.send();
      if (response) {
        setData(response.data || option.data);

        newData = response.data || option.data;
      } else {
        throw new Error("Unknown Error");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
    return newData;
  }

  async function execForFormData(newPayload = {}) {
    let newData = option.data;
    try {
      setIsLoading(true);
      const request = apiClient[option.method](option.url, newPayload, header);
      cancelFn.current = request;
      const response = await request.send();
      if (response) {
        setData(response.data || option.data);

        newData = response.data || option.data;
      } else {
        throw new Error("Unknown Error");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
    return newData;
  }

  async function execForList(page = undefined, newQuery = {}) {
    let newData = option.data;
    try {
      setIsLoading(true);
      if (pagination && page) {
        pagination.current = page;
      }
      const updateQ = {
        ...query,
        ...newQuery
      };
      updateQuery(updateQ);
      const newPayload = {
        query: updateQ,
        pagination,
        sorter
      };

      const request = apiClient[option.method](option.url, newPayload, header);
      cancelFn.current = request;
      const response = await request.send();
      setData(response.data || option.data);

      /* customer setter */
      if (
        response &&
        Object.prototype.hasOwnProperty.call(response.data, "pagination")
      ) {
        setTotal(response.data.pagination.total);
      }

      newData = response.data || option.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
    return newData;
  }

  const tableProps = {
    dataSource: data && data.result,
    loading: isLoading,
    onChange: (page, filters, sort) => {
      setPagination({
        current: page.current
      });
      setSorter({
        sortField: sort.field,
        sortType: SORTER_ABBR[sort.order]
      });
    },
    pagination: {
      ...pagination,
      total
    }
  };

  function getError() {
    return error ? JSON.parse(error) : {};
  }

  const cancel = () => (cancelFn.current && cancelFn.current.cancel ? cancelFn.current.cancel() : () => {});

  return {
    query,
    setQuery,
    pagination: {
      ...pagination,
      total
    },
    setPagination,
    sorter,
    setSorter,
    payload,
    isLoading,
    data,
    error,
    exec,
    execForFormData,
    execForForm,
    execForList,
    tableProps,
    updater,
    getError,
    cancel,
    setData
  };
};

export default useQueryV2;
