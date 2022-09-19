import * as yup from 'yup';

const adminUpdateSchema = yup.object({
  id: yup.string(),
  full_name: yup.string(),
  // email: yup.string('Enter your email').email('Enter a valid email').nullable(),
  email: yup.string('Enter your wallet').nullable(),
  // password: yup
  //     .string('Enter your password')
  //     .min(8, 'Password should be of minimum 8 characters length')
  //     .required('Password is required'),
  // repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  // level: yup.string('Select level').required('Level is required'),
  image: yup.mixed(),
  description: yup.string().max(1024, 'Description has a maximum limit of 1024 characters.'),
});

export default adminUpdateSchema;
