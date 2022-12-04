import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';

import Button4 from 'components/common/buttons/Button4';
import Loading from 'components/common/Loading';
import { MemberElement } from 'components/group/MemberElement';

const GroupMembers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { group_id } = useParams<{ group_id: string }>();
  const memberList = useSelector((rootState: RootState) => rootState.group.groupMembers.members);
  const group_leader = useSelector((rootState: RootState) => rootState.group.groupMembers.group_leader);
  const member_status = useSelector(({ group }: RootState) => group.groupMemberStatus.member_status);
  const user = useSelector(({ user }: RootState) => user.user);

  useEffect(() => {
    if (group_id) {
      dispatch(groupActions.getGroupMembers(group_id));
      dispatch(groupActions.checkMemberStatus(group_id));
    }
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

  if (!memberList) return <Loading />;
  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="" clicked={() => navigate(`/group/detail/${group_id}/`)} />
        <Title>그룹 멤버</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>

      {memberList.map((me, index) => (
        <MemberElement
          key={index}
          id={me.id}
          image={me.image}
          username={me.username}
          cert_days={me.cert_days}
          level={me.level}
          is_leader={me.username === group_leader ? true : false}
          leader={member_status === 'group_leader' ? true : false}
          myself={user?.username === me.username ? true : false}
        />
      ))}
    </Wrapper>
  );
};

export default GroupMembers;

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
