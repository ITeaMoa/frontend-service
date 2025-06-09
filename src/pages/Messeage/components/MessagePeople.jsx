import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';

const MessagePeople = ({ name, messageCount, isSelected, onClick }) => {
  // 클릭 이벤트를 처리하는 새로운 함수
  const handleClick = () => {
    onClick(); // 기존 onClick 함수 실행
  };

  return (
    <PersonContainer onClick={handleClick} isSelected={isSelected}>
      <PersonInfo>
        <FontAwesomeIcon icon={regularUser} size="15px" />
        <Name>{name}</Name>
      </PersonInfo>
      <MessageCount>{isSelected ? "0" : messageCount}</MessageCount>
    </PersonContainer>
  );
};

const PersonContainer = styled.div`
// width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#f0f8ff' : 'white'};

  &:hover {
    background-color: ${props => props.isSelected ? '#f0f8ff' : '#f5f5f5'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 110%;
    margin-left:-20px;
  }
`;

const PersonInfo = styled.div`
  display: flex;
  // align-items: center;
  gap: 10px;
  white-space: nowrap;
`;


const Name = styled.span`
  font-size: 14px;
`;

const MessageCount = styled.div`
  background-color: #e8f5fe;
  color: #1da1f2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

export default MessagePeople;