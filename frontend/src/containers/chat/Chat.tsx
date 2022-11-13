import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillPencilFill } from 'react-icons/bs';
import styled from 'styled-components';
import { RootState } from 'index';
import { chatActions } from 'store/slices/chat';

import ChatroomButton from 'components/chat/ChatroomButton';
import { MyMessage, OtherMessage } from 'components/chat/Message';

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chatRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const { id } = useParams();
  const [input, setInput] = useState('');
  const { user, socket, chatroomList, messageList } = useSelector(({ user, chat }: RootState) => ({
    user: user.user,
    socket: chat.socket,
    chatroomList: chat.chatroomList,
    messageList: chat.messageList,
  }));

  useEffect(() => {
    dispatch(chatActions.setWhere(id || 'lobby'));
    dispatch(chatActions.getChatroomList());
    return () => {
      dispatch(chatActions.setWhere(null));
    };
  }, []);
  useEffect(() => {
    setInput('');
    dispatch(chatActions.setWhere(id || 'lobby'));
    if (id) {
      dispatch(chatActions.getMessageList(id || ''));
    }
  }, [id]);
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
        type: '1:1',
        data: {
          author: user.username,
          room: id,
          content: input,
        },
      }),
    );
    setInput('');
  };

  if (!user) return <div>no user</div>;
  return (
    <Wrapper>
      <ChatroomListWrapper>
        <ChatroomListText>Chatting</ChatroomListText>
        {chatroomList.map(chatroom => (
          <ChatroomButton
            key={chatroom.id}
            user={chatroom.user}
            clicked={() => navigate(`/chat/${chatroom.id}`)}
            active={chatroom.id.toString() === id}
          />
        ))}
      </ChatroomListWrapper>

      <ChatroomWrapper>
        {id ? (
          <ChatWrapper ref={chatRef}>
            {messageList.map(message => (
              <div key={message.id}>
                {message.author?.username === user.username ? (
                  <MyMessage message={message} />
                ) : (
                  <OtherMessage message={message} />
                )}
              </div>
            ))}
          </ChatWrapper>
        ) : (
          <ChatWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
            <NoChatText>선택된 채팅방이 없습니다.</NoChatText>
          </ChatWrapper>
        )}

        {id && (
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
        )}
      </ChatroomWrapper>
    </Wrapper>
  );
};

export default Chat;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 60px);
  min-height: 400px;
  display: flex;

  @media all and (max-width: 735px) {
    flex-direction: column;
  }
`;
const ChatroomListWrapper = styled.div`
  width: 300px;
  height: calc(100vh - 60px);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border-left: 1px solid #d1d1d1;
  border-right: 1px solid #d1d1d1;
  padding: 20px 0;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  @media all and (max-width: 735px) {
    width: 100%;
    height: 300px;
    min-height: 300px;
    border: 1px solid #d1d1d1;
    border-bottom: 1px solid #363636;
  }
`;
const ChatroomListText = styled.div`
  font-size: 32px;
  font-family: FugazOne;
  padding: 15px;
  border-bottom: 1px solid #d1d1d1;
  margin-bottom: 15px;
`;
const ChatroomWrapper = styled.div`
  width: calc(100% - 300px);
  height: calc(100vh - 60px);
  min-height: 400px;
  background-color: #fbfff8;
  border-right: 1px solid #d1d1d1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  @media all and (max-width: 735px) {
    width: 100%;
    height: calc(100vh - 360px);
    min-height: 300px;
    border: 1px solid #d1d1d1;
    border-bottom: 1px solid #363636;
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
const NoChatText = styled.div`
  color: #454545;
  font-size: 24px;
  font-family: NanumSquareR;
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
