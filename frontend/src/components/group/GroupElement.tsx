import { TagBubble } from 'components/tag/tagbubble';
import { TagVisual } from 'store/apis/tag';
import styled from 'styled-components';
import { get_image } from 'components/fitelement/FitElement';
import { BsFillPersonFill } from 'react-icons/bs';
export interface IProps {
  id: number;
  group_name: string;
  number: number | null;
  start_date: string | null;
  end_date: string | null;
  member_number: number;
  address: string | null;
  free: boolean;
  prime_tag: TagVisual | undefined;
  clicked: React.MouseEventHandler<HTMLDivElement>;
}

export const GroupElement = (props: IProps) => {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  const image = props.prime_tag?.tag_class ? props.prime_tag.tag_class : null;

  let logo = props.prime_tag?.tag_class ? props.prime_tag.tag_class : 'example';
  if (props.end_date && props.end_date < date) {
    logo = 'end' + logo;
  }

  return (
    <GroupElementWrapper className={props.end_date && props.end_date < date ? 'end' : 'ing'} onClick={props.clicked}>
      <GroupElementHeader>
        <span style={{ marginRight: '10px' }}>{`#${props.id}`}</span>
      </GroupElementHeader>
      <GroupElementMiddle>
        <LogImage
          src={require(`assets/images/workout_log/fitelement_category/${get_image(image)}.png`)}
          className={logo}
        />
        <GroupElementMiddleLeft>
          <GroupMiddleLine style={{ fontSize: '24px', marginBottom: '15px' }}>
            {props.group_name.length > 10 ? ' ' + props.group_name.slice(0, 10) + '...' : ' ' + props.group_name}
          </GroupMiddleLine>
          <GroupMiddleLine>
            <BsFillPersonFill />
            <div style={{ fontSize: '15px', fontFamily: 'Noto Sans KR' }}>{`멤버 ${props.member_number}명`}</div>
          </GroupMiddleLine>
          <GroupMiddleLine>{props.free ? '자유가입 O' : '자유가입 X'}</GroupMiddleLine>
          {props.prime_tag ? (
            <TagBubble color={props.prime_tag.color}>{props.prime_tag.name}</TagBubble>
          ) : (
            <TagBubble color={'#dbdbdb'}>None</TagBubble>
          )}
        </GroupElementMiddleLeft>
      </GroupElementMiddle>
      {props.start_date ? (
        <GroupElementLine>
          기간 : {props.start_date} ~ {props.end_date}
        </GroupElementLine>
      ) : (
        <GroupElementLine>기간 : 기간없음</GroupElementLine>
      )}
      <GroupElementLine>
        {props.address
          ? props.address.length > 15
            ? '장소 : ' + props.address.slice(0, 15) + '...'
            : '장소 : ' + props.address
          : '장소 : 장소없음'}
      </GroupElementLine>
    </GroupElementWrapper>
  );
};

const GroupElementWrapper = styled.div`
  width: calc(33.3% - 20px);
  height: 300px;
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
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border: 2px solid #6ab18d;
  margin-top: 5px;
  margin-left: 10%;

  &&.등운동 {
    background-color: #f4d284;
    border: 2px solid #f6b92c;
  }

  &&.가슴운동 {
    background-color: #f9b6a2;
    border: 2px solid #f3693f;
  }

  &&.어깨운동 {
    background-color: #f9a2b6;
    border: 2px solid #f3446c;
  }

  &&.하체운동 {
    background-color: #a2cff9;
    border: 2px solid #3b9af2;
  }

  &&.복근운동 {
    background-color: #9fd6cd;
    border: 2px solid #57b7a8;
  }

  &&.팔운동 {
    background-color: #a9f9a2;
    border: 2px solid #4ef33f;
  }

  &&.유산소 {
    background-color: #d3b7d8;
    border: 2px solid #a46aae;
  }

  &&.기타운동 {
    background-color: #d3b7d8;
    border: 2px solid #a46aae;
  }

  &&.end등운동 {
    background-color: #f4d284;
    border: 2px solid darkgray;
  }
  &&.end가슴운동 {
    background-color: #f9b6a2;
    border: 2px solid darkgray;
  }
  &&.end어깨운동 {
    background-color: #f9a2b6;
    border: 2px solid darkgray;
  }
  &&.end하체운동 {
    background-color: #a2cff9;
    border: 2px solid darkgray;
  }
  &&.end복근운동 {
    background-color: #9fd6cd;
    border: 2px solid darkgray;
  }
  &&.end팔운동 {
    background-color: #a9f9a2;
    border: 2px solid darkgray;
  }
  &&.end유산소 {
    background-color: #d3b7d8;
    border: 2px solid darkgray;
  }
  &&.end기타운동 {
    background-color: #d3b7d8;
    border: 2px solid darkgray;
  }
  &&.endexample {
    border: 2px solid darkgray;
  }
`;
const GroupElementLine = styled.div`
  width: 100%;
  height: 20px;
  font-family: 'Noto Sans KR';
  text-align: center;
  margin-bottom: 5%;
`;
const GroupMiddleLine = styled.div`
  display: flex;
  width: 100%;
  height: 20px;
  font-family: Acme;
  margin: 3px 0;
`;
const GroupElementHeader = styled.div`
  display: flex;
  height: 20px;
  line-height: 20px;
  padding-left: 15px;
  font-family: 'FugazOne';
  text-align: center;
  justify-content: left;
  width: 100%;
`;
const GroupElementMiddle = styled.div`
  display: flex;
  padding-top: 5%;
  padding-left: 10%;
  font-family: 'FugazOne';
  justify-content: left;
  width: 100%;
  margin-bottom: 10%;
`;

const GroupElementMiddleLeft = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'FugazOne';
  justify-content: left;
  width: 50%;
  margin-left: 10%;
`;
