import axios, { AxiosRequestConfig } from 'axios'

import { api_url } from '../configs/config'
import authService from './authService'


interface IUserUpdatedata {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface IPictureFile {
  pictureFile: File
}

const getUser = async () => {
  const authorization: string = authService()
  const config : AxiosRequestConfig = {
      headers: { Authorization: authorization},
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


const getAllUsers = async () => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.get(`${api_url}/users/users`,config);
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

const updateUserData = async (userData: IUserUpdatedata) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.put(`${api_url}/users/update`, userData, config);
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

const uploadProfilePicture = async ({pictureFile}: IPictureFile) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization, 'Content-Type': 'multipart/form-data' },
    }
  const formData = new FormData();
  formData.append('file', pictureFile);
  try {
    const response = await axios.post(`${api_url}/users/upload-picture`, formData, config);
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

const getProfilePicture = async () => {
  const authorization: string = authService()
  const config : AxiosRequestConfig = {
    responseType: 'blob',
    headers: { Authorization: authorization}
  }
  try {
    const response = await axios.get(`${api_url}/users/profile-picture`, config);
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
  getUser,
  getAllUsers,
  updateUserData,
  uploadProfilePicture,
  getProfilePicture
};
