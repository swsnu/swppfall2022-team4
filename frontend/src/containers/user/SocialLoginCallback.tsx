import Loading from 'components/common/Loading';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import client from 'store/apis/client';
import { userActions } from 'store/slices/user';

export const KAKAO_REDIRECT_URI = 'http://localhost:3000/oauth/kakao/';

const SocialLoginCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const KAKAO_CODE = location.search.split('=')[1];

  useEffect(() => {
    const func = async () => {
      const response = await client.get(`/api/user/login/kakao/callback/?code=${KAKAO_CODE}`);
      console.log(response);
      try {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch(userActions.setUser(response.data));
        dispatch(userActions.check());
      } catch (e) {
        console.log('localStorage is not working');
      }
      if (response.status === 200) navigate(`/`);
    };
    func();
  }, []);

  return <Loading />;
};

export default SocialLoginCallback;
