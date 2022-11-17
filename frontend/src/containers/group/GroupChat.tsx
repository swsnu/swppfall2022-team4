import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsFillPencilFill } from 'react-icons/bs';
import styled from 'styled-components';
import { chatActions } from 'store/slices/chat';
import { RootState } from 'index';
import { MyMessage, OtherGroupMessage } from 'components/chat/Message';

const GroupChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chatRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const { group_id } = useParams<{ group_id: string }>();
  const [input, setInput] = useState('');
  const { user, socket, messageList } = useSelector(({ user, chat }: RootState) => ({
    user: user.user,
    socket: chat.socket,
    messageList: chat.messageList,
  }));

  useEffect(() => {
    dispatch(chatActions.getGroupMessageList(group_id || '-1'));
    return () => {
      dispatch(chatActions.resetChat());
    };
  }, []);

  useEffect(() => {
    scrollEnd();
  }, [messageList]);

  const scrollEnd = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };
  const onSendMessage = () => {
    if (!user || input === '') return;
    socket.send(
      JSON.stringify({
        type: 'group',
        data: {
          author: user.username,
          group: group_id,
          content: input.substring(0, 255),
        },
      }),
    );
    setInput('');
  };

  if (!user) return <div>no user</div>;
  return (
    <Wrapper>
      <ChatroomWrapper>
        <ChatWrapper ref={chatRef}>
          {messageList.map(message => (
            <div key={message.id}>
              {message.author?.username === user.username ? (
                <MyMessage message={message} />
              ) : (
                <OtherGroupMessage message={message} />
              )}
            </div>
          ))}
        </ChatWrapper>
        <InputWrapper>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') onSendMessage();
            }}
            placeholder="채팅을 입력하세요."
          />
          <InputWriteButton onClick={onSendMessage}>
            <BsFillPencilFill />
          </InputWriteButton>
        </InputWrapper>
      </ChatroomWrapper>
    </Wrapper>
  );
};

export default GroupChat;

const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
  height: calc(100vh - 60px);
  min-height: 400px;
  display: flex;
`;
const ChatroomWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  min-height: 400px;
  background-color: #fbfff8;
  border-right: 1px solid #d1d1d1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ChatWrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const InputWrapper = styled.div`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 20px #46464644;
  background-color: #ffffff;
  display: flex;
  border-top: 1px solid #d1d1d1;
`;
const Input = styled.input`
  width: calc(100% - 45px);
  height: 40px;
  border: 0;
  border-radius: 5px;
  background-color: #00000010;
  padding: 0 10px;
  font-size: 16px;
`;
const InputWriteButton = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  background-color: #7c7c7c;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s linear;
  svg {
    color: white;
    width: 20px;
    height: 20px;
  }
  &:hover {
    background-color: #525252;
  }
`;
