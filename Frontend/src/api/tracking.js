import axiosClient from './axiosClient';

export const getMyExams = async () => {
  const res = await axiosClient.get('/api/my-exams/');
  return res.data;
};

export const addTrackedExam = async (examId) => {
  const res = await axiosClient.post('/api/my-exams/', { exam: examId });
  return res.data;
};

export const updateTrackedExamStatus = async (id, status) => {
  const res = await axiosClient.patch(`/api/my-exams/${id}/`, { status });
  return res.data;
};

export const getReminderPreferences = async () => {
  const res = await axiosClient.get('/api/reminders/');
  return res.data;
};

export const updateReminderPreferences = async (prefs) => {
  const res = await axiosClient.put('/api/reminders/', prefs);
  return res.data;
};