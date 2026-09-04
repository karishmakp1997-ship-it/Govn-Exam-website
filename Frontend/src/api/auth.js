import axiosClient from './axiosClient';

export const requestSignupOtp = (form) =>
  axiosClient.post('/api/auth/signup/request-otp/', form).then((res) => res.data);

export const verifySignupOtp = ({ mobile_number, otp }) =>
  axiosClient.post('/api/auth/signup/verify-otp/', { mobile_number, otp }).then((res) => res.data);

export const login = async (credentials) => {
  const res = await axiosClient.post('/api/auth/login/', credentials);
  return res.data;
};