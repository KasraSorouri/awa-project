import ShowFileContent from './ShowFileContent'
import ShowFolderContent from './ShowFolderContent'


import { IFolder } from '../types/folderTypes'
import { IAlert } from '../types/alertTypes';


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


const ShowContent = ({folders, activeFolder, setActiveFolder, activeFile, setActiveFile, editMode, setEditMode, setAlertData, handleAddFile, handleAddFolder, handleUploadFile, handleDeleteUpdate}: IShowContentProps) => {

  const folder: IFolder | undefined = findCurrentFolder(folders, activeFolder)
  const currentFolder: IFolder = folder ? folder : folders[0]

  if (folders.length === 0) {
    return <div>Loading...</div>
  }
  return (
    <div className="show-content">
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
           />
        : <ShowFileContent activeFile={activeFile} setActiveFile={setActiveFile} editMode={editMode} setEditMode={setEditMode} />
      }
   </div>
  ) 
}


export default ShowContent