import { useAppDispatch } from 'app/store'
import { FormikHelpers, useFormik } from 'formik'
import { authThunks } from 'features/Login/auth.slice'
import { LoginParams } from 'features/Login/auth.api'
import { BaseResponse } from 'common/api/common.api'

type FormikErrorType = Partial<Omit<LoginParams, 'captcha'>>

export const useLogin = () => {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: values => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Field is required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      if (!values.password) {
        errors.password = 'Field is required'
      } else if (values.password.length < 4) {
        errors.password = 'Password too short'
      }
      return errors
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginParams>) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((reason: BaseResponse) => {
          reason.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
    }
  })

  return { formik }
}