/* eslint-disable class-methods-use-this */
import axios, { CancelToken } from 'axios';

class AxiosApiClient {
  constructor(apiConfig) {
    this.axiosInstance = axios.create({ ...apiConfig });
  }

  setHeader(headerObject = null, responseType = '') {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    this.axiosInstance.defaults.headers = { ...defaultHeaders, ...headerObject };
    this.axiosInstance.defaults.responseType = responseType;
  }

  instance() {
    return this.axiosInstance;
  }

  get(url, payload, header) {
    this.setHeader(header);
    const source = CancelToken.source();
    const params = { ...payload };
    return {
      send: () => this.axiosInstance.get(url, { params, cancelToken: source.token }).catch(this.onError),
      cancel: source.cancel,
    };
  }

  getWithoutToken(url, payload) {
    const source = CancelToken.source();
    const params = { ...payload };
    this.axiosInstance.defaults.headers = {};
    return {
      send: () => this.axiosInstance.get(url, { params, cancelToken: source.token }).catch(this.onError),
      cancel: source.cancel,
    };
  }

  post(url, payload, header = { 'Content-Type': 'application/json' }) {
    this.setHeader(header);
    const source = CancelToken.source();
    return {
      send: () => this.axiosInstance.post(...[url, payload], { cancelToken: source.token }).catch(this.onError),
      cancel: source.cancel,
    };
  }

  postFile(url, payload, header = { 'Content-Type': 'application/json' }) {
    this.setHeader(header, 'blob');
    const source = CancelToken.source();
    return {
      send: () => this.axiosInstance.post(...[url, payload], { cancelToken: source.token }).catch(this.onError),
      cancel: source.cancel,
    };
  }

  delete(url, payload, header = {}) {
    this.setHeader(header);
    const source = CancelToken.source();
    return {
      send: this.axiosInstance.delete(...[url, payload], { cancelToken: source.token }).catch(this.onError),
      cancel: source.cancel,
    };
  }

  put(url, payload, header = {}) {
    this.setHeader(header);
    const source = CancelToken.source();
    return {
      send: () => this.axiosInstance.put(...[url, payload], { cancelToken: source.token }).catch(this.onError),
      cancel: source.cancel,
    };
  }

  getFile(url, payload, header = {}) {
    this.setHeader(header, 'blob');
    return this.axiosInstance.get(...[url, payload]).catch(this.onError);
  }

  onError(error) {
    if (axios.isCancel(error)) {
      console.warn('Request canceled by user...');
    } else {
      console.log(error);
    }
  }
}

export default AxiosApiClient;
