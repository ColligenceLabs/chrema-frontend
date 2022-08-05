import { getAllCreatorData } from '../services/creator.service';
import { useEffect, useState } from 'react';
import useUserInfo from './useUserInfo';
import useSWR from 'swr';

const API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/admin/indexs?level=creator`;

function useCreator() {
  const [creatorList, setCreatorList] = useState();

  const { data } = useSWR(API_URL, getAllCreatorData);
  const { level, id } = useUserInfo();

  useEffect(() => {
    if (data && data.status === 1) {
      let creatorArray = [];
      if (level.toLowerCase() === 'creator') {
        creatorArray = data.data.items.filter(
          (item) => item._id === id && { _id: item._id, full_name: item.full_name },
        );
      } else {
        creatorArray = data.data.items
          .filter((item) => item.status === 'active')
          .map((item) => ({
            _id: item._id,
            full_name: item.full_name,
          }));
      }
      setCreatorList(creatorArray);
    }
  }, [data]);

  return creatorList;
}

export default useCreator;
