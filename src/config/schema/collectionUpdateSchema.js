import * as yup from 'yup';

const collectionUpdateSchema = yup.object({
  category: yup
    .array('Select category')
    .nullable()
    .label('Category')
    .min(1)
    .of(yup.string())
    .required('Category is required'),
  image: yup.mixed(),
  description: yup
    .string('Enter your Description')
    .required('Description is required')
    .max(1024, 'Description has a maximum limit of 1024 characters.'),
});

export default collectionUpdateSchema;
