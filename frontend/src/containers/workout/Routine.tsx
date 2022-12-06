import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { workoutLogActions } from 'store/slices/workout';
import { FitElement } from 'components/fitelement/FitElement';
import { getRoutineRequestType } from 'store/apis/workout';

const Routine = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const routineClick = (id: number) => {
    setRoutineId(id);
  };
  const user = useSelector(({ user }: RootState) => user);
  const [routine_id, setRoutineId] = useState<number>(-1);
  const [title, setTitle] = useState('');
  const [edit_mode, setMode] = useState<boolean>(false);
  const [copy_routine, setCopyRoutine] = useState('');
  const [is_copy, setIsCopy] = useState<boolean>(false);
  const [copied_fitelements, setCopiedFitElements] = useState<number[]>([]);

  const defaultRoutineRequest: getRoutineRequestType = {
    username: user.user?.username!,
  };

  const { selected_routine, routines } = useSelector(({ workout_log }: RootState) => ({
    selected_routine: workout_log.selected_routine,
    routines: workout_log.routine,
  }));

  const create_routine_id = useSelector((rootState: RootState) => rootState.workout_log.create_routine_id);
  const deleteFitElementStatus = useSelector((rootState: RootState) => rootState.workout_log.fitelementDelete);
  const edit_routine_success = useSelector((rootState: RootState) => rootState.workout_log.edit_routine_success);

  const fitelementDeleteOnClick = (id: number) => {
    dispatch(
      workoutLogActions.deleteFitElement({
        username: user.user?.username!,
        fitelement_id: id,
      }),
    );
  };

  const editRoutineTitle = (click_type: string) => {
    if ((edit_mode === false && click_type !== 'complete_button') || click_type === 'edit_button') {
      setMode(true);
    } else if (click_type === 'cancel_button') {
      setTitle(selected_routine.name || '');
      setMode(false);
    } else {
      dispatch(
        workoutLogActions.editRoutineTitle({
          username: user.user?.username!,
          title: title,
          routine_id: routine_id,
        }),
      );
      setMode(false);
    }
  };

  const copyRoutine = () => {
    if (selected_routine.fitelements.length > 0) {
      setIsCopy(true);
      setCopyRoutine(selected_routine.name);
      setCopiedFitElements(
        selected_routine.fitelements.map(v => {
          return Number(v.data.id);
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(workoutLogActions.getRoutine(defaultRoutineRequest));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [create_routine_id, edit_routine_success]);

  useEffect(() => {
    setMode(false);
    if (routine_id !== -1) {
      dispatch(
        workoutLogActions.getSpecificRoutine({
          username: user.user?.username!,
          routine_id: routine_id,
        }),
      );
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [routine_id, routines, deleteFitElementStatus]);

  return (
    <Wrapper>
      <LeftWrapper>
        <LeftUpper>
          <Link
            to="/workout"
            state={{ copied_fitelements, copy_routine }}
            style={{ justifyContent: 'start', display: 'flex', width: '100%' }}
          >
            <ReturnButtonWrapper>{'< '}달력으로 돌아가기</ReturnButtonWrapper>
          </Link>
        </LeftUpper>
        <Frame>
          <RoutineNameHeader>루틴 목록</RoutineNameHeader>
          <RoutineListWrapper>
            {routines.map((routine, index) => (
              <RoutineName key={index} data-testid="routine_name" onClick={() => routineClick(Number(routine.id))}>
                <BoxWrapper className={routine.id === routine_id ? (index === 0 ? 'type2' : 'type1') : ''}>
                  {routine.name}
                </BoxWrapper>
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
              <LogHeader className="title">
                {edit_mode ? (
                  <EditInput
                    defaultValue={selected_routine.name}
                    data-testid="edit_input"
                    onChange={e => setTitle(e.target.value)}
                  />
                ) : (
                  selected_routine.name
                )}
                <EditButtonWrapper>
                  <AnyButton
                    className="edit-type"
                    data-testid="title_cancel_button"
                    hidden={!edit_mode}
                    onClick={() => editRoutineTitle('cancel_button')}
                  >
                    취소
                  </AnyButton>
                  <AnyButton
                    className="edit-type"
                    data-testid="title_edit_button"
                    hidden={edit_mode}
                    onClick={() => editRoutineTitle('edit_button')}
                  >
                    수정
                  </AnyButton>
                  <AnyButton
                    className="edit-type"
                    data-testid="copy_button"
                    hidden={edit_mode}
                    disabled={selected_routine.fitelements.length === 0 ? true : false}
                    onClick={() => copyRoutine()}
                  >
                    복사
                  </AnyButton>
                  <AnyButton
                    className="edit-type"
                    data-testid="title_submit_button"
                    hidden={!edit_mode}
                    onClick={() => editRoutineTitle('complete_button')}
                  >
                    완료
                  </AnyButton>
                </EditButtonWrapper>
              </LogHeader>
              <LogHeader>
                <LogCategoryLeft>
                  <LogCategory className="type3">부위</LogCategory>
                  <LogCategory className="type">종류</LogCategory>
                  <LogCategory className="type4">강도</LogCategory>
                  <LogCategory>반복</LogCategory>
                  <LogCategory>세트</LogCategory>
                  <LogCategory className="type2">시간</LogCategory>
                </LogCategoryLeft>
                <LogCategoryRight />
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

const BoxWrapper = styled.div`
  width: 90%;
  height: 72px;
  display: flex;
  font-size: 18px;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: #f5fffd;
  border: 1px solid #c0c0c0;
  &&.type1 {
    background-color: #bbdefb;
  }
  &:hover {
    cursor: pointer;
    border-color: black;
  }
`;

const RoutineName = styled.div`
  width: 100%;
  height: 100%;
  min-height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditInput = styled.input`
  height: 50%;
  width: 30%;
  padding: 5px 15px 5px 15px;
  font-size: 18px;
  font-weight: normal;
  font-family: IBMPlexSansThaiLooped;
  display: flex;
  justify-content: center;
  align-items: center;
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
    font-size: 18px;
    font-weight: 600;
    flex-direction: column;
  }
`;

const RoutineNameHeader = styled.div`
  font-size: 18px;
  font-weight: 800;
  width: 100%;
  height: 30%;
  border-bottom: 1px solid black;
  padding: 10px 0px 5px 0px;
  font-family: IBMPlexSansThaiLooped;
  display: flex;
  justify-content: center;
  align-items: center;
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

const LogCategoryLeft = styled.div`
  width: 95%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogCategoryRight = styled.div`
  width: 5%;
  height: 20px;
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
    width: 22%;
  }

  &&.type3 {
    width: 15%;
  }

  &&.type4 {
    width: 18%;
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
  justify-content: start;
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
  justify-content: start;
  align-items: center;
`;

const Frame = styled.div`
  width: 90%;
  height: 100%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  overflow: auto;
  width: 100%;
  height: 100%;
  min-height: 70vh;
  max-height: 70vh;
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

const AnyButton = styled.button`
  width: 180px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border: 0;
  border-radius: 8px;
  font-family: FugazOne;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }

  &&.type1 {
    width: 120px;
    height: 20px;
  }

  &:disabled {
    background-color: #d7efe3;
    cursor: default;
  }

  &&.edit-type {
    width: 60px;
    height: 20px;
  }
`;

const EditButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: end;
  justify-content: end;
  flex-direction: row;
  font-family: IBMPlexSansThaiLooped;
  font-size: 14px;
  font-weight: 600;
  color: #818281;
`;
