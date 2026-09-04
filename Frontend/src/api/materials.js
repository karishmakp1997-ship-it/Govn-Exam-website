import axiosClient from './axiosClient';

export const getStudyMaterials = (params = {}) =>
  axiosClient.get('/api/materials/', { params }).then((res) => res.data);