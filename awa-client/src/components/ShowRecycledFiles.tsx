import { Box, Button, Checkbox, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RecyclingIcon from '@mui/icons-material/Recycling';

import { IRecycledFiles } from '../types/folderTypes';
import { IAlert } from '../types/alertTypes';
import fileService from '../services/fileService';
import ShowAlert from './ShowAlert';

interface Column {
  id: 'name' | 'folder' | 'dateCreated' | 'dateModified' | 'editable' | 'type';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'folder', label: 'Folder', minWidth: 100 },
  { 
    id: 'dateCreated',
    label: 'Date Created',
    minWidth: 80,
    align: 'left',
  } ,
  {
    id: 'dateModified',
    label: 'Date Deleted',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'type',
    label: '',
    minWidth: 100,
    align: 'right',
  },
];

interface Data {
  id: number;
  name: string;
  folder: string;
  dateCreated: Date;
  dateModified: Date;
  type: string;
  editable?: boolean;
}

interface ShowRecycledFilesProps {
  recycledFiles: IRecycledFiles[];
}


const ShowFileContent = ({recycledFiles}: ShowRecycledFilesProps) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [alertData, setAlertData] = useState<IAlert>({
    type: 'info',
    message: '',
    showAlert: false
  });
  
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows: Data[]= [];
  recycledFiles.forEach((file) => {
    rows.push({
      id: file.id,
      name: file.fileName,
      folder: file.folder.folderName,
      dateCreated: new Date(file.createdAt),
      dateModified: new Date(file.updatedAt),
      type: 'file',
      editable: file.editable,
    });
  })

  const hanndleSelected = (id: number) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleRemoveFile = async(id:number) => {
    try {
      const result = await fileService.removeFile([id]);
      rows.filter((row) => row.id !== id)
      setAlertData({
        type: 'success',
        message: result.message,
        showAlert: true
      })
    } catch (error) {
      if (error instanceof Error) {
        setAlertData({
          type: 'error',
          message: error.message,
          showAlert: true
        })
      }
      console.error('Error removing file:', error);
    }
  };

  const handleRestoreFile = async(id:number) => {
    try {
      const result = await fileService.restoreFile([id]);
      rows.filter((row) => row.id !== id)
      setAlertData({
        type: 'success',
        message: result.message,
        showAlert: true
      })
    } catch (error) {
      if (error instanceof Error) {
        setAlertData({
          type: 'error',
          message: error.message,
          showAlert: true
        })
      }
      console.error('Error removing file:', error);
    }
  };

  const handleRemodeSelected = async () => {
    try {
      const result = await fileService.removeFile(selected);
      rows.filter((row) => !selected.includes(row.id))
      setAlertData({
        type: 'success',
        message: result.message,
        showAlert: true
      })
    } catch (error) {
      if (error instanceof Error) {
        setAlertData({
          type: 'error',
          message: error.message,
          showAlert: true
        })
      }
      console.error('Error removing file:', error);
    }
  };

  const handleRestoreSelected = async () => {
        try {
      const result = await fileService.restoreFile(selected);
      rows.filter((row) => !selected.includes(row.id))
      setAlertData({
        type: 'success',
        message: result.message,
        showAlert: true
      })
    } catch (error) {
      if (error instanceof Error) {
        setAlertData({
          type: 'error',
          message: error.message,
          showAlert: true
        })
      }
      console.error('Error removing file:', error);
    }
  };

return(
  <Grid size={{ xs: 9, lg: 12 }} border={'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={3} margin={{ xs: 1, lg: 5}}>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
          <Typography variant="h6" component="div">
            {selected.length} item(s) selected
          </Typography>
          <Tooltip title='Delete forever' >
            <Button
              type='button'
              size='small'
              variant='contained'
              sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
              onClick={handleRemodeSelected}
            >
             <DeleteForeverIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
            </Button>  
          </Tooltip>
          <Tooltip title="Restore">
            <Button
              type='button'
              size='small'
              variant='contained'
              sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
              onClick={handleRestoreSelected}
            >
              <RecyclingIcon fontSize="small" sx={{color: "#ffffffff"}} />
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
              <TableCell padding="checkbox" align='left'>
              <Checkbox 
                color="primary"
                indeterminate={selected.length > 0 && selected.length < rows.length}
                checked={rows.length > 0 && selected.length === rows.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelected(rows.map((row) => row.id));
                  } else {
                    setSelected([]);
                  }
                }}
                sx={{ width: '20px', height: '20px', padding: '20px', margin: '0px' }}
              />
              </TableCell>
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick ={() => {hanndleSelected(row.id)}} >
                    <TableCell padding="checkbox" align='left' >
                      <Checkbox
                      color="primary"
                      checked={selected.includes(row.id)}
                      sx={{ width: '20px', height: '20px', padding: '20px', margin: '0px' }}

                    />
                    </TableCell>
                    <TableCell> 
                      <Stack direction={'row'} spacing={1}>
                        {row.editable ?
                            <ArticleIcon fontSize="medium" sx={{color: "#4D4D4D"}} />
                          : <InsertDriveFileIcon fontSize="medium" sx={{color: "#4D4D4D"}} />
                          }
                        <Typography variant="body1" component="span" >
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.folder}</TableCell>
                    <TableCell align="left">{row.dateCreated.toLocaleString('En-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    <TableCell align="left">{row.dateModified.toLocaleString('EN-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction={'row'} spacing={1}>
                        <Tooltip title='Delete forever' >
                          <Button
                            type='button'
                            size='small'
                            variant='contained'
                            sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                            onClick={()=>{handleRemoveFile(row.id)}}
                          >
                            <DeleteForeverIcon fontSize="small" sx={{color: "#ffffffff", padding: '0px'}} />
                          </Button>  
                        </Tooltip>
                        <Tooltip title="Restore">
                          <Button
                            type='button'
                            size='small'
                            variant='contained'
                            sx={{ width: '50px', minWidth:'50px', padding: '5px', background: '#000000' }}
                            onClick={()=>{handleRestoreFile(row.id)}}
                          >
                            <RecyclingIcon fontSize="small" sx={{color: "#ffffffff"}} />
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
    <ShowAlert type={alertData.type} message={alertData.message} showAlert={alertData.showAlert} setAlertData={setAlertData} />
    </Grid>
  );
};
export default ShowFileContent;