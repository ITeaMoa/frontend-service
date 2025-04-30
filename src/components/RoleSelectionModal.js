import React from 'react';
import Modal from './Modal'; // Modal 컴포넌트 경로에 맞게 수정
import { styled } from 'styled-components'; // 스타일 컴포넌트 경로에 맞게 수정

const RoleSelectionModal = ({ isOpen, onClose, project, selectedRole, handleRoleSelect, handleApplySubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} modalType="apply">
    <RoleButtonContainer>
      <h3>지원할 역할을 선택하세요</h3>
      {project && project.roles ? (
        <RoleButtonContainerStyled>
          {Object.entries(project.roles).map(([role, count], index) => (
            <RoleButton
              key={index}
              onClick={() => handleRoleSelect(role)}
              isSelected={selectedRole === role}
              style={{ cursor: 'pointer' }}
            >
              {role} ({count})
            </RoleButton>
          ))}
          <RoleButton
            onClick={() => {
              if (selectedRole !== '무관') {
                handleRoleSelect('무관');
              }
            }}
            isSelected={selectedRole === '무관'}
            style={{ cursor: 'pointer' }}
          >
            무관
          </RoleButton>
        </RoleButtonContainerStyled>
      ) : (
        <p>역할 정보가 없습니다.</p>
      )}
    </RoleButtonContainer>
    <SubmitButton onClick={handleApplySubmit} style={{ cursor: 'pointer' }}>제출</SubmitButton>
  </Modal>
);

export default RoleSelectionModal; 


const RoleButtonContainer = styled.div`
  // margin-top: -20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; // 최대 높이 설정
  overflow-y: auto; // 세로 스크롤 가능

  position: relative; // 위치 고정을 위한 설정

  h3 {
    font-size: 24px;
    margin-bottom: 40px;
    position: sticky; // 스크롤 시 고정
    top: 0; // 상단에 고정
    background-color: white; // 배경색 설정 (필요시)
    z-index: 1; // 다른 요소 위에 표시되도록 설정
    //  padding: 20px;
  }
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 15px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 70px;


  &:hover {
    background-color: #a0dafb;
  }
`;


const CloseButton = styled(SubmitButton)`
  margin-top: 20px; 

`;

const RoleButtonContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; // 최대 높이 설정
  overflow-y: auto; // 세로 스크롤 가능
  // height: 800px;

  position: relative; // 위치 고정을 위한 설정

`;

const AuthButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
`;

const AuthButton = styled.button`
    border: none;
  border-radius: 15px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  margin-left: 10px;

  &:hover {
    background-color: #a0dafb;
  }
`;

const RoleButton = styled.button`
  padding: 24px 25px;
  margin-bottom: 20px;
  border: 1px solid;
  border-radius: 14px 14px 1px 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-color: rgba(160, 218, 251);
  background-color: ${({ isSelected }) => (isSelected ? 'rgba(160, 218, 251)' : 'white')};
  color: #0A8ED9;
  font-size: 16px;
  white-space: nowrap;
  font-size: 18px;
  min-width: 60%;
  padding: 10px 20px;

  &:hover {
    background-color: rgba(160, 218, 251);
  }
`;