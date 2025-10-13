//바끤 피그마
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom ,selectedSavedProjectAtom} from '../../../Atoms.jsx/AtomStates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';
import PopularProject from '../components/PopularProject';
import ProjectFeedCard from '../components/ProjectFeedCard';
import axios from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext';
import AlertModal from '../../../components/AlertModal';
import AuthModal from '../../../components/AuthModal';
import Modal from '../../../components/Modal';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import Pagination from '../../../components/Pagination';
import ProfileModal from '../../../components/ProfileModal';
import MainCarousel from '../components/MainCarousel';
import { faPen } from '@fortawesome/free-solid-svg-icons'; // Import the pencil icon






const MainPage = () => {
  const { isLoggedIn, user } = useAuth();
  // const [isLoggedIn, setIsLoggedIn] = useAtom(IS_LOGGED_IN);
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [selectedProjectDetail, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProjects, setPopularProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [showApplyPopup, setShowApplyPopup] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUserProfileLoaded, setIsUserProfileLoaded] = useState(false);
  const [modalOpenedOnce, setModalOpenedOnce] = useState(false);
  const [hasProfileModalOpened, setHasProfileModalOpened] = useState(false);
  // const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedSavedProject,setSelectedSavedProject] = useAtom(selectedSavedProjectAtom); // 아톰에서 프로젝트 정보 가져오기


  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?query=${e.target.value}`);
    }
  };

  const handleFeedToggle = (type) => {
    setFeedType(type);
  };

  // const handleAddButtonClick = () => {
  //   const tagsQuery = selectedTags.length > 0 ? `&tags=${selectedTags.join(',')}` : '';
  //   // const feedType = toggleActive ? 'PROJECT' : 'STUDY'; // 현재의 토글 값에 따라 feedType 설정
  //   navigate(`/SearchPage?q=${searchValue}${tagsQuery}&feedType=${feedType}`); // 검색어, 선택된 태그, feedType을 URL로 전달
  // };

  const handleAddButtonClick = () => {
    if (!user) { 
      setPopupMessage("로그인 후에 이용할 수 있습니다."); 
      setIsSubmitted(true); 
      return; 
    }
    // navigate(`/WritePage?feedType=${feedType}`); 
    navigate(`/WritePage`); 
  };

  const handleContestPageClick = () => {

    navigate(`/ContestPage`);
  };

  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태 추가

  // 1. 프로젝트 데이터 예시
  const projectList = [
    {
      id: 1,
      title: "재난 대응 어플리케이션 백엔드 구해요!",
      description: "재난 대응 어플리케이션에서 백엔드 개발자를 구합니다. 주요 업무는 ...",
      tags: ["백엔드", "Node.js", "React"],
      people: "2",
      date: "2024.06.08",
      views: 340,
    },
    {
      id: 2,
      title: "재난 대응 어플리케이션 백엔드 구해요!",
      description: "재난 대응 어플리케이션에서 백엔드 개발자를 구합니다. 주요 업무는 ...",
      tags: ["백엔드", "Node.js", "React"],
      people: "2",
      date: "2024.06.08",
      views: 340,
    },
    // ... 여러 개 추가
  ];

  // const popularProjects = [
  //   {
  //     title: '블록체인 Dapp 프로젝트',
  //     deadlineTag: 'D-54',
  //     description: '이번 블록체인 Dapp 프로젝트에서 백엔드를 맡아주실 개발자 분을 구하고 있습니다...',
  //     recruitInfo: '모집 인원 | 3~4명',
  //     deadlineInfo: '마감일 25.03.15',
  //     tags: ['AWS', 'Blockchain', 'React']
  //   },
  //   {
  //     title: '하이브리드 웹 개발자 양성',
  //     deadlineTag: 'D-64',
  //     description: '안녕하세요! 저희는 이번에 하이브리드 웹 개발자 양성을 위하여 새로운 신입 멤버를 모집하고 있...',
  //     recruitInfo: '모집 인원 | 3~4명',
  //     deadlineInfo: '마감일 25.04.06',
  //     tags: ['Hybrid', 'Web', 'front']
  //   },
  //   {
  //     title: '알고리즘 프로젝트 모집!',
  //     deadlineTag: 'D-70',
  //     description: '안녕하세요 저희는 뉴알고리즘을 만들고자 새로운 능력자분을 모시고 있습니다 저희는 디앱 기반 ...',
  //     recruitInfo: '모집 인원 | 5~7명',
  //     deadlineInfo: '마감일 25.04.30',
  //     tags: ['Newproject', 'Algorithm', 'AWS']
  //   }
  // ];

  



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
  
    }
  }, [user, userProfile, isProfileModalOpen, isUserProfileLoaded, modalOpenedOnce]);



  const slideCount = 3; // 슬라이드 개수(캐러셀 아이템 개수와 맞추세요)

  useEffect(() => {
    const fetchPopularProjects = async () => {
      try {
        const response = await axios.get(`/main/liked?feedType=${feedType}`);
  
        if (!response.data || response.data.length === 0) {
          console.warn('프로젝트 데이터가 없습니다.');
          setPopularProjects([]);
          return;
        }

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

  const handleProjectClick = (project) => {
    console.log("mainprojecttodetail", project)
    navigate(`/ApplyPage1/${project.pk}`);
    setSelectedProjectDetail(project);
  };


  
  
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const response = await axios.get(`/main?feedType=${feedType}`);
        if (!response.data || response.data.length === 0) {
          setAllProjects([]);
          return;
        }
        console.log('모든 게시물:', response.data);
  
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

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  

  const projectsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  // const [projectsPerPage] = useState(6); 

  //페이지네이션방법 1
  // const indexOfLastProject = currentPage * projectsPerPage;
  // const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  // const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    //페이지네이션방법 2
  const currentProjects = allProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <>
    <ContentsWrap>
    <MainContent Wide1030>
      {/* Header with Logo and Search */}
      <NavigationBar showSearch={true}

      />

      {/* Carousel Section */}
      <MainCarousel currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} slideCount={slideCount} />

      {/* Popular Projects Section */}
      <SectionHeader>
      
      <SectionTitle>
        {feedType === 'STUDY' ? '인기 스터디' : '인기 프로젝트'}
      </SectionTitle>
       
      </SectionHeader>

      {/* <ViewMoreLink>
          자세히 알아보기 
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 4L12 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
   
        </ViewMoreLink> */}

      <PopularProject projects={popularProjects} handleProjectClick={handleProjectClick} />

      {/* Project Feed Toggle */}
      <FeedToggleSection>
        <SectionTitle>피드</SectionTitle>
        <ToggleContainer>
          <ToggleOption 
            active={feedType === 'STUDY'} 
            onClick={() => handleFeedToggle('STUDY')}
          >
            <ToggleCircle active={feedType === 'STUDY'} outlined={feedType !== 'STUDY'}>
              {feedType === 'STUDY' && <ToggleCheck />}
            </ToggleCircle>
            Study
          </ToggleOption>
          <ToggleOption 
            active={feedType === 'PROJECT'} 
            onClick={() => handleFeedToggle('PROJECT')}
          >
            <ToggleCircle active={feedType === 'PROJECT'} outlined={feedType !== 'PROJECT'} >
              {feedType === 'PROJECT' && <ToggleCheck />}
            </ToggleCircle>
          
          
            Project
          </ToggleOption>
        </ToggleContainer>
      </FeedToggleSection>

      {/* Project Feed */}
      <ProjectFeed style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "32px",
        marginBottom: "32px"
      }}>
        {currentProjects.map(project => (
          <ProjectFeedCard
            key={project.id}
            project={project}
            handleProjectClick={handleProjectClick}
            onApplyClick={handleApplyClick}
          />
        ))}
      </ProjectFeed>

     
        <FloatingActionButtonContainer>
            <AddButton onClick={handleContestPageClick} >
           <FontAwesomeIcon icon={faSearch} style={{fontSize:'16px'}}/> {/* FontAwesome icon */}
         공모전
        </AddButton>

         <AddButton onClick={handleAddButtonClick} >
          <FontAwesomeIcon icon={faPen} style={{ color: '#535353', fontSize: '16px' }} /> {/* FontAwesome icon */}
          글쓰기
        </AddButton>
        <MoreButton>
          +
        </MoreButton>

        </FloatingActionButtonContainer>
   

      <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
        <Pagination
          currentPage={currentPage}
          projectsPerPage={projectsPerPage}
          totalProjects={allProjects.length}
          onPageChange={handlePageChange}
        />
      </div>

  
      </MainContent>
    {/* </PageContainer> */}
    </ContentsWrap>

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


    <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        project={selectedProject}
        selectedRole={selectedRole}
        handleRoleSelect={handleRoleSelect}
        handleApplySubmit={handleApplySubmit}
      />

<AlertModal
isOpen={!!showAlertPopup}
message={showAlertPopup}
onClose={() => setShowAlertPopup(false)}
/>

<AuthModal 
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        handleSignUp={() => navigate('/SignupPage')}
        handleLogin={() => navigate('/LoginPage')}
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




const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;




const FeedToggleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 27px;
`;

const ToggleOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#000000' : '#888888'};
  cursor: pointer;
`;

const ToggleCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#00AEFF' : 'transparent'};
  border: ${props => props.outlined ? '1.5px solid #00AEFF' : 'none'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleCheck = styled.div`
  width: 12px;
  height: 12px;
  background-color: white; // Change to the desired color
  border-radius: 50%; // Make it circular
  border: 2px solid #00aeff; // Add border color to match the design
`;

const ProjectFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
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

const AddButton = styled.button`
  // background: #535353;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: 10px;
  color: #535353;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  width: 60px;
  height: 60px;
  padding: 10px 28px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background 0.15s;
  &:hover:enabled {
    background: #d9d9d9;
  }
  &:disabled {
    background: #e0e0e0;
    color: #aaa;
    cursor: not-allowed;
  }
  // position: fixed;
  // right: 10%;
  // bottom: 10%;
  
`;

const AddButtonFixed = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 100;
  background: #00aeff;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 18px 36px;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: background 0.15s;
  &:hover:enabled {
    background: #0090d9;
  }
  &:disabled {
    background: #e0e0e0;
    color: #aaa;
    cursor: not-allowed;
  }
`;


const FloatingActionButtonContainer = styled.div`
  position: fixed;
  right: 120px;
  bottom: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const MoreButton = styled.button`
  background: #535353;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: 10px;
  color: #FFFFFF;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);  
  width: 60px;
  height: 60px;
  padding: 10px 28px;   
  font-size: 40px;
  // font-weight: 600;
  `;


export default MainPage; 