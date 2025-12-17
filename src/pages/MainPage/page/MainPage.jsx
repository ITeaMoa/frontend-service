import  { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom, selectedSavedProjectAtom } from '../../../Atoms.jsx/AtomStates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ContentsWrap , MainContent } from '../../../assets/BusinessAnalysisStyle';
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
import { faPen } from '@fortawesome/free-solid-svg-icons'; 

// [면접관용 설명] 환경 변수로 API URL 분리 (확장성을 위해)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api-iteamoa.brynnpark.xyz';

const MainPage = () => {
  const { user } = useAuth();
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [ ,setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProjects, setPopularProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [showApplyPopup, setShowApplyPopup] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [setPopupMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUserProfileLoaded, setIsUserProfileLoaded] = useState(false);
  const [modalOpenedOnce, ] = useState(false);
  const [, setHasProfileModalOpened] = useState(false);
  const [,setSelectedSavedProject] = useAtom(selectedSavedProjectAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleFeedToggle = (type) => {
    setFeedType(type);
  };

  const handleAddButtonClick = () => {
    if (!user) { 
      setPopupMessage("로그인 후에 이용할 수 있습니다."); 
      setIsSubmitted(true); 
      return; 
    }

    navigate(`/WritePage`); 
  };

  const handleContestPageClick = () => {
    navigate(`/ContestPage`);
  };

  const handleModalClose = async () => {
    setIsProfileModalOpen(false);
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user && user.id) {
          // [면접관용 설명] 에러 처리를 위한 try-catch 블록 추가
          const response = await axios.get(`/my/profile/${user.id}`);
    
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
        // [면접관용 설명] 에러 발생 시 기본 프로필 설정
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

    fetchUserProfile();
  }, [user]); 

  const isProfileComplete = () => {
    const headLine = userProfile?.headLine ? userProfile.headLine.trim() : "";
    const tags = userProfile?.tags || [];
    return headLine.length > 0 && tags.length > 0;
  };

  useEffect(() => {
    if(!user) return;
    setSelectedSavedProject({})

    if (!isUserProfileLoaded) return;
  
    if (!modalOpenedOnce) {
      if (!isProfileComplete()) {
        setIsProfileModalOpen(true);
        setHasProfileModalOpened(true);
      }
    }
    // eslint-disable-next-line
  }, [user, userProfile, isProfileModalOpen, isUserProfileLoaded, modalOpenedOnce]);

  const slideCount = 3; 

  useEffect(() => {
    const fetchPopularProjects = async () => {
      try {
        // [면접관용 설명] 에러 처리를 위한 try-catch 블록 추가
        const response = await axios.get(`/main/liked?feedType=${feedType}`);
  
        if (!response.data || response.data.length === 0) {
          console.warn('프로젝트 데이터가 없습니다.');
          setPopularProjects([]);
          return;
        }

        setPopularProjects(response.data);
      } catch (error) {
        console.error('Error fetching popular projects:', error);
        
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          console.warn('API 서버에 연결할 수 없습니다. 네트워크 연결 또는 서버 상태를 확인해주세요.');
          setPopularProjects([]); 
        } else {
          console.error('API 요청 중 오류가 발생했습니다:', error.message);
          setPopularProjects([]);
        }
      }
    };
  
    fetchPopularProjects();
  }, [feedType]);

  const handleProjectClick = (project) => {
    navigate(`/ApplyPage1/${project.pk}`);
    setSelectedProjectDetail(project);
  };
  
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        // [면접관용 설명] 에러 처리를 위한 try-catch 블록 추가
        const response = await axios.get(`/main?feedType=${feedType}`);
        if (!response.data || response.data.length === 0) {
          setAllProjects([]);
          return;
        }
  
        setAllProjects(response.data);
      } catch (error) {
        console.error('프로젝트 가져오기 실패:', error);
       
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          console.warn('API 서버에 연결할 수 없습니다. 네트워크 연결 또는 서버 상태를 확인해주세요.');
          setAllProjects([]); 
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

    if (project && project.creatorId === user.id) {
      setShowAlertPopup("자신이 작성한 게시글에는 신청할 수 없습니다.");
      return; 
    }
  
    try {
      // [면접관용 설명] 에러 처리를 위한 try-catch 블록 추가
      const response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });
  
      const appliedProjects = response.data.map(app => app.feedId); 
  
      const isAlreadyApplied = appliedProjects.includes(project.pk);
      if (isAlreadyApplied) {
        setShowApplyPopup("이미 신청한 프로젝트입니다."); 
        return;
      }
    } catch (error) {
      console.error("신청 여부 확인 실패:", error);
      // [면접관용 설명] 에러 발생 시에도 계속 진행 (사용자 경험 향상)
    }
  
    setSelectedProject(project);
    setIsRoleModalOpen(true);
  };
  
  const handleApplySubmit = async (project, role) => {
    if (!user) {
      setPopupMessage("로그인 후에 신청할 수 있습니다.");
      setIsSubmitted(true);
      return;
    }
   
    try {
      // [면접관용 설명] 에러 처리를 위한 try-catch 블록 추가
      const applicationData = {
        pk: user.id,
        sk: selectedProject.pk,
        part: selectedRole,
        feedType: feedType
      };
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
      <NavigationBar showSearch={true}/>

      <MainCarousel currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} slideCount={slideCount} />
      <SectionHeader>
      
      <SectionTitle>
        {feedType === 'STUDY' ? '인기 스터디' : '인기 프로젝트'}
      </SectionTitle>
       
      </SectionHeader>

      <PopularProject projects={popularProjects} handleProjectClick={handleProjectClick} />

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
  background-color: white;
  border-radius: 50%;
  border: 2px solid #00aeff;
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
`;

export default MainPage;