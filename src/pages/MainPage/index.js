import React, { useEffect, useState} from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import Section1 from "./Section1";
import Section2 from "./Section2";
import {useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Modal from '../../components/Modal';
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
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태
  // const { nickname } = location.state || {}; // 닉네임 받기
  const [userProfile, setUserProfile] = useState({

    tags: [],
    experiences: [],
    avatarUrl: null,
    headLine: "",
    educations: [],
    personalUrl: ""
  });

  // New state for popup message and submission status
  const [popupMessage, setPopupMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 모달 관련 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [hasFinalizedProfile, setHasFinalizedProfile] = useState(false); // 프로필 제출 여부

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


  const handleModalClose = async () => {
    setHasFinalizedProfile(true);
    setIsProfileModalOpen(false);
  };
  //  userProfile 불러오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user && user.id) {
          const response = await axios.get(`/my/profile/${user.id}`);
          console.log('사용자 프로필:', response.data);
          if (response.data) {
            setUserProfile(response.data);
          } else {
            setUserProfile({
              avatarUrl: '',
              headLine: '',
              tags: [],
              experiences: [],
              educations: [],
              personalUrl: ''
            });
          }
        }
      } catch (error) {
        console.error('사용자 프로필 조회 중 오류 발생:', error);
      }
    }

    fetchUserProfile(); // 사용자 정보가 있을 때 프로필을 가져옴
  }, [user]); // user가 변경될 때마다 실행

  // 모달 자동 열기: 
  // - 사용자가 로그인되어 있고, 아직 제출하지 않았으며
  // - 모달이 열려있지 않고, 프로필이 완성(특히 태그가 입력)되지 않았다면 모달을 열어둔다.
  // 단, 한 번 모달이 열렸다면 이후 userProfile이 완성되더라도 자동으로 닫지 않는다.
  // useEffect(() => {
  //   const isProfileComplete = () => {
  //     const headLine = userProfile.headLine ? userProfile.headLine.trim() : "";
  //     const tags = userProfile.tags || [];
  //     return headLine.length > 0 && tags.length > 0;
  //   };

  //   if (user && !hasFinalizedProfile && !isProfileModalOpen && !isProfileComplete()) {
  //     setIsProfileModalOpen(true);
  //   }
  //   // 여기서는 모달이 이미 열려 있는 경우나 사용자가 제출한 경우(isProfileComplete()가 true여도)
  //   // 자동으로 모달을 닫는 로직을 제거하여, 사용자의 명시적 액션으로만 닫히게 함.
  // }, [user, hasFinalizedProfile, userProfile, isProfileModalOpen]);


  const isProfileComplete = () => {
    const headLine = userProfile.headLine ? userProfile.headLine.trim() : "";
    const tags = userProfile.tags || [];
    return headLine.length > 0 && tags.length > 0;
  };
  
  // 수정된 부분: 프로필이 완성되지 않은 경우 모달을 닫지 않도록 설정
  useEffect(() => {
    if (user && !hasFinalizedProfile) {
      if (!isProfileComplete()) {
        if (!isProfileModalOpen) {
          console.log("모달을 열어야 합니다."); // 모달을 열어야 하는 경우
          setIsProfileModalOpen(true);
        }
      } else {
        console.log("프로필이 완성되었습니다. 모달을 열지 않습니다."); // 프로필이 완성된 경우
        // setIsProfileModalOpen(false); // 모달을 닫지 않도록 주석 처리
      }
    }
  }, [user, hasFinalizedProfile, userProfile, isProfileModalOpen]);
  // ... existing code ...

  // useEffect(() => {
  //   console.log("userProfile 상태:", userProfile); // userProfile 상태 확인
  //   console.log("headline:", userProfile.headLine);
  //   console.log("tags:", userProfile.tags);

  //   const isProfileComplete = () => {
  //     const headLine = userProfile.headLine ? userProfile.headLine.trim() : "";
  //     const tags = userProfile.tags || [];
  //     console.log("headLine:", headLine); // headLine 값 출력
  //     console.log("tags:", tags); // tags 값 출력
  //     return headLine.length > 0 && tags.length > 0;
  //   };

  //   // 조건 확인을 위한 로그 추가
  //   console.log("user:", user);
  //   console.log("hasFinalizedProfile:", hasFinalizedProfile);
  //   console.log("isProfileModalOpen:", isProfileModalOpen);

  //   // 프로필이 완성된 경우 모달을 열지 않도록 수정
  //   if (user && !hasFinalizedProfile) {
  //     if (!isProfileComplete()) {
  //       if (!isProfileModalOpen) {
  //         console.log("모달을 열어야 합니다."); // 모달을 열어야 하는 경우
  //         setIsProfileModalOpen(true);
  //       }
  //     } else {
  //       console.log("프로필이 완성되었습니다. 모달을 열지 않습니다."); // 프로필이 완성된 경우
  //       setIsProfileModalOpen(false); // 모달을 닫습니다.
  //     }
  //   }
  // }, [user, hasFinalizedProfile, userProfile, isProfileModalOpen]);


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
      {/* {showModal && (
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={handleModalClose} 
          userProfile={userProfile} 
          setUserProfile={setUserProfile} 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile}
        />
      )} */}

{(showModal || isProfileModalOpen) && (
        <ProfileModal 
          isOpen={showModal || isProfileModalOpen}
          onClose={handleModalClose} 
          userProfile={userProfile} 
          setUserProfile={setUserProfile} 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile}
        />
      )}

    <AddButton onClick={handleAddButtonClick} disabled={!user}> 피드 작성하기 </AddButton>
    </MainWrapper>
    {isSubmitted && (
      <Modal isOpen={isSubmitted} onClose={() => setIsSubmitted(false)}>
        <h3 style={{ textAlign: 'center' }}>{popupMessage}</h3>
        <ButtonContainer>
          <ActionButton onClick={() => navigate('/SignupPage')}>회원가입하기</ActionButton>
          <ActionButton onClick={() => navigate('/LoginPage')}>로그인하기</ActionButton>
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




