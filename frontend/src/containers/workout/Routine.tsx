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

  const { selected_routine, routines } = useSelector(({ workout_log }: RootState) => ({
    selected_routine: workout_log.selected_routine,
    routines: workout_log.routine,
  }));
  console.log('routines', selected_routine);

  useEffect(() => {
    dispatch(workoutLogActions.getRoutine(defaultRoutineRequest));
  }, []);

  useEffect(() => {
    if (routine_id !== -1) {
      dispatch(workoutLogActions.getSpecificRoutine({ user_id: 1, routine_id: routine_id }));
    }
  }, [routine_id, routines]);

  return (
    <Wrapper>
      <LeftWrapper>
        <LeftUpper>
          <ReturnButtonWrapper onClick={() => calendarButtonClick()}>{'< '} 달력으로 돌아가기</ReturnButtonWrapper>
        </LeftUpper>
        <Frame>
          <RoutineListWrapper>
            {routines.map((routine, index) => (
              <RoutineName
                key={index}
                className={routine.id === routine_id ? (index == 0 ? 'type2' : 'type1') : ''}
                onClick={() => routineClick(Number(routine.id))}
              >
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
          {routine_id === -1 ? (
            <div></div>
          ) : (
            <RoutineHeader>
              <LogHeader className="title">{selected_routine.name}</LogHeader>
              <LogHeader>
                <LogCategory className="type">종류</LogCategory>
                <LogCategory className="type2">강도</LogCategory>
                <LogCategory>반복</LogCategory>
                <LogCategory>세트</LogCategory>
                <LogCategory className="type2">시간</LogCategory>
              </LogHeader>
            </RoutineHeader>
          )}

          <LogWrapper>
            {routine_id === -1
              ? '루틴을 눌러주세요.'
              : selected_routine.fitelements.map((fitelement, index) => (
                  <FitElement
                    key={index}
                    id={index + 1}
                    type={fitelement.data.type}
                    workout_type={fitelement.data.workout_type}
                    category={fitelement.data.category}
                    weight={fitelement.data.weight}
                    rep={fitelement.data.rep}
                    set={fitelement.data.set}
                    time={fitelement.data.time}
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
  max-width: 1200px;
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

  &&.type1 {
    background-color: #84e0ed;
  }

  &&.type2 {
    background-color: #84e0ed;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
`;

const RoutineHeader = styled.div`
  font-size: 18px;
  width: 100%;
  height: 30%;
  font-family: IBMPlexSansThaiLooped;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogHeader = styled.div`
  font-size: 18px;
  width: 100%;
  height: 30%;
  border-bottom: 1px solid black;
  padding: 10px 0px 5px 0px;
  font-family: IBMPlexSansThaiLooped;
  display: flex;
  justify-content: center;
  align-items: center;

  &&.title {
    height: 70%;
    min-height: 10vh;
  }
`;

const LogCategory = styled.div`
  width: 10%;
  height: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  cursor: pointer;
  color: black;

  &&.type {
    width: 40%;
  }
  &&.type2 {
    width: 20%;
  }
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
  background-color: #ffffff;
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
  border-radius: 10px;
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
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;
