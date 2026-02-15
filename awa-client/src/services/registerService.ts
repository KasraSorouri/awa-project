import axios from 'axios'

import { api_url } from '../configs/config'

interface IUserData {
  username: string,
  password: string,
  firstName?: string,
  lastName?: string,
  email?: string,
}
const registerService = async (userData: IUserData) => {
  try {

    const response = await axios.post(`${api_url}/users/register`, userData);

    if (response.status === 201) {
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

export default registerService;
