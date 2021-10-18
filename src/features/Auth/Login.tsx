import React from 'react'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@material-ui/core'
import {FormikHelpers, useFormik} from 'formik'
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {selectIsLoggedIn} from "./selectors";
import {useAppDispatch} from "../../utils/redux-utils";
import {authActions} from "./index";
import { login } from './authReducer';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

type FormValuesType = {
    email: string,
    password: string,
    rememberMe: boolean
}

export const Login = () => {

    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const resultAction = await dispatch(authActions.login(values));

            if (login.rejected.match(resultAction)) {
                if (resultAction.payload?.fieldsErrors?.length) {
                    const error = resultAction.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }
            }
            // formik.resetForm();
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Password is required!'
            } else if (values.password.length < 4) {
                errors.password = 'Password must be more than 4 characters!'
            }
            return errors;
        }
    })

    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }

    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}>here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched && formik.errors.email ?
                            <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched && formik.errors.password ?
                            <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox {...formik.getFieldProps('rememberMe')}/>}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
