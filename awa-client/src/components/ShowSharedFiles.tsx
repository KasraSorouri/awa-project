import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { Box, Button, Dialog, Grid, Stack, Tooltip, Typography } from '@mui/material';
import shareService from '../services/shareService';
import ShowFileContent from './ShowFileContent';
import fileService from '../services/fileService';
import { IAlert } from '../types/alertTypes';
import CopyForm from './CopyForm';

interface Column {
  id: 'name' | 'role' | 'owner' | 'type' ;
  label: string;
  minWidth?: number;
  align?: 'right';
}

const isMobile = window.innerWidth < 600;

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: isMobile? 80 : 120 },
  { 
    id: 'role',
    label: 'Role',
    minWidth: isMobile? 20 : 170,
    align: 'right',
  } ,
  {
    id: 'owner',
    label: 'Owner',
    minWidth: isMobile? 20 : 170,
    align: 'right',
  },
  {
    id: 'type',
    label: '',
    minWidth: isMobile? 30 : 170,
    align: 'right',
  },
];

interface IData {
  id: number;
  name: string;
  role: string;
  owner: string;
  editable: boolean;
  type: string;
}

interface ISharedFile {
  activated: boolean;
  address: string;
  deleted: boolean;
  editable: boolean;
  fileName: string;
  fileOwner: {
    id: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
  };
  fileType: string;
  folderId: number;
  id: number;
  user_file: {
    role: string;
  };
}




const ShowSharedFiles = () => {
  const [rows, setRows] = useState<IData[]>([]);
  const [activeFile, setActiveFile] = useState<number|null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [openCopyForm, setOpenCopyForm] = useState<boolean>(false)
  const [copyItem, setCopyItem] = useState<number|null>(null)
  
  const setAlertData = (alert:IAlert) =>{
    console.log(alert)
  }

  useEffect(() => {
    // Get Shared Files
    const fetchSharedFiles = async () => {
      try {
        const result = await shareService.getSharedFilesToUser();
        const newRows: IData[] = [];
        result.forEach((file: ISharedFile) => {
          newRows.push({
            id: file.id,
            name: file.fileName,
            role: file.user_file.role,
            owner: file.fileOwner.firstName && file.fileOwner.lastName ? 
                    `${file.fileOwner.firstName} ${file.fileOwner.lastName}` :
                    file.fileOwner.username,
            editable: file.editable,
            type: file.fileType,
          });
        });
        setRows(newRows);

      } catch (error) {
        console.log('Error fetching shared files:', error);
      }
    };

    fetchSharedFiles();
  }, []); 

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  
  if (rows.length === 0) {
    return(
      <Paper sx={{ width: 'auto', overflow: 'hidden', minHeight: '60vh', margin: 1 }}>
        <Typography variant='h6' component='h2' sx={{ padding: 2 }}>No files have been shared with you.</Typography>
      </Paper>
    )
  }

  const handleShare = async() => {
    return null
  }

  const handleDownloadFile = async (fileId: number, fileName:string, fileType: string) => {

    if (fileId) {
      if (fileType === 'document') {
        try {
          const result = await fileService.downloadPdfFile(fileId);
          if (!result) {
            alert('Error downloading file');
            return;
          }
          const blob : Blob = new Blob([result.data], { type: 'application/pdf' });
          const url : string = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err: unknown) {
          console.log('Download Failed!', err)
        }
      } else {
        try {
          const result = await fileService.downloadFile(fileId)
          if (!result) {
            alert('Error downloading file');
            return;
          }
          const blob : Blob = new Blob([result.data], { type: result.data.type });
          const url : string = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err: unknown) {
          console.log('Download Failed!', err)
        }
      }
    }
  }


  // Copy a File 
  const copyHandler = (id: number) => {
    console.log('move item with id:', id)
    setCopyItem(id)
    setOpenCopyForm(true)
  }

  const handleCopySubmit = async(selectedFolder: number) => {
    if (!copyItem) {
      console.error('No item selected for copying')
      return
    }
    try {
      await fileService.copyFile(copyItem, selectedFolder !== 0 ? selectedFolder : null)
      setAlertData({type: 'success', message: 'File moved successfully', showAlert: true})

      setOpenCopyForm(false)
    } catch (error) {
      console.error('Error copying item:', error)
      setAlertData({type: 'error', message: 'Error copying item', showAlert: true})
    }
  }

  return (
    activeFile !== null ? (
      <ShowFileContent activeFile={activeFile} setActiveFile={setActiveFile} editMode={editMode} setEditMode={setEditMode} handleShare={handleShare} downloadFile={handleDownloadFile} setAlertData={setAlertData} />
    ) : (
      <Grid size={{ xs: 9, lg: 12 }} border={isMobile? 'none': 'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={isMobile? 0 : 1} margin={{ xs: 1, lg: 5}}>
      <Paper sx={{ width: 'auto', overflow: 'hidden', minHeight: '60vh'}}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 0,
            borderBottom: '1px solid #e0e0e0'
          }}
        >        
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                      <TableCell onClick ={() => {setActiveFile(row.id)}} > 
                        <Stack direction={'row'} spacing={1}>
                          {row.editable ?
                              <ArticleIcon fontSize='medium' sx={{color: '#4D4D4D'}} />
                            : <InsertDriveFileIcon fontSize='medium' sx={{color: '#4D4D4D'}} />
                          }
                          <Typography variant='body1' component='span' sx={{fontSize:isMobile? 'small': 'medium'}} >
                            {row.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='right' sx={{fontSize:isMobile? 'small': 'medium'}}>{row.role}</TableCell>
                      <TableCell align='right' sx={{fontSize:isMobile? 'small': 'medium'}}>{row.owner}</TableCell>
                      <TableCell align='right' sx={{fontSize:isMobile? 'small': 'medium'}}>
                        <Stack direction={'row'} spacing={1}>
                          <Tooltip title='Download'>
                            <Button
                              type='button'
                              size='small'
                              variant='contained'
                              onClick={() => handleDownloadFile(row.id, row.name, row.editable ? 'document' : 'row')}
                              sx={{ width: isMobile? '20px' :'50px', minWidth: isMobile? '20px' :'50px', padding: isMobile ? '1px':'5px', background: '#000000' }}
                            >
                              <FileDownloadIcon fontSize='small' sx={{color: '#ffffffff'}} />
                            </Button>
                          </Tooltip>
                          <Tooltip title='Copy'>
                            <Button
                              type='button'
                              size='small'
                              variant='contained'
                              onClick={() => copyHandler(row.id)}
                              sx={{ width: isMobile? '20px' :'50px', minWidth: isMobile? '20px': '50px', padding: isMobile ? '1px':'5px', background: '#000000' }}
                            >
                              <ContentCopyIcon fontSize='small' sx={{color: '#ffffffff'}} />
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
        <Dialog open={openCopyForm} onClose={() => setOpenCopyForm(false)} >
          <CopyForm copyItem={copyItem} activeFolderId={0} setOpenCopyForm={setOpenCopyForm} setAlertData={setAlertData} handleCopySubmit={handleCopySubmit} />
         </Dialog>
      </Paper>
      </Grid>
    )
  );
}

export default ShowSharedFiles