import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';

import Button4 from 'components/common/buttons/Button4';
import Loading from 'components/common/Loading';
import { MemberElement } from 'components/group/MemberElement';

const GroupJoinReq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { group_id } = useParams<{ group_id: string }>();
  const memberList = useSelector((rootState: RootState) => rootState.group.reqMembers.requests);
  const member_status = useSelector(({ group }: RootState) => group.groupMemberStatus.member_status);
  const user = useSelector(({ user }: RootState) => user.user);
  const groupActionStatus = useSelector(({ group }: RootState) => group.groupAction.status);

  useEffect(() => {
    if (group_id) {
      dispatch(groupActions.getRequests(group_id));
      dispatch(groupActions.checkMemberStatus(group_id));
    }
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

  useEffect(() => {
    if (groupActionStatus && group_id) {
      dispatch(groupActions.stateRefresh());
      dispatch(groupActions.getRequests(group_id));
      dispatch(groupActions.checkMemberStatus(group_id));
    }
  }, [groupActionStatus]);

  if (!memberList) return <Loading />;
  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="Back" clicked={() => navigate(`/group/detail/${group_id}/`)} />
        <Title>멤버 승인 요청</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>

      {memberList.map((me, index) => (
        <MemberElement
          key={index}
          id={me.id}
          image={me.image}
          username={me.username}
          cert_days={0}
          level={me.level}
          leader={member_status === 'group_leader' ? true : false}
          myself={user?.username === me.username ? true : false}
          request={true}
        />
      ))}
    </Wrapper>
  );
};

export default GroupJoinReq;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 50px 0;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  padding: 0 20px;

  @media all and (max-width: 560px) {
    margin: 40px 0 20px 0;
  }
`;
const Title = styled.div`
  margin-top: 20px;
  font-size: 45px;
  font-family: NanumSquareR;

  @media all and (max-width: 560px) {
    display: none;
  }
`;
