import axios from 'axios';

import { api_url } from '../configs/config';
import authService from './authService';
import { IEditFileData } from '../types/folderTypes';

interface INewFileData {
  fileName: string,
  folderId: number | null,
  fileType: string,
}

interface IUploadFileData extends INewFileData {
  file: File
}

// Crate a File
const createFile = async (fileData: INewFileData) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.post(`${api_url}/files/create`, fileData, config);
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


// Upload a File 
const uploadFile = async (fileData: IUploadFileData) => {
  console.log('*** file service * upload ' ,fileData)
  const authorization: string = authService()
  const formData = new FormData();
  formData.append('file', fileData.file);
  formData.append('fileName', fileData.fileName);
  formData.append('fileType', fileData.fileType);
  if (fileData.folderId) {
    formData.append('folderId', fileData.folderId.toString());
  }

  console.log('*** file service * upload ', formData)
  const config = {
      headers: { Authorization: authorization},
      'content-type': 'multipart/form-data'     
    }
  try {
    const response = await axios.post(`${api_url}/files/upload`, formData, config);
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

const deleteFile = async (id: number) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.delete(`${api_url}/files/delete/${id}`, config);
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

const readFile = async (id: number) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.get(`${api_url}/files/edit/${id}`, config);
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

const saveFile = async (fileData: IEditFileData) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.post(`${api_url}/files/save/${fileData.id}`, {fileData}, config);
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
  createFile,
  uploadFile,
  deleteFile,
  readFile,
  saveFile
}
