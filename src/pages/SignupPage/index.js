import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import axios from '../../api/axios'

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isAuthNumberSent, setIsAuthNumberSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(180); // 3분

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('인증 번호:', authNumber);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', confirmPassword);
    console.log('닉네임:', nickname);

    navigate('/?showModal=true');
  };

  // const handleAuthNumberSend = async () => {
  //   try {
  //     const response = await axios.post('login/verify/email', 
  //       { email: email }, 
  //       { 
  //         headers: { 
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  //     console.log('인증 번호 발송 응답:', response.data);
  //     alert('인증번호가 발송되었습니다. 이메일을 확인하세요.');
  //     setIsAuthNumberSent(true);
  //     setIsResendDisabled(true);
  //     setRemainingTime(180); // 타이머 초기화
  //   } catch (error) {
  //     console.error('인증 번호 발송 오류:', error);
  //     alert('인증 번호 발송에 실패했습니다. 다시 시도하세요.');
  //   }
  // };

  //서버 연결 안하고 타이머 테스트 
  const handleAuthNumberSend = async () => {
    // 서버 요청 대신 가상의 인증 번호 발송 기능
    console.log('인증 번호 발송 요청:', email);
    alert('인증번호가 발송되었습니다. 이메일을 확인하세요.');

    // 인증 번호 발송 상태 업데이트
    setIsAuthNumberSent(true);
    setIsResendDisabled(true);
    setRemainingTime(180); // 타이머 초기화

    // 실제 서버 요청 대신 3초 후에 완료된 것으로 간주
    setTimeout(() => {
      console.log('인증 번호 발송 완료');
    }, 3000); // 3초 후에 타이머 시작
  };

  // 타이머 관리
  useEffect(() => {
    let timer;
    if (isResendDisabled && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000); // 1초마다 감소
    } else if (remainingTime === 0) {
      setIsResendDisabled(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 정리
  }, [isResendDisabled, remainingTime]);

  const handleResendCode = async () => {
    try {
       
        const response = await axios.post('login/verify/resend', 
            { email: email }, 
            { 
                headers: { 
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('인증 번호 재발송 응답:', response.data);
        alert('인증번호가 재발송되었습니다. 이메일을 확인하세요.');
    } catch (error) {
        console.error('인증 번호 재발송 오류:', error);
        alert('인증 번호 재발송에 실패했습니다. 다시 시도하세요.');
    }
  };

  const handleConfirmEmail = async () => {
    try {
        const response = await axios.post('login/confirm/email', 
            { email: email, verification_code: authNumber }, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('인증 응답:', response.data);
        alert('이메일 인증이 완료되었습니다.');
    } catch (error) {
        console.error('이메일 인증 오류:', error);
        alert('이메일 인증에 실패했습니다. 인증번호를 확인하세요.');
    }
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,18}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async () => {
    try {
        const response = await axios.post('login/confirm/signup', {
            email: email,
            nickname: nickname,
            password: password,
        });
        console.log('회원가입 응답:', response.data);
        alert('회원가입이 완료되었습니다.');
        navigate('/?showModal=true');
    } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입에 실패했습니다. 다시 시도하세요.');
    }
    navigate('/?showModal=true'); 

  };

  const handleCheckNickname = async () => {
    try {
      const response = await axios.post('lgoin/verify/nickname', { nickname });
      if (response.data.available) {
        alert('사용 가능한 닉네임입니다.');
      } else {
        alert('중복되는 닉네임입니다. 다른 닉네임을 선택하세요.');
      }
    } catch (error) {
      console.error('닉네임 확인 오류:', error);
      alert('닉네임 확인에 실패했습니다. 다시 시도하세요.');
    }
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

      <Label>닉 네 임</Label>
        <InputContainer>
          <Input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            placeholder="닉네임 입력" 
            required 
          />
          <AuthButton type="button" onClick={handleCheckNickname} style={{ padding: '14px 26px' }}>중복 확인</AuthButton>
        </InputContainer>
       
        <Label>이 메 일</Label>
        <InputContainer>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="이메일 입력" 
            required 
          />
          <AuthButton type="button" onClick={isAuthNumberSent ? handleResendCode : handleAuthNumberSend} disabled={isResendDisabled}>
            {isAuthNumberSent ? '인증번호 재발송' : '인증번호 발송'}
          </AuthButton>
  
        </InputContainer>
        <Label>인 증 번 호</Label>
        <InputContainer>
        <Input 
          type="text" 
          value={authNumber} 
          onChange={(e) => setAuthNumber(e.target.value)} 
          placeholder="인증번호 입력" 
          required 
        />
         <AuthButton type="button" onClick={handleConfirmEmail}>인증번호 확인</AuthButton>
         </InputContainer>
         {isResendDisabled && (
        <RemainTime>
          남은 시간: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
        </RemainTime>
      )}
          
        <Label>비밀번호</Label>
        <Input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="비밀번호 입력" 
          required 
        />
        <span style={{ fontSize: '12px', color: 'gray', textAlign: 'center' }}>
          영문 대/소문자, 숫자, 특수문자를 조합하여 12~18자 이내
        </span>
        <Label>비밀번호 확인</Label>
        <Input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="비밀번호를 다시 입력해주세요." 
          required 
          style={{ borderColor: confirmPassword && password !== confirmPassword ? 'red' : '#ccc' }}
        />
        {confirmPassword && password !== confirmPassword && (
          <span style={{ color: 'red', fontSize: '12px', textAlign: 'center', display: 'block' }}>비밀번호가 일치하지 않습니다.</span>
        )}
        
        <Button type="button" onClick={handleSignup} disabled={!isPasswordValid(password)}>가입하기</Button>

        </Form>

        </Con1>

      

        <Form>

       
        <SocialLoginContainer>
        <SocialLogin>
        <DividerLine />
        <SocialLoginTitle>소셜 로그인</SocialLoginTitle>
        <DividerLine />
        </SocialLogin>  
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
  margin-top:180px;
 
`;




const Logo = styled.div`
  position: absolute;
  top:15px;

  img {
    width: 100%; 
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
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

const RemainTime= styled.div`
font-size: 14px;
color: red;
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


