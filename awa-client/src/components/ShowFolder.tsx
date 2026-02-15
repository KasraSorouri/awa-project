import { useState } from 'react'
import { Box, Typography } from "@mui/material"
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { IFolder } from '../types/folderTypes';

interface IShowFolderProps {
  folders: IFolder[];
  activeFolder: number;
  setActiveFolder: (id: number) => void;
  setActiveFile: (id: number | null) => void;
}


const ShowFolder = ({folders, activeFolder, setActiveFolder, setActiveFile}:IShowFolderProps) =>{
  const [showChild, setShowChild] = useState<number[]>([0])

  console.log('show folder * folders', folders)
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
              setActiveFile(null)
              if (folder.id !== 0 && showChild.includes(folder.id)){
                setShowChild(showChild.filter((id) => id !== folder.id))
              } else {
                setShowChild([...showChild, folder.id])
              }
            }}
            >
              {folder.id === 0 ?
                <HomeIcon fontSize="large" sx={{color: "#4D4D4D", marginRight:'3px'}} />
               : <FolderIcon fontSize="large" sx={{color: "#FDF921", marginRight:'3px'}} />}
              <Typography variant={folder.id === activeFolder ? "h4" : "h5"}  color={folder.id === activeFolder ?  '#000000' : '#4D4D4D' }>{folder.folderName}</Typography>
            </Box>
            {showChild.includes(folder.id) &&
              <>
                <Box marginLeft={5} >
                  <ShowFolder folders={folder.subFolders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} setActiveFile={setActiveFile} />
                </Box>
                {folder.files.map((file) => {
                  return (
                    <Box key={file.id}
                      display={'flex'}
                      flexDirection={'row'}
                      marginLeft={1} 
                      onClick={() => {
                        setActiveFile(file.id)
                      }}
                    >
                      {file.editable ?
                        <ArticleIcon fontSize="large" sx={{color: "#4D4D4D", marginRight:'3px'}} />
                        : <InsertDriveFileIcon fontSize="large" sx={{color: "#4D4D4D", marginRight:'3px'}} />
                      }
                      <Typography variant="h5" color='#4D4D4D' >{file.fileName}</Typography>
                    </Box>
                  )})}
            </>}
          </div>)
      })}
    </>
  )
}

export default ShowFolder