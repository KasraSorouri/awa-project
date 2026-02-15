import path from 'path';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import { STORAGE_DIR } from '../configs/config';
import { IFileParam } from '../types/fileTypes';

const saveFile = async(fileParams: IFileParam) => {
  const { userId, fileType, creationMethod } = fileParams;

  // Check if file is provided
  if (creationMethod ==='upload' && !fileParams.file) {
    throw new Error('No file provided');
  }

  // Check Existing and Create Folder
  const filePath  = `./${STORAGE_DIR}/u_${userId}`
  if (!existsSync(filePath)) {
    await fs.mkdir(filePath, { recursive: true });
  }

  // File data
  const file = creationMethod === 'create' ? '' : fileParams.file!.buffer;
  
  // File Name
  try {
    const fileExtension = creationMethod === 'create' ? '.txt' : path.extname(fileParams.file!.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;

    const fullPath = path.join(filePath, fileName)
    // Save the file
    await fs.writeFile(fullPath, file);

    return { fullPath, fileName};
  } catch (error) {
    throw new Error('Error saving file');
  }
};

const removeFile = async(fullPath: string) => {
   await fs.rm(fullPath);
   return true;
}


// Read Content of a File 
const openFile = async(fullPath: string) => {
  if (!existsSync(fullPath)) {
    throw new Error('File not found');
  }
  try {
    const fileContent = await fs.readFile(fullPath,'utf8');
    return fileContent;

  } catch(error) {
    throw new Error('Error opening file');
  }
}

// Save Content to a File
const writeToFile = async (fullPath: string, fileContent: string) => {
  if (!existsSync(fullPath)) {
    throw new Error('File not found');
  }
  try {
    await fs.writeFile(fullPath, fileContent,'utf8');
    return true;
  } catch(error) {
    console.log(error)
    throw new Error('Error saving file');
  }
}

// Copy a File
const copyFile = async(filePath: string, userId: number) =>{
  if (!existsSync(filePath)) {
    throw new Error('File not found');
  }
  try {
    const fileExtension = filePath.split('.')[1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const folder = `./${STORAGE_DIR}/u_${userId}`

    const fullPath = path.join(folder, fileName)

    const result =  await fs.copyFile(filePath,fullPath);
    return {fullPath, fileName};
  } catch(error) {
    console.log(error)
    throw new Error('Error saving file');
  }
}


export default { 
  saveFile,
  removeFile,
  openFile,
  writeToFile,
  copyFile
};
