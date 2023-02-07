import axios from 'axios';
import authHeader from './auth-header';
import authService from './auth.service';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/user`;

export const getUserData = (page, rowsPerPage, searchKeyword, userStatus) => {
  let url = `${API_URL}/indexs?page=${page + 1}&perPage=${rowsPerPage}`;
  url = searchKeyword !== undefined ? `${url}&keyword=${searchKeyword}` : url;
  url = userStatus !== undefined ? `${url}&status=${userStatus}` : url;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) =>
      error.response.status === 401 ? (window.location.href = '/') : console.log(error),
    );
};

export const deleteUser = (ids) => {
  if (ids.length === 1) {
    return axios
      .delete(`${API_URL}/delete/${ids.toString()}`, { headers: authHeader() })
      .catch((error) =>
        error.response.status === 401 ? authService.logout() : console.log(error),
      );
  } else {
    return axios
      .put(
        `${API_URL}/delete-many`,
        {
          nft_ids: ids,
        },
        { headers: authHeader() },
      )
      .catch((error) =>
        error.response.status === 401 ? authService.logout() : console.log(error),
      );
  }
};

const userService = {
  getUserData,
  deleteUser,
};

export default userService;
