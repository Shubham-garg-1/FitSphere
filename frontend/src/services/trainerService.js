import api from '../api/axiosConfig';

export const trainerService = {
  getProfile: async () => {
    const response = await api.get('/trainers/profile');
    return response.data;
  },

  getAssignedClients: async () => {
    const response = await api.get('/trainers/my-clients');
    return response.data;
  },

  getWorkouts: async () => {
    const response = await api.get('/trainers/my-workouts');
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
  },

  assignWorkoutToClient: async (clientId, workoutId) => {
    const response = await api.put(`/users/${clientId}/assign-workout/${workoutId}`);
    return response.data;
  },

  removeWorkoutFromClient: async (clientId, workoutId) => {
    const response = await api.put(`/users/${clientId}/remove-workout/${workoutId}`);
    return response.data;
  }
};
