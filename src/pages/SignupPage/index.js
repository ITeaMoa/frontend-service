import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import axios from '../../api/axios'
import Modal from '../../components/Modal';

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
        console.log('인증 번호 재발송 응답:', response.data);
        setShowAlertPopup('인증번호가 재발송되었습니다. 이메일을 확인하세요.');
    } catch (error) {
        console.error('인증 번호 재발송 오류:', error);
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
      setShowAlertPopup(response.data.message ? '사용가능한 닉네임입니다' : '사용불가능한 닉네임입니다');

    } catch (error) {
      console.error('닉네임 확인 오류:', error);
      // alert('닉네임 확인에 실패했습니다. 다시 시도하세요.');
      setShowAlertPopup('닉네임 확인에 실패했습니다. 다시 시도하세요.');
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
          <AuthButton type="button" onClick={isAuthNumberSent ? handleResendCode : handleAuthNumberSend}>
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

{showAlertPopup && (
  <Modal isOpen={showAlertPopup} onClose={() => setShowAlertPopup(false)}>
        <h3 style={{ textAlign: 'center',fontSize:'16px' }}>{showAlertPopup}</h3>
        <ButtonContainer>
          <ModalButton onClick={() => setShowAlertPopup(false)}>확인</ModalButton>
          {/* <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton> */}
        </ButtonContainer>
      </Modal>  
 
)}
</>
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
