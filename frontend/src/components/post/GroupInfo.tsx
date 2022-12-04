import { NavigateFunction } from 'react-router-dom';
import { Group } from 'store/apis/group';
import { BsFillPersonFill } from 'react-icons/bs';
import styled from 'styled-components';
import { TagBubble } from 'components/tag/tagbubble';

export const GroupInfo = ({ group, navigate }: { group: Group | null | undefined; navigate: NavigateFunction }) => {
  if (group) {
    return (
      <GroupInfoWrapper onClick={() => navigate(`/group/detail/${group.id}`)}>
        <span>태그된 그룹</span>
        <div>
          <span>{group.group_name} </span>
          {group.prime_tag ? (
            <TagBubble color={group.prime_tag.color}>{group.prime_tag.name}</TagBubble>
          ) : (
            <TagBubble color={'#dbdbdb'}>None</TagBubble>
          )}
          <div style={{ display: 'flex' }}>
            <BsFillPersonFill />
            <div style={{ fontFamily: 'Noto Sans KR' }}>
              {group.number ? `멤버 ${group.member_number}명 / ${group.number}명` : `멤버 ${group.member_number}명`}
            </div>
          </div>
          <div>
            <span style={{ fontFamily: 'Noto Sans KR' }}>
              {group.start_date ? `${group.start_date} ~ ${group.end_date}` : ``}
            </span>
          </div>
        </div>
      </GroupInfoWrapper>
    );
  } else {
    return <></>;
  }
};

const GroupInfoWrapper = styled.div`
  background-color: var(--fit-white);
  border-radius: 15px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  > span:first-child {
    /* 태그된 그룹 */
    font-size: 14px;
    color: var(--fit-support-gray);
    margin-bottom: 10px;
  }
  > div:nth-child(2) {
    /* 그룹 내용 */
    display: flex;
    flex-direction: column;
    align-items: center;
    > span:first-child {
      /* 그룹 이름 */
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    > button:nth-child(2) {
      /* 그룹 태그 */
      margin-bottom: 15px;
    }
    > div:nth-child(3) {
      /* 멤버 인원 */
      margin-bottom: 10px;
      font-size: 12px;
      svg {
        color: #2da782;
        margin-right: 3px;
        font-size: 15px;
      }
    }
    > div:nth-child(4) {
      /* 기간 */
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 12px;
    }
  }
`;
