
import ShowFileContent from './ShowFileContent'
import ShowFolderContent from './ShowFolderContent'


import { IFolder } from '../types/folderTypes'


interface IShowContentProps {
  folders: IFolder[],
  activeFolder: number | null;
   setActiveFolder: (id: number | null) => void;
}


const ShowContent = ({folders, activeFolder, setActiveFolder}: IShowContentProps) => {
    console.log(folders)
    if (folders.length === 0) {
        return <div>Loading...</div>
    }
    return (
        <div className="show-content">
            <ShowFolderContent folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} />
            <ShowFileContent />
        </div>
    )
}


export default ShowContent