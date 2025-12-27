
import { IFolder } from '../types/folderTypes';
import { Folder } from '../models';
import { User } from '../models';


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
      attributes: ['id', 'folderName'],
    },
    {
      model: User,
      as: 'user',
      attributes: ['id', 'username'],
    }
  ],
  attributes: ['id', 'folderName'],
}

interface IUserFolders {
  id: number;
  folderName: string;
  userId: number;
  parent: IUserFolders | null;
  subFolders: IUserFolders[];
}

interface IFolderTree {
  id: number;
  folderName: string;
  subFolders: IFolderTree[];
}


// Make The folder tree
const makeFolderTree = (folders: IUserFolders[]) => {
  const folderMap = new Map();
    
    folders.forEach(folder => {
        folderMap.set(folder.id, {
            id: folder.id,
            folderName: folder.folderName,
            subFolders: [] 
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
      ...(folderData.parentFolder && { parentFolder: folderData.parentFolder }),
    }}
  try{
    const existingFolder = await Folder.findOne(searchParams);

    if (existingFolder) {
      throw new Error('Folder already exists');
    }

  } catch (error) {
    throw new Error('Error checking folder');
  }

  try {
    const folder = new Folder(folderData);
    await folder.save();
    return folder;
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

export default {
  createFolder,
  getFolders
}