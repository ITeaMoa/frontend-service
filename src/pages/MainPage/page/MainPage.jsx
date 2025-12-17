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
import { useAuth } from '../../../context/AuthContext';
import AlertModal from '../../../components/AlertModal';
import AuthModal from '../../../components/AuthModal';
import Modal from '../../../components/Modal';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import Pagination from '../../../components/Pagination';
import ProfileModal from '../../../components/ProfileModal';
import MainCarousel from '../components/MainCarousel';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FEED_TYPES } from '../../../constants/feedType';
import { 
  getPopularProjects, 
  getAllProjects, 
  getUserProfile, 
  getUserApplications, 
  submitApplication 
} from '../../../api';

const MainPage = () => {
  const { user } = useAuth();
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProjects, setPopularProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [showApplyPopup, setShowApplyPopup] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUserProfileLoaded, setIsUserProfileLoaded] = useState(false);
  const [, setSelectedSavedProject] = useAtom(selectedSavedProjectAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleFeedToggle = (type) => {
    setFeedType(type);
  };

  const handleAddButtonClick = () => {
    if (!user) { 
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
          const userData = await getUserProfile(user.id);
    
          if (userData) {
            setUserProfile(userData);
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
    };

    fetchUserProfile();
  }, [user]); 

  const isProfileComplete = () => {
    const headLine = userProfile?.headLine ? userProfile.headLine.trim() : "";
    const tags = userProfile?.tags || [];
    return headLine.length > 0 && tags.length > 0;
  };

  useEffect(() => {
    if(!user) return;
    setSelectedSavedProject({});

    if (!isUserProfileLoaded) return;
  
    if (!isProfileComplete()) {
      setIsProfileModalOpen(true);
    }
  }, [user, userProfile, isUserProfileLoaded, setSelectedSavedProject]);

  const slideCount = 3; 

  useEffect(() => {
    const fetchPopularProjects = async () => {
      const projects = await getPopularProjects(feedType);
      setPopularProjects(projects);
    };
  
    fetchPopularProjects();
  }, [feedType]);

  const handleProjectClick = (project) => {
    navigate(`/ApplyPage1/${project.pk}`);
    setSelectedProjectDetail(project);
  };
  
  useEffect(() => {
    const fetchAllProjects = async () => {
      const projects = await getAllProjects(feedType);
      setAllProjects(projects);
    };
  
    fetchAllProjects();
  }, [feedType]);

  const handleApplyClick = async (project) => {
    if (!user) { 
      setIsSubmitted(true); 
      return; 
    }

    if (project && project.creatorId === user.id) {
      setShowAlertPopup("자신이 작성한 게시글에는 신청할 수 없습니다.");
      return; 
    }
  
    try {
      const appliedProjects = await getUserApplications(user.id);
      const isAlreadyApplied = appliedProjects.includes(project.pk);
      
      if (isAlreadyApplied) {
        setShowApplyPopup("이미 신청한 프로젝트입니다."); 
        return;
      }
    } catch (error) {
      console.error("신청 여부 확인 실패:", error);
    }
  
    setSelectedProject(project);
    setIsRoleModalOpen(true);
  };
  
  const handleApplySubmit = async () => {
    if (!user) {
      setIsSubmitted(true);
      return;
    }
    
    if (!selectedRole) {
      setShowApplyPopup("역할을 선택하세요.");
      return;
    }
   
    try {
      const applicationData = {
        pk: user.id,
        sk: selectedProject.pk,
        part: selectedRole,
        feedType: feedType
      };
      
      await submitApplication(applicationData);
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
              {feedType === FEED_TYPES.STUDY ? '인기 스터디' : '인기 프로젝트'}
            </SectionTitle>
          </SectionHeader>

          <PopularProject projects={popularProjects} handleProjectClick={handleProjectClick} />

          <FeedToggleSection>
            <SectionTitle>피드</SectionTitle>
            <ToggleContainer>
              <ToggleOption 
                active={feedType === FEED_TYPES.STUDY} 
                onClick={() => handleFeedToggle(FEED_TYPES.STUDY)}
              >
                <ToggleCircle active={feedType === FEED_TYPES.STUDY} outlined={feedType !== FEED_TYPES.STUDY}>
                  {feedType === FEED_TYPES.STUDY && <ToggleCheck />}
                </ToggleCircle>
                Study
              </ToggleOption>
              <ToggleOption 
                active={feedType === FEED_TYPES.PROJECT} 
                onClick={() => handleFeedToggle(FEED_TYPES.PROJECT)}
              >
                <ToggleCircle active={feedType === FEED_TYPES.PROJECT} outlined={feedType !== FEED_TYPES.PROJECT}>
                  {feedType === FEED_TYPES.PROJECT && <ToggleCheck />}
                </ToggleCircle>
                Project
              </ToggleOption>
            </ToggleContainer>
          </FeedToggleSection>

          <StyledProjectFeed>
            {currentProjects.map(project => (
              <ProjectFeedCard
                key={project.id}
                project={project}
                handleProjectClick={handleProjectClick}
                onApplyClick={handleApplyClick}
              />
            ))}
          </StyledProjectFeed>

          <FloatingActionButtonContainer>
            <AddButton onClick={handleContestPageClick}>
              <FontAwesomeIcon icon={faSearch} />
              공모전
            </AddButton>

            <AddButton onClick={handleAddButtonClick}>
              <FontAwesomeIcon icon={faPen} />
              글쓰기
            </AddButton>
            
            <MoreButton>
              +
            </MoreButton>
          </FloatingActionButtonContainer>

          <PaginationContainer>
            <Pagination
              currentPage={currentPage}
              projectsPerPage={projectsPerPage}
              totalProjects={allProjects.length}
              onPageChange={handlePageChange}
            />
          </PaginationContainer>
        </MainContent>
      </ContentsWrap>

      {isProfileModalOpen && (
        <ProfileModal 
          isOpen={isProfileModalOpen}
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
        <Modal isOpen={!!showApplyPopup} onClose={() => setShowApplyPopup(false)}>
          <ModalContent>
            <h3>{showApplyPopup}</h3>
            <ButtonContainer>
              <ModalButton onClick={() => setShowApplyPopup(false)}>확인</ModalButton>
            </ButtonContainer>
          </ModalContent>
        </Modal>  
      )}
    </>
  );
};

// Styled Components
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

const StyledProjectFeed = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 32px;
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
  
  svg {
    color: #535353;
    font-size: 16px;
  }
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0;
`;

const ModalContent = styled.div`
  text-align: center;
  
  h3 {
    font-size: 16px;
    margin: 0 0 20px 0;
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

export default MainPage;