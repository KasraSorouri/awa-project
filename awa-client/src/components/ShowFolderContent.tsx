import React, { useState } from 'react';
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

import fileService from '../services/fileService';
import folderService from '../services/folderService';


import { IFolder } from '../types/folderTypes'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { IAlert } from '../types/alertTypes';

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
}


const ShowFolderContent = ({folder, activeFolder, setActiveFolder, setActiveFile, setAlertData, handleAddFile, handleAddFolder, handleUploadFile}: IShowFolderContentProps) => {
  console.log('ShowFolderContent * active folder', activeFolder)
  console.log('ShowFolderContent * folders', folder)
  


  console.log('ShowFolderContent * folder', activeFolder, '->' ,folder)
  const rows: Data[]= []

  if (folder.subFolders.length>0) {
    rows.push(...folder.subFolders.map((folder) => { 
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
  rows.push(...folder.files.map((file) => {
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
    

//export default function StickyHeadTable() {
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
        setAlertData({type: 'success', message: 'Folder deleted successfully', showAlert: true});
        rows.filter((row) => row.type === 'folder' && row.id !== id);
      } else {
        const result = await fileService.deleteFile(id);
        if (result) {
          setAlertData({type: 'success', message: 'File deleted successfully',showAlert: true});
          rows.filter((row) => row.type === 'file' && row.id !== id);
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
             <DriveFolderUploadIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
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
        <Typography variant="h6" component="h2" sx={{ padding: 2 }}>This folder is empty</Typography>
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
          borderBottom: '1px solid #e0e0e0' // Optional divider
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
             <DriveFolderUploadIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
            </Button>  
          </Tooltip>
          <Tooltip title='Add new Folder' >
            <Button id='addFolder'  variant='contained' size='small' sx={{ width: '50px', minWidth:'50px', padding: '5px' }} onClick={handleAddFolder} >
              <CreateNewFolderIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
            </Button>
          </Tooltip> 
          <Tooltip title='Add new File' >
            <Button id='addFile'  variant='contained' size='small' sx={{ width: '50px', minWidth:'50px', padding: '5px' }} onClick={handleAddFile} >
              <NoteAddIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
            </Button>
          </Tooltip>
          <Tooltip title='Upload a File' >
            <Button id='uploadFile'  variant='contained' size='small' sx={{ width: '50px', minWidth:'50px', padding: '5px' }} onClick={handleUploadFile} >
              <CloudUploadIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
            </Button>
          </Tooltip> 
        </Box>
        <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={index} >
                    <TableCell onClick ={() => setActiveItem(row.id, row.type)}> 
                      <Stack direction={'row'} spacing={1}>
                        {row.type === 'folder' ? 
                          <FolderIcon fontSize="medium" sx={{color: "#fee634f4"}} />
                          : row.editable ?
                            <ArticleIcon fontSize="medium" sx={{color: "#4D4D4D"}} />
                          : <InsertDriveFileIcon fontSize="medium" sx={{color: "#4D4D4D"}} />
                        }
                        <Typography variant="body1" component="span" >
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{row.dateCreated.toLocaleString('En-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    <TableCell align="right">{row.dateModified.toLocaleString('EN-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    <TableCell align="right">
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
                            <DeleteIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
                          </Button>  
                        </Tooltip>
                        {row.type !== 'folder' && (
                          <>
                            <Tooltip title="Share">
                              <Button
                                type='button'
                                size='small'
                                variant='contained'
                                sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                              >
                                <ShareIcon fontSize="small" sx={{color: "#ffffffff"}} />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Download">
                              <Button
                                type='button'
                                size='small'
                                variant='contained'
                                sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                              >
                                <FileDownloadIcon fontSize="small" sx={{color: "#ffffffff"}} />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Copy">
                              <Button
                                type='button'
                                size='small'
                                variant='contained'
                                sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                              >
                                <ContentCopyIcon fontSize="small" sx={{color: "#ffffffff"}} />
                              </Button>
                            </Tooltip>
                          </>
                      )}
                        <Tooltip title="Move">
                          <Button
                            type='button'
                            size='small'
                            variant='contained'
                            sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                          >
                            <DriveFileMoveIcon fontSize="small" sx={{color: "#ffffffff"}} />
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
    </Paper>
  );
}

export default ShowFolderContent