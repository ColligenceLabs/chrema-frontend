import axios from 'axios';
import authHeader from './auth-header';
import authService from './auth.service';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/collection`;

export const getCollectionData = (page, rowsPerPage, id, searchKeyword, searchStatus) => {
  let url = `${API_URL}/indexs?page=${page + 1}&perPage=${rowsPerPage}`;
  url = id !== undefined ? `${url}&creator_id=${id}` : url;
  url = searchKeyword !== undefined ? `${url}&keyword=${searchKeyword}` : url;
  url = searchStatus !== undefined ? `${url}&status=${searchStatus}` : url;

  // const pageQuery = page === undefined ? '' : `?page=${page + 1}&perPage=${rowsPerPage}`;
  // const subQuery = id === undefined ? '' : `&creator_id=${id}`;

  return (
    axios
      // .get(`${API_URL}/indexs${pageQuery}${subQuery}`, { headers: authHeader() })
      .get(url, { headers: authHeader() })
      .then((response) => {
        return response.data;
      })
      .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)))
  );
};

export const getCollectionById = (id) => {
  let url = `${API_URL}/detail/${id}`;
  return (
    axios
      // .get(`${API_URL}/indexs${pageQuery}${subQuery}`, { headers: authHeader() })
      .get(url)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)))
  );
};

export const getDetailCollection = () => {
  return axios
    .get(`${API_URL}/detail/id`, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })

    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const createCollection = (formData) => {
  return axios.post(`${API_URL}/create`, formData, { headers: authHeader() });
};

export const updateCollection = (id, formData) => {
  return axios
    .put(`${API_URL}/update/${id}`, formData, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const getCollectionsByCreatorId = (id) => {
  return axios
    .get(`${API_URL}/creator/${id}`, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const deleteCollections = (data) => {
  return axios
    .put(`${API_URL}/deletes`, data, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

const collectionsService = {
  getDetailCollection,
  createCollection,
  getCollectionData,
  getCollectionsByCreatorId,
  deleteCollections,
  getCollectionById,
  updateCollection,
};

export default collectionsService;
