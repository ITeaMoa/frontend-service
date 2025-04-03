import React from 'react';
import styled from 'styled-components';

const MessageList = ({ messages }) => {
  return (
    <MessageContainer>
      {messages.map((message, index) => (
        <MessageCard key={index}>
          <MessageHeader>
            <MessageTitle type={message.type}>{message.title}</MessageTitle>
            <MessageDate>{message.date} <DeleteButton>삭제</DeleteButton></MessageDate>
          </MessageHeader>
          <MessageContent>{message.content}</MessageContent>
        </MessageCard>
      ))}
    </MessageContainer>
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


export default MessageList;