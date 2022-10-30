import { useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsCheck2Circle, BsCircle } from 'react-icons/bs';
import styled from 'styled-components';
import { userActions } from 'store/slices/user';
import { RootState } from 'index';
import { signupInitialState, signupReducer } from 'utils/userData';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [state, stateDispatch] = useReducer(signupReducer, signupInitialState);
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
    }

    const height = parseFloat(state.height);
    const weight = parseFloat(state.weight);
    const age = parseFloat(state.age);

    if (!height || height < 80.0 || height > 300.0) {
      alert('올바른 키를 입력해 주세요.');
      return;
    } else if (!weight || weight < 20.0 || weight > 300.0) {
      alert('올바른 몸무게를 입력해 주세요.');
      return;
    } else if (!age || age < 3) {
      alert('올바른 나이를 입력해 주세요.');
      return;
    }

    const request = {
      username: state.username,
      password: state.password,
      nickname: state.nickname,
      gender: state.gender,
      height: height,
      weight: weight,
      age: age,
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
          <NormalInput type="text" placeholder="ID" name="username" value={state.username} onChange={onChange} />
          <Warning color={state.usernameWarning.color}>{state.usernameWarning.content}</Warning>
        </InputItem>

        <InputItem>
          <NormalInput
            type="password"
            placeholder="Password"
            name="password"
            value={state.password}
            onChange={onChange}
          />
          <Warning color={state.passwordWarning.color}>{state.passwordWarning.content}</Warning>
        </InputItem>

        <InputItem>
          <NormalInput
            type="password"
            placeholder="Password"
            name="passwordConfirm"
            value={state.passwordConfirm}
            onChange={onChange}
          />
          <Warning color={state.passwordConfirmWarning.color}>{state.passwordConfirmWarning.content}</Warning>
        </InputItem>

        <InputItem>
          <SmallInputWrapper>
            <NicknameInput
              type="text"
              placeholder="Nickname"
              name="nickname"
              value={state.nickname}
              onChange={onChange}
            />
            <GenderWrapper>
              <GenderText>Gender</GenderText>
              <CheckboxWrapper>
                <div>Male</div>
                {state.gender === 'male' ? (
                  <BsCheck2Circle style={{ marginRight: '6px' }} />
                ) : (
                  <BsCircle
                    style={{ marginRight: '6px' }}
                    onClick={() => stateDispatch({ name: 'gender', value: 'male' })}
                  />
                )}
                <div>Female</div>
                {state.gender === 'female' ? (
                  <BsCheck2Circle />
                ) : (
                  <BsCircle onClick={() => stateDispatch({ name: 'gender', value: 'female' })} />
                )}
              </CheckboxWrapper>
            </GenderWrapper>
          </SmallInputWrapper>
          <Warning color={state.nicknameWarning.color}>{state.nicknameWarning.content}</Warning>
        </InputItem>

        <InputItem>
          <SmallInputWrapper>
            <HeightInput type="text" placeholder="Height" name="height" value={state.height} onChange={onChange} />
            <HeightInput type="text" placeholder="Weight" name="weight" value={state.weight} onChange={onChange} />
            <AgeText>Age</AgeText>
            <AgeInput type="text" placeholder="Age" name="age" value={state.age} onChange={onChange} />
          </SmallInputWrapper>
          <Warning color={state.bodyWarning.color}>{state.bodyWarning.content}</Warning>
        </InputItem>
      </InputWrapper>

      <SignupButton onClick={onSignup}>Sign up</SignupButton>
      <LoginButton to="/login">Back to Login</LoginButton>
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

const NormalInput = styled.input`
  width: 100%;
  height: 48px;
  border: 2px solid #565656;
  padding: 0px 8px;
  font-size: 18px;
`;
const SmallInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const NicknameInput = styled(NormalInput)`
  width: 180px;
`;
const HeightInput = styled(NormalInput)`
  width: 100px;
`;
const AgeText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin: 0 -2px 0 2px;
`;
const AgeInput = styled(NormalInput)`
  width: 60px;
`;
const GenderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: IBMPlexSansThaiLooped;
`;
const GenderText = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;
const CheckboxWrapper = styled.div`
  display: flex;
  div {
    margin-right: 2px;
  }
`;

const SignupButton = styled.button`
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
const LoginButton = styled(Link)`
  color: #606060;
  font-family: IBMPlexSansThaiLooped;
  font-size: 21px;
  letter-spacing: -0.5px;
  transition: color 0.15s linear;
  &:hover {
    color: #000000;
  }
`;
