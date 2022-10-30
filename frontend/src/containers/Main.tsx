import useCheckAuth from 'hooks/useCheckAuth';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const Main = () => {
  useCheckAuth();
  const navigate = useNavigate();
  return (
    <Wrapper>
      <div>Main Page</div>
      <div>Login Success!</div>
      <button onClick={() => navigate('/post')}>Go to post</button>
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
