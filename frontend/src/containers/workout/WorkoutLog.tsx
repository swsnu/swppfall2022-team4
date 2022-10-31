import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FitElement } from 'components/fitelement/FitElement';
import { workoutLogActions } from 'store/slices/workout';
import { getFitElementRequestType } from 'store/apis/workout';

const WorkoutLog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_OF_THE_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const example_fitelements = [
    {
      type: 'log',
      workout_type: '스쿼트',
      category: 'leg',
      weight: 100,
      rep: 10,
      set: 5,
      time: 20,
    },
    {
      type: 'log',
      workout_type: '데드리프트',
      category: 'leg',
      weight: 80,
      rep: 7,
      set: 6,
      time: 15,
    },
  ];

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [startDay, setStartDay] = useState(getStartDayOfMonth(date));

  function getStartDayOfMonth(date: Date) {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let selected_day = 0;
    if (day < 7) {
      selected_day = day + 1;
    } else {
      selected_day = 0;
    }
    return selected_day;
  }

  const defaultConfig: getFitElementRequestType = {
    fitelement_id: 1
  };

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartDay(getStartDayOfMonth(date));
    dispatch(workoutLogActions.getFitElement(defaultConfig));
  }, [date]);

  function isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  const days = isLeapYear(date.getFullYear()) ? DAYS_LEAP : DAYS;

  // header 추가
  return (
    <Wrapper>
      <HeaderWrapper_temp>HeaderPart</HeaderWrapper_temp>
      <InnerWrapper>
        <LeftWrapper>
          <CalendarWrapper>
            <Frame>
              <CalendarHeader>
                <Button onClick={() => setDate(new Date(year, month - 1, day))}>{'<'}</Button>
                <YearMonth>
                  <Year>{year}</Year>
                  <Month>{MONTHS[month]}</Month>
                </YearMonth>

                <Button onClick={() => setDate(new Date(year, month + 1, day))}>{'>'}</Button>
              </CalendarHeader>
              <Body>
                {DAYS_OF_THE_WEEK.map(d =>
                  d == 'SUN' ? (
                    <Day className="sunday" key={d}>
                      {d}
                    </Day>
                  ) : d == 'SAT' ? (
                    <Day className="saturday" key={d}>
                      {d}
                    </Day>
                  ) : (
                    <Day key={d}>{d}</Day>
                  ),
                )}
                {Array(days[month] + (startDay - 1))
                  .fill(null)
                  .map((_, index) => {
                    const d = index - (startDay - 2);
                    return (
                      <Day key={index} onClick={() => setDate(new Date(year, month, d))}>
                        {d > 0 ? d : ''}
                      </Day>
                    );
                  })}
              </Body>
            </Frame>
          </CalendarWrapper>
          <MemoWrapper>
            <Frame className="memo">
              <MemoTitleWrapper>Notes</MemoTitleWrapper>
              <MemoContentWrapper>여기에 내용을 입력해주세요.</MemoContentWrapper>
            </Frame>
          </MemoWrapper>
        </LeftWrapper>
        <RightWrapper>
          <LogWrapper>
            <LogUpper>
              <AnyButton>루틴</AnyButton>
              <AnyButton>불러오기</AnyButton>
              <AnyButton>내보내기</AnyButton>
              <AnyButton>저장</AnyButton>
            </LogUpper>
            <Frame className="right">
              <LogHeader>
                <LogCategory className="type">종류</LogCategory>
                <LogCategory className="type2">강도</LogCategory>
                <LogCategory>반복</LogCategory>
                <LogCategory>세트</LogCategory>
                <LogCategory className="type2">시간</LogCategory>
              </LogHeader>
              <LogBody>
                {example_fitelements.map((fitelement, index) => (
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
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper_temp = styled.div`
  width: 100%;
  height: 8%;
  min-width: 100vw;
  min-height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e4f2e4;
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 92%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LeftWrapper = styled.div`
  width: 40%;
  height: 92vh;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CalendarWrapper = styled.div`
  width: 100%;
  height: 80%;
  margin-top: 10vh;
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
`;

const MemoWrapper = styled.div`
  width: 100%;
  height: 20%;
  min-height: 20vh;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const MemoTitleWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 20%;
  width: 90%;
  font-family: IBMPlexSansThaiLooped;
  font-size: 20px;
  font-weight: 600;
  justify-content: start;
`;

const MemoContentWrapper = styled.div`
  display: flex;
  margin: 10px;
  height: 80%;
  align-items: center;
  font-family: IBMPlexSansThaiLooped;
  font-size: 10px;
  font-weight: 600;
  color: #818281;
`;

const AnyButton = styled.button`
  width: 70px;
  height: 30px;
  margin: 5px;
  background-color: #d7efe3;
  border: 0;
  border-radius: 8px;
  font-family: FugazOne;
  font-size: 10px;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }
`;

const RightWrapper = styled.div`
  width: 60%;
  height: 100%;
  min-height: 92vh;
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: start;
  background-color: #ffffff;
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

const LogBody = styled.div`
  width: 100%;
  height: 90%;
  min-height: 62vh;
  display: flex;
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 5px;
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
