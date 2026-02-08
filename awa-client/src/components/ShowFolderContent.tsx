import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';

import fileService from '../services/fileService';
import folderService from '../services/folderService';


import { IFolder } from '../types/folderTypes'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { IAlert } from '../types/alertTypes';
import MoveForm from './MoveForm';

interface Column {
  id: 'name' | 'dateCreated' | 'dateModified' | 'type' ;
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 120 },
  { 
    id: 'dateCreated',
    label: 'Date Created',
    minWidth: 170,
    align: 'right',
  } ,
  {
    id: 'dateModified',
    label: 'Date Modified',
    minWidth: 150,
    align: 'right',
  },
  {
    id: 'type',
    label: '',
    minWidth: 170,
    align: 'right',
  },
];

interface Data {
  id: number;
  name: string;
  dateCreated: Date;
  dateModified: Date;
  type: string;
  contents: number ;
  editable?: boolean;
}

interface IShowFolderContentProps {
  folder: IFolder,
  activeFolder: number;
  setActiveFolder: (id: number) => void;
  setActiveFile: (id: number | null) => void;
  setAlertData: (alert: IAlert) => void;
  handleAddFile: () => void;
  handleAddFolder: () => void;
  handleUploadFile: () => void;
  handleDeleteUpdate: (item:'file'|'folder', id: number) => void;
  handleShare: (id:number, name:string) => void;
  updateFolderList: () => void;
}


