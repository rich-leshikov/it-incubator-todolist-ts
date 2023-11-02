import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useAppSelector } from 'app/store'
import { Navigate } from 'react-router-dom'
import * as authSelectors from 'features/Login/auth.selectors'
import { useLogin } from 'features/Login/useLogin'

export const Login = () => {
  // console.log('render Login')

  const { formik } = useLogin()
  const isLoggedIn = useAppSelector(authSelectors.isLoggedIn)

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                  {' '}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label='Email' margin='normal' {...formik.getFieldProps('email')} />
              {formik.errors.email && formik.touched.email ? (
                <div style={{ color: '#c20a0a' }}>{formik.errors.email}</div>
              ) : null}
              <TextField type='password' label='Password' margin='normal' {...formik.getFieldProps('password')} />
              {formik.errors.password && formik.touched.password ? (
                <div style={{ color: '#c20a0a' }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={'Remember me'}
                control={<Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')} />}
              />
              <Button type={'submit'} variant={'contained'} color={'primary'}>
                Login{' '}
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
