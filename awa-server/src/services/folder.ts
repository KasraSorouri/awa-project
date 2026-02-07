
import { IFolder } from '../types/folderTypes';
import { Folder, User, File } from '../models';
import { Op } from 'sequelize';

import outputMaker from '../utils/outputMaker';
import { get } from 'http';


const folderQuery = {
  include: [
    {
      model: Folder,
      as: 'parent',
      attributes: ['id', 'folderName', 'createdAt', 'updatedAt' ],
    },
    {
      model: Folder,
      as: 'subFolders',
      attributes: ['id', 'folderName', 'createdAt', 'updatedAt'],
    },
    {
      model: User,
      as: 'folderOwner',
      attributes: ['id', 'username'],
    },
  ],
  attributes: ['id', 'folderName', 'createdAt', 'updatedAt', 'userId'],
}


// Create a new folder
export const createFolder = async (folderData: IFolder) => {
  // Check if the folder already exists
   const searchParams = {
    where: {
      userId: folderData.userId,
      folderName: folderData.folderName,
      parentFolder: folderData.parentFolder ? folderData.parentFolder :  { [Op.is]: null} ,
    }}
  try{
    const existingFolder = await Folder.findOne(searchParams);

    if (existingFolder) {
      throw new Error('Folder already exists');
    }

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
    throw new Error('Error checking folder');
  }

  try {
    const folder = new Folder(folderData);
    await folder.save();
    const result = await getFolders(folder.userId)
    return result;
  } catch (error) {
    throw new Error('Error creating folder');
  }
};

// Get All Folders For a User
export const getFolders = async (userId: number) => {

  try {
    // Get User folder
    const folders = await Folder.findAll({ where: { 'userId' : userId }, ...folderQuery });
    // Get User Files
    const files = await File.findAll({ where: { 'userId' : userId, deleted: false } });
    
    // Process Repository Output
    const result = outputMaker.userFilesFolders(folders, files);
    return result;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error getting folders');
  }
};

// Remove a Folder
export const deleteFolder = async (folderId: number, userId: number) => {
  try {  
    // Check folder 
    const folder = await Folder.findByPk(folderId,{...folderQuery});
    if (!folder) {
      throw new Error('Folder not found');
    }

    // Check folder ownership
    if (folder.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Check if folder is empty
    const files = await File.findAll({ where: { folderId: folderId } });
    const folders = await Folder.findAll({ where: { parentFolder: folderId } });
    if (files && files.length > 0 || folders && folders.length > 0) {
      throw new Error('Folder is not empty');
    }
    // Delete folder
    await folder.destroy();
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
    throw new Error('Error deleting folder');
  }
};

// Edit Folder
const editFolder = async (folderId: number, userId: number, folderData: Partial<IFolder>) => {
  try {
    const folder = await Folder.findByPk(folderId);
    if (!folder) {
      throw new Error('Folder not found');
    }

    if (folder.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await folder.update(folderData);
    return folder;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
    throw new Error('Error editing folder');
  }
};


// get all Folder and subfolder for a user
const getAllFolders = async (userId: number) => {
  try {
    const folders = await Folder.findAll({ where: { 'userId' : userId }, ...folderQuery });
    return folders;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
    throw new Error('Error getting folders');
  }
}

export default {
  createFolder,
  getFolders,
  deleteFolder,
  editFolder,
  getAllFolders
}