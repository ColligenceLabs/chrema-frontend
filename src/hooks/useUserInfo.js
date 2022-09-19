import React, { useEffect, useState } from 'react';

const useUserInfo = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (user && user.user) setUser(user.user);
  }, [user]);

  if (user) {
    return {
      id: user.infor.id,
      full_name: user.infor.full_name,
      level: user.infor.level,
      email: user.infor.email,
      image: user.infor.image,
      description: user.infor.description,
      banner: user.infor.banner,
    };
  } else {
    return {
      id: null,
      full_name: null,
      level: null,
      email: null,
      image: null,
      description: null,
      banner: null,
    };
  }
};

export default useUserInfo;
