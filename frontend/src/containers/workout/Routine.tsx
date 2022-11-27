import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { workoutLogActions } from 'store/slices/workout';
import { FitElement } from 'components/fitelement/FitElement';
import { getRoutineRequestType } from 'store/apis/workout';

const Routine = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendarButtonClick = () => {
    navigate('/workout');
  };

  const routineClick = (id: number) => {
    setRoutineId(id);
  };
  const user = useSelector(({ user }: RootState) => user);
  const [routine_id, setRoutineId] = useState<number>(-1);

  const defaultRoutineRequest: getRoutineRequestType = {
    username: user.user?.username!,
  };

  const { selected_routine, routines } = useSelector(({ workout_log }: RootState) => ({
    selected_routine: workout_log.selected_routine,
    routines: workout_log.routine,
  }));

  const create_routine_id = useSelector((rootState: RootState) => rootState.workout_log.create_routine_id);
  const deleteFitElementStatus = useSelector((rootState: RootState) => rootState.workout_log.fitelementDelete);

  const fitelementDeleteOnClick = (id: number) => {
    dispatch(
      workoutLogActions.deleteFitElement({
        username: user.user?.username!,
        fitelement_id: id,
      }),
    );
  };

  useEffect(() => {
    dispatch(workoutLogActions.getRoutine(defaultRoutineRequest));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [create_routine_id]);

  useEffect(() => {
    if (routine_id !== -1) {
      dispatch(
        workoutLogActions.getSpecificRoutine({
          username: user.user?.username!,
          routine_id: routine_id,
        }),
      );
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [routine_id, routines, deleteFitElementStatus ]);

  return (
    <Wrapper>
      <LeftWrapper>
        <LeftUpper>
          <ReturnButtonWrapper onClick={() => calendarButtonClick()}>{'< '}달력으로 돌아가기</ReturnButtonWrapper>
        </LeftUpper>
        <Frame>
          <RoutineListWrapper>
            {routines.map((routine, index) => (
              <RoutineName
                key={index}
                className={routine.id === routine_id ? (index === 0 ? 'type2' : 'type1') : ''}
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
                <LogCategory className="type3"></LogCategory>
                <LogCategory className="type">종류</LogCategory>
                <LogCategory className="type2">강도</LogCategory>
                <LogCategory>반복</LogCategory>
                <LogCategory>세트</LogCategory>
                <LogCategory className="type2">시간</LogCategory>
              </LogHeader>
            </RoutineHeader>
          )}

          <LogWrapper className={routine_id === -1 ? 'no_routine' : 'routines'}>
            {routine_id === -1 ? (
              <div>
                <Content>달력에서 루틴추가 후</Content>
                <br />
                <Content>루틴을 눌러주세요!</Content>
              </div>
            ) : (
              selected_routine.fitelements.map((fitelement, index) => (
                <FitElementWrapper key={index}>
                  <FitElement
                    key={fitelement.data.id}
                    id={index + 1}
                    type={fitelement.data.type}
                    workout_type={fitelement.data.workout_type}
                    category={fitelement.data.category}
                    weight={fitelement.data.weight}
                    rep={fitelement.data.rep}
                    set={fitelement.data.set}
                    time={fitelement.data.time}
                  />
                  <DeleteButton>
                    <DeleteEmoji
                      data-testid="delete-fitelement"
                      src={require('assets/images/workout_log/fitelement_delete/delete_button.png')}
                      onClick={() => fitelementDeleteOnClick(fitelement.data.id)}
                    />
                  </DeleteButton>
                </FitElementWrapper>
              ))
            )}
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

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  font-family: IBMPlexSansThaiLooped;
  font-size: 30px;
  font-weight: 400;
  color: #818281;
  justify-content: center;
  align-items: center;
`;

const LogCategory = styled.div`
  width: 8%;
  height: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  cursor: pointer;
  color: black;

  &&.type {
    width: 20%;
  }
  &&.type2 {
    width: 20%;
  }
  &&.type3{
    width: 15%;
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
  cursor: pointer;
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

  &&.no_routine {
    justify-content: center;
    align-items: center;
  }
`;

const DeleteButton = styled.div`
  width: 5%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeleteEmoji = styled.img`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const FitElementWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid black;
  align-items: center;
`;
