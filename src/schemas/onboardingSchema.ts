import * as yup from 'yup';

export const onboardingSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  companyEmail: yup.string().email('Invalid email').required('Company email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  position: yup.string().required('Position is required'),
  dateOfBirth: yup.date().nullable(),
  address: yup.string(),
  bio: yup.string(),
  profilePhoto: yup.mixed().nullable(),
});

export type OnboardingFormData = yup.InferType<typeof onboardingSchema>;
