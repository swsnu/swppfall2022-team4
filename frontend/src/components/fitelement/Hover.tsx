import styled from 'styled-components';

type fitElementType = {
  type: string;
  workout_type: string;
  period: number;
  category: string;
  weight: number;
  rep: number;
  set: number;
  time: number;
  date: Date | null;
};

export interface IProps {
  workouts: [];
}

let workouts_list = new Map<String, fitElementType[]>();

export const Hover = (props: IProps) => {
    if (typeof props.workouts !== 'undefined' && props.workouts?.length > 0) {
    props.workouts?.map((workout: fitElementType) => {
      if (workouts_list.get(workout['category']) !== undefined) {
        workouts_list.get(workout['category'])!.push(workout);
      } else {
        workouts_list.set(workout['category'], []);
      }
    });
        console.log(workouts_list)
  }
  return (
      <HoverWrapper>
      {workouts_list.get('back')?.map(workout => workout['workout_type'])}
      <br />
      {props.workouts?.length} 종목
    </HoverWrapper>
  );
};

const HoverWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
