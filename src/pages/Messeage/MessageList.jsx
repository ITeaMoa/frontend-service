import React, { useState } from 'react';
import styled from 'styled-components';

const MessageList = ({ messages }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleClosePopup = () => {
    setSelectedMessage(null);
  };

  return (
    <>
      <MessageContainer>
        {messages.map((message, index) => (
          <MessageCard 
            key={index}
            onClick={() => setSelectedMessage(message)}
          >
            <MessageHeader>
              <MessageTitle type={message.type}>{message.title}</MessageTitle>
              <MessageDate>
                {message.date} 
                <DeleteButton onClick={(e) => {
                  e.stopPropagation();
                }}>삭제</DeleteButton>
              </MessageDate>
            </MessageHeader>
            <MessageContent>{message.content}</MessageContent>
          </MessageCard>
        ))}
      </MessageContainer>

      {selectedMessage && (
        <PopupOverlay onClick={handleClosePopup}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>{selectedMessage.title}</PopupTitle>
              <CloseButton onClick={handleClosePopup}>✕</CloseButton>
            </PopupHeader>
            <MessageTextArea 
              value={selectedMessage.content} 
              readOnly 
            />
          </PopupContainer>
        </PopupOverlay>
      )}
    </>
  );
};

const MessageContainer = styled.div`
//   padding: 20px;
  position: relative;
  height: 100%;
`;

const MessageCard = styled.div`
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;

  // &:hover {
  //   transform: translateY(-2px);
  // }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const MessageTitle = styled.h3`
  color: ${props => props.type === 'notice' ? '#FF0000' : '#000000'};
  font-size: 16px;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    margin-bottom: -10px;
  }
`;

const MessageDate = styled.span`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: space-between;

  }
`;

const DeleteButton = styled.button`
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    color: #ff4444;
  }
`;

const MessageContent = styled.p`
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin: 0;
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

export default MessageList;