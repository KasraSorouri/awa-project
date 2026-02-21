import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { Box, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';

import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { IRecycledFiles } from '../types/folderTypes';
import fileService from '../services/fileService';
import { useLocation } from 'react-router-dom';

interface Column {
  id: 'name' | 'folder' | 'dateCreated' | 'dateModified' | 'editable' | 'type';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}



interface Data {
  id: number;
  name: string;
  folder: string;
  dateCreated: Date;
  dateModified: Date;
  type: string;
  editable?: boolean;
}

const SerachPage = () => {

  const [files, setFiles] = useState<IRecycledFiles[]>([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns: readonly Column[] = [
    { id: 'name', label: 'Name', minWidth: isMobile ? 110 : 150 },
    { id: 'folder', label: 'Folder', minWidth: isMobile ? 70 : 100 },
    { 
      id: 'dateCreated',
      label:  isMobile ?  '' : 'Date Created',
      minWidth:  isMobile ? 0 : 80,
      align: 'left',
    } ,
    {
      id: 'dateModified',
      label:   isMobile ?  '' : 'Date Deleted',
      minWidth:  isMobile ? 0 : 80,
      align: 'left',
    },
    {
      id: 'type',
      label: '',
      minWidth: isMobile ? 0 : 100,
      align: 'right',
    },
  ];

  const searchParam = useLocation().pathname.split('/')[2];


  useEffect(() => {
 
    const getFiles = async () => {
      try {
        const files = await fileService.search(searchParam)
        if (files) {
          setFiles(files)
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
        }
        console.log(error)
      }
    }
    getFiles()
  }, [searchParam])
  
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows: Data[]= [];
  files.forEach((file) => {
    rows.push({
      id: file.id,
      name: file.fileName,
      folder: file.folder?.folderName || 'Root',
      dateCreated: new Date(file.createdAt),
      dateModified: new Date(file.updatedAt),
      type: 'file',
      editable: file.editable,
    });
  })

  
return(
  <Grid size={{ xs: 9, lg: 12 }} border={isMobile? 'none': 'solid'} borderColor={'#4d4d4d'} borderRadius={5} padding={isMobile? 0 : 1} margin={{ xs: 1, lg: 5}}>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderRadius: 5,
          padding:  isMobile ? 1 :2,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
      <Box></Box>
      { !isMobile &&
        <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />}
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
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} >
                    <TableCell> 
                      <Stack direction={'row'} spacing={isMobile ? 0 : 1}>
                        {row.editable ?
                            <ArticleIcon fontSize="medium" sx={{color: "#4D4D4D"}} />
                          : <InsertDriveFileIcon fontSize="medium" sx={{color: "#4D4D4D"}} />
                          }
                        <Typography variant="body1" component="span" sx={{ fontSize: isMobile ? 'small' : 'medium', padding: 0}} >
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontSize: isMobile ? 'small' : 'medium'}}>{row.folder}</TableCell>
                    {!isMobile && 
                    <>
                    <TableCell align="left" sx={{ fontSize: isMobile ? 'small' : 'medium'}}>
                      {row.dateCreated.toLocaleString('En-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: isMobile ? 'small' : 'medium'}}>
                      {row.dateModified.toLocaleString('EN-FI', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
                      .replace('.', ':').replaceAll('/','.').replace(',','')}
                    </TableCell>
                    </>
                    }
                    <TableCell align="right">
                      <Stack direction={'row'} spacing={1}>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        { isMobile &&
          <TablePagination
          rowsPerPageOptions={[5, 10, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />}
      </TableContainer>
    </Paper>
    </Grid>
  );
};
export default SerachPage;