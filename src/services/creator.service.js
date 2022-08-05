import axios from 'axios';
import authHeader from './auth-header';
import undefined from '@iconify-icons/carbon/undefined';
import authService from './auth.service';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/admin/indexs`;

export const getCreatorData = (page = undefined, rowsPerPage, searchName, searchStatus) => {
  let url =
    page === undefined
      ? `${API_URL}?level=creator`
      : `${API_URL}?page=${page + 1}&perPage=${rowsPerPage}&level=creator`;
  url = searchName !== undefined ? `${url}&full_name=${searchName}` : url;
  url = searchStatus !== undefined ? `${url}&status=${searchStatus}` : url;

  return axios
    .get(url, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const getAllCreatorData = (url) => {
  return axios
    .get(url, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const getCreatorDataById = (id) => {
  return axios
    .get(`${process.env.REACT_APP_API_SERVER}/admin-api/admin/detail/${id}`, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

const creatorService = {
  getCreatorData,
  getAllCreatorData,
  getCreatorDataById,
};

export default creatorService;
