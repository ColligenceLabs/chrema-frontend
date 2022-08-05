import * as yup from 'yup';

const collectionCreateSchema = yup.object({
  name: yup.string('Enter your name').required('Name is required'),
  creator_id: yup.string('Select creator').required('Creator is required'),
  category: yup
    .array('Select category')
    .nullable()
    .label('Category')
    .min(1)
    .of(yup.string())
    .required('Category is required'),
  image: yup.mixed().required('You need to provide a file'),
  description: yup
    .string('Enter your Description')
    .required('Description is required')
    .max(1024, 'Description has a maximum limit of 1024 characters.'),
  fee_percentage: yup.number().min(0, 'Must be greater than 0 percent.'),
  // fee_payout: yup.string(),
  fee_payout: yup.string().when('fee_percentage', {
    is: (value) => value > 0,
    then: yup.string().required('Payout wallet address is required'),
  }),
});

export default collectionCreateSchema;
