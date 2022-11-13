import styled from 'styled-components';

export interface IProps {
  id: number;
  image: string;
  username: string;
  cert_days: number;
  level: number;
}

export const MemberElement = (props: IProps) => {
  return (
    <MemberElementWrapper>
      <ProfileImage src={process.env.REACT_APP_API_IMAGE + props.image} alt="profile" />
      <MemberElementLineWrapper>
        <MemberElementLine style={{ fontWeight: '600' }}>{props.username}</MemberElementLine>
        {/* <MemberElementLine>{props.cert_days}</MemberElementLine> */}
        <MemberElementLine>Level: {props.level}</MemberElementLine>
      </MemberElementLineWrapper>
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
