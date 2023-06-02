import axios from 'axios'
import { message } from 'ant-design-vue';

axios.defaults.baseURL = 'https://api.hndx.eu.org'
axios.defaults.timeout = 10000
//错误处理
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      message.error(response)
      return Promise.reject(response)
    }
  },
  error => {
    message.error(error.response)
    return Promise.reject(error.response)
  }
)

async function getLoc() {
  return await axios.get('/loc/')
}

export default {
  getLoc
}
