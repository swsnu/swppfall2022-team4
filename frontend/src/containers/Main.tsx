import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WorkoutChart } from 'components/main/WorkoutChart';
import { workoutLogActions } from 'store/slices/workout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'index';

export type chartData = {
  date: String;
  calories: Number;
};

const Main = () => {
  const dispatch = useDispatch();

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());

  useEffect(() => {
    dispatch(
      workoutLogActions.getCalendarInfo({
        user_id: 1,
        year: year,
        month: month + 1,
      }),
    );
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const calendarInfo = useSelector((rootState: RootState) => rootState.workout_log.calendar_info);

  let calories_map: chartData[] = [];

  calendarInfo.map(single_date_info => {
    console.log(single_date_info);
    let sMonth = String(single_date_info.month);
    let sDate = String(single_date_info.date);
    //let sYear = String(single_date_info.year)
    sMonth = Number(sMonth) > 9 ? sMonth : '0' + sMonth;
    sDate = Number(sDate) > 9 ? sDate : '0' + sDate;
    const dateStringFormat = sMonth + '-' + sDate;
    calories_map.push({
      date: dateStringFormat,
      calories: single_date_info.calories,
    });
  });

  return (
    <Wrapper>
      <WorkoutChart info={calories_map} />
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
