import { Folder, File } from '../models';

interface IFolderTree {
  id: number;
  folderName: string;
  subFolders: IFolderTree[]; 
  parent: number | null;    
  files: File[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userFilesFolders = (foldersData: Folder[], files: File[]): IFolderTree[] => {
  const folderMap = new Map<number, IFolderTree>();

  foldersData.forEach((f) => {
    const plainFolder = f.get({ plain: true }) as any;
    
    const parentId = plainFolder.parent ? plainFolder.parent.id : (plainFolder.parentFolder || null);

    folderMap.set(plainFolder.id, {
      id: plainFolder.id,
      folderName: plainFolder.folderName,
      createdAt: plainFolder.createdAt,
      updatedAt: plainFolder.updatedAt,
      parent: parentId,
      subFolders: [],
      files: files.filter(file => file.folderId === plainFolder.id)
    });
  });

  const rootFolder: IFolderTree = {
    id: 0,
    folderName: 'My Drive',
    parent: null,
    subFolders: [],
    files: files.filter(file => file.folderId === null || file.folderId === 0)
  };

  folderMap.forEach((currentFolder) => {
    const parentId = currentFolder.parent;

    if (parentId && folderMap.has(parentId)) {
      const parentFolder = folderMap.get(parentId)!;
      parentFolder.subFolders.push(currentFolder);
    } else {
      rootFolder.subFolders.push(currentFolder);
    }
  });

  return [rootFolder];
}

export default {
  userFilesFolders 
};