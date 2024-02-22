import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

class Client {
  token = "";
  constructor(url) {
    this.URL = url;
    this.baseURL = `http://${this.URL}`;
    this.request = axios.create({
      baseURL: this.baseURL,
    });
  }

  set authtoken(token) {
    this.token = token;
  }

  get(path, token, headers = {}) {
    return this.request.get(path, {
      headers: {
        Authorization: `Token ${token}`,
        ...headers,
      },
    });
  }

  post(path, token, data = {}, headers = {}) {
    return this.request.post(path, data, {
      headers: {
        Authorization: `Token ${token}`,
        ...headers,
      },
    });
  }
}

class SessionClient {
  constructor(url) {
    this.URL = url;
    this.baseURL = `http://${this.URL}`;
    this.request = axios.create({
      baseURL: this.baseURL,
    });
  }

  get(path) {
    return this.request.get(path);
  }

  post(path, data) {
    return this.request.post(path, data);
  }
}

const client = new Client("192.168.1.72:8000");
const session_client = new SessionClient("192.168.1.72:8000");

export { client, session_client };
// const clinet = Client("http://192.168.1.72:8000")
// const client = axios.create({
//   baseURL: "http://192.168.1.72:8000",
// });
