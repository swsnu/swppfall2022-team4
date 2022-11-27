import styled from 'styled-components';

export interface IProps {
  id: number;
  group_name: string;
  number: number | null;
  start_date: string | null;
  end_date: string | null;
  member_number: number;
  address: string | null;
  free: boolean;
  clicked: React.MouseEventHandler<HTMLDivElement>;
}

export const GroupElement = (props: IProps) => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  return (
    <GroupElementWrapper className={props.end_date && props.end_date < date ? 'end' : 'ing'} onClick={props.clicked}>
      <LogImage
        src={require('assets/images/workout_log/fitelement_category/example.png')}
        className={props.end_date && props.end_date < date ? 'end' : 'ing'}
      />
      <GroupElementLine style={{ fontSize: '24px', marginBottom: '15px' }}>{props.group_name}</GroupElementLine>
      <GroupElementLine>
        장소 :
        {props.address ? (props.address.length > 15 ? props.address.slice(0, 15) + '...' : props.address) : '장소없음'}
      </GroupElementLine>
      <GroupElementLine>최대인원 : {props.number ?? '제한없음'}</GroupElementLine>
      <GroupElementLine>현재인원 : {props.member_number}</GroupElementLine>
      <GroupElementLine>{props.free ? '자유가입O' : '자유가입X'}</GroupElementLine>
      <GroupElementLine>시작일 : {props.start_date ?? '기한없음'}</GroupElementLine>
      <GroupElementLine>마감일 : {props.end_date ?? '기한없음'}</GroupElementLine>
    </GroupElementWrapper>
  );
};

const GroupElementWrapper = styled.div`
  width: calc(33.3% - 20px);
  height: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  border-radius: 15px;
  background-color: #e4fff1;
  box-shadow: 1px 1px 1px 1px #d4eee0;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #c4fade;
  }
  padding: 15px 0;
  font-size: 16px;

  @media all and (max-width: 800px) {
    width: calc(50% - 20px);
  }
  @media all and (max-width: 500px) {
    width: 100%;
  }

  &&.end {
    background-color: silver;
    box-shadow: 1px 1px 1px 1px darkgray;
  }
`;
const LogImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  border: 2px solid #6ab18d;
  margin-bottom: 15px;

  &&.end {
    border: 2px solid darkgray;
  }
`;
const GroupElementLine = styled.div`
  width: 70%;
  height: 20px;
  font-family: Acme;
  text-align: center;
  margin: 3px 0;
`;
