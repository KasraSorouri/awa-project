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

import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import shareService from '../services/shareService';
import ShowFileContent from './ShowFileContent';

interface Column {
  id: 'name' | 'role' | 'owner' | 'type' ;
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 120 },
  { 
    id: 'role',
    label: 'Role',
    minWidth: 170,
    align: 'right',
  } ,
  {
    id: 'owner',
    label: 'Owner',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'type',
    label: '',
    minWidth: 170,
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
  
  useEffect(() => {
    // Get Shared Files
    const fetchSharedFiles = async () => {
      try {
        const result = await shareService.getSharedFilesToUser();
        const newRows: IData[] = [];
        result.sharedFiles.forEach((file: ISharedFile) => {
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
      <Paper sx={{ width: '100%', overflow: 'hidden', minHeight: '60vh' }}>
        <Typography variant='h6' component='h2' sx={{ padding: 2 }}>No files have been shared wioth you.</Typography>
      </Paper>
    )
  }

  const handleShare = async() => {
    return null
  }

  return (
    activeFile !== null ? (
      <ShowFileContent activeFile={activeFile} setActiveFile={setActiveFile} editMode={editMode} setEditMode={setEditMode} handleShare={handleShare} />
    ) : (
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
                      <TableCell onClick ={() => {setActiveFile(row.id); setEditMode(row.editable)}} > 
                        <Stack direction={'row'} spacing={1}>
                          {row.editable ?
                              <ArticleIcon fontSize='medium' sx={{color: '#4D4D4D'}} />
                            : <InsertDriveFileIcon fontSize='medium' sx={{color: '#4D4D4D'}} />
                          }
                          <Typography variant='body1' component='span' >
                            {row.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align='right'>{row.role}</TableCell>
                      <TableCell align='right'>{row.owner}</TableCell>
                      <TableCell align='right'>
                        <Stack direction={'row'} spacing={1}>
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
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    )
  );
}

export default ShowSharedFiles