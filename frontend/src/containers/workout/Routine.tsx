import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { workoutLogActions } from 'store/slices/workout';
import { FitElement } from 'components/fitelement/FitElement';
import { getRoutineRequestType, getRoutineResponseType } from 'store/apis/workout';

const Routine = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendarButtonClick = () => {
    navigate('/workout');
  };

  const routineClick = (id: number) => {
    setRoutineId(id);
  };

  const [routine_id, setRoutineId] = useState<number>(-1);

  const defaultRoutineRequest: getRoutineRequestType = {
    user_id: 1,
  };

  useEffect(() => {
    dispatch(workoutLogActions.getRoutine(defaultRoutineRequest));
  }, []);

  useEffect(() => {
    if (routine_id !== -1) {
      dispatch(workoutLogActions.getSpecificRoutine({ user_id: 1, routine_id: routine_id }));
    }
  }, [routine_id]);

  const routines = useSelector((rootState: RootState) => rootState.workout_log.routine);
  const selected_routine = useSelector((rootState: RootState) => rootState.workout_log.selected_routine_fit_elements);
  console.log(routines);
  console.log(selected_routine);

  return (
    <Wrapper>
      <LeftWrapper>
        <LeftUpper>
          <ReturnButtonWrapper onClick={() => calendarButtonClick()}>{'< '} 달력으로 돌아가기</ReturnButtonWrapper>
        </LeftUpper>
        <Frame>
          <RoutineListWrapper>
            {routines.map((routine, index) => (
              <RoutineName key={index} onClick={() => routineClick(Number(routine.id))}>
                {routine.name}
              </RoutineName>
            ))}
          </RoutineListWrapper>
        </Frame>
      </LeftWrapper>
      <RightWrapper>
        <RightUpper>
          <RoutineTitleWrapper>운동 루틴</RoutineTitleWrapper>
        </RightUpper>
        <Frame className="right">
          <LogWrapper>
            {routine_id === -1
              ? '루틴을 눌러주세요.'
              : selected_routine.map((fitelement, index) => (
                  <FitElement
                    key={index}
                    id={index + 1}
                    type={fitelement.type}
                    workout_type={fitelement.workout_type}
                    category={fitelement.category}
                    weight={fitelement.weight}
                    rep={fitelement.rep}
                    set={fitelement.set}
                    time={fitelement.time}
                  />
                ))}
          </LogWrapper>
        </Frame>
      </RightWrapper>
    </Wrapper>
  );
};

export default Routine;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
`;

const RoutineName = styled.div`
  width: 100%;
  height: 100%;
  min-height: 10vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid black;
  font-weight: normal;
`;

const LeftUpper = styled.div`
  width: 90%;
  height: 10%;
  min-height: 10vh;
  display: flex;
  align-items: end;
  justify-content: end;
`;

const RightUpper = styled.div`
  width: 90%;
  height: 10%;
  min-height: 10vh;
  display: flex;
  align-items: end;
  justify-content: center;
`;

const ReturnButtonWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 20%;
  width: 90%;
  font-family: IBMPlexSansThaiLooped;
  font-size: 15px;
  font-weight: 600;
  justify-content: start;
`;

const RoutineTitleWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 20%;
  width: 90%;
  font-family: IBMPlexSansThaiLooped;
  font-size: 20px;
  font-weight: 600;
  justify-content: center;
  align-items: center;
`;

const LeftWrapper = styled.div`
  width: 40%;
  height: 100%;
  min-height: 92vh;
  display: flex;
  margin-left: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RightWrapper = styled.div`
  width: 60%;
  height: 100%;
  min-height: 92vh;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Frame = styled.div`
  width: 90%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &&.right {
    height: 90%;
    justify-content: center;
    min-height: 70.2vh;
  }
`;

const RoutineListWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const LogWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: start;
`;
