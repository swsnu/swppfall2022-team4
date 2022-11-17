import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import styled from 'styled-components';

import Input1 from 'components/common/inputs/Input1';
import Button1 from 'components/common/buttons/Button1';
import Button2 from 'components/common/buttons/Button2';
import { KAKAO_REDIRECT_URI } from './SocialLoginCallback';

const BACKGROUND_LIST = [
  require('assets/images/main/background_image/1.jpg'),
  require('assets/images/main/background_image/2.jpg'),
  require('assets/images/main/background_image/3.jpg'),
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [backgroundNum, setBackgroundNum] = useState(0);
  const [input, setInput] = useState({ username: '', password: '' });
  const backgroundRef = useRef<HTMLImageElement>(null);
  const { user } = useSelector(({ user }: RootState) => ({
    user: user.user,
  }));

  let timer: NodeJS.Timeout | null = null;
  const changeBackground = () => {
    if (timer === null) {
      timer = setInterval(() => {
        setBackgroundNum(backgroundNum => (backgroundNum + 1) % BACKGROUND_LIST.length);
        backgroundRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 1600,
          easing: 'linear',
          fill: 'forwards',
        });
      }, 15000);
    }
  };

  useEffect(() => {
    changeBackground();
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, []);
  useEffect(() => {
    if (user) {
      navigate('/');
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [navigate, user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const onLogin = () => {
    dispatch(userActions.login(input));
  };
  const onSocialLogin = async (type: string) => {
    if (type === 'kakao') {
      const rest_api_key = process.env.REACT_APP_KAKAO_KEY;
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    } else {
      alert(type + ' 소셜 로그인');
    }
  };

  return (
    <Wrapper>
      <BackgroundImage ref={backgroundRef} src={BACKGROUND_LIST[backgroundNum]} alt="background" />
      <FakeBackgroundImage
        src={BACKGROUND_LIST[(backgroundNum + BACKGROUND_LIST.length - 1) % BACKGROUND_LIST.length]}
        alt="fake_background"
      />

      <ContentWrapper>
        <TitleWrapper>
          <TitleText1>FIT</TitleText1>
          <TitleText2>ogether</TitleText2>
        </TitleWrapper>

        <LoginWrapper>
          <Input1 type="text" placeholder="ID" name="username" value={input.username} changed={e => onChange(e)} />
          <Input1
            type="password"
            placeholder="Password"
            name="password"
            value={input.password}
            changed={e => onChange(e)}
            keyPressed={e => {
              if (e.key === 'Enter') {
                onLogin();
              }
            }}
          />
          <Button1 content="Login" clicked={onLogin} style={{ margin: '20px 0' }} />
          <Button2 content="Create New Account" clicked={() => navigate('/signup')} />
        </LoginWrapper>

        <SocialLoginWrapper>
          <SocialLoginText>Social Login</SocialLoginText>
          <SocialLoginIconWrapper>
            <SocialLoginIcon
              src={require('assets/images/main/social_login_icon/google.png')}
              alt="google"
              onClick={() => onSocialLogin('google')}
            />
            <SocialLoginIcon
              src={require('assets/images/main/social_login_icon/kakao.jpg')}
              alt="kakao"
              onClick={() => onSocialLogin('kakao')}
            />
            <SocialLoginIcon
              src={require('assets/images/main/social_login_icon/facebook.png')}
              alt="facebook"
              onClick={() => onSocialLogin('facebook')}
            />
          </SocialLoginIconWrapper>
        </SocialLoginWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;

  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;

const BackgroundImage = styled.img`
  width: 42%;
  height: clamp(max(100vh, 563px), max(100vh, 563px), max(100vh, 563px));
  object-fit: cover;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  z-index: 1;

  @media all and (max-width: 650px) {
    display: none;
  }
`;
const FakeBackgroundImage = styled(BackgroundImage)`
  position: absolute;
  z-index: 0;

  @media all and (max-width: 650px) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  width: 58%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: end;
  margin-bottom: 40px;
  font-family: FugazOne;
  letter-spacing: -2.5px;
`;
const TitleText1 = styled.div`
  font-size: 80px;
  color: #1c6758;

  @media all and (max-width: 400px) {
    font-size: 60px;
  }
`;
const TitleText2 = styled.div`
  font-size: 64px;
  color: #349c66;

  @media all and (max-width: 400px) {
    font-size: 50px;
  }
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 25px 0;
  input {
    margin: 10px 0;
  }
`;

const SocialLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 10px;
`;
const SocialLoginText = styled.div`
  font-family: IBMPlexSansThaiLooped;
  font-size: 20px;
  font-weight: 600;
`;
const SocialLoginIconWrapper = styled.div`
  display: flex;
  background-color: #f1f1f1;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  padding: 8px;
  margin-top: 8px;
`;
const SocialLoginIcon = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50px;
  margin: 0 15px;
  cursor: pointer;
  transition: box-shadow 0.25s linear;
  &:hover {
    box-shadow: 1px 1px 2px 2px #909090;
  }
`;
