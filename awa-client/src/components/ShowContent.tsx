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
}

const findCurrentFolder = (folders: IFolder[], activeFolder: number): IFolder | undefined => {
  

  for(const folder of folders) {
    if (folder.id === activeFolder) {
      return folder
    } 
    if (folder.subFolders.length > 0) {
      const subFolder: IFolder | undefined = findCurrentFolder(folder.subFolders, activeFolder)
      if (subFolder) {
        return subFolder
      }
    } else {
      return undefined
    }
  }
}


const ShowContent = ({folders, activeFolder, setActiveFolder, activeFile, setActiveFile, editMode, setEditMode, setAlertData}: IShowContentProps) => {
  


  const folder: IFolder | undefined = findCurrentFolder(folders, activeFolder)
  const currentFolder: IFolder = folder ? folder : folders[0]

  console.log('ShowContent * current folder', folder)




  if (folders.length === 0) {
    return <div>Loading...</div>
  }
  return (
    <div className="show-content">
      {activeFile === null 
        ? <ShowFolderContent folder={currentFolder} activeFolder={activeFolder} setActiveFolder={setActiveFolder} setActiveFile={setActiveFile} setAlertData={setAlertData} />
        : <ShowFileContent activeFile={activeFile} setActiveFile={setActiveFile} editMode={editMode} setEditMode={setEditMode} />
      }
   </div>
  ) 
}


export default ShowContent