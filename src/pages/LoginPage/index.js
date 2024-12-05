import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('비밀번호:', password);
    console.log('ID 저장:', rememberMe);

    try {
        const response = await login(email, password);
        console.log('로그인 성공:', response.data);
        // Navigate to another page or handle successful login
    } catch (error) {
        console.error('로그인 실패:', error);
        // Handle error (e.g., show a message to the user)
    }
  };

  const handleAddButtonClick = () => {
    navigate('/SignupPage'); 
  };

  return (
    <Container>
      <Logo>
      <img
          alt="Logo"
          src="/images/logo1.png"
        onClick={() => (window.location.href = "/")}/>
      </Logo>
      
       
       <Label>Sign In</Label>
     
      <Form onSubmit={handleSubmit}>
        <Con1>
        <Input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="이메일 입력" 
          required 
        />

        <Input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="비밀번호 입력" 
          required 
        />
        <HelperText>영문 대/소문자와 숫자, 특수문자를 조합하여 12~18자내</HelperText>
        <CheckboxContainer>
          <Checkbox 
            type="checkbox" 
            checked={rememberMe} 
            onChange={() => setRememberMe(!rememberMe)} 
          />
          <CheckboxLabel>ID 저장</CheckboxLabel>
        </CheckboxContainer>
        <Button type="submit">로그인</Button>
        </Con1>

        <SocialLoginContainer>
        <SocialLogin>
        <DividerLine />
        <SocialLoginTitle>소셜 로그인</SocialLoginTitle>
        <DividerLine />
        </SocialLogin> 
        <SocialButton1>
            <Icon src="/images/pngwing.com.png" alt="카카오톡 아이콘" /> 카카오계정으로 로그인하기
          </SocialButton1>
          <SocialButton2 >
            <Icon src="/images/네이버 로고 아이콘.png" alt="네이버 아이콘" /> 네이버 아이디로 로그인하기
          </SocialButton2>
        </SocialLoginContainer>
      </Form>

      <Signup>
        아직 회원이 아니신가요? <span onClick={handleAddButtonClick}> 회원가입하기 </span>
      </Signup>
    </Container>
  );
};

export default LoginPage;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-top: 90px;
`;

const Logo = styled.div`
  position: absolute;
  top:15px;

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
//  align-items:center;
//  justify-content: center;
  width: 25%;

`;

const Con1 = styled.form`
  display: flex;
  flex-direction: column;
  border: 2px solid;
  // border-color: rgba(160, 218, 251, 0.5);
  border-color: #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  width: 90%;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

`;

const Label = styled.label`
  margin: 10px 0 5px;
  font-size: 35px;
  font-weight: bold;
  margin-bottom:10px;
  color: rgba(160, 218, 251);
`;

const Input = styled.input`
  padding: 16px;
  border: 2px solid #0080ff; //진한 파랑
  border-radius:15px;
  border-color: #A0DAFB;
  margin-bottom: 10px;

`;

const HelperText = styled.span`
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Checkbox = styled.input`
  margin-right: 5px;

`;

const CheckboxLabel = styled.label`
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #3563E9 ;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
  font-size:14px;
  font-weight: bold;
  padding:14px;
  border-radius: 30px 30px 1px 30px;


  &:hover {
    color: #aaa;
  
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // 여기서는 수평정렬
  margin-top:40px;
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

const SocialLoginTitle = styled.h2`
  font-size: 20px;
`;


const SocialButton1 = styled.button`
  padding: 10px;
  background-color: ${props => (props.yellow ? '#f7e02e' : '#3dbd4e')};
  background-color:#f7e02e ;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
  font-size:14px;
  color: black;
  font-weight: bold;
  padding:10px;
  border-radius: 30px 30px 1px 30px;
  width: 100%;


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
  padding:10px;
  border-radius: 30px 30px 1px 30px;
  width: 100%;


  &:hover {
    color: #aaa;
`;

const Icon = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 5px;
  vertical-align: middle;

`;


const Signup = styled.span`
  font-size: 14px;
  color: #888;
  margin-top: 20px;

  span {
   color: #0080ff;
   cursor: pointer;
   font-weight: bold;


   &:hover {
    color: #62B9EC;
  }
  
`;