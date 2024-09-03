import React from 'react'
import { StyledLogin } from './style'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Snackbar, SnackbarOrigin } from '@mui/material';

interface LoginProps {
  username: string;
  password: string;
}
interface State extends SnackbarOrigin {
  open: boolean;
}

const Login = () => {

  const navigate = useNavigate();

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: any) => {
    setState({ ...newState, open: true });
  };
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  return (
    <StyledLogin>
      <form
        onSubmit={handleSubmit(({username, password}: LoginProps) => {
          if(username == 'admin' && password == 'admin'){
            localStorage.setItem('token', 'token');
            navigate("/");
          } else if(username != 'admin' || password != 'admin'){
            handleClick({ vertical: 'top', horizontal: 'center' });
          }
        })}
      >
        <label>Username</label>
        <input {...register("username", { required: true, maxLength: 10 })} />
        {errors.username && <p>This field is required</p>}
        <label>Password</label>
        <input
          {...register("password", { required: true, maxLength: 10 })}
        />
        {errors.password && <p>This field is required</p>}
        <input type="submit" />
      </form>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="Username or password is incorrect"
        key={vertical + horizontal}
      />
    </StyledLogin>
  )
}

export default Login