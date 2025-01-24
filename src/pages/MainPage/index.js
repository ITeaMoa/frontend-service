import React, { useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import Section1 from "./Section1";
import Section2 from "./Section2";
import {useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Modal from '../../components/Modal';
import Dropdown from '../../components/DropDown'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import ProfileModal from '../../components/ProfileModal'; // ProfileModal 컴포넌트 추가



const MainPage = () => {
  const navigate = useNavigate();
  const showSearch = true;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  //URL이 http://example.com/?showModal=true라면 location.search는 "?showModal=true"가 됨
  const showModal = query.get('showModal') === 'true'; // 쿼리 파라미터 확인
  const { user } = useAuth(); // AuthContext에서 사용자 정보 가져오기
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // 모달 상태 추가
  const fileInputRef = useRef(null); // 파일 입력을 위한 ref
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태
  // const { nickname } = location.state || {}; // 닉네임 받기
  const [userProfile, setUserProfile] = useState({

    tags: [],
    experiences: [],
    avatarUrl: null,
    headLine: "",
    educations: [],
    personalUrl: []
  });

  // New state for popup message and submission status
  const [popupMessage, setPopupMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleAddButtonClick = () => {
    if (!user) { // Check if user is logged in
      setPopupMessage("로그인 후에 이용할 수 있습니다."); // Set popup message for login
      setIsSubmitted(true); // Show submission confirmation popup
      return; // Exit the function if not logged in
    }
    navigate(`/WritePage?feedType=${feedType}`); // feedType 전달
  };

  // 로컬 스토리지에서 feedType을 가져와 초기값으로 설정
  const initialFeedType = localStorage.getItem('feedType') || 'PROJECT'; // 기본값 'PROJECT'
  const [feedType, setFeedType] = useState(initialFeedType); // 초기값 설정

  // useEffect를 추가하여 페이지가 새로 고침될 때와 feedType이 변경될 때마다 실행
  useEffect(() => {
    // feedType을 섹션에 전달하는 로직
    console.log("현재 feedType:", feedType);
    // 여기서 feedType을 Section1과 Section2에 전달하는 로직을 추가할 수 있습니다.
  }, [feedType]); // feedType이 변경될 때마다 실행

  const handleToggleChange = (newFeedType) => {
    setFeedType(newFeedType); // feedType 업데이트
    localStorage.setItem('feedType', newFeedType); // 로컬 스토리지에 feedType 저장
    console.log("현재 feedType:", newFeedType); // 콘솔에 현재 feedType 출력
    navigate(location.pathname); // 현재 경로로 새로 고침
  };


  //   const updateUserProfile = async () => {
//     const data = new FormData();// 파일과 JSON 데이터를 함께 전송하기 위해서
  
//     // 닉네임이 있는지 확인
//     if (!nickname) {
//       console.error("Nickname is required");
//       alert("회원가입 및 로그인해주세요");
//       return; // 닉네임이 없으면 종료
//   }

//         // 파일 추가
//         if (selectedFile) {
//           data.append('file', selectedFile); // 선택된 파일 추가
//       }


//     // 파일 추가 (여기서는 avatarUrl이 파일 경로라고 가정)
//     const avatarFile = userProfile.avatarUrl; // 여기서 avatarUrl은 파일의 Blob 또는 File 객체여야 합니다.
//     if (avatarFile) {
//         data.append('file', avatarFile); // 파일 추가
//     }

//     // 프로필 정보 추가
//     const profileData = {
//         tags: userProfile.tags.length > 0 ? userProfile.tags : [],
//         experiences: userProfile.experiences.length > 0 ? userProfile.experiences : [],
//         headLine: userProfile.headline,
//         educations: userProfile.educations.length > 0 ? userProfile.educations : [],
//         personalUrl: userProfile.personalUrl.length > 0 ? userProfile.personalUrl : []
//     };

//     data.append('profile', JSON.stringify(profileData)); // JSON 문자열로 추가

//     try {
//         const response = await axios.put(`my/profile/${nickname}`, data, {
//             headers: {
//                 ...data.getHeaders() // FormData의 헤더 추가
//             }
//         });
//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// };

// const updateUserProfile = async () => {
//   const data = new FormData(); // 파일과 JSON 데이터를 함께 전송하기 위해서

//   // 파일 추가
//   if (selectedFile) {
//       data.append('file', selectedFile); // 선택된 파일 추가
//   }

//   // 프로필 정보 추가
//   const profileData = {
//       tags: userProfile.tags.length > 0 ? userProfile.tags : [],
//       experiences: userProfile.experiences.length > 0 ? userProfile.experiences : [],
//       headLine: userProfile.headLine,
//       educations: userProfile.educations.length > 0 ? userProfile.educations : [],
//       personalUrl: userProfile.personalUrl.length > 0 ? userProfile.personalUrl : []
//   };

//   data.append('profile', JSON.stringify(profileData)); // JSON 문자열로 추가

//   try {
//       const response = await axios.put(`my/profile/${user.id}`, data, {
//           headers: {
//               'Content-Type': 'multipart/form-data' // Content-Type 설정
//           }
//       });
//       console.log(response.data);

//       // 프로필 정보를 localStorage에 저장
//       localStorage.setItem('userProfile', JSON.stringify(profileData)); // 프로필 정보 저장
//       // 성공적으로 프로필이 업데이트되었음을 알림
//       alert("프로필이 성공적으로 업데이트되었습니다."); // 알림 추가
//   } catch (error) {
//       console.error(error);
//   }
// };

  const handleModalClose = async () => {
    await updateUserProfile(); // 프로필 업데이트 후
    setIsRoleModalOpen(false); // 기존 모달 닫기
    setIsProfileModalOpen(true); // 프로필 모달 열기
  };

  useEffect(() => {
    // 프로필이 완성되었는지 확인하는 함수 (기술 스택과 자기소개만 필수)
    const isProfileComplete = () => {
      return (
        userProfile.headLine && // 자기소개가 있는지
        userProfile.tags.length > 0 // 기술 스택이 있는지
      );
    };

    // URL 쿼리 파라미터를 확인하여 모달 상태 업데이트
    const query = new URLSearchParams(location.search);
    const showModal = query.get('showModal') === 'true';
    setIsRoleModalOpen(showModal);

    // 사용자가 로그인했는지 확인하고 프로필이 불완전한지 체크
    if (user && !isProfileComplete()) {
      setIsRoleModalOpen(true); // 프로필이 불완전하면 모달 열기
    } else {
      setIsRoleModalOpen(false); // 프로필이 완전하면 모달 닫기
    }
  }, [location.search, user, userProfile]); // isProfileComplete 제거

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setUserProfile(prevState => ({
      ...prevState,
      [name]: value
  }));
};



const handleLabelClick = () => {
  // 파일 입력 클릭
  fileInputRef.current.click();
};

//다중파일
// const handleImageUpload = (e) => {
//   const files = Array.from(e.target.files);
//   setImages(prevImages => [...prevImages, ...files]);
// };

//단일 파일
const handleImageUpload = (e) => {
  const file = e.target.files[0]; // 첫 번째 파일만 선택
  if (file) {
      setSelectedFile(file); // 상태에 파일 저장
  }
};

const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // 프로필 모달 상태 추가

// useEffect(() => {
//   const queryParams = new URLSearchParams(location.search);
//   if (queryParams.get('showModal') === 'true') {
//     setIsSubmitted(true); // 쿼리 파라미터에 따라 모달 열기
//     setPopupMessage('모달이 열렸습니다!'); // 메시지 설정
//   }
// }, [location.search]); // location.search가 변경될 때마다 실행

useEffect(() => {
  if (showModal) {
    setIsProfileModalOpen(true); // 쿼리 파라미터에 따라 프로필 모달 열기
  }
}, [showModal]); // showModal이 변경될 때마다 실행

  return (
    <>
    <Nav showSearch={showSearch} onToggleChange={handleToggleChange} /> 
    <MainWrapper>
      <Section1 feedType={feedType} />
      <Section2 feedType={feedType} />
      {/* ProfileModal 사용 */}
      {showModal && (
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={handleModalClose} // 모달 닫기 함수 연결
          userProfile={userProfile} 
          setUserProfile={setUserProfile} 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile} 
          // userId={user.id} 
        />
      )}

    <AddButton onClick={handleAddButtonClick} disabled={!user}> 피드 작성하기 </AddButton>
    </MainWrapper>
    {isSubmitted && (
      <Modal isOpen={isSubmitted} onClose={() => setIsSubmitted(false)}>
        <h3 style={{ textAlign: 'center' }}>{popupMessage}</h3>
        <ButtonContainer>
          <ActionButton onClick={() => navigate('/signup')}>회원가입하기</ActionButton>
          <ActionButton onClick={() => navigate('/login')}>로그인하기</ActionButton>
        </ButtonContainer>
      </Modal>
    )}
    </>
  );
}

export default MainPage;

const MainWrapper = styled.div`
 margin-top: 35vh;
 min-height: calc(100vh - 250px);
 display: flex;
 flex-direction: column;
 align-items: center;
 
`;


const AddButton = styled.div`
position: fixed;
right:5%;
top: calc(100% - 100px);
border: 1px solid #ddd;
border-radius: 30px 30px 1px 30px; //반시계 방향
padding: 10px 15px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
background-color:#62B9EC;
color: white;
font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #A0DAFB;
  }
  
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; 
  padding: 10px;
  border: none;
  text-align: left;

  input {
    border: none;
    outline: none; 
    border-bottom: 2px solid #A2D8F5; 
    

  }
`;

const Label = styled.label`
  display: inline-block;
  // flex-direction: column;
  font-weight: bold; 
  // margin-bottom: 5px; 
  margin-top:-10px;
  color: #1489CE;
  
`;

const StyledButton = styled.button`
  background-color: #62B9EC;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;


  &:hover {
    background-color: #A0DAFB;
  }
`;

const StyledModalTitle = styled.h2`
  font-size: 24px;
  color: #1489CE;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledTextArea = styled.textarea`
  border: none;
  outline: none; 
  border-bottom: 2px solid #A2D8F5; 
  resize: vertical;
  // min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
`;


const FileInput = styled.input`
    display: none; // 기본 파일 입력 숨기기
`;

const CustomButton = styled.label`
    text-align: center;
    background-color:  #62B9EC; 
    color: white; 
    font-weight: bold;
    padding: 10px;
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
    font-size: 12px; 
    transition: background-color 0.3s; 
    width: 20%;


    &:hover {
        background-color: #0056b3; // 호버 시 배경색 변화
    }
`;


const ImagePreview = styled.img`
    margin-top: 5px;
    max-width: 50%; // 최대 너비 100%로 설정
    height: auto; // 비율 유지
    border-radius: 10px; // 모서리 둥글게
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
`;

const ActionButton = styled.button`
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




