import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { FitElement } from 'components/fitelement/FitElement';
import { workoutLogActions } from 'store/slices/workout';
import {
  getDailyLogRequestType,
  createWorkoutLogRequestType,
  createDailyLogRequestType,
  editMemoRequestType,
  addFitElementsRequestType,
  createRoutineWithFitElementsRequestType,
} from 'store/apis/workout';

const WorkoutLog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [startDay, setStartDay] = useState(getStartDayOfMonth(date));
  const [selected_year, setSelectedYear] = useState(date.getFullYear());
  const [selected_month, setSelectedMonth] = useState(date.getMonth());
  const [selected_date, setSelectedDay] = useState(date.getDate());
  const [workout_type, setWorkoutType] = useState('');
  //TODO: workout_type이 비어있을 경우, alert
  //TODO: fitelement 추가 후, 값 비우기
  const [workout_category, setWorkoutCategory] = useState('leg');
  const [rep, setRep] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [set, setSet] = useState<number | null>(null);
  const [workout_time, setWorkoutTime] = useState<number | null>(null);
  const [workout_period, setWorkoutPeriod] = useState<number | null>(null);
  const [memo_write_mode, setMemoWriteMode] = useState<boolean>(false);
  const [memo, setMemo] = useState('');
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [copy_date, setCopyDate] = useState<Date>(new Date());
  const [copied_fitelements, setCopiedFitElements] = useState<number[]>([]);

  function getStartDayOfMonth(date: Date) {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let selected_day = 0;
    if (day < 7) {
      selected_day = day + 1;
    } else {
      selected_day = 0; // 일요일
    }
    return selected_day;
  }

  const defaultDailyLogConfig: getDailyLogRequestType = {
    year: year,
    month: month + 1,
    specific_date: day,
    user_id: 1,
    data: {
      user_id: 1,
    },
  };

  const clickDate = (year: number, month: number, d: number) => {
    setDate(new Date(year, month, d));
    console.log(year, month, d);
    setSelectedYear(year);
    setSelectedDay(d);
    setSelectedMonth(month);
    const dailyLogConfig: getDailyLogRequestType = {
      year: year,
      month: month + 1,
      specific_date: d,
      user_id: 1,
      data: {
        user_id: 1,
      },
    };
    dispatch(workoutLogActions.getDailyLog(dailyLogConfig));
  };

  const routineClick = () => {
    // TODO: edit 도중 나가는 이벤트
    navigate('/routine');
  };

  const createWorkoutLog = () => {
    console.log('create', year, month, day);
    const newLogConfig: createWorkoutLogRequestType = {
      user_id: 1,
      type: 'log',
      workout_type: workout_type,
      period: workout_period,
      category: 'leg',
      weight: weight,
      rep: rep,
      set: set,
      time: workout_time,
      date: new Date(year, month, day + 1),
    };
    dispatch(workoutLogActions.createWorkoutLog(newLogConfig));
    setWorkoutType('');
    setRep(0);
    setWeight(0);
    setSet(0);
    setWorkoutTime(0);
  };

  const copyDailyLog = () => {
    if (dailyLog.isDailyLog === true && dailyFitElements.length > 0) {
      setIsCopy(true);
      setCopyDate(new Date(year, month, day));
      setCopiedFitElements(
        dailyFitElements.map(v => {
          return Number(v.id);
        }),
      );
    }
  };

  const addRoutineClick = () => {
    if (dailyLog.isDailyLog === true && dailyFitElements.length > 0) {
      const fitelements_id_list = dailyFitElements.map(v => {
        return Number(v.id);
      });
      const createRoutineConfig: createRoutineWithFitElementsRequestType = {
        user_id: 1,
        fitelements: fitelements_id_list,
      };
      dispatch(workoutLogActions.createRoutineWithFitElements(createRoutineConfig));

      navigate('/routine');
    }
  };

  const pasteDailyLog = () => {
    setIsCopy(false);

    const addFitElementConfig: addFitElementsRequestType = {
      user_id: 1,
      fitelements: copied_fitelements,
      year: year,
      month: month + 1,
      specific_date: day,
    };
    dispatch(workoutLogActions.addFitElements(addFitElementConfig));
  };

  const memoOnClick = () => {
    console.log(memo_write_mode);
    if (memo_write_mode === false) {
      setMemoWriteMode(true);
    } else {
      const editMemoConfig: editMemoRequestType = {
        user_id: 1,
        memo: memo,
        year: year,
        month: month + 1,
        specific_date: day,
      };
      dispatch(workoutLogActions.editMemo(editMemoConfig));
      setMemoWriteMode(false);
    }
  };

  const dailyLog = useSelector((rootState: RootState) => rootState.workout_log.daily_log);
  const dailyFitElements = useSelector((rootState: RootState) => rootState.workout_log.daily_fit_elements);
  const calendarInfo = useSelector((rootState: RootState) => rootState.workout_log.calendar_info);
  const createDailyLogStatus = useSelector((rootState: RootState) => rootState.workout_log.workoutCreate);
  const pasteStatus = useSelector((rootState: RootState) => rootState.workout_log.add_fit_elements);

  useEffect(() => {
    dispatch(workoutLogActions.getDailyLog(defaultDailyLogConfig));
  }, [createDailyLogStatus, pasteStatus]);

  useEffect(() => {
    setMemo(dailyLog.memo || '연필 클릭 후 메모를 추가해 보세요.');
  }, [dailyLog]);

  useEffect(() => {
    dispatch(workoutLogActions.getCalendarInfo({ user_id: 1, year: year, month: month + 1 }));
  }, [isCopy, createDailyLogStatus]);

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartDay(getStartDayOfMonth(date));
  }, [date, calendarInfo]);

  function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const days = isLeapYear(date.getFullYear()) ? DAYS_LEAP : DAYS;

  return (
    <Wrapper>
      <InnerWrapper>
        <LeftWrapper>
          <LeftUpper>
            <DateWrapper>
              {isCopy === true
                ? String(copy_date.getFullYear()) +
                  '.' +
                  String(copy_date.getMonth() + 1) +
                  '.' +
                  String(copy_date.getDate()) +
                  ' ' +
                  '복사중'
                : '복사 없음'}
            </DateWrapper>
          </LeftUpper>
          <CalendarWrapper>
            <Frame>
              <CalendarHeader>
                <Button
                  onClick={() => {
                    dispatch(
                      workoutLogActions.getCalendarInfo({
                        user_id: 1,
                        year: month == 0 ? year - 1 : year,
                        month: month == 0 ? 12 : month,
                      }),
                    );
                    setDate(new Date(year, month - 1, day));
                  }}
                >
                  {'<'}
                </Button>
                <YearMonth>
                  <Year>{year}</Year>
                  <Month>{MONTHS[month]}</Month>
                </YearMonth>

                <Button
                  onClick={() => {
                    dispatch(
                      workoutLogActions.getCalendarInfo({
                        user_id: 1,
                        year: month == 11 ? year + 1 : year,
                        month: ((month + 1) % 12) + 1,
                      }),
                    );
                    setDate(new Date(year, month + 1, day));
                  }}
                >
                  {'>'}
                </Button>
              </CalendarHeader>
              <Body>
                {DAYS_OF_THE_WEEK.map(d =>
                  d === 'SUN' ? (
                    <Day className="sunday" key={d}>
                      {d}
                    </Day>
                  ) : d === 'SAT' ? (
                    <Day className="saturday" key={d}>
                      {d}
                    </Day>
                  ) : (
                    <Day key={d}>{d}</Day>
                  ),
                )}
                {Array(36)
                  .fill(null)
                  .map((_, index) => {
                    const d = index - (startDay - 2);
                    // {year}.{selected_month + 1}.{day}
                    let day_type = 'future_day';
                    if (year > today.getFullYear()) {
                      day_type = 'future_day';
                    } else if (year === today.getFullYear() && month > today.getMonth()) {
                      day_type = 'future_day';
                    } else if (year === today.getFullYear() && month === today.getMonth() && d > today.getDate()) {
                      day_type = 'future_day';
                    } else if (year === selected_year && month === selected_month && d === selected_date) {
                      day_type = 'selected_day';
                    } else if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
                      day_type = 'today';
                    } else if (d > 0 && d <= days[month] && calendarInfo.length > 0) {
                      if (calendarInfo[d - 1]?.workouts.length === 0) {
                        day_type = 'type2';
                      } else {
                        day_type = 'type1';
                      }
                    } else {
                      day_type = 'type2';
                    }
                    return (
                      <Day
                        className={day_type}
                        key={index}
                        onClick={() => {
                          if (day_type !== 'future_day') {
                            clickDate(year, month, d);
                          }
                        }}
                      >
                        <DayContent className={day_type}>{d > 0 ? (d <= days[month] ? d : '') : ''}</DayContent>
                      </Day>
                    );
                  })}
              </Body>
            </Frame>
          </CalendarWrapper>
          <MemoWrapper>
            <Frame className="memo">
              <MemoTitleWrapper>
                Notes
                <MemoEditButton
                  onClick={() => memoOnClick()}
                  src={require('assets/images/workout_log/memo/memo_edit.png')}
                ></MemoEditButton>
              </MemoTitleWrapper>
              <MemoContentWrapper>
                {memo_write_mode ? <MemoInput value={memo} onChange={e => setMemo(e.target.value)} /> : memo}
              </MemoContentWrapper>
            </Frame>
          </MemoWrapper>
        </LeftWrapper>
        <RightWrapper>
          <LogWrapper>
            <LogUpper>
              <DateWrapper>
                {selected_year}.{selected_month + 1}.{selected_date}
              </DateWrapper>
              <AnyButton onClick={() => routineClick()}>루틴</AnyButton>
              <AnyButton
                disabled={
                  isCopy
                    ? copy_date.getFullYear() === selected_year &&
                      copy_date.getMonth() === selected_month &&
                      copy_date.getDate() === selected_date
                      ? true
                      : false
                    : true
                }
                onClick={() => pasteDailyLog()}
              >
                불러오기
              </AnyButton>
              <AnyButton onClick={() => copyDailyLog()}>내보내기</AnyButton>
              <AnyButton>저장</AnyButton>
              <AnyButton onClick={() => addRoutineClick()}>루틴추가</AnyButton>
            </LogUpper>
            <Frame className="right">
              <LogHeader>
                <LogCategory className="type">종류</LogCategory>
                <LogCategory className="type2">강도</LogCategory>
                <LogCategory>반복</LogCategory>
                <LogCategory>세트</LogCategory>
                <LogCategory className="type2">시간</LogCategory>
              </LogHeader>
              <LogInputBody>
                <LogInputBody_input>
                  <WorkoutTypeInput
                    type="text"
                    value={workout_type || ''}
                    onChange={e => setWorkoutType(e.target.value)}
                  />
                  <WorkoutTypeInput
                    className="type2"
                    type="number"
                    min="0"
                    value={weight || 0}
                    onChange={e => setWeight(Number(e.target.value))}
                  />
                  <WorkoutTypeInput
                    className="type1"
                    type="number"
                    min="0"
                    value={rep || 0}
                    onChange={e => setRep(Number(e.target.value))}
                  />
                  <WorkoutTypeInput
                    className="type1"
                    type="number"
                    min="0"
                    value={set || 0}
                    onChange={e => setSet(Number(e.target.value))}
                  />
                  <WorkoutTypeInput
                    className="type2"
                    type="number"
                    min="0"
                    value={workout_time || 0}
                    onChange={e => setWorkoutTime(Number(e.target.value))}
                  />
                </LogInputBody_input>
                <LogInputBody_button>
                  <AnyButton className="type1">취소</AnyButton>
                  <AnyButton className="type1" onClick={() => createWorkoutLog()}>
                    완료
                  </AnyButton>
                </LogInputBody_button>
              </LogInputBody>
              <LogBody>
                {dailyFitElements.length === 0 ? (
                  <CenterContentWrapper>운동 기록을 추가하세요!</CenterContentWrapper>
                ) : (
                  dailyFitElements.map((fitelement, index) => (
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
                  ))
                )}
              </LogBody>
              <LogFooter></LogFooter>
            </Frame>
          </LogWrapper>
        </RightWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default WorkoutLog;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1200px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
