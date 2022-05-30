import React, { useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button';
import './styles.css';
import { useNavigate, Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../header/mylogo.svg';
const url = process.env.REACT_APP_API_URL || 'http://localhost:4000/'

export default function Login() {
  const initialFormData = {
    email: '',
    password: '',
  };
  const [user, setUser] = useState(initialFormData);
  const [loginResponse, setLoginResponse] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    };

    fetch(`${url}/user/login`, options)
      .then((res) => {
        res.json().then((json) => {
          if (res.ok) {
            console.log('RESPONSE OK, TOKEN:', json.data);
            localStorage.setItem('JWT', json.data);
            navigate('/board');
          } else {
            setLoginResponse(json.error);
            console.log('Invalid response code:', res.status);
            console.log('Invalid response data:', json.error);
          }
        });
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  };

  return (
    <form className='user-form' onSubmit={handleSubmit}>
      <div className='top-of-login'>
        <h1 className='title'>will manage</h1>
        <div className='logo'>
          <Logo height='60' width='60' />
        </div>
      </div>
      <div className='login'>
        <h2>Login</h2>
        <TextField
          className='user-form-input'
          type='email'
          label='Email'
          variant='outlined'
          name='email'
          value={user.email}
          onChange={handleChange}
          size='small'
          InputLabelProps={{style: {fontSize: 13}}}
        />
        <TextField
          className='user-form-input'
          type='password'
          label='Password'
          variant='outlined'
          name='password'
          value={user.password}
          onChange={handleChange}
          size='small'
          InputLabelProps={{style: {fontSize: 13}}}
        />
        <Button
          id='user-submit-button'
          type='submit'
          variant='contained'
          size='small'
        >
          Login
        </Button>
        {loginResponse && <p>{loginResponse}</p>}
        <Link
          to='/register'
          style={{
            textDecoration: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '12px',
          }}
        >
          <p>Not yet registered? Click here!</p>
        </Link>
      </div>
    </form>
  );
}
