import * as yup from 'yup';

const adminRegisterSchema = yup.object({
  full_name: yup.string('Enter your name').required('Name is required'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  level: yup.string('Select level').required('Level is required'),
  image: yup.mixed().required('Image is required'),
  description: yup
    .string('Enter your Description')
    .required('Description is required')
    .max(1024, 'Description has a maximum limit of 1024 characters.'),
});

export default adminRegisterSchema;
