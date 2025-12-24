import axios from 'axios'

import { api_url } from '../configs/config'

const getUser = async (token: string) => {

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  try {
    const response = await axios.get(`${api_url}/users/user`,config);
    if (response.status === 200) {
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

export default {
  getUser
};
