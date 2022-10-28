import useCheckAuth from 'hooks/useCheckAuth';
import { useNavigate } from 'react-router';

const Main = () => {
  useCheckAuth();
  const navigate = useNavigate();
  return (
    <div>
      <div>Main Page</div>
      <div>Login Success!</div>
      <button onClick={e => navigate('/post')}>Go to post</button>
    </div>
  );
};

export default Main;
