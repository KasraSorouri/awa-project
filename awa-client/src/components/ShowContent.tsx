import ShowFileContent from './ShowFileContent'
import ShowFolderContent from './ShowFolderContent'


import { IFolder } from '../types/folderTypes'
import { IAlert } from '../types/alertTypes';


interface IShowContentProps {
  folders: IFolder[],
  activeFolder: number | null;
  setActiveFolder: (id: number | null) => void;
  activeFile: number | null;
  setActiveFile: (id: number | null) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  setAlertData: (alert: IAlert) => void;
}


const ShowContent = ({folders, activeFolder, setActiveFolder, activeFile, setActiveFile, editMode, setEditMode, setAlertData}: IShowContentProps) => {
  if (folders.length === 0) {
    return <div>Loading...</div>
  }
  return (
    <div className="show-content">
      {activeFile === null 
        ? <ShowFolderContent folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} setActiveFile={setActiveFile} setAlertData={setAlertData} />
        : <ShowFileContent activeFile={activeFile} setActiveFile={setActiveFile} editMode={editMode} setEditMode={setEditMode} />
      }
   </div>
  ) 
}


export default ShowContent