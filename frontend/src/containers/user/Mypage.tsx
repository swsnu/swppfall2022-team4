import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEdit } from 'react-icons/ai';
import styled from 'styled-components';
import { RootState } from 'index';
import { userActions } from 'store/slices/user';
import { dateDiff } from 'utils/datetime';
import Loading from 'components/common/Loading';

const Mypage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { username } = useParams();
  const [type, setType] = useState(0);
  const { user, profile, loading } = useSelector(({ user }: RootState) => ({
    user: user.user,
    profile: user.profile,
    loading: user.loading,
  }));

  useEffect(() => {
    dispatch(userActions.getProfile(username || ''));
    return () => {
      dispatch(userActions.resetProfile());
    };
  }, []);

  const changeType = (num: number) => {
    setType(num);
  };

  if (!user) return <div>no user</div>;
  if (loading || !profile) return <Loading />;
  return (
    <Wrapper>
      <ProfileWrapper>
        <LeftWrapper>
          <ProfileImage src={process.env.REACT_APP_API_IMAGE + profile.image} alt="profile" />

          <ProfileInfoWrapper>
            <Nickname>{profile.nickname}</Nickname>
            <Username>{profile.username}</Username>
            <Gender>{profile.gender === 'male' ? '남성' : '여성'}</Gender>
            <BodyWrapper>
              <div>{`${profile.height}cm`}</div>
              <div>{`${profile.weight}kg`}</div>
            </BodyWrapper>
          </ProfileInfoWrapper>
        </LeftWrapper>

        <ProfileEtcWrapper>
          <DateDiff>{dateDiff(profile.created)}</DateDiff>
          <DateDiffText>일 째</DateDiffText>
          <EditButton onClick={() => navigate('/edit_profile')}>프로필 수정</EditButton>
        </ProfileEtcWrapper>
        <EditIcon onClick={() => navigate('/edit_profile')} />
      </ProfileWrapper>

      <ContentWrapper>
        <CategoryWrapper>
          <Category active={type === 0} onClick={() => changeType(0)}>
            요약
          </Category>
          <Category active={type === 1} onClick={() => changeType(1)}>
            내 글
          </Category>
          <Category active={type === 2} onClick={() => changeType(2)}>
            내 댓글
          </Category>
          <Category active={type === 3} onClick={() => changeType(3)}>
            팔로잉
          </Category>
          <Category active={type === 4} onClick={() => changeType(4)}>
            스크랩
          </Category>
          <Category active={type === 5} onClick={() => changeType(5)}>
            내 그룹
          </Category>
        </CategoryWrapper>
        <div>{`${type} 선택됨`}</div>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Mypage;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileWrapper = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: space-between;
  border-bottom: solid #d1d1d1 2px;
  padding: 35px 120px 25px 120px;

  @media all and (max-width: 950px) {
    padding: 35px 80px 25px 80px;
  }
  @media all and (max-width: 840px) {
    padding: 35px 50px 25px 50px;
  }
  @media all and (max-width: 800px) {
    padding: 35px 20px 25px 20px;
  }
  @media all and (max-width: 600px) {
    height: 180px;
    padding: 20px 15px 15px 15px;
  }
  @media all and (max-width: 480px) {
    height: 160px;
    padding: 20px 15px 15px 15px;
  }
`;
const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border: 2px solid black;
  border-radius: 30px;
  margin-right: 35px;

  @media all and (max-width: 700px) {
    width: 120px;
    height: 120px;
    margin-right: 15px;
  }
  @media all and (max-width: 400px) {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
  @media all and (max-width: 360px) {
    display: none;
  }
`;
const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: NanumSquareR;
`;
const Nickname = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 5px;

  @media all and (max-width: 480px) {
    font-size: 24px;
  }
`;
const Username = styled.div`
  color: #464646;
  font-size: 21px;
  margin-bottom: 12px;

  @media all and (max-width: 480px) {
    font-size: 18px;
  }
`;
const Gender = styled.div`
  font-size: 20px;
  margin-bottom: 12px;

  @media all and (max-width: 480px) {
    font-size: 16px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
const BodyWrapper = styled.div`
  display: flex;
  font-family: sans-serif;
  gap: 5px;
  font-size: 16px;
  color: #303030;

  @media all and (max-width: 480px) {
    font-size: 15px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
const ProfileEtcWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 600px) {
    display: none;
  }
`;
const DateDiff = styled.div`
  color: #3a8d4d;
  font-size: 84px;
  font-family: 'Rubik', sans-serif;
`;
const DateDiffText = styled.div`
  font-size: 25px;
  font-family: NanumSqaureR;
`;
const EditButton = styled.div`
  width: 120px;
  height: 40px;
  border: 1px solid #646464;
  border-radius: 5px;
  background-color: #d7efe3;
  padding-top: 8px;
  margin-top: 25px;
  font-size: 17px;
  font-weight: 600;
  font-family: NanumSqaureR;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #aae5c7;
  }
`;
const EditIcon = styled(AiOutlineEdit)`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 40px;
  padding: 5px;
  background-color: #d7efe3;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #aae5c7;
  }
  align-self: flex-end;
  display: none;

  @media all and (max-width: 600px) {
    display: block;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  border-radius: 30px;
  margin-top: 25px;
`;
const CategoryWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 45px;
  div + div {
    border-left: 1px solid black;
  }
`;
const Category = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  text-align: center;
  color: ${props => (props.active ? '#198331' : '#000000')};
  font-size: 20px;
  font-weight: ${props => (props.active ? '600' : '400')};
  font-family: NanumSquareR;
  border-bottom: 1px solid black;
  padding-top: 11px;
  cursor: pointer;
  &:hover {
    font-weight: 600;
  }

  @media all and (max-width: 500px) {
    font-size: 18px;
  }
  @media all and (max-width: 360px) {
    font-size: 16px;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
