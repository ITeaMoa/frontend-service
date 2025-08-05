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
      <MessageCount messageCount={isSelected ? 0 : messageCount} isSelected={isSelected} />
        <FontAwesomeIcon icon={regularUser} size="15px" />
        <Name>{name}</Name>
      </PersonInfo>
      {/* <MessageCount>{isSelected ? "0" : messageCount}</MessageCount> */}
    
    </PersonContainer>
  );
};

const PersonContainer = styled.div`
// width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#f0f8ff' : '#f5f5f5'};
 &:last-child {
    border-bottom: 1px solid #e0e0e0;
  }
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

// const MessageCount = styled.div`
//   background-color: #e8f5fe;
//   color: #1da1f2;
//   padding: 4px 8px;
//   border-radius: 12px;
//   font-size: 12px;
// `;

const MessageCount = styled.div`
  /*
    props.messageCount가 0보다 크고 (즉, 새 메시지가 있고)
    선택되지 않았을 때 (props.isSelected가 false일 때)만 파란색 점 스타일을 적용합니다.
    주의: PersonContainer에서 messageCount prop으로 isSelected ? 0 : messageCount 값을 보내고 있으므로,
    여기서 props.messageCount가 0일 때는 선택되었거나 실제 메시지가 없는 경우를 의미합니다.
  */
  ${props => props.messageCount > 0 && !props.isSelected ? `
    /* 파란색 점 스타일 */
    background-color: #00AEFF; /* 요청하신 파란색 */
    width: 10px;  /* 점의 크기 조절 */
    height: 10px;
    border-radius: 50%; /* 원형으로 만들기 */
    padding: 0; /* 패딩 제거 */
    display: flex; /* 중앙 정렬을 위한 display */
    justify-content: center;
    align-items: center;
    flex-shrink: 0; /* 공간이 부족해도 줄어들지 않도록 */
  ` : `
    /* messageCount가 0이거나 isSelected일 때의 원래 스타일 */
    // background-color: #e8f5fe;
    // color: #1da1f2;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
  `}
`;

export default MessagePeople;