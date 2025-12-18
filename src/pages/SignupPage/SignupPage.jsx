import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { sendVerificationEmail, resendVerificationCode, confirmEmail, signupUser, checkNicknameAvailability } from '../../api';
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
  const [remainingTime, setRemainingTime] = useState(180);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);


const interestOptions = [
  '전략/기획', '상품/서비스 기획(PO)', '마케팅/브랜드', '세일즈/BD', 
  'PR/커뮤니케이션', '구매/소싱', 'UX/UI-리서치', 'PM(프로그래밍/프로젝트)', 
  '생산/품질/SCM', '재무/회계', 'HR(조직/채용/러닝)', '데이터/AI(분석)', 
  '법무/컴플라이언스', 'ESG/지속가능경영', '소프트웨어/플랫폼(백엔드·클라우드)'
];

const skillsOptions = ['AWS', 'Blockchain', 'NodeJS', 'React', 'Java', 'Dapp', 'DID', 'Backend'];

const handleInterestToggle = (interest) => {
  setSelectedInterests(prev => 
    prev.includes(interest)
      ? prev.filter(item => item !== interest)
      : [...prev, interest]
  );
};

const handleSkillToggle = (skill) => {
  setSelectedSkills(prev => 
    prev.includes(skill)
      ? prev.filter(item => item !== skill)
      : [...prev, skill]
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleAuthNumberSend = async () => {
    try {

      await sendVerificationEmail(email);
      
  
      setShowAlertPopup('인증번호가 발송되었습니다. 이메일을 확인하세요.');
      setIsAuthNumberSent(true);
      setIsResendDisabled(true);
      setRemainingTime(180); 
    } catch (error) {
      if (error.response) {
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
  

  useEffect(() => {
    let timer;
    if (isResendDisabled && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000); 
    } else if (remainingTime === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer); 
  }, [isResendDisabled, remainingTime]);

  const handleResendCode = async () => {
    try {
       
     await resendVerificationCode(email);
        setShowAlertPopup('인증번호가 재발송되었습니다. 이메일을 확인하세요.');
    } catch (error) {
        setShowAlertPopup('인증 번호 재발송에 실패했습니다. 다시 시도하세요.');
    }
  };

  const handleConfirmEmail = async () => {
    try {
     await confirmEmail(email, authNumber);
        setShowAlertPopup('이메일 인증이 완료되었습니다.');
        setConfirmEmail(true);
        setIsResendDisabled(false);
    } catch (error) {
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
      const response = await signupUser(email, nickname, password);

      setShowAlertPopup(response.data.message);
      navigate('/', { state: { nickname } });
  } catch (error) {
      if (error.response) {
          setShowAlertPopup(`회원가입에 실패했습니다: ${error.response.data.message || '다시 시도하세요.'}`);
      } else {
          setShowAlertPopup('회원가입에 실패했습니다. 다시 시도하세요.');
      }
  }
};

  const handleCheckNickname = async () => {
    try {
      const response = await checkNicknameAvailability(nickname);
          if (response.data.message) {
            setShowAlertPopup('사용가능한 닉네임입니다');
            setIsNicknameAvailable(true);
          } else {
            setShowAlertPopup('사용불가능한 닉네임입니다');
            setIsNicknameAvailable(false); 
          }

    } catch (error) {
      console.error('닉네임 확인 오류:', error);;
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
            placeholder="활동명을 입력하세요 " 
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
            placeholder="이메일을 입력하세요" 
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
          placeholder="인증번호를 입력하세요" 
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
          placeholder="비밀번호를 입력하세요 (영문, 숫자, 특수문자 포함 12~18자)" 
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
          placeholder="비밀번호를 다시 입력해주세요" 
          required 
          $hasError={confirmPassword && password !== confirmPassword}
        />
        {confirmPassword && password !== confirmPassword && (
          <PasswordErrorMessage>비밀번호가 일치하지 않습니다.</PasswordErrorMessage>
        )}

        </Form>
        </Con1>

         <AdditionalInfoContainer>
          <AdditionalInfo>
            <AdditionalInfoTitle>추가 정보</AdditionalInfoTitle>
            <AdditionalInfoSubtitle>*선택 사항</AdditionalInfoSubtitle>
            </AdditionalInfo>

            <InterestSection>
              <InterestLabel>관심있는 공모전 분야를 선택하세요 <span style={{ color: 'red', fontWeight: '600', fontSize: '14px'}}>*(중복 선택 가능)</span></InterestLabel>
              <InterestTagsContainer>
                {interestOptions.map((option) => (
                  <InterestTag
                    key={option}
                    onClick={() => handleInterestToggle(option)}
                    selected={selectedInterests.includes(option)}
                  >
                    {option}
                  </InterestTag>
                ))}
              </InterestTagsContainer>
            </InterestSection>

            <SkillsSection> 
              <SkillsLabel>
                사용 가능한 기술 스택을 선택하세요 <span style={{ color: 'red', fontWeight: '600', fontSize: '14px'}}>*(중복 선택 가능)</span>
              </SkillsLabel>
              <SkillsTagsContainer>
                {skillsOptions.map((skill) => (
                  <SkillsTag
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    selected={selectedSkills.includes(skill)}
                  >
                    {skill}
                  </SkillsTag>
                ))}
              </SkillsTagsContainer>
            </SkillsSection>
          </AdditionalInfoContainer>

        
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
        
        <Form>

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
  position: absolute;
  top: 15px; 
  img {
    width: 100%; 
    max-width: 250px;
    height: auto; 
    cursor: pointer;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  text-align: left;
`;

const Con1 = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #EDEDED;
  margin-top: 120px;
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
  padding: 18px;
  padding-right: 140px; 
  width: 100%;
  box-sizing: border-box; 
  border: none;
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
  padding: 10px 12px; 
  background-color:white;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap; 
  
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
  width: 300px;
  
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
  margin-top: -10px;
`;

const PasswordErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  text-align: left;
  display: block;
  margin-top: -10px;
`;

const RemainTime= styled.div`
font-size: 14px;
color: red;
`;
;


const AdditionalInfoContainer = styled.div`
   width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #EDEDED;
  margin-top: 30px;
`;

const AdditionalInfo = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const AdditionalInfoTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
`;

const AdditionalInfoSubtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-left: 10px;
  margin-top: 20px; /* Added top margin to push it down */
`;

const InterestSection = styled.div`
  margin-bottom: 20px;
`;

const InterestLabel = styled.label`
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10px;
`;

const InterestTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const InterestTag = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.selected ? '#007bff' : '#f0f0f0'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.selected ? '#0056b3' : '#e0e0e0'};
  }
`;

const SkillsSection = styled.div`
  margin-bottom: 20px;
`;

const SkillsLabel = styled.label`
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10px;
`;

const SkillsTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillsTag = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.selected ? '#007bff' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 1px solid ${props => props.selected ? '#007bff' : '#ddd'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.selected ? '#0056b3' : '#e0e0e0'};
  }
`;