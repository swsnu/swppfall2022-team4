import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';
import { timeAgoFormat } from 'utils/datetime';

interface IProps {
  category: string;
  content: string;
  image: string;
  created: string;
  clicked: React.MouseEventHandler<HTMLDivElement>;
  clickedDelete: React.MouseEventHandler<HTMLDivElement>;
}

const NotificationItem = ({ category, content, image, created, clicked, clickedDelete }: IProps) => {
  return (
    <Wrapper>
      <ContentWrapper onClick={clicked}>
        <Image src={process.env.REACT_APP_API_IMAGE + image} />
        <Content>{content}</Content>
        <Created>{timeAgoFormat(created)}</Created>
      </ContentWrapper>
      <CloseButtonWrapper onClick={clickedDelete}>
        <CloseButton />
      </CloseButtonWrapper>
    </Wrapper>
  );
};

export default NotificationItem;

const Wrapper = styled.div`
  width: 100%;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ContentWrapper = styled.div`
  width: calc(100% - 24px);
  padding: 8px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #ffffffb1;
  transition: box-shadow 0.15s linear;
  &:hover {
    background-color: #ffffff;
    box-shadow: 1px 1px 2px 2px #bdbdbd;
  }
`;
const Image = styled.img`
  width: 40px;
  height: 40px;
  border: 1px solid #a1a1a1;
  border-radius: 10px;
  margin: 0 8px 5px 0;
  float: left;
`;
const Content = styled.div`
  word-wrap: break-word;
`;
const Created = styled.div`
  width: 100%;
  text-align: end;
  margin-top: 5px;
  font-size: 14px;
  color: #464646;
`;
const CloseButtonWrapper = styled.div`
  svg {
    width: 20px !important;
    height: 20px !important;
  }
`;
const CloseButton = styled(AiOutlineClose)`
  color: #9d9d9d;
  transition: color 0.15s linear;
  &:hover {
    color: #000000;
  }
`;
