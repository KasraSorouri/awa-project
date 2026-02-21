
import { Op } from 'sequelize';
import { File, UserFiles, Folder, User } from '../models';
import { IEditFileData, IFile, IFileData, IFileParam, IUserFile } from '../types/fileTypes';
import convertToPDF from '../utils/fileConvert';
import storeFile from '../utils/storeFile';

const fileQuery = {
  include: [
    {
      model: Folder,
      as: 'folder',
      attributes: ['id', 'folderName'],
    },
    {
      model: User,
      as: 'activeUser',
      attributes: ['id', 'username', 'firstName', 'lastName']

    }
  ],
  attributes: ['id', 'fileName', 'folderId', 'fileType', 'address', 'editable', 'deleted', 'activated', 'currentUser'],
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
    currentUser: fileData.userId,
    address: fullPath
  }

  try {
    const file = new File(newFile);
    await file.save();

    const userFileData: IUserFile= {
      userId: fileData.userId,
      fileId: file.id,
      role: 'OWNER',
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
      role: 'OWNER',
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
    const file = await File.findOne({ where: { id: fileId } });
    
    if (!file) {
      throw new Error('File not found');
    }
    if (file.userId !== userId) {
      throw new Error('User does not have permission to delete this file');
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
    const file = await File.findOne({ where: { id: fileId }, ...fileQuery });

    if (!file) {
      throw new Error('File not found');
    }
 
    if (file.activated && file.currentUser != userId) {
      console.log('file is open. * Current user', file.currentUser , ' * user:', userId )
      const user = file.activeUser;
      const name = `${user?.firstName} ${user?.lastName}`
      throw new Error(`The file is opened by ${name.length >1 ? name : user?.username} `)
    }

    if (!file.editable) {
      throw new Error('File is not editable');
    }

    file.activated = true;
    file.currentUser = userId;
    await file.save()
    const fileContent = await storeFile.openFile(file.address);
    const result = {
      file,
      role: userFile.role,
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
    if (!(userFile.role === 'OWNER' || userFile.role === 'EDITOR')) {
      throw new Error('User does not have permission to save this file');
    }
    const file = await File.findOne({ where: { id: fileId } });
    if (!file){
      throw new Error('File not found');
    }

    const result = await storeFile.writeToFile(file.address, fileData.fileContent);

    file.fileName = fileData.fileName;
    file.activated = false;
    file.currentUser = null;

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

// Share a file
const shareFile = async (fileId: number, userId: number, users: number[], role: string) => {
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    if (file.userId !== userId) {
      throw new Error('User does not have permission to share this file');
    }
    
    for (const user of users) {
      const checkUser = await User.findByPk(user);
      if (!checkUser) {
        throw new Error('User not found');
      }
    }
    for (const user of users) {
      const userFileData: IUserFile= {
        userId: user,
        fileId: fileId,
        role: role,
      }
      const newUserFile = new UserFiles(userFileData);
      await newUserFile.save();
    }
    return {message: 'File shared successfully'};
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error sharing file');
  }
}

// Get shared Files
const getSharedFiles = async (userId: number) => {
  try {
    const userAllFile = await User.findByPk(userId, {
      include: [{
        model: File,
        as: 'sharedFiles',
        attributes: ['id', 'fileName', 'folderId', 'fileType', 'address', 'editable', 'deleted', 'activated'],
        include: [{
          model: User,
          as: 'fileOwner',
          attributes: ['id', 'username', 'firstName', 'lastName'],
        }],
        through: {
          attributes: ['role'], 
        }
      }],
      attributes:[]
    });

    const userOwnFiles = await File.findAll({where: { userId : userId}})

    if (!userAllFile){
      return []
    }
    const sharedFiles = userAllFile.sharedFiles?.filter(file => !userOwnFiles.some(ownFile => ownFile.id === file.id))


    return sharedFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error reading shared files');
  }
}

// Move a file
const moveFile = async (id: number, targetFolderId: number|null, userId: number) => {
  try {
    const file = await File.findByPk(id);
    if (!file) {
      throw new Error('File not found');
    }

    if (file.userId !== userId) { 
      throw new Error('User does not have permission to move this file');
    }

    if (targetFolderId) {
      const targetFolder = await Folder.findByPk(targetFolderId);
      if (!targetFolder) {
        throw new Error('Target folder not found');
      }
    }

    file.folderId = targetFolderId;
    await file.save();
    return file;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error moving file');
  }
}


// Download a file
const downloadPdfFile = async (fileId: number, userId: number) => {
  try {

    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    const user = await UserFiles.findOne({where: {fileId, userId}})
    if (!user){
      throw new Error('Permission error: user does not have access to this file!')
    }

    const fileContent = await storeFile.openFile(file.address);
    const pdfBuffer = await convertToPDF(fileContent);

    return { fileName: file.fileName, buffer: pdfBuffer };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error downloading file');
  }
}

// Download an Uploaded File
const downloadFile = async (fileId: number, userId: number) => {
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    const user = await UserFiles.findOne({where: {fileId, userId}})
    if (!user){
      throw new Error('Permission error: user does not have access to this file!')
    }

    const filePath = file.address

    return filePath

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error downloading file');
  }
}


// Copy a file
 const copyFile = async (fileId: number, userId: number, folderId: number) => {
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    const user = await UserFiles.findOne({where: {fileId, userId}})
    if (!user){
      throw new Error('Permission error: user does not have access to this file!')
    }

    if (folderId) {
      const folder = await Folder.findByPk(folderId)
      if (!folder) {
        throw new Error('Destination Folder not found !')
      }
    }
 

    // Make a copy on the storage
    const newFile = await storeFile.copyFile(file.address, userId)

    const newFileData = new File({
      fileName: `${file.fileName}(2)`,
      userId: userId,
      folderId: folderId,
      fileType: file.fileType,
      address: newFile.fullPath,
      editable: file.editable,
      deleted: false,
      activated: false,
    });

    const fileData = await newFileData.save();

    const userFileData: IUserFile= {
      userId: newFileData.userId,
      fileId: newFileData.id,
      role: 'OWNER',
    }

    const userFile = new UserFiles(userFileData);
    await userFile.save();

    return fileData;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error Copying file');
  }
}


// Close an open File
const closeFile = async (fileId: number, userId: number) => {
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    if (file.currentUser === userId){
      file.activated = false;
      file.currentUser = null;
      await file.save();
    }

    return file

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error Copying file');
  }
}

// Search files
const search = async (searchParam: string, userId: number) => {

  console.log(userId, searchParam)
  try {

    const Files = await File.findAll({
      where: { fileName:{ [Op.iLike]: `%${searchParam}%` }},
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
    return Files;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error reading recycle bin files');
  }
};

export default {
  createFile,
  uploadFile,
  deleteFile,
  removeFile,
  openFile,
  saveFile,
  getRecycledFiles,
  restoreFile,
  shareFile,
  getSharedFiles,
  moveFile,
  downloadPdfFile,
  downloadFile,
  copyFile,
  closeFile,
  search
}
