
export interface IFile {
  id: number,
  fileName: string,
  folderId: number,
  content: string,
  deleted: boolean,
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
}