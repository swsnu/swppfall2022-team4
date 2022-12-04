/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';

import Button4 from 'components/common/buttons/Button4';
import Loading from 'components/common/Loading';
import { JoinReqElement } from 'components/group/JoinReqElement';

const GroupJoinReq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { group_id } = useParams<{ group_id: string }>();
  const memberList = useSelector((rootState: RootState) => rootState.group.reqMembers.requests);
  const groupActionStatus = useSelector(({ group }: RootState) => group.groupAction.status);
  const group_detail = useSelector(({ group }: RootState) => group.groupDetail.group);

  useEffect(() => {
    if (group_id) {
      dispatch(groupActions.getRequests(group_id));
      dispatch(groupActions.getGroupDetail(group_id));
    }
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

  useEffect(() => {
    if (groupActionStatus && group_id) {
      dispatch(groupActions.stateRefresh());
      dispatch(groupActions.getRequests(group_id));
      dispatch(groupActions.getGroupDetail(group_id));
    }
  }, [groupActionStatus]);

  if (!memberList) return <Loading />;
  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="" clicked={() => navigate(`/group/detail/${group_id}/`)} />
        <Title>멤버 승인 요청</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>
      {memberList.length !== 0 ? (
        memberList.map((me, index) => (
          <JoinReqElement
            key={index}
            id={me.id}
            image={me.image}
            username={me.username}
            level={me.level}
            is_full={group_detail?.number === group_detail?.member_number}
          />
        ))
      ) : (
        <EmptyWrapper>Empty!</EmptyWrapper>
      )}
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
const EmptyWrapper = styled.div`
  font-size: 40px;
  margin-top: 20%;
  font-family: 'Press Start 2P', cursive;
  color: #9b9b9b;
`;
