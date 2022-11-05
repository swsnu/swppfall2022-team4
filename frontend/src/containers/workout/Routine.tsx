import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const Routine = () => {
  const navigate = useNavigate();
  const calendarButtonClick = () => {
    navigate('/workout');
  };
  return (
    <Wrapper>
      <LeftWrapper>
        <LeftUpper>
          <ReturnButtonWrapper onClick={() => calendarButtonClick()}>{'< '} 달력으로 돌아가기</ReturnButtonWrapper>
        </LeftUpper>
        <Frame>
          <RoutineListWrapper></RoutineListWrapper>
        </Frame>
      </LeftWrapper>
      <RightWrapper>
        <RightUpper>
          <RoutineTitleWrapper>운동 루틴</RoutineTitleWrapper>
        </RightUpper>
        <Frame className="right">
          <LogWrapper></LogWrapper>
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
  justify-content: center;
`;

const LogWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
