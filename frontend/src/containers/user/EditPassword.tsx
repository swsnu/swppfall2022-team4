import { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { userReducer, userInitialState } from 'utils/userData';

import Loading from 'components/common/Loading';
import Input1 from 'components/common/inputs/Input1';
import Button1 from 'components/common/buttons/Button1';
import Button4 from 'components/common/buttons/Button4';
import Passwords from 'components/user/Passwords';

const EditPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState('');
  const [state, stateDispatch] = useReducer(userReducer, userInitialState);
  const { user, loading, editProfile } = useSelector(({ user }: RootState) => ({
    user: user.user,
    loading: user.loading,
    editProfile: user.editProfile,
  }));

  useEffect(() => {
    return () => {
      dispatch(userActions.resetProfile());
    };
  }, []);
  useEffect(() => {
    if (editProfile) {
      navigate(`/profile/${user?.username}`);
    }
  }, [navigate, editProfile]);

  const onConfirm = () => {
    if (!user) {
      return;
    } else if (oldPassword === '') {
      alert('현재 비밀번호를 확인해 주세요.');
      return;
    } else if (state.passwordWarning.color !== '#009112' || state.passwordConfirmWarning.color !== '#009112') {
      alert('새로운 비밀번호를 확인해 주세요.');
      return;
    }

    const request = {
      oldPassword: oldPassword,
      newPassword: state.password,
    };

    dispatch(userActions.editProfile({ username: user.username, data: request }));
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stateDispatch({ name: e.target.name, value: e.target.value });
  };

  if (!user) return <div>no user</div>;
  if (loading) return <Loading />;
  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="Back" clicked={() => navigate(`/profile/${user.username}`)} />
        <Title>비밀번호 변경</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>

      <InputWrapper>
        <InputText>현재 비밀번호</InputText>
        <Input1
          type="password"
          placeholder=""
          name="oldPassword"
          value={oldPassword}
          changed={e => setOldPassword(e.target.value)}
          style={{ width: '100%' }}
        />

        <InputText style={{ margin: '20px 0 2px 0' }}>새로운 비밀번호</InputText>
        <Passwords
          password={state.password}
          passwordConfirm={state.passwordConfirm}
          passwordWarning={state.passwordWarning}
          passwordConfirmWarning={state.passwordConfirmWarning}
          changed={onChange}
        />
      </InputWrapper>

      <Button1 content="Update" clicked={onConfirm} style={{ marginTop: '-10px' }} />
    </Wrapper>
  );
};

export default EditPassword;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fafafa;
  padding-bottom: 40px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  padding: 0 20px;

  @media all and (max-width: 620px) {
    margin: 40px 0 20px 0;
  }
`;
const Title = styled.div`
  margin-top: 20px;
  font-size: 45px;
  font-family: NanumSquareR;

  @media all and (max-width: 620px) {
    display: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px 0 35px 0;
  width: 320px;
`;
const InputText = styled.div`
  font-size: 20px;
  font-family: NanumSquareR;
  margin-bottom: 5px;
`;
