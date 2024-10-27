import React from 'react';
import styled from 'styled-components';

const Modal = ({ isOpen, onClose, children, modalType }) => {
    if (!isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음

    const handleOverlayClick = (e) => {
        // 모달 외부를 클릭했을 때만 onClose 호출
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

//     return (
//         <ModalOverlay modalType={modalType} onClick={onClose}>
//             <ModalContent modalType={modalType} onClick={(e) => e.stopPropagation()}> 
//                 {children}
//                 <CloseButton onClick={onClose}>X</CloseButton>
//             </ModalContent>
//         </ModalOverlay>
//     );
// };


return (
    <ModalOverlay modalType={modalType}  onClick={handleOverlayClick}>
        <ModalContent modalType={modalType} onClick={(e) => e.stopPropagation()}>
            {children}
            <CloseButton onClick={onClose}>X</CloseButton>
        </ModalContent>
    </ModalOverlay>
);
};

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; // 모달을 최상위로 표시
    border: 2px solid #ddd;
    border-radius: 30px 30px 1px 30px; 


    ${({ modalType }) => modalType === 'nav' && `

    background: none;
    border: none;
    width: 100vw;
    height: 100vh;
    margin-top: -4.5%;


    
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
        width:  600px;
        height: 300px;
        margin-right: 20px;
        padding: 20px;


    
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

export default Modal;
