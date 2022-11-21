import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';
import { timeAgoFormat } from 'utils/datetime';

interface IProps {
  content: string;
  image: string;
  created: string;
  clicked: React.MouseEventHandler<HTMLDivElement>;
  clickedDelete: React.MouseEventHandler<HTMLDivElement>;
}

const NotificationDetail = ({ content, image, created, clicked, clickedDelete }: IProps) => {
  return (
    <Wrapper>
      <ContentWrapper onClick={clicked}>
        <Image src={process.env.REACT_APP_API_IMAGE + image} />
        <ContentSmallWrapper>
          <Content>{content}</Content>
          <Created>{timeAgoFormat(new Date(), new Date(created))}</Created>
        </ContentSmallWrapper>
      </ContentWrapper>
      <CloseButtonWrapper onClick={clickedDelete}>
        <CloseButton />
      </CloseButtonWrapper>
    </Wrapper>
  );
};

export default NotificationDetail;

const Wrapper = styled.div`
  width: 100%;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ContentWrapper = styled.div`
  width: calc(100% - 40px);
  display: flex;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffffffb1;
  transition: box-shadow 0.15s linear;
  &:hover {
    background-color: #ffffff;
    box-shadow: 0px 0px 1px 1px #797979af;
  }
`;
const Image = styled.img`
  width: 60px;
  height: 60px;
  border: 1px solid #a1a1a1;
  border-radius: 10px;
  margin: 0 20px 0 0;
`;
const ContentSmallWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 5px;
`;
const Content = styled.div`
  word-wrap: break-word;
  font-size: 17px;
`;
const Created = styled.div`
  width: 100%;
  text-align: end;
  margin-top: 5px;
  font-size: 15px;
  color: #646464;
  justify-self: flex-end;
`;
const CloseButtonWrapper = styled.div`
  svg {
    width: 30px !important;
    height: 30px !important;
  }
`;
const CloseButton = styled(AiOutlineClose)`
  color: #9d9d9d;
  transition: color 0.15s linear;
  cursor: pointer;
  &:hover {
    color: #000000;
  }
`;
