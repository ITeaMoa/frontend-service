import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import Section1 from "./section1";
import Section2 from "./section2";
// import Section2 from "./Section2";
import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Modal from '../../components/Modal';

import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import ProfileModal from '../../components/ProfileModal'; // ProfileModal 컴포넌트 추가
import AuthModal from '../../components/AuthModal';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom, likedProjectsAtom } from '../../Atoms.jsx/AtomStates';
import MainPageComponent from './MainPage';

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
      id: 2,
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
    // ... 나머지 더미 데이터 ...
    {
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
  ];

  
    // // ... 기존 상태들 ...
    // const [allProjects, setAllProjects] = useState([]);
    // const [popularProjects, setPopularProjects] = useState([]);
    const [popularProjects, setPopularProjects] = useState(dummyProjects);
    const [allProjects, setAllProjects] = useState(dummyProjects);
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
    const { user } = useAuth(); 

    const [selectedFile, setSelectedFile] = useState(null); 
    const [userProfile, setUserProfile] = useState({
      tags: [],
      experiences: [],
      avatarUrl: null,
      headLine: "",
      educations: [],
      personalUrl: ""
    });
    const [popupMessage, setPopupMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [hasFinalizedProfile, setHasFinalizedProfile] = useState(false); // 프로필 제출 여부
    const [hasProfileModalOpened, setHasProfileModalOpened] = useState(false);
    const [isUserProfileLoaded, setIsUserProfileLoaded] = useState(false);
    const [likedProjects, setLikedProjects] = useAtom(likedProjectsAtom);


   

  
    const handleAddButtonClick = () => {
      if (!user) { 
        setPopupMessage("로그인 후에 이용할 수 있습니다."); 
        setIsSubmitted(true); 
        return; 
      }
      navigate(`/WritePage?feedType=${feedType}`); 
    };
  
    // const initialFeedType = localStorage.getItem('feedType') || 'PROJECT'; 
    // const [feedType, setFeedType] = useState(initialFeedType); 
    const [feedType, setFeedType] = useAtom(feedTypeAtom);

  
    useEffect(() => {
      console.log("현재 feedType:", feedType);
    }, [feedType]); 
  
    // const handleToggleChange = (newFeedType) => {
    //   setFeedType(newFeedType); 
    //   localStorage.setItem('feedType', newFeedType); 
    //   console.log("현재 feedType:", newFeedType); 
    //   navigate(location.pathname); 
    // };
  
  
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


  
    // useEffect(() => {
    //   if ( !modalOpenedOnce) {
    //     setIsProfileModalOpen(true); // 쿼리 파라미터에 따라 프로필 모달 열기
    //     modalOpenedOnce = true;
    //     setHasProfileModalOpened(true);
    //   }
    // }, [ modalOpenedOnce]); // showModal이 변경될 때마다 실행


    const fetchPopularProjects = useCallback(async () => {
      try {
        const response = await axios.get(`/main/liked?feedType=${feedType}`);
  
        if (!response.data || response.data.length === 0) {
          console.warn('프로젝트 데이터가 없습니다.');
          setPopularProjects([]);
          return;
        }
  
        console.log('응답 데이터:', response.data);
  
        // const projectsWithLikes = response.data.map((project) => {
        //   const isLiked = likedProjects.find(likedProject => likedProject.id === project.id);
        //   return {
        //     ...project,
        //     creatorId: project.creatorId,
        //     liked: isLiked ? isLiked.liked : false,
        //     likesCount: project.likesCount || 0,
        //   };
        // });

        const projectsWithLikes = response.data.map((project) => ({
          ...project,
          // creatorId: project.creatorId,
          // atom의 상태를 사용하여 좋아요 여부 확인
          liked: likedProjects.some(
              likedProject => likedProject.id === project.id && likedProject.liked
          ),
          // likesCount: project.likesCount || 0  //있는지 없는지 확인인
      }));
        setPopularProjects(projectsWithLikes);
      } catch (error) {
        console.error('Error fetching popular projects:', error);
      }
    }, [feedType, likedProjects]);

    useEffect(() => {
      fetchPopularProjects();
    }, [fetchPopularProjects, feedType]);
  
  
  
    // // Section2 관련 API 호출 함수들을 MainPage로 이동
    // const fetchAllProjects = useCallback(async () => {
    //   try {
    //     const response = await axios.get(`/main?feedType=${feedType}`);
    //     if (!response.data || response.data.length === 0) {
    //       setAllProjects([]);
    //       return;
    //     }
    // const projectsWithLikes = response.data.map((project) => ({
    //   ...project,
    //   // creatorId: project.creatorId,
    //   // atom의 상태를 사용하여 좋아요 여부 확인
    //   liked: likedProjects.some(
    //       likedProject => likedProject.id === project.id && likedProject.liked
    //   ),
    //     setAllProjects(projectsWithLikes);
    //   } catch (error) {
    //     console.error('프로젝트 가져오기 실패:', error);
    //   }
    // }, [feedType, likedProjects]);

//  useEffect(() => {
//     fetchAllProjects();
//   }, [fetchAllProjects, feedType]);


    const handleApplyClick = async (project) => {
      if (!user) { 
        setPopupMessage("로그인 후에 신청할 수 있습니다."); 
        setIsSubmitted(true); 
        return; 
      }
    
      // 자신이 작성한 게시글인지 확인
      if (project && project.creatorId === user.id) {
        alert("자신이 작성한 게시글에는 신청할 수 없습니다."); 
        return; 
      }
    
      try {
        const response = await axios.get('/feed/applications', {
          params: {
            userId: user.id,
          }
        });
        console.log('이미신청한 프로젝트:', response.data); // 응답 데이터 출력
    
        const appliedProjects = response.data.map(app => app.feedId); // 신청한 프로젝트의 feedId 목록
        console.log('신청한 프로젝트 feedId 목록:', appliedProjects); // 신청한 프로젝트 feedId 출력
    
        // 선택한 프로젝트의 pk와 비교
        const isAlreadyApplied = appliedProjects.includes(project.pk);
        if (isAlreadyApplied) {
          alert("이미 신청한 프로젝트입니다."); 
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
          sk: project.pk,
          part: role,
          feedType: feedType
        };
        await axios.post('/main/application', applicationData);
        alert("신청이 완료되었습니다.");
      } catch (error) {
        console.error("신청 실패:", error);
        alert("신청에 실패했습니다.");
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
          {/* <Section2 
            projects={allProjects}
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            onPageChange={setCurrentPage}
            onProjectClick={handleProjectClick}
            onLikeClick={handleLikeClick}
            // onApplyClick={(project) => {
            //   setSelectedProject(project);
            //   setIsRoleModalOpen(true);
            // }}
            onApplyClick={handleApplyClick} 
            isLoggedIn={!!user}
            userId={user?.id}
          /> */}

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
        <Modal 
        isOpen={isRoleModalOpen} 
        onClose={handleModalClose}
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
        <SubmitButton onClick={handleApplySubmit}>제출</SubmitButton>
      </Modal>

      <AuthModal 
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        handleSignUp={() => navigate('/SignupPage')}
        handleLogin={() => navigate('/LoginPage')}
      />
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


