import * as yup from 'yup';

const nftRegisterSchema = yup.object({
  name: yup.string('Enter your name').required('Name is required'),
  creator_id: yup.string('Select creator').required('Creator is required'),
  collection: yup.string('Select collection').required('Collection is required'),
  category: yup.string('Select category').required('Category is required'),
  content: yup.mixed().required('You need to provide a file'),
  amount: yup
    .number('Enter amount')
    .required('Amount is required')
    .integer('Only positive numbers can be entered.'),
  thumbnail: yup.mixed(),
  externalURL: yup.string('Enter externalURL'),
  description: yup
    .string('Enter description')
    .required('Description is required')
    .max(1024, 'Description has a maximum limit of 1024 characters.'),
  price: yup
    .number('Enter price')
    .required('Price is required')
    .min(0.000001, 'Must be more than 0.000001'),
  quote: yup.string().required('Quote is required'),
});

export default nftRegisterSchema;
