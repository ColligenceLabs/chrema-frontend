import axios from 'axios';
import authHeader from './auth-header';
import authService from './auth.service';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/nft`;

export const getNFTData = (type, page, rowsPerPage, searchKeyword, collectionId, creator_id) => {
  let url = `${API_URL}/indexs?type=${type}&page=${page + 1}&perPage=${rowsPerPage}&onchain=true`;
  url = searchKeyword !== undefined ? `${url}&keyword=${searchKeyword}` : url;
  url = collectionId !== undefined ? `${url}&collection_id=${collectionId}` : url;
  url = creator_id !== undefined ? `${url}&creator_id=${creator_id}` : url;
  return axios
    .get(url, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response?.status === 401 ? authService.logout() : console.log(error);
    });
};

export const rentalMetadata = (request) => {
  return axios
    .post(`${API_URL}/metadata-rental`, request, { headers: authHeader() })
    .then((res) => {
      return res;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const registerNFT = (formData) => {
  return axios
    .post(`${API_URL}/create`, formData, { headers: authHeader() })
    .then((res) => {
      return res;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const registerRentalNFT = (formData) => {
  return axios
    .post(`${API_URL}/create-rental`, formData, { headers: authHeader() })
    .then((res) => {
      return res;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const registerSolanaNFT = (formData) => {
  return axios
    .post(`${API_URL}/solanacreate`, formData, { headers: authHeader() })
    .then((res) => {
      return res;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const deployNFT17 = (formData) => {
  return axios
    .post(`${API_URL}/kas/deploy17`, formData, { headers: authHeader() })
    .then((res) => {
      return res;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const deployNFT37 = (formData) => {
  return axios
    .post(`${API_URL}/kas/deploy37`, formData, { headers: authHeader() })
    .then((res) => {
      return res;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const batchRegisterNFT = (formData) => {
  return axios
    .post(`${API_URL}/batchcreate`, formData, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const kasTransferNFT = (formData) => {
  return axios
    .post(`${API_URL}/transfer`, formData, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const setNftOnchain = (id) => {
  return axios
    .put(`${API_URL}/update-onchain/${id}`, { onchain: 'true' }, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const setNftOnchains = (ids) => {
  return axios
    .put(`${API_URL}/update-onchains`, { nftIds: ids, onchain: 'true' }, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const setNftTransfered = (id, amount) => {
  return axios
    .put(`${API_URL}/update-transfered/${id}`, { transfered: amount }, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const setNftTransferData = (nft_id, to_address, amount, transactionHash) => {
  return axios
    .post(
      `${API_URL}/set-transfered`,
      { nft_id, to_address, amount, transactionHash },
      { headers: authHeader() },
    )
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const cancelCreateNft = (nftId) => {
  return axios
    .delete(`${API_URL}/cancel-create/${nftId}`, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const cancelCreateNfts = (nftIds) => {
  return axios
    .put(`${API_URL}/cancel-creates`, { nftIds }, { headers: authHeader() })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const deleteNft = (nfts) => {
  if (nfts.length === 1) {
    return axios
      .delete(`${API_URL}/delete/${nfts.toString()}`, { headers: authHeader() })
      .catch((error) =>
        error.response.status === 401 ? authService.logout() : console.log(error),
      );
  } else {
    return axios
      .put(
        `${API_URL}/delete-many`,
        {
          nft_ids: nfts,
        },
        { headers: authHeader() },
      )
      .catch((error) =>
        error.response.status === 401 ? authService.logout() : console.log(error),
      );
  }
};

export const setMintNFT37 = (nftId, amount) => {
  return axios
    .get(`${API_URL}/mint/${nftId}?amount=${amount}`, { headers: authHeader() })
    .then((res) => {
      return res;
    })
    .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const setSchedule = (id, start_date, end_date, use_kas, seller) => {
  return axios.put(
    `${API_URL}/update-schedule`,
    { id: id, start_date, end_date, use_kas, seller },
    { headers: authHeader() },
  );
  //   .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const setStopSelling = (id, use_kas, owner) => {
  return axios.put(`${API_URL}/stop-selling`, { id, use_kas, owner }, { headers: authHeader() });
  //   .catch((error) => (error.response.status === 401 ? authService.logout() : console.log(error)));
};

export const getUserNFTs = (address, size) => {
  const url = `${API_URL}/user-nfts?address=${address}&size=${size}`;
  return axios
    .get(url, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response?.status === 401 ? authService.logout() : console.log(error);
    });
};

export const sellNFTsBatch = (nft_id) => {
  const url = `${API_URL}/batch-sell?nft_id=${nft_id}`;
  return axios
    .get(url, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response?.status === 401 ? authService.logout() : console.log(error);
    });
};

export const getUserNftSerialsData = (searchNftId, owner) => {
  let url = `${API_URL}/user-serials?nft_id=${searchNftId}&owner_id=${owner}`;

  return axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      return response.data;
    })
    .catch((error) =>
      error.response.status === 401 ? (window.location.href = '/') : console.log(error),
    );
};

export const selectSerials = (nft_id, buyer, amount) => {
  const url = `${API_URL}/select-serials?nft_id=${nft_id}&buyer=${buyer}&amount=${amount}`;
  return axios
    .get(url, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response?.status === 401 ? authService.logout() : console.log(error);
    });
};

export const cancelBuy = (nft_id, tokenId, buyer) => {
  const url = `${API_URL}/cancel-buy?nft_id=${nft_id}&token_id=${tokenId}&buyer=${buyer}`;
  return axios
    .get(url, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response?.status === 401 ? authService.logout() : console.log(error);
    });
};
