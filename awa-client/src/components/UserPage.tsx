import { useState, useEffect } from 'react';

import UserFolder from './UserFolder';

import { IFile, IFileCounter, IFolderTree, INewFolderData } from '../types/folderTypes';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import ShowContent from './ShowContent';
import ShowAlert from './ShowAlert';
import { IAlert } from '../types/alertTypes';
import fileService from '../services/fileService';
import folderService from '../services/folderService';



interface INewFileData {
  fileName: string,
  folderId: number | null,
  fileType: string,
}

interface IUploadFileData extends INewFileData {
  file: File
}

const updateAddFile = (folders: IFolderTree[], currentFolder:number, file: IFile ) => {
  for (const folder of folders) {
    if (folder.id === currentFolder) {
      folder.files.push(file);
      break
    } else {
      updateAddFile(folder.subFolders, currentFolder, file);
    }
  }
  return folders

}

const updateDeleteItem = (folders: IFolderTree[], currentFolder:number, item: 'file'|'folder', id: number) => {
  for (const folder of folders) {
    if (folder.id === currentFolder) {
      if (item === 'file') {
        folder.files = folder.files.filter((file) => file.id !== id)
      } else {
        folder.subFolders = folder.subFolders.filter((subFolder) => subFolder.id !== id)
      }
      break
    } else {
      updateDeleteItem(folder.subFolders, currentFolder, item, id);
    }
  }
  return folders
}

const countRepository = (folders: IFolderTree[]) => {

  let fileCounter = 0;
  let folderCounter = 0;
  const sharedCounter = 0;

  const countItems = (folders:IFolderTree[]) =>{
    folders.forEach((folder: IFolderTree) => {
      fileCounter = fileCounter + folder.files.length;
      folderCounter = folderCounter + 1
      countItems(folder.subFolders)
    })
    return {fileCounter, folderCounter}
  }

  ({fileCounter ,folderCounter} = countItems(folders))

  return {fileCounter, folderCounter, sharedCounter}
}

interface IUserPageProps {
  updateCounter : (counters: IFileCounter) => void;
  counter: IFileCounter;
}

const UserPage = ({counter, updateCounter}: IUserPageProps) => {

  const [folders, setFolders] = useState<IFolderTree[]>([])

  console.log('folders', folders)

  const [activeFolder, setActiveFolder] = useState<number>(0)
  const [activeFile, setActiveFile] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false)
  const [alertData, setAlertData] = useState<IAlert>({
    type: 'info',
    message: '',
    showAlert: false
  });
    
  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false)
  const [openAddFile, setOpenAddFile] = useState<boolean>(false)
  const [openUploadFile, setOpenUploadFile] = useState<boolean>(false)

  const [newFolder, setNewFolder] = useState<string>('')
  const [newFile, setNewFile] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<string>('')

  console.log('*** active folder ->', activeFolder)

  useEffect(() => {
    const getUserFiles = async () => {
      try {
        const result = await folderService.getUserFolders()
        if (result) {
          setFolders([...result])
          const counters = countRepository([...result])
          updateCounter(counters)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
        console.log(error)
      }
    }

    getUserFiles()
  }, [])


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
      parentFolder: activeFolder !==0 ? activeFolder : null
    }
    try{
      const result = await folderService.createFolder(newFolderData)
      setFolders(result)
      updateCounter({fileCounter:(counter.folderCounter || 0) +1 })
      setAlertData(
        {
          type: 'success',
          message: 'Folder created successfully',
          showAlert: true
        })
      
      setNewFolder('')
    } catch (error) {
      if (error instanceof Error) {
        setAlertData(
          {
            type: 'error',
            message: error.message,
            showAlert: true
          })
      }
      console.log(error)
    }
  }


  const handleAddFileSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOpenAddFile(false)
    const newFileData: INewFileData = {
      fileName: newFile,
      folderId: activeFolder !==0 ? activeFolder : null,
      fileType: 'document'
    }
    try{
      const result = await fileService.createFile(newFileData)
      // update data
      const updatedFolders : IFolderTree[] = updateAddFile(folders, activeFolder, result)
      setFolders([...updatedFolders])
      updateCounter({fileCounter:(counter.fileCounter || 0) +1 })
      setActiveFile(result.id)
      setEditMode(true)
      setNewFile('')
    } catch (error) {
      if (error instanceof Error) {
        setAlertData(
          {
            type: 'error',
            message: error.message,
            showAlert: true
          })
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
      folderId: activeFolder !==0 ? activeFolder : null,
      fileType: uploadedFile.type,
      file: uploadedFile,
    }
    try{
      const result = await fileService.uploadFile(newFileData)
      // Update Data
      const updatedFolders : IFolderTree[] = updateAddFile(folders, activeFolder, result)
      setFolders([...updatedFolders])
      updateCounter({fileCounter:(counter.fileCounter || 0) +1 })
      setUploadedFile(null)
      setNewFile('')
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      console.log(error)
    }
  }

  const handleDeleteUpdate = (item:'file'|'folder', id: number) => {
    const result = updateDeleteItem(folders, activeFolder, item, id)
    setFolders([...result])
  
    if (item === 'file') {
      updateCounter({fileCounter:(counter.fileCounter || 0) -1,
        recycledCounter:(counter.recycledCounter || 0) +1
       })
    } else {
      updateCounter({folderCounter:(counter.folderCounter || 0) -1 })
    }
  }

  return (
    <>
    <ShowAlert type={alertData.type} message={alertData.message} showAlert={alertData.showAlert} setAlertData={setAlertData} />
    <h1>UserPage</h1>
    <Grid container spacing={1} margin={1} >
      <Grid size={{  sm: 0, md: 0, lg: 3  }} display={{ xs: 'none', sm: 'none', md: 'none', lg: editMode ? 'none' : 'block' }} border={'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={3}>
        <UserFolder 
          folders={folders}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          setActiveFile={setActiveFile}
          setEditMode={setEditMode}
          setAlertData={setAlertData}
          handleAddFolder={handleAddFolder}
          handleAddFile={handleAddFile}
          handleUploadFile={handleUploadFile}
         />
      </Grid>
      <Grid size={{ sm: 12, md: 12, lg: editMode ? 12 : 9 }} border={'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={3}>
        <ShowContent 
          folders={folders}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          editMode={editMode}
          setEditMode={setEditMode}
          setAlertData={setAlertData}
          handleAddFile={handleAddFile}
          handleAddFolder={handleAddFolder}
          handleUploadFile={handleUploadFile}
          handleDeleteUpdate={handleDeleteUpdate}
        />
      </Grid>
    </Grid>
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
              variant='standard'
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
            <FormControl fullWidth sx={{ marginTop: '5px'}}>
              <InputLabel id='fileType'>File Type</InputLabel>
              <Select
                labelId='fileTypelable'
                id='fileTypelable'
                value={fileType}
                label='File Type'
                onChange={(e) => setFileType(e.target.value)}
              >
                <MenuItem value={'document'}>Document</MenuItem>
                <MenuItem value={'image'}>Image</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpenUploadFile(false)}>Cancel</Button>
          <Button type='submit' form='uploadFile-form' >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserPage