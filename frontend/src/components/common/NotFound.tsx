import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button4 from './buttons/Button4';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <NumberText>404</NumberText>
      <NotFoundText>Not Found</NotFoundText>
      <Button4 content="Home" clicked={() => navigate('/')} style={{ marginTop: '50px' }} />
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
