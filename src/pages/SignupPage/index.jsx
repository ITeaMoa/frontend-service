import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import axios from '../../api/axios'
import Modal from '../../components/Modal';
import AlertModal from '../../components/AlertModal';

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
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('이메일:', email);
    // console.log('인증 번호:', authNumber);
    // console.log('비밀번호:', password);
    // console.log('비밀번호 확인:', confirmPassword);
    // console.log('닉네임:', nickname);

    // navigate('/?showModal=true');
  };

  const handleAuthNumberSend = async () => {
    try {
      // const response = await axios.post('/login/verify/email', 
      //   { email: email }, 
      //   { 
      //     headers: { 
      //       'Content-Type': 'application/json',
      //     }
      //   }
      // );

      await axios.post('/login/verify/email', 
        { email: email }, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      
  
      setShowAlertPopup('인증번호가 발송되었습니다. 이메일을 확인하세요.');
      setIsAuthNumberSent(true);
      setIsResendDisabled(true);
      setRemainingTime(180); // 타이머 초기화
    } catch (error) {
      if (error.response) {
        // 서버가 응답한 오류 메시지를 확인
        console.error('인증 번호 발송 오류:', error.response.data);
        if (error.response.status === 409) {
          setShowAlertPopup('가입된 이메일입니다. 다른 이메일을 사용하세요.');
        } else {
          setShowAlertPopup('인증 번호 발송에 실패했습니다. 다시 시도하세요.');
        }
      } else {
        console.error('인증 번호 발송 오류:', error);
        setShowAlertPopup('인증 번호 발송에 실패했습니다. 다시 시도하세요.');
      }
    }
  };
  

  // 타이머 관리
  useEffect(() => {
    let timer;
    if (isResendDisabled && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000); // 1초마다 감소
    } else if (remainingTime === 0) {
      // setIsResendDisabled(false);
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
        setShowAlertPopup('인증번호가 재발송되었습니다. 이메일을 확인하세요.');
    } catch (error) {
        setShowAlertPopup('인증 번호 재발송에 실패했습니다. 다시 시도하세요.');
    }
  };

  const handleConfirmEmail = async () => {
    try {
     await axios.post('login/confirm/email', 
            { email: email, verification_code: authNumber }, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        // console.log('인증 응답:', response.data);
        setShowAlertPopup('이메일 인증이 완료되었습니다.');
        setConfirmEmail(true);
        setIsResendDisabled(false);
    } catch (error) {
        // console.error('이메일 인증 오류:', error);
        setShowAlertPopup('이메일 인증에 실패했습니다. 인증번호를 확인하세요.');
    }
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,18}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = () => {
    return (
      isPasswordValid(password) &&          
      isNicknameAvailable &&                 
      password === confirmPassword &&     
      password !== '' &&                    
      confirmPassword !== '' &&
      confirmEmail
    );
  };

const handleSignup = async () => {
  if (password !== confirmPassword) {
      setShowAlertPopup('비밀번호가 일치하지 않습니다.');
      return;
  }

  if (!isPasswordValid(password)) {
      setShowAlertPopup('비밀번호 형식이 유효하지 않습니다.');
      return;
  }

  try {
      const response = await axios.post('login/confirm/signup', {
          email,
          nickname,
          password,
      });
      
      // 응답 데이터의 구조에 맞게 메시지 처리
      // console.log('회원가입 응답:', response.data);
      // alert(response.data.message); // 서버에서 반환된 메시지를 사용자에게 알림
      setShowAlertPopup(response.data.message);
      // MainPage로 닉네임을 전달하며 이동
      navigate('/', { state: { nickname } });
  } catch (error) {
      console.error('회원가입 오류:', error);
      if (error.response) {
          setShowAlertPopup(`회원가입에 실패했습니다: ${error.response.data.message || '다시 시도하세요.'}`);
      } else {
          setShowAlertPopup('회원가입에 실패했습니다. 다시 시도하세요.');
      }
  }
};

  const handleCheckNickname = async () => {
    try {
      const response = await axios.post('login/verify/nickname', { nickname });
      // 서버 응답 구조 확인을 위한 상세 로깅
 
      // 여기서 응답 구조를 확인한 후 적절한 조건문을 작성할 수 있습니다
      // setShowAlertPopup(response.data.message ? '사용가능한 닉네임입니다' : '사용불가능한 닉네임입니다');
          // 닉네임 사용 가능 여부에 따라 state 업데이트
          if (response.data.message) {
            setShowAlertPopup('사용가능한 닉네임입니다');
            setIsNicknameAvailable(true); // 사용 가능한 경우 true
          } else {
            setShowAlertPopup('사용불가능한 닉네임입니다');
            setIsNicknameAvailable(false); // 사용 불가능한 경우 false
          }

    } catch (error) {
      console.error('닉네임 확인 오류:', error);
      // alert('닉네임 확인에 실패했습니다. 다시 시도하세요.');
      setShowAlertPopup('닉네임 확인에 실패했습니다. 다시 시도하세요.');
      setIsNicknameAvailable(false);
    }
  };
  return (
    <>
    <Container>
       <Logo>
      <img
          alt=" Logo"
          src="/images/logo1.png"
        onClick={() => (window.location.href = "/")}/>
      </Logo>

      
    <Con1>
      <Form onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        <Label>닉 네 임</Label>
        <InputContainer>
          <Input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            placeholder="닉네임 입력" 
            required 
          />
          <AuthButton type="button" onClick={handleCheckNickname}>중복 확인</AuthButton>
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
          <AuthButton disabled={!isNicknameAvailable} type="button" onClick={isAuthNumberSent ? handleResendCode : handleAuthNumberSend}>
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
         <AuthButton disabled={!isNicknameAvailable} type="button" onClick={handleConfirmEmail}>인증번호 확인</AuthButton>
         </InputContainer>
         {isResendDisabled && (
        <RemainTime>
          남은 시간: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
        </RemainTime>
      )}
          
        <Label htmlFor="password">비밀번호</Label>
        <Input 
          id="password"
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="비밀번호 (영문, 숫자, 특수문자 포함 12~18자)" 
          required 
        />
        <PasswordHelperText>
          영문 대/소문자, 숫자, 특수문자를 조합하여 12~18자 이내
        </PasswordHelperText>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input 
          id="confirmPassword"
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="비밀번호를 다시 입력해주세요." 
          required 
          $hasError={confirmPassword && password !== confirmPassword}
        />
        {confirmPassword && password !== confirmPassword && (
          <PasswordErrorMessage>비밀번호가 일치하지 않습니다.</PasswordErrorMessage>
        )}
        
        <Button 
          type="button" 
          onClick={handleSignup} 
          disabled={!isFormValid()}
          style={{
            opacity: isFormValid() ? 1 : 0.5,
            cursor: isFormValid() ? 'pointer' : 'not-allowed'
          }}
        >
          회원가입 하기
        </Button>
        </Form>
        </Con1>

        
        
        <Form>

{/*        
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
        </SocialLoginContainer> */}
      </Form>
    </Container>

    <AlertModal
  isOpen={!!showAlertPopup}
  message={showAlertPopup}
  onClose={() => setShowAlertPopup(false)}
/>
</>
  );
};

export default SignUpPage;


// Add these styled components at the top of the file
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f9f9f9;
  
`;

const Logo = styled.div`
  margin-bottom: 30px;
  cursor: pointer;
  position: absolute; /* Keep absolute positioning for logo */
  top: 15px; /* Keep top positioning for logo */
  img {
    width: 100%; 
    max-width: 250px; /* Adjusted max-width to match previous */
    height: auto; 
    cursor: pointer;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px; /* Adjusted margin for better spacing inside the form */
  text-align: left;
`;

const Con1 = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #EDEDED;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
  display: block;
  font-size: 14px;
  // margin-bottom: 8px;
  margin-bottom:-10px;

  &::after {
    content: " *";
    color: red;
    margin-left: 2px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px;
  padding-right: 140px; /* 버튼을 위한 공간 확보 */
  width: 100%;
  box-sizing: border-box; /* 패딩과 보더를 너비에 포함 */
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #EDEDED;
  outline: none;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  ${props => props.$hasError && `
    border-color: red;
    box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.25);
  `}
`;

const AuthButton = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px 12px; /* Input과 동일한 수직 패딩 */
  background-color:white;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  // height: calc(100% - 20px); /* Input의 상하 보더 1px씩 제외 */
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 14px;
  background-color: #2C2C2C;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PasswordHelperText = styled.span`
  font-size: 12px;
  color: #666;
  text-align: left;
  margin-top: -10px; /* Adjust spacing */
`;

const PasswordErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  text-align: left;
  display: block;
  margin-top: -10px; /* Adjust spacing */
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
