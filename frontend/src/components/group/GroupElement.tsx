import styled from 'styled-components';
import { useNavigate } from 'react-router';

export interface IProps {
  id: number;
  group_name: string;
  number: number | null;
  start_date: string | null;
  end_date: string | null;
}

export const GroupElement = (props: IProps) => {
  const navigate = useNavigate();
  return (
    <GroupElementWrapper>
      <LogImage src={require('assets/images/workout_log/fitelement_category/example.png')} />
      <GroupElementLine>이미지 삽입 todo</GroupElementLine>
      <GroupElementLine>그룹명 : {props.group_name}</GroupElementLine>
      <GroupElementLine>최대인원 : {props.number ?? '제한없음'}</GroupElementLine>
      <GroupElementLine>시작일 : {props.start_date ?? '기한없음'}</GroupElementLine>
      <GroupElementLine>마감일 : {props.end_date ?? '기한없음'}</GroupElementLine>
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
  width: 70%;
  height: 20px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  color: black;
`;

const LogImage = styled.img`
  width: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
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
