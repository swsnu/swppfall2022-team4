import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { userReducer, userInitialState, checkBody } from 'utils/userData';

import Input1 from 'components/common/inputs/Input1';
import Button1 from 'components/common/buttons/Button1';
import Button2 from 'components/common/buttons/Button2';
import Passwords from 'components/user/Passwords';
import OtherInfos from 'components/user/OtherInfos';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, stateDispatch] = useReducer(userReducer, userInitialState);
  const { user } = useSelector(({ user }: RootState) => ({
    user: user.user,
  }));

  useEffect(() => {
    if (user) {
      navigate('/');
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [navigate, user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stateDispatch({ name: e.target.name, value: e.target.value });
  };
  const onSignup = () => {
    if (state.usernameWarning.color !== '#009112') {
      alert('유저네임을 확인해 주세요.');
      return;
    } else if (state.passwordWarning.color !== '#009112' || state.passwordConfirmWarning.color !== '#009112') {
      alert('비밀번호를 확인해 주세요.');
      return;
    } else if (state.nicknameWarning.color !== '#009112') {
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
      password: state.password,
      nickname: state.nickname,
      gender: state.gender,
      height: parseFloat(state.height),
      weight: parseFloat(state.weight),
      age: parseFloat(state.age),
    };

    dispatch(userActions.signup(request));
  };

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
            changed={onChange}
            style={{ width: '100%' }}
          />
          <Warning color={state.usernameWarning.color}>{state.usernameWarning.content}</Warning>
        </InputItem>
        <Passwords
          password={state.password}
          passwordConfirm={state.passwordConfirm}
          passwordWarning={state.passwordWarning}
          passwordConfirmWarning={state.passwordConfirmWarning}
          changed={onChange}
        />
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
};

export default Signup;

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
const Warning = styled.div<{ color: string }>`
  font-size: 15px;
  font-family: 'Noto Sans KR', sans-serif;
  letter-spacing: -1px;
  margin-top: 2px;
  color: ${props => props.color};
`;
