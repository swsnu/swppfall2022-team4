import { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import client from 'store/apis/client';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { userReducer, userInitialState, checkBody } from 'utils/userData';

import Loading from 'components/common/Loading';
import Button1 from 'components/common/buttons/Button1';
import Button3 from 'components/common/buttons/Button3';
import Button4 from 'components/common/buttons/Button4';
import OtherInfos from 'components/user/OtherInfos';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [image, setImage] = useState('profile_default.png');
  const [state, stateDispatch] = useReducer(userReducer, userInitialState);
  const { user, profile, loading, editProfile, deleteProfile } = useSelector(({ user }: RootState) => ({
    user: user.user,
    profile: user.profile,
    loading: user.loading,
    editProfile: user.editProfile,
    deleteProfile: user.deleteProfile,
  }));

  useEffect(() => {
    if (user) dispatch(userActions.getProfile(user.username));
    return () => {
      dispatch(userActions.resetProfile());
    };
  }, []);
  useEffect(() => {
    if (profile) {
      setImage(profile.image);
      stateDispatch({ name: 'nickname', value: profile.nickname });
      stateDispatch({ name: 'gender', value: profile.gender });
      stateDispatch({ name: 'height', value: profile.height.toString() });
      stateDispatch({ name: 'weight', value: profile.weight.toString() });
      stateDispatch({ name: 'age', value: profile.age.toString() });
    }
  }, [profile]);
  useEffect(() => {
    if (editProfile) {
      navigate(`/profile/${user?.username}`);
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [navigate, editProfile]);
  useEffect(() => {
    if (deleteProfile) {
      navigate(`/`);
      localStorage.removeItem('user');
    }
  }, [navigate, deleteProfile]);

  const onConfirm = () => {
    if (!user) {
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
      image: image,
      nickname: state.nickname,
      gender: state.gender,
      height: parseFloat(state.height),
      weight: parseFloat(state.weight),
      age: parseFloat(state.age),
    };

    dispatch(userActions.editProfile({ username: user.username, data: request }));
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stateDispatch({ name: e.target.name, value: e.target.value });
  };
  const onSignout = () => {
    if (window.confirm('정말 탈퇴하시겠습니까?') && user) {
      dispatch(userActions.signout(user.username));
    }
  };
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const onChangeProfileImage = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const result = await client.post(process.env.REACT_APP_API_IMAGE_UPLOAD || '', formData);
      setImage(result.data.title);
    } catch (error) {
      alert('이미지 업로드 오류');
    }
  };

  if (!user) return <div>no user</div>;
  if (loading || !profile) return <Loading />;
  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="Back" clicked={() => navigate(`/profile/${user.username}`)} />
        <Title>개인정보 수정</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>

      <ButtonWrapper>
        {profile.login_method === 'email' && (
          <Button3 content="비밀번호 변경" clicked={() => navigate('/edit_password')} />
        )}
        <Button3 content="회원 탈퇴" clicked={onSignout} />
      </ButtonWrapper>

      <ProfileImage
        src={process.env.REACT_APP_API_IMAGE + image}
        alt="profile"
        onClick={() => {
          document.getElementById('FileInput_Mypage')?.click();
        }}
      />
      <FileInput type="file" id="FileInput_Mypage" onChange={onChangeProfileImage} />

      <InputWrapper>
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

      <Button1 content="Update" clicked={onConfirm} />
    </Wrapper>
  );
};

export default EditProfile;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 40px 0 70px 0;
  padding: 0 20px;

  @media all and (max-width: 620px) {
    margin: 40px 0;
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

const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
`;

const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border: 2px solid #727272;
  border-radius: 30px;
  margin-top: 20px;
  cursor: pointer;
  transition: border 0.15s linear;
  &:hover {
    border: 2px solid #000000;
  }
`;
const FileInput = styled.input`
  display: none;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px 0 35px 0;
  width: 320px;
`;
