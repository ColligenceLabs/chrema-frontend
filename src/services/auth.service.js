import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/admin/`;

export const register = (formData) => {
  return axios
    .post(API_URL + 'register', formData)

    .catch((error) => (error.response.status === 401 ? logout() : console.log(error)));
};

export const updater = (formData, id) => {
  return axios
    .put(API_URL + 'update/' + id, formData, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? logout() : console.log(error)));
};

const login = (email, password) => {
  return axios
    .post(API_URL + 'login', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.status === 1) {
        localStorage.setItem('user', JSON.stringify(response.data.data || null));
      }
      return response.data;
    })

    .catch((error) => (error.response.status === 401 ? logout() : console.log(error)));
};

export const changePassword = (id, old_password, password) => {
  return axios
    .put(
      `${API_URL}password/${id}`,
      {
        old_password,
        password,
      },
      { headers: authHeader() },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

// Todo logout
const logout = () => {
  // localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
  changePassword,
};

export default authService;
