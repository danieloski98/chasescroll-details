import * as yup from 'yup';

export const agentOnboardingSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Company email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  profilePicture: yup.mixed().nullable(),
});

export type OnboardingFormData = yup.InferType<typeof  agentOnboardingSchema>;
