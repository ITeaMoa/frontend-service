import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Nav from "../../../components/Nav";
import Section1 from "../components/section1";
import Section2 from "../components/section2";
// import Section2 from "./Section2";
import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Modal from '../../../components/Modal';
import RoleSelectionModal from '../../../components/RoleSelectionModal';

import axios from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext'
import ProfileModal from '../../../components/ProfileModal'; // ProfileModal 컴포넌트 추가
import AuthModal from '../../../components/AuthModal';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom, likedProjectsAtom, USER_PROFILE ,selectedSavedProjectAtom} from '../../../Atoms.jsx/AtomStates';

// import MainPageComponent from '../MainPage';
import AlertModal from '../../../components/AlertModal';

let modalOpenedOnce = false;

const MainPage = () => {
  
  const dummyProjects  = [
    {
      id: 1,
      pk: "project1",
      sk: "details1",
      nickname: "개발왕",
      title: "React 기반 소셜 미디어 플랫폼 개발",
      content: "React와 Node.js를 활용한 소셜 미디어 다.Re자 합니다.",
      tags: ["React", "Node.js", "MongoDB", "웹개발"],
      recruitmentNum: 4,
      deadline: "2024-06-30",
      liked: false,
      likesCount: 15,
      creatorId: "user1",
      roles: {
        "프론트엔드": 2,
        "백엔드": 1,
        "디자이너": 1
      }
    },
   
    {
      id: 3,
      pk: "project2",
      sk: "details2",
      nickname: "디자인고수",
      title: "AI 기반 학습 플랫폼 UI/UX 디자인",
      content: "인공지능 학습 플랫폼의 사용자 경험을 개선하는 프로젝트입니다. 직관적이고 효율적인 인터페이스 설계가 핵심입니다. 교육과 기술의 조화를 추구합니다.",
      tags: ["UI/UX", "AI", "교육", "디자인"],
      recruitmentNum: 3,
      deadline: "2024-07-15",
      liked: true,
      likesCount: 23,
      creatorId: "user2",
      roles: {
        "UI디자이너": 2,
        "프론트엔드": 1
      }
    },
     {
      id: 4,
      pk: "project2",
      sk: "details2",
      nickname: "디자인고수",
      title: "AI 기반 학습 플랫폼 UI/UX 디자인",
      content: "인공지능 학습 플랫폼의 사용자 경험=니다. 교육과 기술의 조화를 추구합니다.",
      tags: ["UI/UX", "AI", "교육", "디자인"],
      recruitmentNum: 3,
      deadline: "2024-07-15",
      liked: true,
      likesCount: 23,
      creatorId: "user2",
      roles: {
        "UI디자이너": 2,
        "프론트엔드": 1
      }
    },
    
  ];

  
    const [allProjects, setAllProjects] = useState([]);
    const [popularProjects, setPopularProjects] = useState([]);
    // const [popularProjects, setPopularProjects] = useState(dummyProjects);
    // const [allProjects, setAllProjects] = useState(dummyProjects);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(6);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedProjectDetail, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
    const navigate = useNavigate();
    const showSearch = true;
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    // const showModal = query.get('showModal') === 'true'; 
    const [showAlertPopup, setShowAlertPopup] = useState(false);
    const { user } = useAuth(); 
    const [selectedFile, setSelectedFile] = useState(null); 
    const [userProfile, setUserProfile] = useAtom(USER_PROFILE);
    const [popupMessage, setPopupMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [hasFinalizedProfile, setHasFinalizedProfile] = useState(false); // 프로필 제출 여부
    const [hasProfileModalOpened, setHasProfileModalOpened] = useState(false);
    const [isUserProfileLoaded, setIsUserProfileLoaded] = useState(false);
    const [likedProjects, setLikedProjects] = useAtom(likedProjectsAtom);
    // const [showAlertPopup, setShowAlertPopup] = useState(false);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    // const initialFeedType = localStorage.getItem('feedType') || 'PROJECT'; 
    // const [feedType, setFeedType] = useState(initialFeedType); 
    const [feedType, ] = useAtom(feedTypeAtom);
    const [selectedSavedProject,setSelectedSavedProject] = useAtom(selectedSavedProjectAtom); // 아톰에서 프로젝트 정보 가져오기



  
    const handleAddButtonClick = () => {
      if (!user) { 
        setPopupMessage("로그인 후에 이용할 수 있습니다."); 
        setIsSubmitted(true); 
        return; 
      }
      navigate(`/WritePage?feedType=${feedType}`); 
    };
  



    const handleModalClose = async () => {
      // setHasFinalizedProfile(true);
      setIsProfileModalOpen(false);
    };
    
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          if (user && user.id) {
            const response = await axios.get(`/my/profile/${user.id}`);
            console.log('사용자 프로필:', response.data);
            if (response.data) {
              setUserProfile(response.data);
              setIsUserProfileLoaded(true);
            } else {
              setUserProfile({
                avatarUrl: '',
                headLine: '',
                tags: [],
                experiences: [],
                educations: [],
                personalUrl: ''
              });
              setIsUserProfileLoaded(true);
              
            }
          }
        } catch (error) {
          console.error('사용자 프로필 조회 중 오류 발생:', error);
        }
      }
  
      fetchUserProfile(); // 사용자 정보가 있을 때 프로필을 가져옴
    }, [user]); // user가 변경될 때마다 실행
  
    const isProfileComplete = () => {
      const headLine = userProfile.headLine ? userProfile.headLine.trim() : "";
      const tags = userProfile.tags || [];
      return headLine.length > 0 && tags.length > 0;
    };
   
 //app.js에서 체크하며 어떨까.
    useEffect(() => {
      // 로그인하지 않은 경우 (user가 null) 함수 즉시 종료
      if(!user) return;
      setSelectedSavedProject({})

      // 프로필 데이터가 완전히 로딩되지 않았다면 아래 로직 실행하지 않음
      if (!isUserProfileLoaded) return;
    
      // 이미 모달이 열렸던 적이 없고, 사용자가 로그인 상태일 때만 진행
      if (!modalOpenedOnce) {
        // 프로필이 미완성일 경우에만 모달을 강제로 열어줍니다.
        if (!isProfileComplete()) {
          console.log("모달을 열어야 합니다.");
          setIsProfileModalOpen(true);
          modalOpenedOnce = true;
          setHasProfileModalOpened(true);
        }
        // 프로필이 완성되었더라도 자동으로 모달을 닫지 않습니다.
        // 모달 닫기는 사용자가 제출 버튼을 눌러 handleModalClose를 호출할 때 수행됩니다.
      }
    }, [user, userProfile, isProfileModalOpen, isUserProfileLoaded, modalOpenedOnce]);



    useEffect(() => {
      const fetchPopularProjects = async () => {
        try {
          const response = await axios.get(`/main/liked?feedType=${feedType}`);
    
          if (!response.data || response.data.length === 0) {
            console.warn('프로젝트 데이터가 없습니다.');
            setPopularProjects([]);
            return;
          }

          
      //   const projectsWithLikes = response.data.map((project) => ({
      //     ...project,
      //     // creatorId: project.creatorId,
      //     // atom의 상태를 사용하여 좋아요 여부 확인
      //     liked: likedProjects.some(
      //         likedProject => likedProject.id === project.id && likedProject.liked
      //     ),
      //     // likesCount: project.likesCount || 0  //있는지 없는지 확인인
      // }));
    
          setPopularProjects(response.data);
        } catch (error) {
          console.error('Error fetching popular projects:', error);
          
          // Network error handling - set empty array as fallback
          if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.warn('API 서버에 연결할 수 없습니다. 네트워크 연결 또는 서버 상태를 확인해주세요.');
            setPopularProjects([]); // Set empty array as fallback
          } else {
            console.error('API 요청 중 오류가 발생했습니다:', error.message);
            setPopularProjects([]);
          }
        }
      };
    
      fetchPopularProjects();
    }, [feedType]);

 
  
  
    useEffect(() => {
      const fetchAllProjects = async () => {
        try {
          const response = await axios.get(`/main?feedType=${feedType}`);
          if (!response.data || response.data.length === 0) {
            setAllProjects([]);
            return;
          }
          console.log('모든 게시물:', response.data);
    
          // 필요하다면 여기서 likedProjects 관련 로직 추가
          // const projectsWithLikes = response.data.map((project) => ({
          //   ...project,
          //   liked: likedProjects.some(
          //     likedProject => likedProject.id === project.id && likedProject.liked
          //   ),
          // }));
          // setAllProjects(projectsWithLikes);
    
          setAllProjects(response.data);
        } catch (error) {
          console.error('프로젝트 가져오기 실패:', error);
          
          // Network error handling - set empty array as fallback
          if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.warn('API 서버에 연결할 수 없습니다. 네트워크 연결 또는 서버 상태를 확인해주세요.');
            setAllProjects([]); // Set empty array as fallback
          } else {
            console.error('API 요청 중 오류가 발생했습니다:', error.message);
            setAllProjects([]);
          }
        }
      };
    
      fetchAllProjects();
    }, [feedType]);

 


    const handleApplyClick = async (project) => {
      if (!user) { 
        setPopupMessage("로그인 후에 신청할 수 있습니다."); 
        setIsSubmitted(true); 
        return; 
      }
    
      // 자신이 작성한 게시글인지 확인
      if (project && project.creatorId === user.id) {
        // alert("자신이 작성한 게시글에는 신청할 수 없습니다."); 
        setShowAlertPopup("자신이 작성한 게시글에는 신청할 수 없습니다.");
        return; 
      }
    
      try {
        const response = await axios.get('/feed/applications', {
          params: {
            userId: user.id,
          }
        });
    
        const appliedProjects = response.data.map(app => app.feedId); // 신청한 프로젝트의 feedId 목록
    
        // 선택한 프로젝트의 pk와 비교
        const isAlreadyApplied = appliedProjects.includes(project.pk);
        if (isAlreadyApplied) {
          setShowApplyPopup("이미 신청한 프로젝트입니다."); 
          // setPopupMessage("이미 신청한 프로젝트입니다."); // 이미 신청한 경우 메시지 설정
          // setIsSubmitted(true); // 제출 확인 팝업 표시
          return; // Exit the function if already applied
        }
      } catch (error) {
        console.error("신청 여부 확인 실패:", error);
      }
    
      // setProject(project); // 선택한 프로젝트 상태 저장
      setSelectedProject(project);
      setIsRoleModalOpen(true); // 역할 선택 모달 열기
    };
    
  
    // 프로젝트 신청 처리
    const handleApplySubmit = async (project, role) => {
      if (!user) {
        setPopupMessage("로그인 후에 신청할 수 있습니다.");
        setIsSubmitted(true);
        return;
      }
     
      try {
        const applicationData = {
          pk: user.id,
          sk: selectedProject.pk,
          part: selectedRole,
          feedType: feedType
        };
        console.log('applicationData:', applicationData);
        await axios.post('/main/application', applicationData);
        setShowApplyPopup("신청이 완료되었습니다.");
        setIsRoleModalOpen(false);
      } catch (error) {
        console.error("신청 실패:", error);
        setShowApplyPopup("신청에 실패했습니다.");
      }
    };

    
  // const handleProjectClick = (project) => {
  //   navigate(`/ApplyPage/${project.pk}`, { 
  //     state: { 
  //       sk: project.sk // sk 값을 상태로 전달
  //     } 
  //   });
  // };

  const handleProjectClick = (project) => {
    console.log("mainprojecttodetail", project)
    navigate(`/ApplyPage/${project.pk}`);
    setSelectedProjectDetail(project);
  };

  // const handleLikeClick = (index, newLiked) => {
  //   setAllProjects(prevProjects => {
  //     const newProjects = [...prevProjects];
  //     const project = newProjects[index];
  //     const newLikesCount = newLiked ? project.likesCount + 1 : Math.max(project.likesCount - 1, 0);
  //     project.liked = newLiked;
  //     project.likesCount = newLikesCount;

  //     // // 배열을 timestamp를 기준으로 정렬
  //     // return newProjects.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  //     return newProjects; // 원래 자리 유지
  //   });
  // };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  
    return (
      <>
        <Nav showSearch={showSearch} />
        <MainWrapper>
          <Section1 
            feedType={feedType}
            projects={popularProjects}
            // onLikeClick={handleLikeClick}
            onProjectClick={handleProjectClick}
          />
        
          <Section2 
            projects={allProjects}
            onProjectClick={handleProjectClick}
            // onLikeClick={handleLikeClick}
            onApplyClick={handleApplyClick}
            isLoggedIn={!!user}
            userId={user?.id}
            feedType={feedType}
          />
{/* 
      {( !hasProfileModalOpened && isProfileModalOpen) && ( */}
      {(isProfileModalOpen) &&  (
        <ProfileModal 
          isOpen={ isProfileModalOpen}
          onClose={handleModalClose} 
          userProfile={userProfile} 
          setUserProfile={setUserProfile} 
          selectedFile={selectedFile} 
          setSelectedFile={setSelectedFile}
        />
      )}
 
    <AddButton onClick={handleAddButtonClick} disabled={!user}> 피드 작성하기 </AddButton>

        </MainWrapper>
        {/* <Modal 
        isOpen={isRoleModalOpen}  
        // onClose={handleModalClose}
        onClose={() => setIsRoleModalOpen(false)}
        modalType="apply"
      >
        <RoleButtonContainer>
          <h3>지원할 역할을 선택하세요</h3>
          {selectedProject && selectedProject.roles ? (
            <RoleButtonContainerStyled>
              {Object.entries(selectedProject.roles).map(([role, count], index) => (
                <RoleButton
                  key={index}
                  onClick={() => handleRoleSelect(role)}
                  isSelected={selectedRole === role}
                >
                  {role} ({count})
                </RoleButton>
              ))}
              <RoleButton
                onClick={() => handleRoleSelect('무관')}
                isSelected={selectedRole === '무관'}
              >
                무관
              </RoleButton>
            </RoleButtonContainerStyled>
          ) : (
            <p>역할 정보가 없습니다.</p>
          )}
        </RoleButtonContainer>
        <SubmitButton onClick={() => handleApplySubmit(selectedProject, selectedRole)}>제출</SubmitButton>
      </Modal> */}

<RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        project={selectedProject}
        selectedRole={selectedRole}
        handleRoleSelect={handleRoleSelect}
        handleApplySubmit={handleApplySubmit}
      />


      <AuthModal 
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        handleSignUp={() => navigate('/SignupPage')}
        handleLogin={() => navigate('/LoginPage')}
      />

<AlertModal
  isOpen={!!showAlertPopup}
  message={showAlertPopup}
  onClose={() => setShowAlertPopup(false)}
/>

{showApplyPopup && (
  <Modal isOpen={showApplyPopup} onClose={() => setShowApplyPopup(false)}>
        <h3 style={{ textAlign: 'center',fontSize:'16px' }}>{showApplyPopup}</h3>
        <ButtonContainer>
          <ModalButton onClick={() => setShowApplyPopup(false)}>확인</ModalButton>
          {/* <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton> */}
        </ButtonContainer>
      </Modal>  
 
)}
      </>
    );
  };

  // export default MainPageComponent; //바뀐 피그마
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