`;

const LeftWrapper = styled.div`
  width: 40%;
  height: 92vh;
  min-width: 480px;
  max-width: 480px;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const CalendarWrapper = styled.div`
  width: 100%;
  height: 80%;
  min-height: 500px;
  max-height: 500px;
  min-width: 480px;
  max-width: 480px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
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

const YearMonth = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Year = styled.div`
  height: 40%;
  width: 100%;
  font-size: 15px;
  justify-content: center;

  && {
    font-weight: normal;
  }
`;

const Month = styled.div`
  height: 60%;
  width: 100%;
  font-weight: bold;
  justify-content: center;
`;

const CalendarHeader = styled.div`
  font-size: 18px;
  width: 50%;
  padding: 20px 10px 0px 10px;
  font-family: IBMPlexSansThaiLooped;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.div`
  font-family: IBMPlexSansThaiLooped;
  cursor: pointer;
  font-weight: bold;
`;

const Body = styled.div`
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
  font-weight: normal;
`;

const Day = styled.div`
  width: 14.2%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  cursor: pointer;
  color: black;

  && {
    font-weight: normal;
  }

  &&.sunday {
    color: red;
  }

  &&.saturday {
    color: blue;
  }

  &&.future_day {
    font-weight: bold;
  }
`;

const DayContent = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  cursor: pointer;
  color: black;

  &&.selected_day {
    color: #0000cc;
    background-color: #818281;
    font-weight: bold;
    border-radius: 50%;
  }

  &&.today {
    color: black;
    font-weight: bold;
    background-color: #99ffff;
    border-radius: 50%;
  }

  &&.type1 {
    color: black;
    font-weight: bold;
    background-color: #d7efe3;
    border-radius: 50%;
  }

  &&.type2 {
    color: black;
    font-weight: bold;
  }

  &&.future_day {
    font-weight: bold;
    color: #a9a9a9;
  }
