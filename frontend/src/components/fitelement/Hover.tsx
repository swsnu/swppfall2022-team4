import { TagClass } from 'store/apis/tag';
import styled from 'styled-components';

type fitElementType = {
  type: string;
  workout_type: string;
  period: number;
  category: string;
  color: string;
  weight: number;
  rep: number;
  set: number;
  time: number;
  date: string | null;
};

export interface IProps {
  key: number;
  workouts: fitElementType[];
  types: TagClass[];
}

interface IPropsColor {
  color: string;
}

export const Hover = (props: IProps) => {
  const workouts_list = new Map<string, fitElementType[]>();
  if (typeof props.workouts !== 'undefined' && props.workouts?.length > 0) {
    props.workouts?.forEach((workout: fitElementType) => {
      if (workouts_list.get(workout['category']) !== undefined) {
        workouts_list.get(workout['category'])!.push(workout);
      } else {
        workouts_list.set(workout['category'], []);
        workouts_list.get(workout['category'])!.push(workout);
      }
    });
  }

  const workout_type_list = (category: string, color: string, key: number) => (
    <WorkoutSingle key={key}>
      <WorkoutColor color={color} />
      {workouts_list.get(category) !== undefined && workouts_list.get(category)!.length > 1
        ? workouts_list.get(category)![0]['workout_type'] + ` 외 ${workouts_list.get(category)!.length - 1}개`
        : workouts_list.get(category) !== undefined && workouts_list.get(category)!.length > 0
        ? workouts_list.get(category)![0]['workout_type']
        : ''}
    </WorkoutSingle>
  );
  return (
    <HoverWrapper>
      {typeof props.workouts !== 'undefined' && props.workouts?.length === 0 ? (
        <Content>기록된 운동이 없습니다!</Content>
      ) : (
        <WorkoutList key={0}>
          {props.types.map((eachType, index) => workout_type_list(eachType.class_name, eachType.color, index))}
        </WorkoutList>
      )}
      <br />
      <hr />
      <br />
      {props.workouts?.length} 종류
    </HoverWrapper>
  );
};

const HoverWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 5px;
`;

const WorkoutList = styled.div`
  flex-direction: column;
`;

const Content = styled.div`
  height: 100px;
  width: 100px;
  align-items: center;
  justify-content: center;
`;

const WorkoutSingle = styled.div`
  display: flex;
  font-family: IBMPlexSansThaiLooped;
  flex-direction: row;
  margin: 4px;
  margin-left: 0px;
`;

const WorkoutColor = styled.div<IPropsColor>`
  width: 12px;
  height: 12px;
  margin-right: 6px;
  border-radius: 50%;
  background: #a2cff9;
  ${({ color }) =>
    color &&
    `
      background: ${color};
    `}
`;
