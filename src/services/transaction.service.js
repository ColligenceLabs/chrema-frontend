import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/transaction`;

export const getTransactionData = (page, rowsPerPage) => {
  let url = `${API_URL}/indexs?page=${page + 1}&perPage=${rowsPerPage}`;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) =>
      error.response.status === 401 ? (window.location.href = '/') : console.log(error),
    );
};

const transactionService = {
  getTransactionData,
};

export default transactionService;
