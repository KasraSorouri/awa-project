import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';

import fileService from '../services/fileService';
import folderService from '../services/folderService';

import { IFolder } from '../types/folderTypes'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';

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
}

interface IShowFolderContentProps {
  folders: IFolder[],
  activeFolder: number | null;
  setActiveFolder: (id: number | null) => void;
}


const ShowFolderContent = ({folders, activeFolder, setActiveFolder}: IShowFolderContentProps) => {
  console.log('ShowFolderContent', folders)

  const folder:IFolder = folders.find((folder) => folder.id === activeFolder) || folders[0]
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
      contents: 0
    }
  }))
    

//export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const setActiveItem = (id: number, type: string) => {
    console.log('Item clicked:', id, type);
    if (type === 'folder') {
      setActiveFolder(id)
    } else {
      console.log('File clicked:', id);
    }
  }


  const deleteHandler = async (id: number, type: string) => {
    try {
      if (type === 'folder') {
        await folderService.deleteFolder(id);
      } else {
        const result = await fileService.deleteFile(id);
        if (result) {
          console.log('File deleted successfully');
          rows.filter((row) => row.type === 'file' && row.id !== id);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting item:', error.message);
      }
      console.error('Error deleting item:', error);
    }
    console.log('Delete clicked');
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} >
                    <TableCell onClick ={() => setActiveItem(row.id, row.type)}> 
                      <Stack direction={'row'} spacing={1}>
                        {row.type === 'folder' ? 
                          <FolderIcon fontSize="medium" sx={{color: "#fee634f4"}} /> :
                          <InsertDriveFileIcon fontSize="medium" sx={{color: "#4D4D4D"}} />
                        }
                        <Typography variant="body1" component="span" >
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{row.dateCreated.toLocaleString('EN-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</TableCell>
                    <TableCell align="right">{row.dateModified.toLocaleString('EN-GB', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</TableCell>
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ShowFolderContent