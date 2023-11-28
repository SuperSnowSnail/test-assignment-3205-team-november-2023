import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().trim().email('Must be a valid email').required('Email required'),
  number: yup
    .string()
    .trim()
    .matches(/^[0-9]{6}$/, 'Must be a 6-digit number'),
});

export default schema;
