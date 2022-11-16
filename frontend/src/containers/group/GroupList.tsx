import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';
import { BsSearch } from 'react-icons/bs';
import styled from 'styled-components';

import Button1 from 'components/common/buttons/Button1';
import Loading from 'components/common/Loading';
import { GroupElement } from 'components/group/GroupElement';

const GroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const groupList = useSelector((rootState: RootState) => rootState.group.groupList.groups);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(groupActions.getGroups());
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

  if (!groupList) return <Loading />;
  return (
    <Wrapper>
      <SearchWrapper>
        <BsSearch />
        <SearchInput
          placeholder="그룹 검색..."
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
        />
      </SearchWrapper>
      <Button1 content="지도 보기" clicked={() => navigate('/group/location')} />
      <Button1
        content="Create Group"
        clicked={() => navigate('/group/create')}
        style={{ width: '180px', alignSelf: 'end', marginRight: '10px' }}
      />
      <GroupListWrapper>
        {groupList
          .filter(groupelement => {
            if (searchTerm == '') {
              return groupelement;
            } else {
              return groupelement.group_name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
            }
          })
          .map((groupelement, index) => (
            <GroupElement
              key={index}
              id={groupelement.id}
              group_name={groupelement.group_name}
              number={groupelement.number}
              start_date={groupelement.start_date}
              end_date={groupelement.end_date}
              member_number={groupelement.member_number}
              clicked={() => navigate(`/group/detail/${groupelement.id}/`)}
            />
          ))}
      </GroupListWrapper>
    </Wrapper>
  );
};

export default GroupList;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 50px 0;
`;
const SearchWrapper = styled.div`
  width: 100%;
  height: 45px;
  border-bottom: 2px solid #646464;
  margin-bottom: 25px;
  padding: 5px 10px;
  svg {
    width: 27px;
    height: 27px;
    margin: 0 12px -4px 0;
  }
`;
const SearchInput = styled.input`
  border: none;
  width: calc(100% - 45px);
  font-size: 25px;
  font-family: NanumSquareR;
  margin-bottom: 5px;
`;

const GroupListWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
`;