const ShowFolderContent = ({folder, activeFolder, setActiveFolder, setActiveFile, setAlertData, handleAddFile, handleAddFolder, handleUploadFile, handleDeleteUpdate, handleShare, updateFolderList}: IShowFolderContentProps) => {
  console.log('ShowFolderContent * folder', activeFolder, '->' ,folder)
  const [rows, setRows] = useState<Data[]>([])
  const [OpenRenameFolder, setOpenRenameFolder] = useState<boolean>(false)
  const [newFolderData, setNewFolderData] = useState<{folderId: number, newName: string}>({folderId: 0, newName: ''})
  const [openMoveForm, setOpenMoveForm] = useState<boolean>(false)
  const [moveItem, setMoveItem] = useState<{itemId: number,type: 'folder'|'file'}|null>(null)

  useEffect(() => {
    const initialRows: Data[] = []
    if (folder.subFolders.length>0) {
        initialRows.push(...folder.subFolders.map((folder) => { 
          return {
            id: folder.id,
            name: folder.folderName,
            dateCreated: new Date(folder.createdAt || 0),
            dateModified: new Date(folder.updatedAt || 0),
            type: 'folder',
            contents: folder.subFolders.length + folder.files.length
          }    
        }))
      }
      initialRows.push(...folder.files.map((file) => {
        return {
          id: file.id,
          name: file.fileName,
          dateCreated: new Date(file.createdAt),
          dateModified: new Date(file.updatedAt),
          type: 'file',
          contents: 0,
          editable: file.editable
        }
      }))

    setRows(initialRows)
  }, [folder])

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const setActiveItem = (id: number, type: string) => {
    if (type === 'folder') {
      setActiveFolder(id)
      setActiveFile(null)
    } else {
      setActiveFile(id)
    }
  }


  const deleteHandler = async (id: number, type: string) => {
    try {
      if (type === 'folder') {
        await folderService.deleteFolder(id);
        handleDeleteUpdate('folder', id)
        setAlertData({type: 'success', message: 'Folder deleted successfully', showAlert: true});
        setRows((prevRows) => prevRows.filter((row) => row.id !== id || row.type !== 'folder'));
      } else {
        const result = await fileService.deleteFile(id);
        if (result) {
          handleDeleteUpdate('file', id)
          setAlertData({type: 'success', message: 'File deleted successfully',showAlert: true});
          setRows((prevRows) => prevRows.filter((row) => row.id !== id || row.type !== 'file'));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error deleting item:', error.message);
        setAlertData({type: 'error', message: error.message, showAlert: true});
      }
      console.error('Error deleting item:', error);
    }
  }

  const shareHandler = (fileId: number, fileName:string) => {
    console.log('sharing file with id:', fileId)
    handleShare(fileId,fileName)
  }

  const renameHandler = (id: number, name: string) => {
    console.log('rename item with id:', id)
    setNewFolderData({folderId: id, newName: name})
    setOpenRenameFolder(true)
  }

  const moveHandler = (id: number, type: string) => {
    console.log('move item with id:', id, 'type:', type)
    setMoveItem({itemId: id, type: type as 'folder'|'file'})
    setOpenMoveForm(true)
  }

  const handleMoveSubmit = async(selectedFolder: number) => {
    if (!moveItem) {
      console.error('No item selected for moving')
      return
    }
    try {
      if (moveItem.type === 'file') {
        await fileService.moveFile(moveItem.itemId, selectedFolder !== 0 ? selectedFolder : null)
        updateFolderList()
        setAlertData({type: 'success', message: 'File moved successfully', showAlert: true})
      } else {
        await folderService.moveFolder(moveItem.itemId, selectedFolder !== 0 ? selectedFolder : null)
        updateFolderList()
        setAlertData({type: 'success', message: 'Folder moved successfully', showAlert: true})
      }
      setOpenMoveForm(false)
    } catch (error) {
      console.error('Error moving item:', error)
      setAlertData({type: 'error', message: 'Error moving item', showAlert: true})
    }
  }

  const handleRenameSubmit = async() => {
    try {
      const result = await folderService.renameFolder(newFolderData.folderId, newFolderData.newName)
      if (!result) {
        throw new Error('Renaming folder failed')
      }
      const index = rows.findIndex((row) => row.id === newFolderData.folderId && row.type ==='folder')
      if (index !== -1) {
        rows[index].name = newFolderData.newName
      }
      setAlertData({type: 'success', message: 'Folder renamed successfully', showAlert: true})
      setOpenRenameFolder(false)
    } catch (error) {
      console.error('Error renaming folder:', error)
      setAlertData({type: 'error', message: 'Error renaming folder', showAlert: true})
    }
  }

  if (!(folder.subFolders.length !== 0 || folder.files.length !== 0 )) {
    return(
      <Paper sx={{ width: '100%', overflow: 'hidden', minHeight: '60vh' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', padding: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Tooltip title='Up Folder' >
            <Button
              type='button'
              size='small'
              variant='contained'
              sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
              onClick={() => setActiveFolder(folder.parent || 0)}
            >
             <DriveFolderUploadIcon fontSize='small' sx={{color: '#ffffffff', padding: '0px'}} />
            </Button>  
          </Tooltip>
          <Tooltip title='Add new Folder' >
            <Button id='addFolder'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleAddFolder} ><CreateNewFolderIcon /></Button>
          </Tooltip>
          <Tooltip title='Add new File' >
            <Button id='addFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleAddFile} ><NoteAddIcon /></Button>
          </Tooltip>
          <Tooltip title='Upload a File' >
            <Button id='uploadFile'  variant='contained' size='small' sx={{ width: '10px'}} onClick={handleUploadFile} ><CloudUploadIcon /></Button>
          </Tooltip> 
        </Box>
        <Typography variant='h6' component='h2' sx={{ padding: 2 }}>This folder is empty</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', minHeight: '60vh' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: 2,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title='Up Folder' >
            <Button
              type='button'
              size='small'
              variant='contained'
              sx={{ width: '50px', minWidth:'50px', padding: '5px' }}
              onClick={() => setActiveFolder(folder.parent || 0)}
            >
             <DriveFolderUploadIcon fontSize='small' sx={{color: '#ffffffff', padding: '0px'}} />
            </Button>  
          </Tooltip>
          <Tooltip title='Add new Folder' >
            <Button id='addFolder'  variant='contained' size='small' sx={{ width: '50px', minWidth:'50px', padding: '5px' }} onClick={handleAddFolder} >
              <CreateNewFolderIcon fontSize='small' sx={{color: '#ffffffff', padding: '0px'}} />
            </Button>
          </Tooltip> 
          <Tooltip title='Add new File' >
            <Button id='addFile'  variant='contained' size='small' sx={{ width: '50px', minWidth:'50px', padding: '5px' }} onClick={handleAddFile} >
              <NoteAddIcon fontSize='small' sx={{color: '#ffffffff', padding: '0px'}} />
            </Button>
          </Tooltip>
          <Tooltip title='Upload a File' >
            <Button id='uploadFile'  variant='contained' size='small' sx={{ width: '50px', minWidth:'50px', padding: '5px' }} onClick={handleUploadFile} >
              <CloudUploadIcon fontSize='small' sx={{color: '#ffffffff', padding: '0px'}} />
            </Button>
          </Tooltip> 
        </Box>
        <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={index} >
                    <TableCell onClick ={() => setActiveItem(row.id, row.type)}> 
                      <Stack direction={'row'} spacing={1}>
                        {row.type === 'folder' ? 
                          <FolderIcon fontSize='medium' sx={{color: '#fee634f4'}} />
                          : row.editable ?
                            <ArticleIcon fontSize='medium' sx={{color: '#4D4D4D'}} />
                          : <InsertDriveFileIcon fontSize='medium' sx={{color: '#4D4D4D'}} />
                        }
                        <Typography variant='body1' component='span' >
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align='right'>{row.dateCreated.toLocaleString('En-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    <TableCell align='right'>{row.dateModified.toLocaleString('EN-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    <TableCell align='right'>
                      <Stack direction={'row'} spacing={1}>
                        <Tooltip title='Delete' >
                          <Button
                            type='button'
                            size='small'
                            variant='contained'
                            sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                            disabled={row.contents > 0}
                            onClick={()=>deleteHandler(row.id, row.type)}
                          >
                            <DeleteIcon fontSize='small' sx={{color: '#ffffffff', padding: '0px'}} />
                          </Button>  
                        </Tooltip>
                        {row.type !== 'folder' ? (
                          <>
                            <Tooltip title='Share'>
                              <Button
                                type='button'
                                size='small'
                                variant='contained'
                                onClick={() => shareHandler(row.id, row.name)}
                                sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                              >
                                <ShareIcon fontSize='small' sx={{color: '#ffffffff'}} />
                              </Button>
                            </Tooltip>
                            <Tooltip title='Download'>
                              <Button
                                type='button'
                                size='small'
                                variant='contained'
                                sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                              >
                                <FileDownloadIcon fontSize='small' sx={{color: '#ffffffff'}} />
                              </Button>
                            </Tooltip>
                            <Tooltip title='Copy'>
                              <Button
                                type='button'
                                size='small'
                                variant='contained'
                                sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                              >
                                <ContentCopyIcon fontSize='small' sx={{color: '#ffffffff'}} />
                              </Button>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title='Rename'>
                              <Button
                                type='button'
                                size='small'
                                variant='contained'
                                onClick={() => renameHandler(row.id, row.name)}
                                sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                              >
                                <EditIcon fontSize='small' sx={{color: '#ffffffff'}} />
                              </Button>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title='Move'>
                          <Button
                            type='button'
                            size='small'
                            variant='contained'
                            onClick={() => moveHandler(row.id, row.type)}
                            sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                          >
                            <DriveFileMoveIcon fontSize='small' sx={{color: '#ffffffff'}} />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={OpenRenameFolder} onClose={() => setOpenRenameFolder(false)} >
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} >
              <TextField
                autoFocus
                margin='dense'
                id='folderName'
                label='Folder Name'
                type='text'
                fullWidth
                variant='outlined'
                value={newFolderData.newName}
                onChange={(e) => setNewFolderData({...newFolderData, newName: e.target.value})}
              />
              <Button onClick={handleRenameSubmit} variant='contained' size='small' sx={{ height: 40 }} >
                Rename Folder
              </Button>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenameFolder(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openMoveForm} onClose={() => setOpenMoveForm(false)} >
        <MoveForm moveItem={moveItem} activeFolderId={activeFolder} setOpenMoveForm={setOpenMoveForm} setAlertData={setAlertData} handleMoveSubmit={handleMoveSubmit} />
      </Dialog>
    </Paper>
  );
}

export default ShowFolderContent