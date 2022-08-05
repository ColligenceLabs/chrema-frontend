import * as yup from 'yup';

const changePasswordSchema = yup.object({
  old_password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  new_password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  new_repassword: yup
    .string()
    .oneOf([yup.ref('new_password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default changePasswordSchema;
