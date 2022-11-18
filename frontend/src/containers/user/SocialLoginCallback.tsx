import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import client from 'store/apis/client';
import { userActions } from 'store/slices/user';
import { checkBody, socialUserInitialState, socialUserReducer } from 'utils/userData';
import Loading from 'components/common/Loading';
import Input1 from 'components/common/inputs/Input1';
import Button1 from 'components/common/buttons/Button1';
import Button2 from 'components/common/buttons/Button2';
import OtherInfos from 'components/user/OtherInfos';

import { RootState } from 'index';
import { notificationFailure } from 'utils/sendNotification';
import { AxiosError } from 'axios';

export const KAKAO_REDIRECT_URI = 'http://localhost:3000/oauth/kakao/';

type errorIProps = {
  error: string;
};

const SocialLoginCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const KAKAO_CODE = location.search.split('=')[1];

  const [isLoading, setIsLoading] = useState(true);
  const [state, stateDispatch] = useReducer(socialUserReducer, socialUserInitialState);
  const { user } = useSelector(({ user }: RootState) => ({
    user: user.user,
  }));

  useEffect(() => {
    if (user) {
      navigate('/');
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    } else {
      const func = async () => {
        try {
          const kakao_response = await client.get(
            `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.REACT_APP_KAKAO_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${KAKAO_CODE}`,
            { headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' } },
          );
          const response = await client.get(`/api/user/login/kakao/callback/?code=${kakao_response.data.access_token}`);

          if (response.status === 200) {
            try {
              localStorage.setItem('user', JSON.stringify(response.data));
              dispatch(userActions.setUser(response.data));
              dispatch(userActions.check());
            } catch (e) {
              console.log('localStorage is not working');
            }
            navigate(`/`);
          } else if (response.status === 201) {
            stateDispatch({ name: 'username', value: response.data.username });
            stateDispatch({ name: 'nickname', value: response.data.nickname });
            stateDispatch({ name: 'image', value: response.data.image });
            setIsLoading(false);
          } else {
          }
        } catch (error) {
          const axiosError: AxiosError = error as AxiosError;
          if (axiosError.response?.status === 400) {
            notificationFailure('User', '오류가 발생했습니다. 다시 시도해주세요.');
          } else {
            notificationFailure('User', ((error as AxiosError).response?.data as errorIProps).error);
          }
          navigate('/login');
        }
      };
      func();
    }
  }, [user, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stateDispatch({ name: e.target.name, value: e.target.value });
  };
  const onSignup = () => {
    if (state.nicknameWarning.color !== '#009112') {
      alert('닉네임을 확인해 주세요.');
      return;
    } else if (state.gender === '') {
      alert('성별을 선택해 주세요.');
      return;
    } else if (!checkBody(state.height, state.weight, state.age)) {
      return;
    }

    const request = {
      username: state.username,
      nickname: state.nickname,
      gender: state.gender,
      height: parseFloat(state.height),
      weight: parseFloat(state.weight),
      age: parseFloat(state.age),
    };

    dispatch(userActions.socialSignup(request));
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <Wrapper>
        <TitleWrapper>
          <TitleText1>FIT</TitleText1>
          <TitleText2>ogether</TitleText2>
        </TitleWrapper>

        <InputWrapper>
          <InputItem>
            <Input1
              type="text"
              placeholder="ID"
              name="username"
              value={state.username}
              style={{ width: '100%' }}
              disabled={true}
            />
          </InputItem>
          <OtherInfos
            nickname={state.nickname}
            gender={state.gender}
            height={state.height}
            weight={state.weight}
            age={state.age}
            nicknameWarning={state.nicknameWarning}
            bodyWarning={state.bodyWarning}
            changed={onChange}
            stateDispatch={stateDispatch}
          />
        </InputWrapper>

        <Button1 content="Sign up" clicked={onSignup} style={{ margin: '15px 0' }} />
        <Button2 content="Back to Login" clicked={() => navigate('/login')} />
      </Wrapper>
    );
  }
};

export default SocialLoginCallback;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: end;
  margin-bottom: 40px;
  font-family: FugazOne;
  letter-spacing: -2px;
`;
const TitleText1 = styled.div`
  font-size: 70px;
  color: #1c6758;
`;
const TitleText2 = styled.div`
  font-size: 56px;
  color: #349c66;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px 0 35px 0;
  width: 320px;
`;
const InputItem = styled.div`
  width: 100%;
  height: 70px;
  margin: 3px 0;
`;
