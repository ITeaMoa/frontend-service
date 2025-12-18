import Modal from './Modal'; 
import { styled } from 'styled-components'; 

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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; 
  overflow-y: auto;
  position: relative; 

  h3 {
    font-size: 24px;
    margin-bottom: 40px;
    position: sticky; 
    top: 0; 
    background-color: white;
    z-index: 1; 
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



const RoleButtonContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; 
  overflow-y: auto; 

  position: relative;

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