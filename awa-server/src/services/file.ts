
import { stripTypeScriptTypes } from 'module';
import { File, UserFiles, Folder, User } from '../models';
import { IEditFileData, IFile, IFileData, IFileParam, IUserFile } from '../types/fileTypes';
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

const RecycleQuery = {
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
    userId: fileData.userId,
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
    userId: fileData.userId,
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
const removeFile = async (fileIds: number[], userId: number) => {
  try {
    const userFile = await UserFiles.findAll({ where: { fileId: fileIds, userId } });
    if (!userFile) {
      throw new Error('File not found');
    }

    const files = await File.findAll({ where: { id: fileIds } });

    if (!files) {
      throw new Error('File not found');
    }
    let counter = 0;
    const errors: Error[] = [];
    for (const file of files) {
      try {
        await storeFile.removeFile(file.address)
        await file.destroy();
        counter ++;
      } catch (error) {
        if (error instanceof Error) {
          errors.push(new Error(error.message));
        }
        errors.push(new Error('Error removing file'));
      }
    }
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    return {message: `${counter} files removed`};
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error removing file');
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
    /*
    if(file.activated) {
      throw new Error('File is opened by another user');
    }
    */
    file.activated = true;
    const fileContent = await storeFile.openFile(file.address);
    const result = {
      file,
      fileContent
    }
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error opening file');
  }
}

// save a file
const saveFile = async (fileId: number, fileData: IEditFileData, userId: number) => {
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

    const result = await storeFile.writeToFile(file.address, fileData.fileContent);

    file.fileName = fileData.fileName;
    file.activated = false;
    await file.save();

    userFile.activated = false;
    await userFile.save();

    const response = { file, fileContent: result }
    return response
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error saving file');
  }
}

// Read recycleBin files
const getRecycledFiles = async (userId: number) => {
  try {

    const deletedFiles = await File.findAll({
      where: { deleted: true },
      include: [
        {
          model: User,
          where: { id: userId }
        },
        {
          model: Folder,
          as: 'folder',
          attributes: ['id', 'folderName'],
        }
      ]
    })
    return deletedFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error reading recycle bin files');
  }
};


// Restore Files
const restoreFile = async (fileIds: number[], userId: number) => {
  try {
    const userFiles = await UserFiles.findAll({ where: { fileId: fileIds, userId } });
    if (!userFiles) {
      throw new Error('File not found');
    }

    const files = await File.findAll({ where: { id: fileIds } });

    if (!files) {
      throw new Error('File not found');
    }

    let counter = 0;
    const errors: Error[] = [];
    for (const file of files) {
      try {
        file.deleted = false;
        await file.save();
        counter ++;
      } catch (error) {
        if (error instanceof Error) {
          errors.push(new Error(error.message));
        }
        errors.push(new Error('Error restoring file'));
      }
    }
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    return {message: `${counter} files restored`};
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error restoring file');
  }
}

export default {
  createFile,
  uploadFile,
  deleteFile,
  removeFile,
  openFile,
  saveFile,
  getRecycledFiles,
  restoreFile
}
