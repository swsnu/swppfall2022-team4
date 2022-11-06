import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { groupActions } from 'store/slices/group';
import { MemberElement } from 'components/group/MemberElement';

const GroupMembers = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (group_id) {
      dispatch(
        groupActions.getGroupMembers({
          group_id: group_id,
        }),
      );
    }
  }, []);

  const memberList = useSelector((rootState: RootState) => rootState.group.groupMembers.members);
  return (
    <Wrapper>
      {memberList?.map((me, index) => (
        <MemberElement key={index} id={me.id} image={me.image} username={me.username} cert_days={7} level={me.level} />
      ))}
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

export default GroupMembers;
