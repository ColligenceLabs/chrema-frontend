import axios from 'axios';
import authHeader from './auth-header';
import authService from './auth.service';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/admin`;

export const getAdminsData = (
  page,
  rowsPerPage,
  searchName,
  searchEmail,
  searchLevel = 'administrator',
) => {
  let url = `${API_URL}/indexs?page=${page + 1}&perPage=${rowsPerPage}`;
  url = searchName !== undefined ? `${url}&full_name=${searchName}` : url;
  url = searchEmail !== undefined ? `${url}&email=${searchEmail}` : url;
  url = searchLevel !== undefined ? `${url}&level=${searchLevel}` : url;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) =>
      error.response.status === 401 ? (window.location.href = '/') : console.log(error),
    );
};

export const updateAdminsStatus = (id, status) => {
  return axios
    .put(
      `${API_URL}/update/${id}`,
      {
        status: status,
      },
      { headers: authHeader() },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const updateMultiAdminsStatus = (id, data) => {
  return axios
    .put(`${API_URL}/update-status/${id}`, data, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const updateWallet = (id, address) => {
  return axios
    .put(
      `${API_URL}/update-mine/${id}`,
      {
        admin_address: address,
      },
      { headers: authHeader() },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
  // .catch((error) => console.log(error))
};

const adminsService = {
  getAdminsData,
  updateAdminsStatus,
  updateMultiAdminsStatus,
  updateWallet,
};

export default adminsService;
