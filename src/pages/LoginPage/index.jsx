import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
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
      if (response) {
        console.log('로그인 성공:', response);
        console.log('사용자 닉네임:', response.data.nickname);
        navigate('/');
        // navigate('/?showModal=true');
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

// // JWT 디코드 함수
// const parseJwt = (token) => {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
//   return JSON.parse(jsonPayload);
// };

// //jotai import
// import { useAtom } from 'jotai';
// const [, setIsLoggedIn] = useAtom(IS_LOGGED_IN); // 로그인 상태를 위한 아톰
// const [user, setUser] = useAtom(USER); // 사용자 정보를 위한 아톰

//   const handleSubmit = async (e) => {
//     e.preventDefault();

    
//     try {
//       const response = await axios.post('/login/confirm/signin', {
//         email,
//           password,
//         });
    
//       if (response) {
//         sessionStorage.setItem("accessToken", response.data.access_token);
//         // sessionStorage.getItem("accessToken"); //가져올때 

//         const idToken = response.data.id_token; // id_token 가져오기
        
//         setIsLoggedIn(true); // 로그인 상태 업데이트
//         // ID 토큰 디코드하여 사용자 정보 추출
//         const decodedToken = parseJwt(idToken);
//         const userId = decodedToken.sub; // 'sub' 필드에서 사용자 ID 추출
//         const nickname = decodedToken.nickname; // ID 토큰에서 닉네임 추출
//          // 사용자 정보를 상태에 저장 (닉네임 포함)
//          const userInfo = { 
//           id: userId, 
//           email,
//           nickname // 닉네임 추가
//         };
        
//         setUser(userInfo);
//         console.log('로그인한 사용자 정보:', userInfo);
  
//         // 사용자 정보를 로컬 스토리지에 저장
//         sessionStorage.setItem('user', JSON.stringify(userInfo)); // 로컬 스토리지에 저장


//         console.log('로그인 성공:', response);
//         console.log('사용자 닉네임:', response.data.nickname);
//         navigate('/');
//         // navigate('/?showModal=true');
//         if (rememberMe) {
//           sessionStorage.setItem('savedEmail', email);
//           sessionStorage.setItem('savedPassword', password);
//         }
//       }
//     } catch (error) {
//       console.error('로그인 실패:', error);
//       alert('로그인에 실패하였습니다. 아이디와 비밀번호를 확인하세요.');
//     }
//   };

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
       
        
        <Label>로그인</Label>
      
       <Form onSubmit={handleSubmit}>
         <Con1>
           <Input 
             type="email" 
             value={email} 
             onChange={(e) => setEmail(e.target.value)} 
             placeholder="아이디" 
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
 align-items:center;
 justify-content: center;
  width: 25%;

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
  margin: 10px 0 5px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom:10px;
  color: #333;
  text-align: left;
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
  width: 90%;
  padding: 16px;
  border-radius: 8px;
  border: none;
  background-color: #f5f5f5;
  font-size: 14px;
  margin-bottom: 16px;
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
  border-radius: 8px;
  background-color: ${props => props.secondary ? 'transparent' : '#333'};
  color: ${props => props.secondary ? '#333' : 'white'};
  font-size: 16px;
  font-weight: bold;
  border: ${props => props.secondary ? '1px solid #333' : 'none'};
  margin-bottom: 16px;
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

const Link = styled.a`
  color: #666;
  font-size: 12px;
  text-decoration: none;
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