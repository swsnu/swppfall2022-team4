import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import styled from 'styled-components';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <NumberText>404</NumberText>
      <NotFoundText>Not Found</NotFoundText>
      <Home onClick={() => navigate('/')}>
        <BiArrowBack />
        Home
      </Home>
    </Wrapper>
  );
};

export default NotFound;

const Wrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
`;
const NumberText = styled.div`
  font-size: 160px;
  color: #606060;
  font-family: 'Red Hat Mono', monospace;
  margin-bottom: 15px;
`;
const NotFoundText = styled.div`
  font-size: 27px;
  font-family: 'Press Start 2P', cursive;
  color: #606060;
`;
const Home = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
  font-size: 24px;
  font-family: 'Press Start 2P', cursive;
  color: #9b9b9b;
  svg {
    width: 30px;
    height: 30px;
    margin: 0 10px 1.5px 0;
  }
  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    color: black;
  }
`;