`;

const MemoWrapper = styled.div`
  width: 100%;
  height: 20%;
  min-height: 200px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const MemoEditButton = styled.img`
  display: flex;
  height: 75%;
  margin-left: 3px;
  align-items: center;
  justify-content: center;
`;

const MemoInput = styled.input`
  width: 400px;
  height: 50%;
  padding: 8px 20px;
  font-size: 10px;
`;

const MemoTitleWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 10%;
  width: 90%;
  font-family: IBMPlexSansThaiLooped;
  font-size: 20px;
  font-weight: 600;
  justify-content: start;
`;

const DateWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 20%;
  width: 90%;
  font-family: IBMPlexSansThaiLooped;
  font-size: 15px;
  font-weight: 600;
  justify-content: start;
`;

const MemoContentWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 80%;
  align-items: center;
  font-family: IBMPlexSansThaiLooped;
  font-size: 14px;
  font-weight: 600;
  color: #818281;
`;

const CenterContentWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 60vh;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  font-size: 30px;
  font-weight: 400;
  color: #818281;
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
`;

const RightWrapper = styled.div`
  width: 60%;
  height: 100%;
  min-width: 680px;
  max-width: 680px;
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: start;
  background-color: #ffffff;
`;

const LeftUpper = styled.div`
  width: 90%;
  height: 10%;
  min-height: 10vh;
  margin-left: 35px;
  display: flex;
  justify-content: start;
  align-items: end;
`;

