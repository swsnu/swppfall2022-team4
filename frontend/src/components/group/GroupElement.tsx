import styled from 'styled-components';
import { useNavigate } from 'react-router';

export interface IProps {
  id: number;
  group_name: string;
  number: number;
  start_date: string;
  end_date: string;
}

export const GroupElement = (props: IProps) => {
  const navigate = useNavigate();
  return (
    <GroupElementWrapper>
      <GroupElementLine>이미지 삽입 todo</GroupElementLine>
      <GroupElementLine>{props.group_name}</GroupElementLine>
      <GroupElementLine>{props.number}</GroupElementLine>
      <GroupElementLine>{props.start_date}</GroupElementLine>
      <GroupElementLine>{props.end_date}</GroupElementLine>
      <GroupDetailBtn onClick={() => navigate(`/group/detail/${props.id}/`)}>자세히 보기</GroupDetailBtn>
    </GroupElementWrapper>
  );
};

const GroupElementWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 10vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid black;
  font-weight: normal;
  flex-direction: column;
`;

const GroupElementLine = styled.div`
  width: 10%;
  height: 20px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  color: black;
`;

const GroupDetailBtn = styled.button`
  width: 70px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border-radius: 15px;
  font-size: 10px;
  cursor: pointer;
`;
