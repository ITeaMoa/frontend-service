import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AlertModal from '../../components/AlertModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('savedEmail');
    const savedPassword = sessionStorage.getItem('savedPassword');
    if (rememberMe || (savedEmail && savedPassword)) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, [rememberMe]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('로그인 시도');
    // console.log('이메일:', email);
    // console.log('비밀번호:', password);
    // console.log('ID 저장:', rememberMe);
    
    try {
      const response = await login(email, password);
      if (response) {;
        navigate('/');

        if (rememberMe) {
          // localStorage.setItem('savedEmail', email);
          // localStorage.setItem('savedPassword', password);
          sessionStorage.setItem('savedEmail', email);
          sessionStorage.setItem('savedPassword', password);
        }
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setShowAlertPopup('로그인에 실패하였습니다. 아이디와 비밀번호를 확인하세요.');
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
       
    
       <Form onSubmit={handleSubmit}>
          <Label>로그인</Label>
         <Con1>
           <Input 
             type="email" 
             value={email} 
             onChange={(e) => setEmail(e.target.value)} 
             placeholder="이메일을 입력하세요" 
             required 
           />
 
           <div style={{ position: 'relative', width: '100%' }}>
             <Input 
               type={showPassword ? 'text' : 'password'}
               value={password} 
               onChange={(e) => setPassword(e.target.value)} 
               placeholder="비밀번호(영문, 숫자, 특수문자 포함 8~15자내)" 
               required 
             />
              <TogglePasswordButton type="button" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </TogglePasswordButton>
           </div>
           <HelperText>
             영문 대/소문자와 숫자, 특수문자를 조합하여 8~15자 내
           </HelperText>
 
           <CheckboxContainer>
             <Checkbox 
               type="checkbox" 
               checked={rememberMe} 
               onChange={() => setRememberMe(!rememberMe)} 
             />
             <CheckboxLabel>ID 저장</CheckboxLabel>
           
           </CheckboxContainer>
 
           <ButtonGroup>
             <Button type="submit">로그인</Button>
             <Button type="button" onClick={handleAddButtonClick} secondary>회원가입</Button>
           </ButtonGroup>
         </Con1>
       </Form>
 
       {/* <Signup>
         아직 회원이 아니신가요? <span onClick={handleAddButtonClick}> 회원가입하기 </span>
       </Signup> */}
 
      <AlertModal
        isOpen={!!showAlertPopup}
        message={showAlertPopup}
        onClose={() => setShowAlertPopup(false)}
      />
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
  background-color: #fff;
`;

const Logo = styled.div`
  position: absolute;
  // top:100px;
  top:15px;

  img {
    width: 100%; 
    max-width: 250px; 
    height: auto; 
    cursor: pointer;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Changed to flex-start to align children to the left */
  justify-content: center;
  width: 30%;

`;

const Con1 = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid;
  border: none;
  /* border-color: #A0DAFB;
  border-radius: 30px 30px 1px 30px; */
  width: 100%;
  padding: 15px;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */

`;

const Label = styled.label`
  // margin: 10px 0 5px;
  font-size: 20px;
  font-weight: bold;
  // margin-bottom:10px;
  color: #333;
  // text-align: left;
  margin-left: 14px;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 16px;
  top: 40%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #888;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px;
  border-radius: 5px;
  border: none;
  background-color: #EDEDED;
  font-size: 14px;
  margin-bottom: 16px;
  box-sizing: border-box;
  outline: none;

  // &:focus {
  //   border-color: #007bff;
  //   box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  // }
`;

const HelperText = styled.span`
  margin: 0 0 16px 0;
  font-size: 12px;
  color: #666;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Checkbox = styled.input`
  margin-right: 5px;

`;

const CheckboxLabel = styled.label`
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 5px;
  background-color: ${props => props.secondary ? 'transparent' : '#333'};
  color: ${props => props.secondary ? '#333' : 'white'};
  font-size: 16px;
  font-weight: bold;
  border: ${props => props.secondary ? '1px solid #333' : 'none'};
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.secondary ? '#f5f5f5' : '#555'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  // gap: 4px;
  width: 100%;
  flex-direction: column;
`;

