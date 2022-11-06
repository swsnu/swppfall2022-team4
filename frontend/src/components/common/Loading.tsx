import styled from 'styled-components';

const Loading = () => {
  return (
    <Wrapper>
      <Text>FITogether</Text>
      <LoadingComponent r="80px" />
    </Wrapper>
  );
};

export default Loading;

export const LoadingWithoutMinHeight = () => {
  return (
    <WrapperWithoutMinheight>
      <Text>FITogether</Text>
      <LoadingComponent r="80px" />
    </WrapperWithoutMinheight>
  );
};

export const LoadingBox = ({ r }: { r: string }) => {
  return (
    <FlexBox>
      <LoadingComponent r={r} />
    </FlexBox>
  );
};
export const LoadingComponent = ({ r }: { r: string }) => {
  return <LoadingItem style={{ width: r, height: r }} />;
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const WrapperWithoutMinheight = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Text = styled.div`
  font-size: 60px;
  font-family: FugazOne;
  letter-spacing: -3px;
  margin-bottom: 30px;
  animation: opacityChange 2s infinite linear;
  @keyframes opacityChange {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 0.8;
    }
  }
`;
const FlexBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LoadingItem = styled.div`
  border: 3px solid #565656;
  border-top-color: white;
  border-right-color: white;
  border-radius: 100%;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  animation: spin 1s infinite linear;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;
