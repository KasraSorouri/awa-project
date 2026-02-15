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


// Delete a File
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


// Get a File Content
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


// Save a File
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

// Read Recyle Bin
const getRecycleBin = async () => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.get(`${api_url}/files/recycle-bin`, config);
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


// Remove a File from Recyle Bin
const removeFile = async (fileIds: number[]) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.post(`${api_url}/files/remove`, { fileIds }, config);
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

const restoreFile = async (fileIds: number[]) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.post(`${api_url}/files/restore`, { fileIds }, config);
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


// Move a File to another Folder
const moveFile = async (fileId: number, targetFolderId: number|null) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.put(`${api_url}/files/move`, { fileId, targetFolderId }, config);
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


// Download a Text File as PDF
const downloadPdfFile = async (fileId: number) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
      responseType: 'blob' as const
    }
  try {
    const response = await axios.get(`${api_url}/files/download_pdf/${fileId}`, config);
    if (response.status === 200) {
      return response;
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      throw new Error(error.response?.data.error);
    }
    console.log(error);
  }
}


// Download an Uploaded File
const downloadFile = async (fileId: number) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
      responseType: 'blob' as const
    }
  try {
    const response = await axios.get(`${api_url}/files/download/${fileId}`, config);
    if (response.status === 200) {
      return response;
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      throw new Error(error.response?.data.error);
    }
    console.log(error);
  }
}

// Copy a File
const copyFile = async (fileId: number, destFolder: number|null) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.post(`${api_url}/files/copy/${fileId}`, {destFolder}, config);
    if (response.status === 200) {
      return response;
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      throw new Error(error.response?.data.error);
    }
    console.log(error);
  }
}

// Close File
const closeFile  = async (fileId: number) => {
  const authorization: string = authService()
  const config = {
      headers: { Authorization: authorization},
    }
  try {
    const response = await axios.get(`${api_url}/files/close/${fileId}`, config);
    if (response.status === 200) {
      return response;
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
  saveFile,
  getRecycleBin,
  removeFile,
  restoreFile,
  moveFile,
  downloadPdfFile,
  downloadFile,
  copyFile,
  closeFile
}
