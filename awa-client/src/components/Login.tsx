import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Box, Button, FormControl, TextField, Typography } from '@mui/material'
import loginService from '../services/loginService'

interface IUserData {
  username: string,
  password: string,
}

const Login = () => {

  const navigate = useNavigate()

  const initFormData : IUserData = {
    username: '',
    password: '',
  }
  const [formData, setFormData] = useState<IUserData>(initFormData)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await loginService(formData)
    if (result) {
      setFormData(initFormData)
      navigate('/')
      window.location.reload()
    }
  }


  return(
    <FormControl>
      <Box  
        component='form' 
        marginTop={5}
        gap={2}
        display={'flex'} 
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        bgcolor={'whitesmoke'}
        borderRadius={5}
        padding={5} 
        onSubmit={handleLogin}
        >
       <TextField 
        id='username'
        name='username'
        label='Username'
        variant='outlined'
        placeholder='Username'
        value={formData.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
        required
      />
      <TextField
        id='password'
        name='password'
        label='Password'
        variant='outlined'
        placeholder='Password'
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
        required
      />
        <Button 
          id='login'
          name='login'
          variant='contained'
          color='primary'
          type='submit'
          > Login
        </Button>
        <Typography variant='body2' color='error'>
          If you don't have an account, please <Link to='/register'>register</Link>
        </Typography>
        </Box>
    </FormControl>
  )
}

export default Login