const LogUpper = styled.div`
  width: 90%;
  height: 10%;
  min-height: 10vh;
  display: flex;
  align-items: end;
  justify-content: end;
`;

const LogWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 78vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogHeader = styled.div`
  font-size: 18px;
  width: 100%;
  height: 10%;
  border-bottom: 1px solid black;
  padding: 10px 0px 5px 0px;
  font-family: IBMPlexSansThaiLooped;
  display: flex;

  justify-content: center;
  align-items: center;
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

const LogInputBody_input = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  min-height: 60px;
  font-weight: normal;
`;

const WorkoutTypeInput = styled.input`
  width: 40%;
  height: 100%;
  padding: 8px 20px;
  font-size: 10px;
  margin: 7px;

  &&.type1 {
    width: 10%;
  }
  &&.type2 {
    width: 20%;
  }
`;

const LogInputBody_button = styled.div`
  width: 100%;
  height: 20%;
  min-height: 40px;
  display: flex;
  justify-content: end;
  font-weight: normal;
`;

const LogInputBody = styled.div`
  width: 100%;
  height: 10%;
  max-height: 90px;
  display: flex;
  flex-direction: column;
  font-weight: normal;
  border-bottom: 1px solid black;
`;

const LogBody = styled.div`
  width: 100%;
  height: 90%;
  min-height: 62vh;
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  align-items: start;
  font-weight: normal;
`;

const LogFooter = styled.div`
  width: 100%;
  height: 10%;
  min-height: 8vh;
  display: flex;
  flex-wrap: wrap;
  font-weight: normal;
  background-color: #d7efe3;
  border-top: 1px solid black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
