
import { File, UserFiles, Folder } from '../models';
import { IFile, IFileData, IFileParam, IUserFile } from '../types/fileTypes';
import storeFile from '../utils/storeFile';

const fileQuery = {
  include: [
    {
      model: UserFiles,
      as: 'userFiles',
      attributes: ['userId', 'role'],
    },
    {
      model: Folder,
      as: 'folder',
      attributes: ['id', 'folderName'],
    }
  ],
  attributes: ['id', 'fileName', 'folderId', 'fileType', 'address', 'editable', 'deleted', 'activated'],
}


// Create a New File
const createFile = async (fileData: IFileData) => {

  const fileParams: IFileParam = {
    creationMethod: 'create',
    userId: fileData.userId,
    fileType: 'document'
  }

  const { fullPath } = await storeFile.saveFile(fileParams);

  const newFile: IFile = {
    fileName: fileData.fileName,
    folderId: fileData.folderId,
    fileType: fileData.fileType,
    editable: true,
    activated: true,
    address: fullPath
  }

  try {
    const file = new File(newFile);
    await file.save();

    const userFileData: IUserFile= {
      userId: fileData.userId,
      fileId: file.id,
      role: 'owner',
      activated: true
    }
    const userFile = new UserFiles(userFileData);
    await userFile.save();    

    return file;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error creating file');
  }
}


// upload a File
const uploadFile = async (fileData: IFileData, file: Express.Multer.File) => {

  const fileParams: IFileParam = {
    creationMethod: 'upload',
    userId: fileData.userId,
    fileType: 'document',
    file: file
  }

  const { fullPath } = await storeFile.saveFile(fileParams);

  const newFile: IFile = {
    fileName: fileData.fileName,
    folderId: fileData.folderId,
    fileType: fileData.fileType,
    editable: false,
    activated: false,
    address: fullPath
  }

  try {
    const file = new File(newFile);
    await file.save();

    const userFileData: IUserFile= {
      userId: fileData.userId,
      fileId: file.id,
      role: 'owner',
    }

    const userFile = new UserFiles(userFileData);
    await userFile.save();

    return file;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error uploading file');
  }
}

// Delete a file
const deleteFile = async (fileId: number, userId: number) => {
  try {
    const userFile = await UserFiles.findOne({ where: { fileId, userId } });
    if (!userFile) {
      throw new Error('File not found');
    }
    if (userFile.role !== 'owner') {
      throw new Error('User does not have permission to delete this file');
    }
    const file = await File.findOne({ where: { id: fileId } });
    
    if (!file) {
      throw new Error('File not found');
    }

    file.deleted = true;
    await file.save();
    return true
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error deleting file');
  }
}

// Remove a file
const removeFile = async (fileId: number, userId: number) => {
  try {
    const userFile = await UserFiles.findOne({ where: { fileId, userId } });
    if (!userFile) {
      throw new Error('File not found');
    }
    if (userFile.role !== 'owner') {
      throw new Error('User does not have permission to remove this file');
    }
    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      throw new Error('File not found');
    }

    await storeFile.removeFile(file.address)
    await file.destroy();
  
    return true
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error deleting file');
  }
}

// Open a File
const openFile = async (fileId: number, userId: number) => {
  try {
    const userFile = await UserFiles.findOne({ where: { fileId, userId } });
    if (!userFile) {
      throw new Error('File not found');
    }
    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      throw new Error('File not found');
    }

    if (!file.editable) {
      throw new Error('File is not editable');
    }

    if(file.activated) {
      throw new Error('File is opened by another user');
    }
  
    file.activated = true;
    const fileContent = await storeFile.openFile(file.address);

    return fileContent
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error opening file');
  }
}

// save a file
const saveFile = async (fileId: number, fileContent: string, userId: number) => {
  try {
    const userFile = await UserFiles.findOne({ where: { fileId, userId } });
    if (!userFile) {
      throw new Error('File not found');
    }
    if (!(userFile.role === 'owner' || userFile.role === 'edit')) {
      throw new Error('User does not have permission to save this file');
    }
    const file = await File.findOne({ where: { id: fileId } });
    if (!file){
      throw new Error('File not found');
    }

    const result = await storeFile.writeToFile(file.address, fileContent)
    file.activated = false;
    await file.save();
    userFile.activated = false;
    await userFile.save();

    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error saving file');
  }
}

export default {
  createFile,
  uploadFile,
  deleteFile,
  removeFile,
  openFile,
  saveFile
}
