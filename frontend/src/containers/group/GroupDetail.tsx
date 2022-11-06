import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { FitElement } from 'components/fitelement/FitElement';
import { groupActions } from 'store/slices/group';

const GroupDetail = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const group_detail = useSelector(({ group }: RootState) => group.groupDetail.groupdetail);
  const groupDeleteStatus = useSelector(({ group }: RootState) => group.groupDelete);
  const user = useSelector(({ user }: RootState) => user.user);
  const member_status = useSelector(({ group }: RootState) => group.groupMemberStatus.member_status);

  useEffect(() => {
    if (group_id && user) {
      dispatch(groupActions.getGroupDetail({ group_id: group_id }));
      dispatch(groupActions.checkMemberStatus({ group_id: group_id, member: user.username }));
    }
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

  return (
    <Wrapper>
      <div>{member_status}</div>
      <GroupDetailHeader>
        <div>{group_detail?.group_name}</div>
        <div>{group_detail?.start_date}</div>
        <div>{group_detail?.end_date}</div>
        <span>최대 인원수</span>
        <div>{group_detail?.number}</div>
        <span>현재 인원수 추가해야합니다. </span>
      </GroupDetailHeader>
      <GroupDetailWrapper>
        <h1>About</h1>
        <span>그룹장</span>
        <span>{group_detail?.group_leader.username}</span>
        <span>닉네임</span>
        <span>{group_detail?.group_leader.nickname}</span>
        <h1>Specification</h1>
        <span>기간 : </span>
        <span>
          {group_detail?.start_date}~{group_detail?.end_date}
        </span>
        <span>인원수 : </span>
        <span>{group_detail?.number}</span>
      </GroupDetailWrapper>
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
      {member_status == 'group_leader' && <GroupDeleteBtn onClick={deleteOnClick}>그룹 삭제하기</GroupDeleteBtn>}
      {member_status == 'group_member' && <GroupDeleteBtn onClick={exitOnClick}>그룹 탈퇴하기</GroupDeleteBtn>}
      {member_status == 'not_member' && <GroupDeleteBtn onClick={joinOnClick}>그룹 가입하기</GroupDeleteBtn>}
      {(member_status == 'group_member' || member_status == 'group_leader') && (
        <GroupDeleteBtn onClick={() => navigate(`/group/detail/${group_id}/member`)}>그룹 멤버보기</GroupDeleteBtn>
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

const JoinGroupBtn = styled.button`
  width: 70px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border-radius: 15px;
  font-size: 10px;
  cursor: pointer;
`;

const GroupDeleteBtn = styled.button`
  width: 70px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border-radius: 15px;
  font-size: 10px;
  cursor: pointer;
`;

export default GroupDetail;
