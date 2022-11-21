import styled from 'styled-components';

export interface IProps {
  workouts: [];
}

export const Hover = (props: IProps) => {
  let workouts_list = {};
  return (
    <HoverWrapper>
      {props.workouts?.map(workout => workout['workout_type'])}
      <br />
      {props.workouts?.length} 종목
    </HoverWrapper>
  );
};

const HoverWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
