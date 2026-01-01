
export interface IFile {
  fileName: string;
  folderId: number;
  fileType: string;
  address: string;
  editable: boolean;
  deleted?: boolean;
  activated?: boolean;
}

export interface IUserFile {
  userId: number;
  fileId: number;
  role: string;
  activated?: boolean;
}

export interface IFileData {
  fileName: string;
  userId: number;
  folderId: number,
  fileType: 'document' | 'image'
  ,
}

export interface IFileParam {
  creationMethod : 'create'| 'upload'
  userId: number;
  fileType: string;
  file?: Express.Multer.File;
}

export interface IEditFileData {
  id: number,
  fileName: string,
  fileContent: string
}

