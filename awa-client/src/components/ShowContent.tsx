import { useState } from 'react';

import { Dialog } from '@mui/material';

import ShowFileContent from './ShowFileContent'
import ShowFolderContent from './ShowFolderContent'
import ShareForm from './ShareForm';

import { IFolder } from '../types/folderTypes'
import { IAlert } from '../types/alertTypes';
import fileService from '../services/fileService';


interface IShowContentProps {
  folders: IFolder[],
  activeFolder: number;
  setActiveFolder: (id: number) => void;
  activeFile: number | null;
  setActiveFile: (id: number | null) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  setAlertData: (alert: IAlert) => void;
  handleAddFile: () => void;
  handleAddFolder: () => void;
  handleUploadFile: () => void;
  handleDeleteUpdate: (item:'file'|'folder', id: number) => void;
  updateFolderList: () => void;
}

const findCurrentFolder = (folders: IFolder[], activeFolder: number): IFolder | undefined => {
  
  for(const folder of folders) {
    if (folder.id === activeFolder) {
      return folder
    } 
    if (folder.subFolders) {
      const subFolder: IFolder | undefined = findCurrentFolder(folder.subFolders, activeFolder)
      if (subFolder) {
        return subFolder
      }
    } else {
      return undefined
    }
  }
}

interface IShareFile {
  fileId: number;
  fileName: string;
}


const ShowContent = ({folders, activeFolder, setActiveFolder, activeFile, setActiveFile, editMode, setEditMode, setAlertData, handleAddFile, handleAddFolder, handleUploadFile, handleDeleteUpdate, updateFolderList}: IShowContentProps) => {

  const [openShareFile, setOpenShareFile] = useState<boolean>(false)
  const [sharedFile, setSharedFile] = useState<IShareFile|null>(null)

  const folder: IFolder | undefined = findCurrentFolder(folders, activeFolder)
  const currentFolder: IFolder = folder ? folder : folders[0]


  const handleShareFile = async(fileId: number, fileName:string) => {
    setSharedFile({fileId,fileName})
    setOpenShareFile(true)
    console.log('*** share file ->',fileId)
  }

  const handleDownloadFile = async (fileId: number, fileName:string, fileType: string) => {

    console.log('**** Download file -> fileId', fileId, ' *  fileName: ' , fileName, ' * File type: ', fileType)
    if (fileId) {
      if (fileType === 'document') {
        try {
          const result = await fileService.downloadPdfFile(fileId);
          if (!result) {
            alert('Error downloading file');
            return;
          }
          const blob : Blob = new Blob([result.data], { type: 'application/pdf' });
          const url : string = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err: unknown) {
          console.log('Download Failed!', err)
        }
      } else {
        try {
          const result = await fileService.downloadFile(fileId)
          if (!result) {
            alert('Error downloading file');
            return;
          }
          const blob : Blob = new Blob([result.data], { type: result.data.type });
          const url : string = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err: unknown) {
          console.log('Download Failed!', err)
        }
      }
    }

  }

  if (folders.length === 0) {
    return <div>Loading...</div>
  }
  return (
    <>
      {activeFile === null 
        ? <ShowFolderContent 
            folder={currentFolder}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            setActiveFile={setActiveFile} 
            setAlertData={setAlertData}
            handleAddFile={handleAddFile}
            handleAddFolder={handleAddFolder}
            handleUploadFile={handleUploadFile}
            handleDeleteUpdate={handleDeleteUpdate}
            handleShare = {handleShareFile}
            updateFolderList={updateFolderList}
            downloadFile={handleDownloadFile}
           />
        : <ShowFileContent 
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            editMode={editMode}
            setEditMode={setEditMode}
            handleShare={handleShareFile}
            downloadFile={handleDownloadFile}
            setAlertData={setAlertData}
            updateFolderList={updateFolderList}
          />
      }
      <Dialog open={openShareFile} onClose={()=>setOpenShareFile(false)} >
          <ShareForm sharedFile={sharedFile} setAlertData={setAlertData} setOpenShareFile={setOpenShareFile} />
      </Dialog>
   </>
  ) 
}


export default ShowContent