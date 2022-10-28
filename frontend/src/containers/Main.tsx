import useCheckAuth from 'hooks/useCheckAuth';

const Main = () => {
  useCheckAuth();

  return (
    <div>
      <div>Main Page</div>
      <div>Login Success!</div>
    </div>
  );
};

export default Main;
