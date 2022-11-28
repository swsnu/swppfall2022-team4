import styled from 'styled-components';

export interface IProps {
  key: number;
  id: number;
  type: string | null;
  workout_type: string | null;
  category: string | null;
  weight: number | null;
  rep: number | null;
  set: number | null;
  time: number | null;
}

export const get_image = (name: string | null) => {
  if (name) {
    const tag_class = ['등운동', '가슴운동', '어깨운동', '하체운동', '복근운동', '팔운동', '유산소', '기타운동'];
    const image_names = ['back', 'chest', 'deltoid', 'leg', 'abs', 'arm', 'cardio', 'etc'];
    return image_names[tag_class.indexOf(name)];
  } else {
    return 'example';
  }
};

export const FitElement = (props: IProps) => (
  <FitElementLog>
    <LogCategory className="type3">{props.id}</LogCategory>
    <LogImage src={require(`assets/images/workout_log/fitelement_category/${get_image(props.category)}.png`)} />
    <LogCategory className="type">{props.workout_type}</LogCategory>
    <LogCategory className="type2">{props.weight}</LogCategory>
    <LogCategory>{props.rep}</LogCategory>
    <LogCategory>{props.set}</LogCategory>
    <LogCategory className="type2">
      <Content>{props.time}</Content>
    </LogCategory>
  </FitElementLog>
);

const FitElementLog = styled.div`
  width: 95%;
  height: 100%;
  min-height: 80px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-weight: normal;
`;

const LogImage = styled.img`
  width: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogCategory = styled.div`
  width: 10%;
  height: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  color: black;

  &&.type {
    width: 25%;
  }
  &&.type2 {
    width: 20%;
  }
  &&.type3 {
    width: 7%;
  }
`;

const Content = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
