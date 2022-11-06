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
      <MemberElementLine>{props.image}</MemberElementLine>
      <MemberElementLine>{props.username}</MemberElementLine>
      <MemberElementLine>{props.cert_days}</MemberElementLine>
      <MemberElementLine>{props.level}</MemberElementLine>
    </MemberElementWrapper>
  );
};

const MemberElementWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 10vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid black;
  font-weight: normal;
  flex-direction: column;
`;

const MemberElementLine = styled.div`
  width: 10%;
  height: 20px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: IBMPlexSansThaiLooped;
  color: black;
`;
