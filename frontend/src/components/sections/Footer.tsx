import { FaGithub } from 'react-icons/fa';
import styled from 'styled-components';

const Footer = () => {
  return (
    <Wrapper>
      <LeftWrapper>
        <TitleWrapper>
          <Title>FITogether</Title>
          <a target="_blank" href="https://github.com/swsnu/swppfall2022-team4">
            <FaGithub />
          </a>
        </TitleWrapper>
        <Content>SNU SWPP 2022. Team 4.</Content>
      </LeftWrapper>
      <RightWrapper>
        <RightColumnWrapper>
          <div>Junyoung Kim</div>
          <div>Jihyung Ko</div>
        </RightColumnWrapper>
        <RightColumnWrapper>
          <div>Seungha Jeon</div>
          <div>Junho Choi</div>
        </RightColumnWrapper>
      </RightWrapper>
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #474747;
  color: #fff;
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0 20px;
  position: relative;
`;
const LeftWrapper = styled.div`
  width: 150px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  a,
  svg {
    width: 24px;
    height: 24px;
  }
`;
const Title = styled.div`
  font-size: 20px;
  line-height: 30px;
  margin-right: 10px;
`;
const Content = styled.div`
  font-size: 14px;
  margin-top: 10px;
`;
const RightWrapper = styled.div`
  width: 195px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  color: #e5e5e5;

  @media all and (max-width: 435px) {
    width: 90px;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }
`;
const RightColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  text-align: center;

  @media all and (max-width: 435px) {
    gap: 4px;
    font-size: 16px;
  }
`;
