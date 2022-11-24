import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WorkoutChart } from 'components/main/WorkoutChart';
import { workoutLogActions } from 'store/slices/workout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'index';

export type chartData = {
  date: string;
  calories: number;
};

const Main = () => {
  const dispatch = useDispatch();

  const today = new Date();
  // eslint-disable-next-line no-unused-vars
  const date = today;
  const month = date.getMonth();
  const year = date.getFullYear();
  const user = useSelector(({ user }: RootState) => user.user);

  useEffect(() => {
    dispatch(
      workoutLogActions.getCalendarInfo({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        username: user?.username!,
        year: year,
        month: month + 1,
      }),
    );
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const calendarInfo = useSelector((rootState: RootState) => rootState.workout_log.calendar_info);

  const calories_map: chartData[] = [];

  for (const child of calendarInfo) {
    let sMonth = String(child.month);
    let sDate = String(child.date);
    sMonth = sMonth.padStart(2, '0');
    sDate = sDate.padStart(2, '0');
    const dateStringFormat = sMonth + '-' + sDate;
    calories_map.push({
      date: dateStringFormat,
      calories: child.calories,
    });
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <SectionWrapper>
          <SectionItemWrapper>
            <WorkoutChart info={calories_map} />
          </SectionItemWrapper>
          <SectionItemWrapper></SectionItemWrapper>
          <SectionItemWrapper></SectionItemWrapper>
          <SectionItemWrapper></SectionItemWrapper>
        </SectionWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media all and (max-width: 650px) {
    width: 100%;
  }
`;

const SectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
  width: 100%;
  min-height: 600px;
  height: 70vh;
`;

const SectionItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px 20px;
  border: 1px solid black;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
