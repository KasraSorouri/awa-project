import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button } from '@mui/material';

import FolderSharedIcon from '@mui/icons-material/FolderShared';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';

import { IFileCounter } from '../types/folderTypes';
import userService from '../services/userService';

interface IUserData {
  user_id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  picture?: string;
}

type THeaderProps = {
  user: IUserData | null;
  counter: IFileCounter;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));




const Header = ({user, counter}:THeaderProps) => {

  const navigate = useNavigate()

  const showUser = user ? 
    (user.firstName && user.lastName) ? (user.firstName + ' ' + user.lastName) :
    (user.firstName) ? (user.firstName) :
    (user.lastName) ? (user.lastName) :
    user.username : null;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const getProfilePicture = async () => {
      if (user?.picture) {
        try {
          const profilePic = await userService.getProfilePicture();
          const url = URL.createObjectURL(profilePic);
          setPictureUrl(url);
        } catch (error) {
          console.log('Error fetching profile picture:', error);
        }
      }
    };
    getProfilePicture();
    return () => {
      if (pictureUrl) {
        URL.revokeObjectURL(pictureUrl);
      }
    };
  }, [user]);



  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('awa-token');
    window.location.reload();    
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => navigate('/userProfile')}>Profile</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton 
          size="large"
          aria-label="My Drive"
          color="inherit"
          onClick={()=> navigate('/')}
        >
          <Badge badgeContent={(counter.fileCounter|| 0)+ (counter.folderCounter||0)} color="error">
            <InventoryIcon />
          </Badge>
        </IconButton>
        <p>My Files</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          onClick={()=> navigate('/recycled')}
        >
          <Badge badgeContent={counter.recycledCounter} color="error">
            <DeleteIcon />
          </Badge>
        </IconButton>
        <p>Deleted Files</p>
      </MenuItem>
      <MenuItem>
            <IconButton
              size="large"
              aria-label="Shared Files"
              color="inherit"
              onClick={()=> navigate('/sharedFiles')}
            >
              <Badge badgeContent={counter.sharedCounter} color="error">
                <FolderSharedIcon />
              </Badge>
            </IconButton>
        <p>Shared Files</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/*<IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            AWA Project
          </Typography>
          { user ?
            <>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton 
              size="large"
              aria-label="My Drive"
              color="inherit"
              onClick={()=> navigate('/')}
            >
              <Badge badgeContent={(counter.fileCounter|| 0)+ (counter.folderCounter||0)} color="error">
                <InventoryIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={()=> navigate('/recycled')}
            >
              <Badge badgeContent={counter.recycledCounter} color="error">
                <DeleteIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="shared Files"
              color="inherit"
              onClick={()=> navigate('/sharedFiles')}
            >
              <Badge badgeContent={counter.sharedCounter} color="error">
                <FolderSharedIcon />
              </Badge>
            </IconButton>
              <Typography variant='h5' sx={{ margin: '2rem' }}>
                {showUser}
              </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              
              {pictureUrl ? <Avatar alt="Profile Picture" src={pictureUrl} sx={{ width: 56, height: 56, marginLeft: '0.5rem' }} /> : <AccountCircle />}
            </IconButton>
            <Button variant='contained' sx={{ margin: '0 1rem' }} onClick={handleLogout} >Logout</Button>
          </Box>
          </> :
          <>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} />
          <Button variant='contained' sx={{ margin: '0 1rem' }} onClick={() => navigate('/login')} >Login</Button>
          <Button variant='contained' sx={{}} onClick={() => navigate('/register')} >Sign Up</Button>
          
          </>
          }
          { user &&
            <>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          </>}
        </Toolbar>
      </AppBar>
      { user ? (
        <>
      {renderMobileMenu}
      {renderMenu}
      </>
       ) : null
       }
    </Box>
  );
}

export default Header
