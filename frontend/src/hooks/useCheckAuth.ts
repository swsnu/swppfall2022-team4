import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from 'index';

const useCheckAuth = () => {
  const navigate = useNavigate();
  const user = useSelector(({ user }: RootState) => user.user);
  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);
};

export default useCheckAuth;
