import styled from 'styled-components';
import Button1 from 'components/common/buttons/Button1';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { groupActions } from 'store/slices/group';
export interface IProps {
  id: number;
  image: string;
  username: string;
  cert_days: number;
  level: number;
  leader: boolean;
  myself: boolean;
}

export const MemberElement = (props: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { group_id } = useParams<{ group_id: string }>();

  const leaderChangeClick = () => {
    if (group_id) {
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
    <MemberElementWrapper>
      <ProfileImage src={process.env.REACT_APP_API_IMAGE + props.image} alt="profile" />
      <MemberElementLineWrapper>
        <MemberElementLine style={{ fontWeight: '600' }}>{props.username}</MemberElementLine>
        <MemberElementLine>Cert_days: {props.cert_days}</MemberElementLine>
        <MemberElementLine>Level: {props.level}</MemberElementLine>
      </MemberElementLineWrapper>
      {props.leader && !props.myself && (
        <Button1 style={{ fontSize: '15px' }} content="그룹장 위임" clicked={leaderChangeClick} />
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
`;
const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border: 2px solid #00000032;
  border-radius: 10px;
  margin-right: 15px;
  background-color: #ffffff;
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
