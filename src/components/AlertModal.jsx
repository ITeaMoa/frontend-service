import React from 'react';
import Modal from './Modal'; // 기존 Modal 컴포넌트 import
import styled from 'styled-components';

// const AlertModal = ({ isOpen, message, onClose }) => (
//   <Modal isOpen={isOpen} onClose={onClose}>
//     <h3 style={{ textAlign: 'center', fontSize: '16px' }}>{message}</h3>
//     <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
//       <button
//         style={{
//           backgroundColor: '#3563E9',
//           color: 'white',
//           border: 'none',
//           padding: '10px 20px',
//           borderRadius: 5,
//           cursor: 'pointer'
//         }}
//         onClick={onClose}
//       >
//         확인
//       </button>
//     </div>
//   </Modal>
// );

const AlertModal = ({ isOpen, message, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 style={{ textAlign: 'center', fontSize: '16px' }}>{message}</h3>
      <ButtonContainer>
        <ModalButton onClick={onClose}>확인</ModalButton>
      </ButtonContainer>
    </Modal>
  );

export default AlertModal;

// {showAlertPopup && (
//     <Modal isOpen={showAlertPopup} onClose={() => setShowAlertPopup(false)}>
//           <h3 style={{ textAlign: 'center',fontSize:'16px' }}>{showAlertPopup}</h3>
//           <ButtonContainer>
//             <ModalButton onClick={() => setShowAlertPopup(false)}>확인</ModalButton>
//             {/* <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton> */}
//           </ButtonContainer>
//         </Modal>  
   
//   )}

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
  