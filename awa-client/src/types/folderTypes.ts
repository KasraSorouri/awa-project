
export interface IFile {
  id: number,
  fileName: string,
  folderId: number,
  fileContent: string,
  deleted: boolean,
  editable: boolean,
  activated: boolean,
  currentUser: number,
  createdAt: string,
  updatedAt: string
}

export interface IFolder {
  id: number,
  folderName: string,
  userId: number,
  subFolders: IFolder[],
  files: IFile[],
  deleted?: boolean,
  activated?: boolean,
  currentUser?: number,
  createdAt?: string,
  updatedAt?: string
}

export interface IEditFileData {
  id: number,
  fileName: string,
  fileContent: string
}

interface ISimpleFolder {
  id: number,
  folderName: string
}

export interface IRecycledFiles extends IFile {
  folder: ISimpleFolder
}