import api from '../api/axiosConfig';

export const clientService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  }
};
