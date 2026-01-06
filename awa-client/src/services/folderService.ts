import axios from 'axios';

import { api_url } from '../configs/config'
import authService from './authService';

import { INewFolderData } from '../types/folderTypes';

const getUserFolders = async () => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization}
    }
  try {
    const response = await axios.get(`${api_url}/folders/getFolders`,config);
    if (response.status === 200) {
      console.log(`** get foder data -> \n`,response.data)
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



const createFolder = async (folderData: INewFolderData) => {
  console.log('*** folder service * create ' ,folderData)
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
      
    }
  try {
    const response = await axios.post(`${api_url}/folders/create`, {...folderData}, config);
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

const deleteFolder = async (id: number) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.delete(`${api_url}/folders/delete/${id}`, config);
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
  getUserFolders,
  createFolder,
  deleteFolder
}
