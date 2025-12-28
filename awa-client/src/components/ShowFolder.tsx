import { useState } from 'react'
import { Box, Typography } from "@mui/material"

import FolderIcon from '@mui/icons-material/Folder';
//import ShowSubFolder from "./ShowSubFolder";


interface IFile {
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

interface IFolder {
  id: number;
  folderName: string;
  userId: number;
  subFolders: IFolder[];
  Filse: IFile[];
}

interface IShowFolderProps {
  folders: IFolder[];
  activeFolder: number | null;
  setActiveFolder: (id: number) => void;
}


const ShowFolder = ({folders, activeFolder, setActiveFolder}:IShowFolderProps) =>{
  const [showChild, setShowChild] = useState<number[]>([])

  console.log('active folder  : ', activeFolder)
  return(
    <>
      {folders.map((folder) =>{
        return (
          <div key={folder.id}>
          <Box 
             display={'flex'}
             flexDirection={'row'}
             onClick={() => {
              setActiveFolder(folder.id)
              if (showChild.includes(folder.id)){
                setShowChild(showChild.filter((id) => id !== folder.id))
              } else {
                setShowChild([...showChild, folder.id])
              }
            }}
            >
              <FolderIcon fontSize="large" sx={{color: "#FDF921", marginRight:'3px'}} />
              <Typography variant={folder.id === activeFolder ? "h4" : "h5"}  color={folder.id === activeFolder ?  '#000000' : '#4D4D4D' }>{folder.folderName}</Typography>
            </Box>
            {showChild.includes(folder.id) &&
              <Box marginLeft={5} >
                <ShowFolder folders={folder.subFolders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} />
              </Box>}
          </div>)
      })}
    </>
  )
}

export default ShowFolder