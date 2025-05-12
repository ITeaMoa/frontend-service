import React from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children, modalType, confirmFooter,   showFooter = false, onConfirm }) => {
    if (!isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음

    const handleOverlayClick = (e) => {
        // 모달 외부를 클릭했을 때만 onClose 호출
        if (e.target === e.currentTarget) {
            onClose();
        }
    };



return (
    <ModalOverlay modalType={modalType}  onClick={handleOverlayClick}>
        <ModalContent modalType={modalType} onClick={(e) => e.stopPropagation()}>
            {children}
            {showFooter && (
          <ModalFooter>
            {confirmFooter ? (
              confirmFooter
            ) : (
              <>
                <span
                  style={{ color: '#888', cursor: 'pointer', marginRight: '32px' }}
                  onClick={onClose}
                >
                  취소
                </span>
                <span
                  style={{ color: '#1976d2', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={onConfirm || onClose} // onConfirm이 없으면 onClose 실행
                >
                  확인
                </span>
              </>
            )}
          </ModalFooter>
        )}
            <CloseButton onClick={onClose}>X</CloseButton>
        </ModalContent>
    </ModalOverlay>
);

};

const ModalOverlay = styled.div`
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;lo
    border: 2px solid #ddd;
    border-radius: 30px 30px 1px 30px;
    position:fixed;

    ${({ modalType }) => modalType === 'nav' && `
        // top: 100%;
        background: none;
        border: none;
        width: 100%;
        height: auto;
        margin-top: 232px;
        position:absolute;
    `}

     ${({ modalType }) => modalType === 'mypage' && `

        position:fixed;
      
    `}

 
`;

const ModalContent = styled.div`
    position: relative;
    background: white;
    padding: 50px;
    border-radius: 30px 30px 5px 30px;
    width: 310px;
    border: 2px solid #62B9EC;
    

    ${({ modalType }) => modalType === 'nav' && `
        width: 600px;
        height: auto;
        margin-right: 20px;
        padding: 20px;
    `}

     ${({ modalType }) => modalType === 'apply' && `
        width: 500px;
        height: 400px;
        margin-right: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-conent: center;
    `}

     ${({ modalType }) => modalType === 'close' && `
         display: flex;
        flex-direction: column;
        align-items: center;
        justify-conent: center;
    
      
    `}

    ${({ modalType }) => modalType === 'mypage' && `
        width: 400px;
    
      
    `}

    
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 12px;
    // float: right;
    // transform: translateY(-55px);  
    position: absolute;
    top: 30px;
    right:40px;
    

    ${({ modalType }) => modalType === 'nav' && `
        top: 10px;
        right: 60px;
        transform: translateY(-55px);  
    
    `}  

`;
const ModalFooter = styled.div`
  border-top: 1px solid #eee;
  margin-top: 32px;
  padding-top: 16px;
  display: flex;
    justify-content: center;
  align-items: center;
  gap: 32px;
  font-size: 16px;
`;

export default Modal;
