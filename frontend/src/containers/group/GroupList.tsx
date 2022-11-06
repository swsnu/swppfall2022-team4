import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'index';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { GroupElement } from 'components/group/GroupElement';
import { groupActions } from 'store/slices/group';

const GroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(groupActions.getGroups(''));
  }, []);

  const groupList = useSelector((rootState: RootState) => rootState.group.groupList.groups);

  return (
    <Wrapper>
      <CreateGroupBtn onClick={() => navigate('/group/create')}>그룹 만들기</CreateGroupBtn>
      <GroupListWrapper>
        {groupList?.map((groupelement, index) => (
          <GroupElement
            id={groupelement.id}
            key={index}
            group_name={groupelement.group_name}
            number={groupelement.number}
            start_date={groupelement.start_date}
            end_date={groupelement.end_date}
          />
        ))}
      </GroupListWrapper>
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

const GroupListWrapper = styled.div`
  border: 1px solid black;
  margin-right: 15px;
  width: 40%;
  height: 100%;
  min-height: 100%;
  background-color: #ffffff;
  position: relative;
  left: 30%;
`;

const CreateGroupBtn = styled.button`
  width: 70px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border-radius: 15px;
  font-size: 10px;
  cursor: pointer;
`;

export default GroupList;
