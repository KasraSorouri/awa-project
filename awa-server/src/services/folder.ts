
import { IFolder } from '../types/folderTypes';
import { Folder, User, File } from '../models';
import { Op, where } from 'sequelize';
import { log } from 'console';


const folderQuery = {
  include: [
    {
      model: Folder,
      as: 'parent',
      attributes: ['id', 'folderName'],
    },
    {
      model: Folder,
      as: 'subFolders',
    },
    {
      model: User,
      as: 'user',
      attributes: ['id', 'username'],
    },
    {
      model: File,
      as: 'files',
      where: { deleted: false },
    },
  ],
}

interface IUserFolders {
  id: number;
  folderName: string;
  userId: number;
  parent: IUserFolders | null;
  subFolders: IUserFolders[];
  files: File[];
  createdAt: Date;
  updatedAt: Date;
}

interface IFolderTree {
  id: number;
  folderName: string;
  subFolders: IFolderTree[];
  files: File[];
}


// Make The folder tree
const makeFolderTree = (folders: IUserFolders[]) => {
  const folderMap = new Map();
    
    folders.forEach(folder => {
        folderMap.set(folder.id, {
            id: folder.id,
            folderName: folder.folderName,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            subFolders: [],
            files: folder.files
        });
    });

    const rootFolders : IFolderTree[] = [];

    folders.forEach(folder => {
        const currentFolder = folderMap.get(folder.id);
        
        const parentId = folder.parent ? folder.parent.id : null;

        if (parentId && folderMap.has(parentId)) {
            const parentFolder = folderMap.get(parentId);
            parentFolder.subFolders.push(currentFolder);
        } else {
            rootFolders.push(currentFolder);
        }
    });

  return rootFolders;
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
    const folders = await Folder.findAll({ where: { 'userId' : userId }, ...folderQuery });

    const plainFolders = folders.map(folder => folder.get({ plain: true })) as unknown as IUserFolders[]
    const folderTree = makeFolderTree(plainFolders);
    return folderTree;

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

export default {
  createFolder,
  getFolders,
  deleteFolder,
}