const ApplyButton = styled.button`
  align-self: flex-end;
  margin-top: auto;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 14px 14px 1px 14px; 
  padding: 8px 25px;
  // width: calc(100% / 4);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #62B9EC;
  color: white;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #A0DAFB;
  }
`;

const RoleButton = styled.button`
  padding: 24px 25px;
  margin-bottom: 20px;
  border: 1px solid;
  border-radius: 14px 14px 1px 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-color: rgba(160, 218, 251);
  background-color: ${({ isSelected }) => (isSelected ? 'rgba(160, 218, 251)' : 'white')};
  color: #0A8ED9;
  font-size: 16px;
  white-space: nowrap;
  font-size: 18px;
  min-width: 60%;
  padding: 10px 20px;

  &:hover {
    background-color: rgba(160, 218, 251);
  }
`;

const RoleButtonContainer = styled.div`
  // margin-top: -20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; // 최대 높이 설정
  overflow-y: auto; // 세로 스크롤 가능

  position: relative; // 위치 고정을 위한 설정

  h3 {
    font-size: 24px;
    margin-bottom: 40px;
    position: sticky; // 스크롤 시 고정
    top: 0; // 상단에 고정
    background-color: white; // 배경색 설정 (필요시)
    z-index: 1; // 다른 요소 위에 표시되도록 설정
    //  padding: 20px;
  }
`;

const SubmitButton = styled.button`  border: none;
  border-radius: 15px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 70px;
  


  &:hover {
    background-color: #a0dafb;
  }
`;





const RoleButtonContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; // 최대 높이 설정
  overflow-y: auto; // 세로 스크롤 가능
  // height: 800px;

  position: relative; // 위치 고정을 위한 설정

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
