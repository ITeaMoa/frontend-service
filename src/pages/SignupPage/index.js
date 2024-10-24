import React, { useState } from 'react';
import styled from 'styled-components';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('인증 번호:', authNumber);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', confirmPassword);
    console.log('휴대폰 번호:', phone);
    console.log('닉네임:', nickname);
  };

  return (
    <Container>
       <Logo>
      <img
          alt=" Logo"
          src="/images/logo1.png"
        onClick={() => (window.location.href = "/")}/>
      </Logo>

      <Title>Sign Up</Title>

    <Con1>
      <Form onSubmit={handleSubmit}>
       
    
        <Label>이 메 일</Label>
        <Input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="이메일 입력" 
          required 
        />
     
         
        <Label>인 증 번 호</Label>
        <Input 
          type="text" 
          value={authNumber} 
          onChange={(e) => setAuthNumber(e.target.value)} 
          placeholder="인증번호 입력" 
          required 
        />
        <Label>비밀번호</Label>
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
        />
        <Label>휴 대 폰 번 호</Label>
        <Input 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="휴대폰 번호 입력" 
          required 
        />
        <Label>닉 네 임</Label>
        <Input 
          type="text" 
          value={nickname} 
          onChange={(e) => setNickname(e.target.value)} 
          placeholder="닉네임 입력" 
          required 
        />
        <Button type="submit">가입하기</Button>

        </Form>

        </Con1>

      

        <Form>
        <SocialLoginContainer>
        <SocialButton1 yellow>
            <Icon src="/images/pngwing.com.png" alt="카카오톡 아이콘" /> 카카오로 시작하기
          </SocialButton1>
          <SocialButton2 >
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



const Con1 = styled.form`
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
  // font-weight: bold;
//   display: block; //안해줘도 됨
  align-self: flex-start;

`;

const Input = styled.input`
padding: 16px;
border: 2px solid #0080ff; //진한 파랑
border-radius: 15px;
margin-bottom: 10px;
border-color: #A0DAFB;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #3563E9 ;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
  margin-top:30px;
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
 // justify-content:center; //여기서는 수직 정렬
  align-items: center; // 여기서는 수평정렬
`;

const SocialButton1 = styled.button`
  padding: 10px;
  background-color: ${props => (props.yellow ? '#f7e02e' : '#3dbd4e')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 60px;
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