import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { MESSAGE_LIST } from '../../../atoms/AtomStates';
import { useAuth } from '../../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const MessageList = ({ onSendMessage }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageList] = useAtom(MESSAGE_LIST);
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');


  const handleClosePopup = () => {
    setSelectedMessage(null);
  };

  function formatFullDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const week = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const isAM = hours < 12;
    const ampm = isAM ? '오전' : '오후';
    if (!isAM) hours = hours === 12 ? 12 : hours - 12;
    if (hours === 0) hours = 12;
    return `${year}년 ${month}월 ${day}일 (${week}) ${ampm} ${hours}:${minutes}`;
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const isAM = hours < 12;
    const ampm = isAM ? '오전' : '오후';
    if (!isAM) hours = hours === 12 ? 12 : hours - 12;
    if (hours === 0) hours = 12;
    return `${ampm} ${hours}:${minutes}`;
  }

  const orderedMessages = [...messageList].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const messageEndRef = useRef(null);


  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, []); 

  let lastDate = null;
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');

  };

  return (
    <>
     
<ChatWrapper>
  <MessageContainer>
    {orderedMessages.length > 0 ? (
        orderedMessages.map((message, idx) => {
          const dateObj = new Date(message.timestamp);
          const dateStr = `${dateObj.getFullYear()}.${dateObj.getMonth() + 1}.${dateObj.getDate()}`;
          const showDate = idx === 0 || lastDate !== dateStr;
          lastDate = dateStr;
          const isSent = message.creatorId === user.id;
          return (
            <React.Fragment key={message.sk}>
              {showDate && (
                <DateDivider>
                  {formatFullDateTime(message.timestamp)}
                </DateDivider>
              )}
              <MessageCard isSent={isSent}>
                <MessageBubble isSent={isSent}>
                  {message.messageContent}
                </MessageBubble>
                <MessageMeta isSent={isSent}>
                  {formatTime(message.timestamp)}
                </MessageMeta>
              </MessageCard>
            </React.Fragment>
          );
        })
      ) : (
        <MessageCard>쪽지가 없습니다. 쪽지를 보내주세요.</MessageCard>
      )}
      <div ref={messageEndRef} />

        <ChatInputBar>
          <InputWrapper>
            <Input
              type="text"
              placeholder="내용을 입력해주세요"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <SendButton onClick={handleSend}>
              <FontAwesomeIcon icon={faPaperPlane} /> 
            </SendButton>
          </InputWrapper>
        </ChatInputBar>
    </MessageContainer>
</ChatWrapper>


      {selectedMessage && (
        <PopupOverlay onClick={handleClosePopup}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>{selectedMessage.title}</PopupTitle>
              <CloseButton onClick={handleClosePopup}>✕</CloseButton>
            </PopupHeader>
            <MessageTextArea 
              value={selectedMessage.messageContent} 
              readOnly 
            />
          </PopupContainer>
        </PopupOverlay>
      )}
    </>
  );
};

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden; 
  height: 100%;   
`;

const MessageContainer = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding-right: 12px;      
  padding-bottom: 60px; 
`;

const MessageCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isSent }) => (isSent ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`;

const MessageBubble = styled.div`
  background-color: ${({ isSent }) => (isSent ? '#e5f6ff' : '#ededed')};
  color: #222;
  padding: 16px 18px;
  border-radius: 16px;
  max-width: 60%;
  word-break: break-all;
  margin-bottom: 4px;
  align-self: ${({ isSent }) => (isSent ? 'flex-end' : 'flex-start')};
`;

const MessageMeta = styled.div`
  font-size: 13px;
  color: #888;
  margin: 2px 8px 10px 8px;
  align-self: ${({ isSent }) => (isSent ? 'flex-end' : 'flex-start')};
`;


const PopupOverlay = styled.div`
   position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #A0DAFB;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 80%;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PopupTitle = styled.h3`
   margin: 0;
  font-size: 18px;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
`;

const MessageTextArea = styled.textarea`
   width: 90%;
  height: 200px;
  padding: 10px;
  border: 2px solid #A0DAFB;
  border-radius: 5px;
  resize: none;
  margin-bottom: 20px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #e5efff;
  }
`;


const DateDivider = styled.div`
  text-align: center;
  color: #888;
  font-size: 15px;
  margin: 18px 0 8px 0;
  font-weight: 500;
`;

const ChatInputBar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  padding-top: 5px;
  z-index: 10;
  height: 50px; 
`;


const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border: 1.5px solid #ededed;
  padding: 0 16px;
  height: 30px;
  margin-right:20px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  background: transparent;
  color: #222;
  &::placeholder {
    color: #ccc;
    font-size: 18px;
  }
`;

const SendButton = styled.button`
  width: 24px;
  height: 24px;
  background: #00baff;
  border: none;
  border-radius: 50%;
  margin-left: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default MessageList;