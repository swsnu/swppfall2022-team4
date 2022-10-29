import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { userActions } from 'store/slices/user';
import { RootState } from 'index';

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
  const backgroundElement = useRef<HTMLImageElement>(null);
  const { user } = useSelector(({ user }: RootState) => ({
    user: user.user,
  }));

  let timer: NodeJS.Timeout | null = null;
  const changeBackground = () => {
    if (timer === null) {
      timer = setInterval(() => {
        setBackgroundNum(backgroundNum => (backgroundNum + 1) % BACKGROUND_LIST.length);
        backgroundElement.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
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
  }, [changeBackground, timer]);
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
  const onSocialLogin = (type: string) => {
    alert(type + ' 소셜 로그인');
  };

  return (
    <Wrapper>
      <BackgroundImage ref={backgroundElement} src={BACKGROUND_LIST[backgroundNum]} alt="background" />
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
          <LoginInput type="text" placeholder="ID" name="username" value={input.username} onChange={e => onChange(e)} />
          <LoginInput
            type="password"
            placeholder="Password"
            name="password"
            value={input.password}
            onChange={e => onChange(e)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                onLogin();
              }
            }}
          />
          <LoginButton onClick={onLogin}>Login</LoginButton>
          <SignupButton to="/signup">Create New Account</SignupButton>
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
`;
const LoginInput = styled.input`
  width: 300px;
  height: 48px;
  border: 2px solid #565656;
  margin: 10px 0;
  padding: 0px 8px;
  font-size: 18px;
`;
const LoginButton = styled.button`
  width: 120px;
  height: 45px;
  background-color: #349c66;
  color: white;
  border: 0;
  border-radius: 5px;
  margin: 20px 0;
  font-family: FugazOne;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }
`;
const SignupButton = styled(Link)`
  color: #606060;
  font-family: IBMPlexSansThaiLooped;
  font-size: 21px;
  letter-spacing: -0.5px;
  transition: color 0.15s linear;
  &:hover {
    color: #000000;
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
