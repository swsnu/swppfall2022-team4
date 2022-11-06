import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { FitElement } from 'components/fitelement/FitElement';
import { groupActions } from 'store/slices/group';
import { userActions } from 'store/slices/user';
import Loading from 'components/common/Loading';

const GroupDetail = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const group_detail = useSelector(({ group }: RootState) => group.groupDetail.groupdetail);
  const groupDeleteStatus = useSelector(({ group }: RootState) => group.groupDelete);
  const user = useSelector(({ user }: RootState) => user.user);
  const member_status = useSelector(({ group }: RootState) => group.groupMemberStatus.member_status);
  const { profile } = useSelector(({ user }: RootState) => ({ profile: user.profile }));

  useEffect(() => {
    if (group_id && user) {
      dispatch(groupActions.getGroupDetail({ group_id: group_id }));
      dispatch(groupActions.checkMemberStatus({ group_id: group_id, member: user.username }));
    }
  }, []);

  useEffect(() => {
    dispatch(userActions.getProfile(user?.username || ''));
    return () => {
      dispatch(userActions.resetProfile());
    };
  }, []);

  useEffect(() => {
    if (groupDeleteStatus) {
      navigate('/group');
      dispatch(groupActions.stateRefresh());
    }
  }, [groupDeleteStatus]);

  const deleteOnClick = () => {
    if (group_id) {
      dispatch(
        groupActions.deleteGroup({
          group_id: group_id,
        }),
      );
    }
  };

  const joinOnClick = () => {
    if (group_id && user) {
      dispatch(
        groupActions.joinGroup({
          group_id: group_id,
          member: user.username,
        }),
      );
    }
  };

  const exitOnClick = () => {
    if (group_id && user) {
      dispatch(
        groupActions.exitGroup({
          group_id: group_id,
          member: user.username,
        }),
      );
    }
  };

  if (!profile) return <Loading />;
  return (
    <Wrapper>
      <GroupDetailHeader>
        <div>그룹명 : {group_detail?.group_name}</div>
        <div>시작일 : {group_detail?.start_date ?? '기한없음'}</div>
        <div>마감일 : {group_detail?.end_date ?? '기한없음'}</div>
        <div>최대인원수 : {group_detail?.number ?? '제한없음'}</div>
        <div>현재인원수 : {group_detail?.member_number}</div>
      </GroupDetailHeader>
      <GroupDetailWrapper>
        <h1>About</h1>
        <div>그룹장 : {group_detail?.group_leader.username}</div>
        <ProfileImage src={process.env.REACT_APP_API_IMAGE + profile.image} alt="profile" />
        <div>그룹 소개 : {group_detail?.description}</div>
      </GroupDetailWrapper>
      <GroupDetailWrapper>
        <h1>Specification</h1>
        <div>시작일 : {group_detail?.start_date ?? '기한없음'}</div>
        <div>마감일 : {group_detail?.end_date ?? '기한없음'}</div>
        {group_detail?.goal.map((goal, index) => (
          <FitElement
            key={index}
            id={index + 1}
            type={goal.type}
            workout_type={goal.workout_type}
            category={goal.category}
            weight={goal.weight}
            rep={goal.rep}
            set={goal.set}
            time={goal.time}
          />
        ))}
      </GroupDetailWrapper>
      {member_status == 'group_leader' && <AnyButton onClick={deleteOnClick}>그룹 삭제하기</AnyButton>}
      {member_status == 'group_member' && <AnyButton onClick={exitOnClick}>그룹 탈퇴하기</AnyButton>}
      {member_status == 'not_member' && <AnyButton onClick={joinOnClick}>그룹 가입하기</AnyButton>}
      {(member_status == 'group_member' || member_status == 'group_leader') && (
        <AnyButton onClick={() => navigate(`/group/detail/${group_id}/member`)}>그룹 멤버보기</AnyButton>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const GroupDetailHeader = styled.div`
  border: 1px solid black;
  margin-right: 15px;
`;

const GroupDetailWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 40%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
`;

const AnyButton = styled.button`
  width: 70px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border-radius: 15px;
  font-size: 10px;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
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

export default GroupDetail;
