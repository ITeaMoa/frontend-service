import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import apiClient from '../../services/api'; 

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [isAuthCodeValid, setIsAuthCodeValid] = useState(false); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email Verification Handler
  const handleEmailVerification = async () => {
    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await apiClient.post('/verify/verify-email', { email });
      console.log('Email:', email);

      setSuccessMessage('인증번호가 이메일로 발송되었습니다.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '이메일 인증에 실패했습니다. 다시 시도해주세요.'
      );
    }
  };

  // Auth Code Confirmation Handler
  const handleConfirmAuthCode = async () => {
    if (!authNumber) {
      setErrorMessage('인증번호를 입력해주세요.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await apiClient.post('/verify/confirm-email', {
        email,                   
        verification_code: authNumber, 
      });
      setIsAuthCodeValid(true);
      setSuccessMessage('이메일 인증이 완료되었습니다.');
      setErrorMessage('');
      console.log("email verification succeed")
    } catch (error) {
      setIsAuthCodeValid(false);
      setErrorMessage(
        error.response?.data?.message || '인증번호 확인에 실패했습니다. 다시 시도해주세요.'
      );
    }
  };

  // Signup Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked'); // Debugging

    if (!isAuthCodeValid) {
      console.log('Auth code not valid'); // Debugging
      setErrorMessage('이메일 인증을 먼저 완료해주세요.');
      setSuccessMessage('');
      return;
    }

    if (!nickname) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }
    
    if (!password || !confirmPassword) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      console.log('Passwords do not match'); // Debugging
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      setSuccessMessage('');
      return;
    }

    try {
      console.log('Signup Submit Button Clicked');  // Debugging
      const payload = { email, nickname, password };
      const response = await apiClient.post('/signup', payload);


      console.log('Signup successful:', response.data); // Debugging
      setSuccessMessage('회원가입이 완료되었습니다.');
      setErrorMessage('');

      // Navigate to Login Page
      navigate('/LoginPage');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage(
        error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.'
      );
    }

    console.log('이메일:', email);
    console.log('인증 번호:', authNumber);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', confirmPassword);
    console.log('닉네임:', nickname);
    navigate('/?showModal=true');
  };

  return (
    <Container>
      <Logo>
        <img
          alt="Logo"
          src="/images/logo1.png"
          onClick={() => (window.location.href = '/')}
        />
      </Logo>
      
      <Title>Sign Up</Title>
      <Con1>
        <Form onSubmit={handleSubmit}>
          {/* Email Verification */}
          <Label>이 메 일</Label>
            <InputContainer>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 입력"
                required
              />
              <AuthButton type="button" onClick={handleEmailVerification}>
                인증번호 발송
              </AuthButton>
            </InputContainer>

          {/* Email Confirmation */}
          <Label>인 증 번 호</Label>
            <InputContainer>
              <Input
                type="text"
                value={authNumber}
                onChange={(e) => setAuthNumber(e.target.value)}
                placeholder="인증번호 입력"
                required
              />
              <AuthButton 
                type="button" 
                onClick={handleConfirmAuthCode}
                disabled={!email} // Disable if email is empty or API is processing
                >
                인증번호 확인
              </AuthButton>
            </InputContainer>

          {/* Signup Form */}
            <Label>비 밀 번 호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
            />
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요."
              required
              style={{ borderColor: confirmPassword && password !== confirmPassword ? 'red' : '#ccc' }}
            />
            <HelperText>영문 대/소문자와 숫자, 특수문자를 조합하여 12~18자내</HelperText>
            {confirmPassword && password !== confirmPassword && <span style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</span>}
            
            <Label>닉 네 임</Label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              required
            />
            <Button
              type="submit"
              disabled={!isAuthCodeValid || !email || !nickname || password !== confirmPassword}
            > 가입하기 </Button>
        </Form>
      </Con1>

      {/* Social Login */}
      <Form>
        <SocialLoginContainer>
          <SocialLogin>
            <DividerLine />
            <SocialLoginTitle>소셜 로그인</SocialLoginTitle>
            <DividerLine />
          </SocialLogin>
          <SocialButton1 yellow="true">
            <Icon src="/images/pngwing.com.png" alt="카카오톡 아이콘" /> 카카오로 시작하기
          </SocialButton1>
          <SocialButton2>
            <Icon src="/images/네이버 로고 아이콘.png" alt="네이버 아이콘" /> 네이버로 시작하기
          </SocialButton2>
        </SocialLoginContainer>
      </Form>
    </Container>
  );
};


