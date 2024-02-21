import axios from "axios";

class Client {
  token = "";
  constructor(url) {
    this.baseURL = url;
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

const client = new Client("http://192.168.1.72:8000");

// const clinet = Client("http://192.168.1.72:8000")
// const client = axios.create({
//   baseURL: "http://192.168.1.72:8000",
// });

export default client;
