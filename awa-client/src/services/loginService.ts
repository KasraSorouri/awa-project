import axios from 'axios'

import { api_url } from '../configs/config'

interface IUserData {
  username: string,
  password: string,
}
const loginService = async (userData: IUserData) => {
  try {

    const response = await axios.post(`${api_url}/users/login`, userData);

    if (response.status === 200) {
      console.log('service ',response.data);
      localStorage.setItem('awa-token', response.data.token);
      return response.data;
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      throw new Error(error.response?.data.error);
    }
    console.log(error);
  }
}

export default loginService;
