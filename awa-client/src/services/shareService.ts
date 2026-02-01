import axios from 'axios';

import { api_url } from '../configs/config';
import authService from './authService';



const shareFileWithUser = async (id: number, users: number[]  , role: string) => {
  
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.post(`${api_url}/files/share/${id}`, {users, role}, config)    
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

const shareFileExternal = async (id: number, expireDate: string | null ) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.post(`${api_url}/external_share/${id}`, {expireDate}, config)
    
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

// Get shared file by token (For external shares)
const getSharedFile = async (token: string) => {
  try {
    const response = await axios.get(`${api_url}/external_share/share/${token}`)
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

// Get shared file by id (For internal shares)
const getSharedFilesToUser = async () => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.get(`${api_url}/files/share`, config)
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
  shareFileWithUser,
  shareFileExternal,
  getSharedFile,
  getSharedFilesToUser
}