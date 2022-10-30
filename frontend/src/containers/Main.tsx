import useCheckAuth from 'hooks/useCheckAuth';
import styled from 'styled-components';

const Main = () => {
  useCheckAuth();
  return (
    <Wrapper>
      <div>Main Page</div>
      <div>Login Success!</div>
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