export default SignUpPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-top:200px;
`;

const Logo = styled.div`
  position: absolute;
  top:1.5%;

  img {
    width: 90%; 
    max-width: 300px;
    height: auto; 
    cursor: pointer;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
`;



const Con1 = styled.div`
  display: flex;
  flex-direction: column;
  margin-top:10px;
  border: 2px solid;
  border-color: rgba(160, 218, 251, 0.5);
  width: 25%;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  align-items:center;
  justify-content: center;
  border-radius: 30px 30px 1px 30px;
  border-color: #A0DAFB;

`;


const Title = styled.label`
  margin-top:40px;
  font-size: 35px;
  font-weight: bold;
  color: rgba(160, 218, 251);
`;

const Label = styled.label`
  margin: 10px 0 5px;
  font-size: 14px;
  align-self: flex-start;

`;

const Input = styled.input`
  padding: 16px;
  border: 2px solid #0080ff; //진한 파랑
  border-radius: 15px;
  margin-bottom: 10px;
  border-color: #A0DAFB;
  flex-grow: 1; /* 버튼을 제외한 나머지 공간을 모두 차지 */
`;

const Button = styled.button`
  padding: 10px;
  background-color: #3563E9;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
  margin-top: 30px;
  font-size: 14px;
  font-weight: bold;
  padding: 14px;
  border-radius: 30px 30px 1px 30px;
  white-space: nowrap;
  overflow: hidden; 
  text-overflow: ellipsis;


  &:hover {
    color: #aaa;
  }


`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  // justify-content: center;
  width: 100%;
  
`;

const AuthButton = styled(Button)`
  background-color: #62B9EC;
  color: white;
  margin-left: 20px; 
  margin-top: -3px;

  
  &:hover {
    background-color: #A0DAFB;
  }

  
`;

const SocialLogin = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600px;

`;

const DividerLine = styled.hr`
    border: 0; 
    height: 1px;
    background: #ccc;
    flex: 1; /* 남은 공간을 차지, 기본 너비가 0이기 때문에 설정 필수 */
    margin: 0px 10px; 

`;

const SocialLoginTitle = styled.div`
  font-size: 20px;
`;


const SocialLoginContainer = styled.div`
   display: flex;
  flex-direction: column;
 // justify-content:center; //여기서는 수직 정렬
  align-items: center; // 여기서는 수평정렬
  margin-top: 30px;
`;

const SocialButton1 = styled.button`
  padding: 10px;
  background-color: ${props => (props.yellow ? '#f7e02e' : '#3dbd4e')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size:14px;
  color: black;
  font-weight: bold;
  width: 30%;
  border-radius: 10px;
  border-radius: 30px 30px 1px 30px;


  &:hover {
    color: #aaa;
`;


const SocialButton2 = styled.button`
  padding: 10px;
  background-color: #03CF5D; /* 네이버 색상 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
  font-size:14px;
  color: white;
  font-weight: bold;
  width: 30%;
  border-radius: 10px;
  margin-bottom: 50px;
  border-radius: 30px 30px 1px 30px;



  &:hover {
    color: #aaa;
`;

const Icon = styled.img`
  width: 25px; /* 아이콘 크기 조절 */
  height: 25px;
  margin-right: 5px;
  vertical-align: middle;

`;

const HelperText = styled.span`
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
`;