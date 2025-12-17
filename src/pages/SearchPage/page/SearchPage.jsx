import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom } from '../../../Atoms.jsx/AtomStates';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';
import ProjectFeedCard from '../components/ProjectFeedCard';
import { useAuth } from '../../../context/AuthContext';
import AlertModal from '../../../components/AlertModal';
import Modal from '../../../components/Modal';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import Pagination from '../../../components/Pagination';
import { 
  getAllProjects, 
  getUserApplications, 
  submitApplication, 
  searchProjectsByKeyword, 
  searchProjectsByTags 
} from '../../../api';

const SearchPage = () => {
  const {  user } = useAuth();
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [ setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [, setAllProjects] = useState([]);
  const [showApplyPopup, setShowApplyPopup] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [, setPopupMessage] = useState('');
  const [, setIsSubmitted] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();


  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  const searchTerm = query.get("q");
  const tags = query.get("tags");


  useEffect(() => {
    const fetchSearchItems = async () => {
        if ((!searchTerm || searchTerm.trim() === '') && (!tags || tags.trim() === '')) {
          setSearchResults([]); 
          return;
        }
        try {
            let data;
            if (tags) {
                data = await searchProjectsByTags(feedType, tags);
            } else {
                data = await searchProjectsByKeyword(feedType, searchTerm);
            }
            
            const filteredResults = data.filter(item => {
                return !tags || (item.tags && item.tags.some(tag => tags.split(',').includes(tag)));
            });
            setSearchResults(filteredResults); 

        } catch (error) {
            console.error("Error fetching search items:", error);
        }
    };

    fetchSearchItems();
}, [searchTerm, tags, feedType]); 

  const handleFeedToggle = (type) => {
    setFeedType(type);
  };


  const handleProjectClick = (project) => {
    navigate(`/ApplyPage1/${project.pk}`);
    setSelectedProjectDetail(project);
  };


  
  
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const data = await getAllProjects(feedType);
        if (!data || data.length === 0) {
          setAllProjects([]);
          return;
        }
  
        setAllProjects(data);
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
      const appliedProjectsData = await getUserApplications(user.id);
  
      const appliedProjects = appliedProjectsData.map(app => app.feedId); 
  
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
  const [currentPage, setCurrentPage] = useState(1);


  const currentProjects = searchResults.slice(
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
     
      <NavigationBar/>
      <FeedToggleSection>
        <SectionTitle>프로젝트 목록</SectionTitle>
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

      <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
        <Pagination
          currentPage={currentPage}
          projectsPerPage={projectsPerPage}
          totalProjects={currentProjects.length}
          onPageChange={handlePageChange}
        />

      </div>

      </MainContent>
    </ContentsWrap>

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
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
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


export default SearchPage; 