import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'index';
import { groupActions } from 'store/slices/group';

import { FitElement } from 'components/fitelement/FitElement';
import { workoutLogActions } from 'store/slices/workout';
import Loading from 'components/common/Loading';
import { createCertRequestType, Fitelement, getCertsRequestType } from 'store/apis/group';
import Button1 from 'components/common/buttons/Button1';
import Button4 from 'components/common/buttons/Button4';

const GroupCert = () => {
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
  const [selectedGoal, setSelectedGoal] = useState<Fitelement | null>(null);

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
  const clickDate = (year: number, month: number, d: number) => {
    if (group_id) {
      setDate(new Date(year, month, d));
      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDay(d);
      const getCerts: getCertsRequestType = {
        group_id: group_id,
        year: selected_year,
        month: selected_month,
        specific_date: selected_date,
      };
      dispatch(groupActions.getCerts(getCerts));
    }
  };
  const setGoal = (id: number) => {
    if (group_detail) {
      setSelectedGoal(group_detail.goal[id]);
    }
  };
  const submitCert = () => {
    if (group_id && selectedGoal) {
      setDate(new Date(selected_year, selected_month, selected_date));
      setSelectedYear(selected_year);
      setSelectedMonth(selected_month);
      setSelectedDay(selected_date);
      const createCertRequest: createCertRequestType = {
        group_id: group_id,
        fitelement_id: selectedGoal.id,
        year: selected_year,
        month: selected_month,
        specific_date: selected_date,
      };
      dispatch(groupActions.createCert(createCertRequest));
    }
  };

  const calendarInfo = useSelector((rootState: RootState) => rootState.workout_log.calendar_info);
  const group_detail = useSelector(({ group }: RootState) => group.groupDetail.group);
  const all_certs = useSelector(({ group }: RootState) => group.groupCerts.all_certs);
  const { group_id } = useParams<{ group_id: string }>();

  useEffect(() => {
    if (group_id) {
      dispatch(groupActions.getGroupDetail(group_id));
      const getCerts: getCertsRequestType = {
        group_id: group_id,
        year: selected_year,
        month: selected_month,
        specific_date: selected_date,
      };
      dispatch(groupActions.getCerts(getCerts));
    }
    return () => {
      dispatch(groupActions.stateRefresh());
    };
  }, []);

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
  if (!group_id || !group_detail) return <Loading />;
  return (
    <Wrapper>
      <TitleWrapper>
        <Button4 content="Back" clicked={() => navigate(`/group/detail/${group_id}/`)} />
        <Title>그룹 운동 인증</Title>
        <div style={{ width: '136px' }} />
      </TitleWrapper>
      <InnerWrapper>
        <LeftWrapper>
          <CalendarWrapper>
            <Frame>
              <CalendarHeader>
                <Button
                  onClick={() => {
                    dispatch(
                      workoutLogActions.getCalendarInfo({
                        user_id: 1,
                        year: month === 0 ? year - 1 : year,
                        month: month === 0 ? 12 : month,
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
                        year: month === 11 ? year + 1 : year,
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
                    if (year === selected_year && month === selected_month && d === selected_date) {
                      day_type = 'selected_day';
                    } else if (year > today.getFullYear()) {
                      day_type = 'future_day';
                    } else if (year === today.getFullYear() && month > today.getMonth()) {
                      day_type = 'future_day';
                    } else if (year === today.getFullYear() && month === today.getMonth() && d > today.getDate()) {
                      day_type = 'future_day';
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
                        data-testid="day_component"
                        key={index}
                        onClick={() => {
                          clickDate(year, month, d);
                        }}
                      >
                        <DayContent className={day_type}>{d > 0 ? (d <= days[month] ? d : '') : ''}</DayContent>
                      </Day>
                    );
                  })}
              </Body>
            </Frame>
          </CalendarWrapper>
        </LeftWrapper>
        <RightWrapper>
          <LogWrapper>
            <LogUpper>
              {selected_year}.{selected_month + 1}.{selected_date}
              <select style={{ height: '40px', fontFamily: 'NanumSquareR' }} onChange={e => setGoal(+e.target.value)}>
                <option key={-1} value={-1}>
                  목표를 지정하세요
                </option>
                {group_detail.goal.map((goal, index) => (
                  <option key={index} value={index}>
                    type: {goal.workout_type} category: {goal.category} rep: {goal.rep} set: {goal.set} time:
                    {goal.time}
                  </option>
                ))}
              </select>
              <Button1 content="완료" clicked={submitCert} style={{ width: '80px' }} />
            </LogUpper>
            <Frame className="right">
              <LogHeader>
                <LogCategory className="type">종류</LogCategory>
                <LogCategory className="type2">강도</LogCategory>
                <LogCategory className="type2">반복</LogCategory>
                <LogCategory className="type2">세트</LogCategory>
                <LogCategory className="type2">시간</LogCategory>
              </LogHeader>
              <LogBody>
                {all_certs &&
                  all_certs.map((item, index) => (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ProfileImage src={process.env.REACT_APP_API_IMAGE + item.member.image} alt="profile" />
                        <div style={{ paddingRight: '10px' }}>{item.member.username}</div>
                        <div>{item.member.nickname}</div>
                      </div>
                      {item.certs &&
                        item.certs.map((c, id) => (
                          <FitElement
                            key={index}
                            id={index + 1}
                            type={c.type}
                            workout_type={c.workout_type}
                            category={c.category}
                            weight={c.weight}
                            rep={c.rep}
                            set={c.set}
                            time={c.time}
                          />
                        ))}
                    </div>
                  ))}
              </LogBody>
            </Frame>
          </LogWrapper>
        </RightWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default GroupCert;

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
  padding-top: 7%;
`;

const CalendarWrapper = styled.div`
  width: 100%;
  height: 80%;
  min-height: 500px;
  max-height: 400px;
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

const LogUpper = styled.div`
  width: 90%;
  height: 10%;
  min-height: 10vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
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
  font-size: 17px;
  width: 100%;
  height: 10%;
  border-bottom: 1px solid black;
  padding: 10px 0px 18px 0px;
  font-family: IBMPlexSansThaiLooped;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogCategory = styled.div`
  width: 10%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
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
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  align-items: start;
  font-weight: normal;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  padding: 0 20px;

  @media all and (max-width: 560px) {
    margin: 40px 0 20px 0;
  }
`;
const Title = styled.div`
  margin-top: 20px;
  font-size: 45px;
  font-family: NanumSquareR;

  @media all and (max-width: 560px) {
    display: none;
  }
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border: 2px solid black;
  border-radius: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
`;