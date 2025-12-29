import { useState, useEffect } from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Tooltip, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import ShowFolder from './ShowFolder';
import folderService from '../services/folderService';
import fileService from '../services/fileService';


interface FolderProps {
    token: string;
}

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
  id: number,
  folderName: string,
  userId: number,
  subFolders: IFolder[],
  files: IFile[],
}

interface INewFolderData {
  folderName: string,
  parentFolder?: string,
}

interface INewFileData {
  fileName: string,
  folderId: number | null,
  fileType: string,
}

interface IUploadFileData extends INewFileData {
  file: File
}


const UserFolder = ({token}: FolderProps) => {
  const [folders, setFolders] = useState<IFolder[]>([])
  const [activeFolder, setActiveFolder] = useState<number | null>(null)
  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false)
  const [openAddFile, setOpenAddFile] = useState<boolean>(false)
  const [openUploadFile, setOpenUploadFile] = useState<boolean>(false)


  const [newFolder, setNewFolder] = useState<string>('')
  const [newFile, setNewFile] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    const getFolders = async() => {
      try{
        const result = await folderService.getUserFolders()
        if (result) {
          setFolders(result)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (token) {
      getFolders()
    }
   },[token])

  console.log('folders : ', folders)
  console.log('activefolder : ', activeFolder)

  const handleAddFolder = () => {
    setOpenAddFolder(true)
  }

  const handleAddFile = () => {
    setOpenAddFile(true)
  }

  const handleUploadFile = () => {
    setOpenUploadFile(true)
  }

  const handleAddFolderSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpenAddFolder(false)
    const newFolderData: INewFolderData = {
      folderName: newFolder,
      parentFolder: activeFolder?.toString()
    }
    try{
      const result = await folderService.createFolder(newFolderData)
      setFolders(result)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      console.log(error)
    }
  }


  const handleAddFileSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpenAddFile(false)
    const newFileData: INewFileData = {
      fileName: newFile,
      folderId: activeFolder as number,
      fileType: 'document'
    }
    try{
      const result = await fileService.createFile(newFileData)
      console.log('** file created ' , result)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      console.log(error)
    }
  }

  const handleUploadFileSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpenUploadFile(false)
    if (!uploadedFile) {
      return
    }
    const newFileData: IUploadFileData = {
      fileName: newFile ? newFile: uploadedFile.name,
      folderId: activeFolder,
      fileType: uploadedFile.type,
      file: uploadedFile,
    }
    try{
      const result = await fileService.uploadFile(newFileData)
      console.log('** file created ', result)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      console.log(error)
    }
  }


  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
      >
      <Stack direction={'row'} spacing={1}>
        <Tooltip title='Add new Folder' >
          <Button id='addFolder'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleAddFolder} ><CreateNewFolderIcon /></Button>
        </Tooltip>
        <Tooltip title='Add new File' >
          <Button id='addFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleAddFile} ><NoteAddIcon /></Button>
        </Tooltip>
        <Tooltip title='Upload a File' >
          <Button id='uploadFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleUploadFile} ><CloudUploadIcon /></Button>
        </Tooltip> 
      </Stack>
      <Box onClick={() => setActiveFolder(null)}>
        <Stack direction={'row'} >
          <HomeIcon fontSize="large" sx={{color: "#4D4D4D", marginRight:'3px'}} />
          <Typography variant="h5" align="left" color="#4D4D4D">My Drive /</Typography>
        </Stack>
      </Box>
      <ShowFolder folders={folders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} />
      <Dialog open={openAddFolder} onClose={()=>setOpenAddFolder(false)} >
        <DialogTitle>New Folder</DialogTitle>
        <DialogContent>

          <form  onSubmit={handleAddFolderSubmit} id="addFolder-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="newfolder"
              name="newFolder"
              label="Folder Name"
              type="text"
              fullWidth
              variant='outlined'
              value={newFolder}
              onChange={(e)=>setNewFolder(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpenAddFolder(false)}>Cancel</Button>
          <Button type='submit' form="addFolder-form" >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddFile} onClose={()=>setOpenAddFile(false)} >
        <DialogTitle>File Name</DialogTitle>
        <DialogContent>
          <form  onSubmit={handleAddFileSubmit} id="addFile-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="newfile"
              name="newFile"
              label="File Name"
              type="text"
              fullWidth
              variant='outlined'
              value={newFile}
              onChange={(e)=>setNewFile(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpenAddFile(false)}>Cancel</Button>
          <Button type='submit' form="addFile-form" >
            save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openUploadFile} onClose={()=>setOpenUploadFile(false)} >
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <form  onSubmit={handleUploadFileSubmit} id="uploadFile-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="fileUpload"
              name="FileUplaod"
              label="File"
              type='file'
              fullWidth
              variant='outlined'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files) {
                  setUploadedFile(event.target.files[0]);
                }}}
            />
            <TextField
              required
              margin="dense"
              id="newfile"
              name="newFile"
              label="File Name"
              type="text"
              fullWidth
              variant='outlined'
              value={newFile}
              onChange={(e)=>setNewFile(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpenUploadFile(false)}>Cancel</Button>
          <Button type='submit' form='uploadFile-form' >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserFolder;