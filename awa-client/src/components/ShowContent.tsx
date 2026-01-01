import ShowFileContent from './ShowFileContent'
import ShowFolderContent from './ShowFolderContent'


import { IFolder } from '../types/folderTypes'


interface IShowContentProps {
  folders: IFolder[],
  activeFolder: number | null;
  setActiveFolder: (id: number | null) => void;
  activeFile: number | null;
  setActiveFile: (id: number | null) => void;
}


const ShowContent = ({folders, activeFolder, setActiveFolder, activeFile, setActiveFile}: IShowContentProps) => {
    if (folders.length === 0) {
        return <div>Loading...</div>
    }
    return (
        <div className="show-content">
            {activeFile === null 
             ? <ShowFolderContent folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} setActiveFile={setActiveFile} />
             : <ShowFileContent activeFile={activeFile} setActiveFile={setActiveFile} />
            }
        </div>
    )
}


export default ShowContent