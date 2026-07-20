import api from '../api/axiosConfig';

export const adminService = {
  getAllClients: async () => {
    const response = await api.get('/admin/clients');
    return response.data;
  },
  
  getAllTrainers: async () => {
    const response = await api.get('/admin/trainers');
    return response.data;
  },
  
  assignTrainer: async (clientId, trainerId) => {
    const response = await api.put(`/admin/assign-trainer?clientId=${clientId}&trainerId=${trainerId || ''}`);
    return response.data;
  },
  
  createTrainer: async (trainerData) => {
    const response = await api.post('/trainers', trainerData);
    return response.data;
  },
  
  updateTrainer: async (id, trainerData) => {
    const response = await api.put(`/trainers/${id}`, trainerData);
    return response.data;
  },
  
  deleteTrainer: async (id) => {
    await api.delete(`/trainers/${id}`);
  },
  
  getAllWorkouts: async () => {
    const response = await api.get('/workouts');
    return response.data;
  },
  
  createWorkout: async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },
  
  updateWorkout: async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
  },
  
  deleteWorkout: async (id) => {
    await api.delete(`/workouts/${id}`);
  }
};
