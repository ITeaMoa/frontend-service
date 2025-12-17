import Modal from './Modal'; 
import styled from 'styled-components';


const AlertModal = ({ isOpen, message, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 style={{ textAlign: 'center', fontSize: '16px' }}>{message}</h3>
      <ButtonContainer>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </ButtonContainer>
    </Modal>
  );

export default AlertModal;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #a0dafb;
  }
`;
  