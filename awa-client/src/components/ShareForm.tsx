import { useEffect, useState } from "react"

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { Dayjs } from "dayjs"
import { 
  TextField, 
  Grid, 
  Divider, 
  InputAdornment, 
  Tooltip, 
  IconButton, 
  Button, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  FormControl,
  InputLabel
} from "@mui/material"
import { Theme, useTheme } from '@mui/material/styles';

import ContentCopyIcon from "@mui/icons-material/ContentCopy"

import shareService from '../services/shareService';
import userService from "../services/userService"


interface IShareFile {
  fileId: number;
  fileName: string;
}

interface IShareFormProps {
  sharedFile: IShareFile | null;
  setAlertData: (alert: {type: 'success' | 'error', message: string, showAlert: boolean}) => void;
  setOpenShareFile: (open: boolean) => void;
}

interface IUSer {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(user: IUSer, sharedUser: IUSer[], theme: Theme) {
  const isSelected = sharedUser.some((selected) => selected.id === user.id);

return {
  fontWeight: isSelected
    ? theme.typography.fontWeightBold
    : theme.typography.fontWeightRegular,
  color: isSelected ? theme.palette.primary.main : 'inherit',
};
}

const ShareForm = ({sharedFile, setAlertData, setOpenShareFile}: IShareFormProps) => {
  const theme = useTheme();

  const [expires_at, setExpires_at] = useState<Dayjs|null>(null)
  const [tooltipTitle, setTooltipTitle] = useState('Copy to Clipboard');
  const [shareLink, setShareLink] = useState<string>('')
  const [userList, setUserList] = useState<IUSer[]>([])
  const [sharedUser, setSharedUser] = useState<IUSer[]>([])
  const [role, setRole] = useState<string>('VIEWER')

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  console.log('ShareForm * user list->', userList)
  console.log('ShareForm * shared  users->', sharedUser)


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers()
        setUserList(response)
      } catch (error) {
        console.error('Error fetching users:', error)
        setAlertData({type: 'error', message: 'Error fetching users', showAlert: true})
      }
    }
    fetchUsers()
  }, [])

const handleAddUsers = (event: SelectChangeEvent<number[]>) => {
  const {
    target: { value },
  } = event;

  const selectedIds: number[] = typeof value === 'string' ? value.split(',').map(Number) : value;

  const selectedUsers = userList.filter((user) => 
    selectedIds.includes(user.id)
  );

  setSharedUser(selectedUsers);
};
  console.log('selected users->', sharedUser)

  const handleCopyLink = async() => {
    try{
      await navigator.clipboard.writeText(shareLink)
      setTooltipTitle('Copied!')
      setTimeout(() => {
        setTooltipTitle('Copy to Clipboard')
      }, 2000)
    } catch (error) {
      console.error('Failed to copy: ', error)
    }
  }

  const handleShareSubmit = async() => {
    if (!sharedFile) {
      console.error('No file selected for sharing')
      return
    }
    const result = await shareService.shareFileWithUser(
      sharedFile.fileId,
      sharedUser.map(u => u.id),
      role
    )
    console.log('*** share result ->',result)
    setAlertData({type: 'success', message: `File shared with ${sharedUser.length} users`, showAlert: true})
  }



  const handleCreateLink = async() => {
    if (!sharedFile) {
      console.error('No file selected for sharing')
      return
    }
    const result = await shareService.shareFileExternal(sharedFile.fileId,expires_at?.toISOString() || null)
    setShareLink(result.link)
    console.log('*** share result ->',result)
    setAlertData({type: 'success', message: `File shared with ${sharedUser}`, showAlert: true})
  }

  return (
    <>
      <DialogTitle>Share File</DialogTitle>
      <Typography variant='h6'  marginLeft={3}>File name: {sharedFile?.fileName}</Typography>
      <DialogContent>
        <Grid container spacing={2} marginBottom={2} maxWidth={500} >
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel id="shared_users_label">Users</InputLabel>
            <Select
              id="shared_users"
              label="Users"
              multiple
              value={sharedUser.map(u => u.id) as number[]}
              onChange={handleAddUsers}
              input={<OutlinedInput label="Users" />}
              MenuProps={MenuProps}
             sx={{ minWidth: 300, height: 40 }}
            >
              {userList.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  sx={{ minWidth: 200 }}
                  style={getStyles(user, sharedUser, theme)}
                >
                  {`${user.firstName || ''} ${user.lastName || ''}(${user.username})`}
                </MenuItem>
            ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="shared_role_label">Role</InputLabel>
              <Select
                labelId="shared_role_label"
                id="shared-role"
                value={role}
                label="Role"
                onChange={handleRoleChange}
                sx={{ height:40 }}
              >
                <MenuItem value={'VIEWER'}>Viewer</MenuItem>
                <MenuItem value={'EDITOR'}>Editor</MenuItem>
                <MenuItem value={'OWNER'}>Owner</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={handleShareSubmit}  size="small" variant="contained" sx={{ height: 40 }} >
              Share File
            </Button>
          </Stack>
        </Grid>
        <Divider sx={{ marginY: 2 }}>Free Share</Divider>
          <Grid container spacing={2} >
             <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker
                    label='Expires at'
                    format='YYYY.MM.DD'
                    value={expires_at}
                    disablePast
                    onChange={(newDate: Dayjs | null) => setExpires_at(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button onClick={handleCreateLink}  size="small" variant="contained" sx={{ height: 40, margin:2 }} >
                Create Link
              </Button>
              <TextField
                margin='dense'
                id='link'
                name='link'
                label='Link'
                type='text'
                fullWidth
                value={shareLink}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={tooltipTitle}>
                          <IconButton onClick={handleCopyLink} edge="end">
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=> setOpenShareFile(false)}>Close</Button>
      </DialogActions>
    </>
  )
}

export default ShareForm