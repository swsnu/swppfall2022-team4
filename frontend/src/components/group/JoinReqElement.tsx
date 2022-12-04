import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { groupActions } from 'store/slices/group';
export interface IProps {
  id: number;
  image: string;
  username: string;
  level: number;
  is_full: boolean;
}

export const JoinReqElement = (props: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { group_id } = useParams<{ group_id: string }>();

  const postRequestClick = () => {
    if (group_id) {
      dispatch(
        groupActions.postRequest({
          group_id: group_id,
          username: props.username,
        }),
      );
    }
  };
  const deleteRequestClick = () => {
    if (group_id) {
      dispatch(
        groupActions.deleteRequest({
          group_id: group_id,
          username: props.username,
        }),
      );
    }
  };

  return (
    <JoinReqElementWrapper>
      <ProfileImage
        src={process.env.REACT_APP_API_IMAGE + props.image}
        alt="profile"
        onClick={() => navigate(`/profile/${props.username}`)}
      />
      <JoinReqElementLineWrapper>
        <JoinReqElementLine style={{ fontWeight: '600' }}>{props.username}</JoinReqElementLine>
        <JoinReqElementLine>Level: {props.level}</JoinReqElementLine>
      </JoinReqElementLineWrapper>
      <div>
        <Button
          className={props.is_full ? 'disabled' : 'ing'}
          style={{ fontSize: '15px' }}
          onClick={postRequestClick}
          disabled={props.is_full}
        >
          승인
        </Button>
        <Button className="remove" style={{ fontSize: '15px' }} onClick={deleteRequestClick}>
          삭제
        </Button>
      </div>
    </JoinReqElementWrapper>
  );
};

const JoinReqElementWrapper = styled.div`
  width: 300px;
  height: 120px;
  background-color: aliceblue;
  margin: 10px 0;

  display: flex;
  align-items: center;

  border-radius: 15px;
  background-color: #e4fff1;
  box-shadow: 1px 1px 1px 1px #d4eee0;
  padding: 15px;
`;
const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border: 2px solid #00000032;
  border-radius: 10px;
  margin-right: 15px;
  background-color: #ffffff;
  cursor: pointer;
`;
const JoinReqElementLineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;
const JoinReqElementLine = styled.div`
  font-size: 18px;
  font-family: IBMPlexSansThaiLooped;
`;
const Button = styled.button`
  width: 50px;
  height: 40px;
  border: 0;
  margin: 3px;
  border-radius: 5px;
  background-color: #349c66;
  color: white;
  font-size: 20px;
  font-family: FugazOne;
  cursor: pointer;
  transition: background-color 0.15s linear;
  &:hover {
    background-color: #3bb978;
  }

  &&.disabled {
    color: black;
    background-color: silver;
    cursor: default;
  }

  &&.remove {
    background-color: #f29886;
  }
`;
