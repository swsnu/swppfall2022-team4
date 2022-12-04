import styled from 'styled-components';
import Button1 from 'components/common/buttons/Button1';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { groupActions } from 'store/slices/group';
import { RootState } from 'index';
export interface IProps {
  id: number;
  image: string;
  username: string;
  cert_days: number;
  level: number;
  is_leader: boolean;
  leader: boolean;
  myself: boolean;
}

export const MemberElement = (props: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { group_id } = useParams<{ group_id: string }>();
  const user = useSelector(({ user }: RootState) => user.user);
  const socket = useSelector(({ chat }: RootState) => chat.socket);

  const leaderChangeClick = () => {
    if (group_id) {
      if (user && socket) {
        socket.send(
          JSON.stringify({
            type: 'notification',
            data: {
              category: 'group',
              info: props.username,
              content: `그룹장을 위임받았습니다.`,
              image: user.image,
              link: `/group/detail/${group_id}/`,
            },
          }),
        );
      }
      dispatch(
        groupActions.leaderChange({
          group_id: group_id,
          username: props.username,
        }),
      );
      navigate(`/group/detail/${group_id}`);
    }
  };

  return (
    <MemberElementWrapper className={props.myself ? 'myself' : 'others'}>
      <ProfileImage
        src={process.env.REACT_APP_API_IMAGE + props.image}
        alt="profile"
        onClick={() => navigate(`/profile/${props.username}`)}
      />
      <MemberElementLineWrapper>
        <MemberElementLine style={{ fontWeight: '600' }}>
          {props.is_leader ? '👑 ' + props.username : props.username}
        </MemberElementLine>
        <CertElementLine>{props.cert_days} 일째 인증 중!</CertElementLine>
        <MemberElementLine>Level: {props.level}</MemberElementLine>
      </MemberElementLineWrapper>
      {props.leader && !props.myself && (
        <Button1 content="그룹장 위임" style={{ fontSize: '15px' }} clicked={leaderChangeClick} />
      )}
    </MemberElementWrapper>
  );
};

const MemberElementWrapper = styled.div`
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

  &&.myself {
    background-color: #5bc88f;
  }
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

const MemberElementLineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;
const MemberElementLine = styled.div`
  font-size: 18px;
  font-family: IBMPlexSansThaiLooped;
`;
const CertElementLine = styled.div`
  font-size: 18px;
  font-family: FugazOne;
`;
