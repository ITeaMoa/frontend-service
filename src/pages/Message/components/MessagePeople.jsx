import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';

const MessagePeople = ({ name, messageCount, isSelected, onClick }) => {

  const handleClick = () => {
    onClick(); 
  };

  return (
    <PersonContainer onClick={handleClick} isSelected={isSelected}>
      <PersonInfo>
      <MessageCount messageCount={isSelected ? 0 : messageCount} isSelected={isSelected} />
        <FontAwesomeIcon icon={regularUser} size="15px" />
        <Name>{name}</Name>
      </PersonInfo>
    
    </PersonContainer>
  );
};

const PersonContainer = styled.div`
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
  gap: 10px;
  white-space: nowrap;
`;


const Name = styled.span`
  font-size: 14px;
`;

const MessageCount = styled.div`

  ${props => props.messageCount > 0 && !props.isSelected ? `
    background-color: #00AEFF;
    width: 10px;  
    height: 10px;
    border-radius: 50%;
    padding: 0; 
    display: flex; 
    justify-content: center;
    align-items: center;
    flex-shrink: 0; 
  ` : `
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
  `}
`;

export default MessagePeople;