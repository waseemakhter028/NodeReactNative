import * as yup from 'yup';

const validSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Please Enter Your Email Id')
    .email('Please Enter Valid Email Id')
    .max(50, 'Email Id cannot be exceeds 50 characters'),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('login.error.email_invalid')
    .required('login.error.email')
    .max(50, 'login.error.email_max'),
  password: yup
    .string()
    .min(8, 'login.error.password_min')
    .required('login.error.password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/,
      'login.error.password_match',
    )
    .max(50, 'login.error.password_max'),
});

const resendSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Please Enter Your Email Id')
    .email('Please Enter Valid Email Id')
    .max(50, 'Email Id cannot be exceeds 50 characters'),
});

const signUpSchema = yup.object().shape({
  email: yup
    .string()
    .email('signup.error.email_invalid')
    .required('signup.error.email')
    .max(50, 'signup.error.email_max'),
  password: yup
    .string()
    .min(8, 'signup.error.password_min')
    .required('signup.error.password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/,
      'signup.error.password_match',
    )
    .max(50, 'signup.error.password_max'),
  name: yup
    .string()
    .trim()
    .required('signup.error.name')
    .min(2, 'signup.error.name_min')
    .max(40, 'signup.error.name_max')
    .matches(/^[a-zA-Z ]*$/, 'signup.error.name_match'),
});

const verifySchema = yup.object().shape({
  otp: yup
    .array()
    .of(yup.string().matches(/^[0-9]$/, 'Only Numbers are allowed'))
    .min(6, 'OTP should be 6 digits')
    .max(6, 'OTP cannot be exceeds 6 digits'),
});

const forgotSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email('forgot.error.email_invalid')
    .required('forgot.error.email')
    .max(50, 'forgot.error.email_max'),
});

const addressSchema = yup.object().shape({
  address_type: yup
    .string()
    .trim()
    .required('Please enter address type')
    .max(20, 'Address type cannot be exceeds 20 characters'),

  street: yup
    .string()
    .trim()
    .required('Please enter street')
    .max(20, 'Street cannot be exceeds 20 characters'),

  address: yup
    .string()
    .trim()
    .required('Please enter address')
    .max(50, 'Address cannot be exceeds 50 characters'),

  landmark: yup
    .string()
    .trim()
    .required('Please enter landmark')
    .max(40, 'Landmark cannot be exceeds 40 characters'),

  city: yup
    .string()
    .trim()
    .required('Please enter city name')
    .max(20, 'City name cannot be exceeds 20 characters'),

  state: yup
    .string()
    .trim()
    .required('Please enter state name')
    .max(20, 'State cannot be exceeds 20 characters'),

  zipcode: yup
    .string()
    .trim()
    .required('Please Enter zipcode')
    .min(6, 'Zipcode must be 6 digits')
    .max(6, 'Zipcode must be 6 digits')
    .matches(/^[0-9]*$/, 'Only Numbers are allowed'),
});

const contactSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Please Enter Your Email Id')
    .email('Please Enter Valid Email Id')
    .max(50, 'Email Id cannot be exceeds 50 characters'),

  message: yup
    .string()
    .trim()
    .required('Please Enter Your Message')
    .max(500, 'Message cannot be exceeds 500 characters'),

  phone: yup
    .string()
    .trim()
    .required('Please Enter Your Phone Number')
    .min(10, 'Phone Number must be 10 digits')
    .max(10, 'Phone Number must be 10 digits')
    .matches(/^[7896]\d{9}$/, 'Only Numbers are allowed'),
  name: yup
    .string()
    .trim()
    .required('Please Enter Name')
    .min(2, 'Name atleast 2 chars long')
    .max(40, 'Name cannot exceeds 40 chars')
    .matches(/^[a-zA-Z ]*$/, 'Only chars and space are allowed'),
});

const profilePaswordSchema = yup.object().shape({
  current_password: yup
    .string()
    .min(8, 'Minimum 8 chars long')
    .required('Please enter your current password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
    )
    .max(50, 'Current password cannot be exceeds 50 characters'),
  new_password: yup
    .string()
    .min(8, 'Minimum 8 chars long')
    .required('Please enter new password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
    )
    .max(50, 'New password cannot be exceeds 50 characters'),
  confirm_password: yup
    .string()
    .min(8, 'Minimum 8 chars long')
    .required('Please enter confirm password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\D)(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Must contain minimum 8 characters, at least one upper case letter, one number and one special character',
    )
    .max(50, 'Confirm password cannot be exceeds 50 characters')
    .oneOf([yup.ref('new_password')], 'Your passwords do not match'),
});

export default validSchema;

export {
  loginSchema,
  contactSchema,
  resendSchema,
  signUpSchema,
  verifySchema,
  forgotSchema,
  addressSchema,
  profilePaswordSchema,
};
