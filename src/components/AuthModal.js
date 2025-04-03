import React from 'react';
import Modal from './Modal'; // Modal 컴포넌트 경로에 맞게 수정
import { styled } from 'styled-components'; // 스타일 컴포넌트 경로에 맞게 수정

const AuthModal = ({ isOpen, onClose, handleSignUp, handleLogin }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    modalType="auth"
  >
    <h3 style={{ textAlign: 'center' }}>로그인 후에 신청할 수 있습니다.</h3>
    <AuthButtonContainer>
      <AuthButton onClick={handleSignUp}>회원가입하기</AuthButton>
      <AuthButton onClick={handleLogin}>로그인하기</AuthButton>
    </AuthButtonContainer>
  </Modal>
);

export default AuthModal; 


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