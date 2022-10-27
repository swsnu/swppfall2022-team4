import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BsCheck2Circle, BsCircle } from 'react-icons/bs';

type stateType = {
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  gender: string;
  height: string;
  weight: string;
  age: string;

  usernameWarning: {
    content: string;
    color: string;
  };
  passwordWarning: {
    content: string;
    color: string;
  };
  passwordConfirmWarning: {
    content: string;
    color: string;
  };
  nicknameWarning: {
    content: string;
    color: string;
  };
  bodyWarning: {
    content: string;
    color: string;
  };
};
const initialState: stateType = {
  username: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
  gender: '',
  height: '',
  weight: '',
  age: '',

  usernameWarning: {
    content: '* 8 ~ 16자 영문, 숫자',
    color: '#686868',
  },
  passwordWarning: {
    content: '* 8 ~ 16자 영문, 숫자, 기호',
    color: '#686868',
  },
  passwordConfirmWarning: {
    content: '',
    color: '#686868',
  },
  nicknameWarning: {
    content: '* 2자 이상 8자 이하',
    color: '#686868',
  },
  bodyWarning: {
    content: '',
    color: '#686868',
  },
};
const reducer = (state: stateType, action: { name: string; value: string }) => {
  const actionName: string = action.name;
  let newValue: string = action.value;
  const newWarning = {
    content: '',
    color: '',
  };

  switch (actionName) {
    case 'username': {
      const regex = /[^a-zA-Z0-9]/g;
      if (regex.test(newValue)) {
        newWarning.content = '* 영어와 숫자만 입력할 수 있습니다.';
        newValue = newValue.replace(regex, '');
      } else {
        newWarning.content = '* 8 ~ 16자 영문, 숫자';
      }

      newValue = newValue.substring(0, 16);
      if (newValue.length >= 8 && newValue.length <= 16) {
        newWarning.color = '#009112';
      } else if (newValue.length === 0) {
        newWarning.color = '#686868';
      } else {
        newWarning.color = '#ff3939';
      }

      return {
        ...state,
        [actionName]: newValue,
        [actionName + 'Warning']: newWarning,
      };
    }
    case 'password': {
      const regex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
      if (regex.test(newValue)) {
        newWarning.content = '* 한글을 입력할 수 없습니다.';
        newValue = newValue.replace(regex, '');
      } else {
        newWarning.content = '* 8 ~ 16자 영문 + 숫자 + 기호';
      }

      newValue = newValue.substring(0, 16);
      if (newValue.length >= 8 && newValue.length <= 16) {
        newWarning.color = '#009112';
      } else if (newValue.length === 0) {
        newWarning.color = '#686868';
      } else {
        newWarning.color = '#ff3939';
      }

      if (newValue === state.passwordConfirm && state.passwordConfirm.length > 0) {
        return {
          ...state,
          [actionName]: newValue,
          [actionName + 'Warning']: newWarning,
          passwordConfirmWarning: {
            content: '* 비밀번호가 일치합니다.',
            color: '#009112',
          },
        };
      } else if (state.passwordConfirm.length > 0) {
        return {
          ...state,
          [actionName]: newValue,
          [actionName + 'Warning']: newWarning,
          passwordConfirmWarning: {
            content: '* 비밀번호가 일치하지 않습니다.',
            color: '#ff3939',
          },
        };
      } else {
        return {
          ...state,
          [actionName]: newValue,
          [actionName + 'Warning']: newWarning,
        };
      }
    }
    case 'passwordConfirm': {
      const passwordPattern = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
      newValue = newValue.replace(passwordPattern, '');

      newValue = newValue.substring(0, 16);
      if (newValue.length === 0) {
        newWarning.content = '';
        newWarning.color = '#686868';
      } else if (newValue === state.password) {
        newWarning.content = '* 비밀번호가 일치합니다.';
        newWarning.color = '#009112';
      } else {
        newWarning.content = '* 비밀번호가 일치하지 않습니다.';
        newWarning.color = '#ff3939';
      }

      return {
        ...state,
        [actionName]: newValue,
        [actionName + 'Warning']: newWarning,
      };
    }
    case 'nickname': {
      newWarning.content = '* 2자 이상 8자 이하';

      newValue = newValue.substring(0, 8);
      if (newValue.length >= 2 && newValue.length <= 8) {
        newWarning.color = '#009112';
      } else if (newValue.length === 0) {
        newWarning.color = '#686868';
      } else {
        newWarning.color = '#ff3939';
      }

      return {
        ...state,
        [actionName]: newValue,
        [actionName + 'Warning']: newWarning,
      };
    }
    case 'gender': {
      return {
        ...state,
        [actionName]: newValue,
      };
    }
    case 'height': {
      newValue = newValue.substring(0, 5);

      const exceptNum = /[^0-9.]/g;
      newValue = newValue.replace(exceptNum, '');

      const regex = /^([0-9]{1,3})([.][0-9])?$/;
      if (!regex.test(newValue)) {
        newWarning.content = '* 키는 정수 또는 소수점 첫째 자리까지여야 합니다.';
        newWarning.color = '#ff3939';
      } else {
        newWarning.content = '';
      }

      return {
        ...state,
        [actionName]: newValue,
        bodyWarning: newWarning,
      };
    }
    case 'weight': {
      newValue = newValue.substring(0, 5);

      const exceptNum = /[^0-9.]/g;
      newValue = newValue.replace(exceptNum, '');

      const regex = /^([0-9]{1,3})([.][0-9])?$/;
      if (!regex.test(newValue)) {
        newWarning.content = '* 몸무게는 정수 또는 소수점 첫째 자리까지여야 합니다.';
        newWarning.color = '#ff3939';
      } else {
        newWarning.content = '';
      }

      return {
        ...state,
        [actionName]: newValue,
        bodyWarning: newWarning,
      };
    }
    case 'age': {
      newValue = newValue.substring(0, 2);

      const exceptNum = /[^0-9]/g;
      newValue = newValue.replace(exceptNum, '');

      const regex = /^[0-9]{1,3}$/;
      if (!regex.test(newValue)) {
        newWarning.content = '* 나이는 정수여야 합니다.';
        newWarning.color = '#ff3939';
      } else {
        newWarning.content = '';
      }

      return {
        ...state,
        [actionName]: newValue,
        bodyWarning: newWarning,
      };
    }
    default:
      return state;
  }
};

const Signup = () => {
  const [state, stateDispatch] = useReducer(reducer, initialState);

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

    alert(JSON.stringify(request));
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
