import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NavigationBar from "../../../components/NavigationBar";
import ProjectDetail from '../components/ProjectDetail';
import { useAuth } from '../../../context/AuthContext'
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../../../atoms/AtomStates';
import Pagination from '../../../components/Pagination';
import Modal from '../../../components/Modal';
import ProjectItemComponent from '../components/ProjectItemComponent';
import UserProfile from '../components/UserProfile';
import AlertModal from '../../../components/AlertModal';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import ProjectLikeItem from '../components/ProjectLikeItem';
import ProjectItemColumnComponent from '../components/ProjectItemColumnComponent';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import ProjectDeadline from '../components/ProjectDeadline';
import { 
  getUserApplications, 
  submitApplication, 
  getUserWriting, 
  getUserTempFeeds, 
  getUserLikedFeeds, 
  getFeedApplications, 
  closeFeed, 
  cancelApplication 
} from '../../../api';
import { 
  MOCK_SAVED_PROJECTS, 
  MOCK_LIKED_PROJECTS, 
  MOCK_APPLIED_PROJECTS, 
  MOCK_WRITTEN_PROJECTS 
} from '../../../data/mockData';

const PROJECTS_PER_PAGE = 5;

const MyPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(PROJECTS_PER_PAGE); 
  const [selectedList, setSelectedList] = useState('applied');
  const [selectedProject, setSelectedProject] = useState(null);
  const [applySelectedProject, setApplySelectedProject] = useState(null);
  const showSearch = false;
  const { user } = useAuth(); 
  const [feedType, ] = useAtom(feedTypeAtom);
  const [applications, setApplications] = useState([]); 
  const [isFading, setIsFading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProjectForCancel, setSelectedProjectForCancel] = useState(null);
  const [, setIsProfileVisible] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [showApplyPopup, setShowApplyPopup] = useState(''); 
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);


useEffect(() => {
  window.scrollTo(0, 0);
}, []);


const refreshProjects = async () => {
  try {
    let data;

    if (selectedList === 'applied') {
      data = await getUserApplications(user.id);
    } else if (selectedList === 'written') {
      data = await getUserWriting(user.id, feedType);
    } else if (selectedList === 'saved') {
      data = await getUserTempFeeds(user.id, feedType);
    } else if (selectedList === 'interested') {
      data = await getUserLikedFeeds(user.id, feedType);
    }
    
    if (data) {
      setProjects(data);
    } else {
      setProjects([]); 
    }
  } catch (error) {
    console.warn("Backend unavailable, loading mock data...", error);
    if (selectedList === 'applied') {
      setProjects(MOCK_APPLIED_PROJECTS);
    } else if (selectedList === 'written') {
      setProjects(MOCK_WRITTEN_PROJECTS);
    } else if (selectedList === 'saved') {
      setProjects(MOCK_SAVED_PROJECTS);
    } else if (selectedList === 'interested') {
      setProjects(MOCK_LIKED_PROJECTS);
    } else {
      setProjects([]);
    }
  }
};


useEffect(() => {
  refreshProjects();
  // eslint-disable-next-line
}, [selectedList, user?.id, feedType]); 


  useEffect(() => {
    const fetchApplications = async (feedId) => {
      if (!feedId) {
        return; 
      }

      try {
        const data = await getFeedApplications(feedId);

        if (data) {
          setApplications(data); 
        } else {
          setApplications([]);
        }
      } catch (error) {
        setApplications([]);
      }
    };

    if (selectedProject?.pk) {
      fetchApplications(selectedProject.pk);
    }
  }, [selectedProject]);



  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleListClick = (listType) => {
    setSelectedList(listType);
    setCurrentPage(1); 
    setSelectedProject(null); 

    if (listType === 'saved' || listType === 'closed' || listType === 'interested' || listType === 'applied' || listType === 'written') {
      setProjects([]);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);

  };
  

  const handleBackToList = () => {
    setSelectedProject(null);
  };


    const handleButtonClick = (project) => {
      if (!isProjectCompleted(project.pk)) {
          setIsFading(true);
          setTimeout(() => {
              handleProjectClick(project);
              setIsFading(false);
            
              localStorage.removeItem('completedProjects');
              
              setProjects(prevProjects => 
                  prevProjects.map(p => ({ ...p, completed: false }))
              );
          }, 100);
      } else {
      }
    };
  
     const isProjectCompleted = (projectId) => {
      const saved = localStorage.getItem('completedProjects');
      if (saved) {
        const completedArray = JSON.parse(saved);
        return completedArray.includes(projectId);
      }
      return false;
    };
  

const handleProjectClose = async (projectId, feedType) => {
    try {
        const requestData = {
            pk: projectId,
            sk: feedType  
        };

        await closeFeed(requestData);
            
        setProjects(prevProjects => 
            prevProjects.map(project => 
                project.pk === projectId 
                    ? { ...project, isCompleted: true } 
                    : project
            )
        );
    } catch (error) {
        setShowAlertPopup('모집 완료 처리 중 문제가 발생했습니다.');
    }
};

const handleCancelApplication = async (userId, feedId) => {
    if (!userId || !feedId) {
      return;
    }
    setSelectedProjectForCancel({ userId, feedId });
    setIsConfirmModalOpen(true);
  };

const handleConfirmCancel = async () => {
    const { userId, feedId } = selectedProjectForCancel;
    try {
      const response = await cancelApplication(userId, feedId);
      if (response || response === null) { 
        setProjects(prevProjects => 
          prevProjects.filter(project => project.feedId !== feedId)
        );
        if (refreshProjects) {
          await refreshProjects();
        }
        setShowAlertPopup('신청이 취소되었습니다.');
      } else {
        setShowAlertPopup('신청 취소에 실패했습니다.');
      }
      setIsConfirmModalOpen(false);
    } catch (error) {
      setShowAlertPopup(`신청 취소 중 오류가 발생했습니다. (${error.message})`);
    }
  };

  const isProjectCanceled = (projectId) => {
    const project = currentProjects.find(p => p.feedId === projectId);
    return project ? project.canceled : false; 
  };


  

  const handleApplyClick = async (project) => {

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
      console.error('신청 여부 확인 실패:', error);
    }
  
    setApplySelectedProject(project);
    setIsRoleModalOpen(true); 
  };
  
  const handleApplySubmit = async () => {
    try {
      const applicationData = {
        pk: user.id,
        sk: applySelectedProject.pk,
        part: selectedRole,
        feedType: feedType
      };

      await submitApplication(applicationData);
      setShowApplyPopup("신청이 완료되었습니다.");
      setIsRoleModalOpen(false);
    } catch (error) {
      setShowApplyPopup("신청에 실패했습니다.");
    }
  };


  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
 


  return (
    <>
       <ContentsWrap>
       <MainContent Wide1030>
    
        <NavigationBar  showSearch={showSearch}  />

        <TabWrapType3 Border>
        {['applied', 'interested', 'written', 'saved', 'closed', 'profile'].map((tabType) => (
          <TabButtonType3
            key={tabType}
            onClick={() => handleListClick(tabType)}
            isActive={selectedList === tabType}
            className={selectedList === tabType ? "active" : ""}
          >
            {tabType === 'applied' && '신청 목록'}
            {tabType === 'interested' && '관심 목록'}
            {tabType === 'written' && '작성 목록'}
            {tabType === 'saved' && '임시 저장'}
            {tabType === 'closed' && '마감 목록'}
            {tabType === 'profile' && '개인 정보'}
          </TabButtonType3>
        ))}
      </TabWrapType3>

      {selectedProject ? (
        <>
         <ProjectDetail 
                    project={selectedProject}
                    applications={applications}
                    onBack={handleBackToList} 
                    onClose={(projectId) => handleProjectClose(projectId, 'PROJECT')}
                />
         
        </>
      ) : (
        <ProjectList isFading={isFading} selectedList={selectedList}>
          {selectedList === 'applied' ? (
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                나의 신청 목록 ({currentProjects.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {currentProjects.length === 0 ? (
                  <p style={{ gridColumn: '1 / -1' }}>신청한 프로젝트가 없습니다.</p>
                ) : (
                  currentProjects.map((project, index) => (
                    <ProjectItemColumnComponent
                      key={`applied-${project.pk || project.sk || index}`}
                      project={project}
                      user={user}
                      handleCancelApplication={handleCancelApplication}
                      isProjectCanceled={isProjectCanceled}
                    />
                  ))
                )}
              </div>
            </div>
          ) : selectedList === 'saved' ? (
            <>
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                나의 임시저장글({currentProjects.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}></div>
              {currentProjects.filter(project => project.savedFeed).length === 0 ? (
                <p>저장한 프로젝트가 없습니다.</p>
              ) : (
                currentProjects.filter(project => project.savedFeed).map((project, index) => (
                  <ProjectItemComponent 
                    key={`saved-${project.pk || project.sk || index}`}
                    project={project}
                    user={user}
                    handleCancelApplication={handleCancelApplication}
                    isProjectCanceled={isProjectCanceled}
                    isSaved={true}
                  />
                ))
              )}
              </div>
            </>
          ) : selectedList === 'interested' ? (
            <>
        
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                나의 관심 목록 ({currentProjects.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {currentProjects.filter(project => project.postStatus).length === 0 ? (
                <p>좋아요한 프로젝트가 없습니다.</p>
              ) : (
                currentProjects.filter(project => project.postStatus).map((project, index) => (
                  <ProjectLikeItem 
                    key={`interested-${project.pk || project.sk || index}`}
                    project={project}
                    user={user}
                    // handleProjectClick={handleProjectClick}
                    onApplyClick={handleApplyClick}
                 
                  />
                ))
              )}
              </div>
              </div>
            </>
          ) : selectedList === 'profile' ? (
            <UserProfile 
              // userProfile={userProfile}
              user={user} 
              setIsProfileVisible={setIsProfileVisible} 
              setShowAlertPopup={setShowAlertPopup}
            />
          ) : selectedList === 'written' ? (
            <>
              <div style={{ gridColumn: '1 / -1', width: '100%' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                  나의 작성 목록 ({currentProjects.length})
                </h2>
                <div style={{ display: 'grid',  gap: '10px' }}>
                  {currentProjects.filter(project => project.postStatus).length === 0 ? (
                    <p>작성한 프로젝트가 없습니다.</p>
                  ) : (
                    currentProjects && currentProjects.map((project, index) => (
                      <ProjectItemComponent 
                        key={`written-${project.pk || project.sk || index}`}
                        project={project}
                        handleButtonClick={handleButtonClick}
                        isProjectCompleted={isProjectCompleted}
                        isSaved={false}
                      />  
                    ))
                  )}
                </div>
              </div>
            </>
          ) : ( <> 
          <div style={{ gridColumn: '1 / -1', width: '100%' }}> 
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
            나의 프로젝트 ({currentProjects.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
             {currentProjects.length === 0 ? (
                    <p>참여한 공모전이 없습니다.</p>
                  ) : (
                    currentProjects && currentProjects.map((project, index) => (
                      <ProjectDeadline
                      key={`deadline-${project.pk || project.sk || index}`}
                      project={project}
                   
                    />
                    ))
                  )}
          </div>
          </div>  
          </>
          )}
        </ProjectList>
      )} 

</MainContent>
</ContentsWrap>

      {selectedList !== 'profile' && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
                <Pagination 
                  currentPage={currentPage}
                  projectsPerPage={projectsPerPage}
                  totalProjects={projects.length}
                  onPageChange={paginate} 
                />
              </div>
            )}

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
              <h3 style={{ textAlign: 'center' }}>정말로 신청을 취소하시겠습니까?</h3>
              <ButtonContainer>
                <ModalButton onClick={handleConfirmCancel}>확인</ModalButton>
                <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton>
              </ButtonContainer>
            </Modal>
        

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

      <RoleSelectionModal
              isOpen={isRoleModalOpen}
              onClose={() => setIsRoleModalOpen(false)}
              project={applySelectedProject}
              selectedRole={selectedRole}
              handleRoleSelect={handleRoleSelect}
              handleApplySubmit={handleApplySubmit}
            />
          </>
   
  );
};

export default MyPage;

const TabWrapType3 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto; 
  white-space: nowrap; 
  max-width: 100%; 
  padding: 20px;

  ul {
    list-style: none;
    display: flex;
    gap: 20px;
    padding: 0;
    margin: 0;
  }

  @media (max-width: 768px) {
    ul {
      gap: 10px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ul {
      gap: 5px;

    }
    
  }
`;


const TabButtonType3 = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #000; 
  cursor: pointer;
  padding: 10px 20px; 
  position: relative;
  margin-right: 25px;

  &.active {
    color: #00aeff; 
    font-weight: bold; 
  }

  &:hover {
    color: #00aeff; 
  }


  &.active::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -0px; 
    transform: translateX(-50%);
    width: 80%; 
    height: 2px; 
    background-color: #00aeff; 
  }
`;

const ProjectList = styled.div`
  margin-top: 20px;
  padding: 20px;
  padding-bottom: 0px;
  // border: 2px solid #A0DAFB;
  border-radius: 20px;
  overflow-x: auto;
  transition: transform 0.5s ease;
  transform: ${(props) => (props.isFading ? 'translateX(100%)' : 'translateX(0)')};
  min-height: 700px;

  ${({ selectedList }) => (selectedList === 'applied' || selectedList === 'interested' ) && `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    

  `}

  
  ${({ selectedList }) => (selectedList === 'applied' || selectedList === 'saved' || selectedList === 'interested' || selectedList === 'profile' || selectedList === 'written') && `
    border: none;
    padding: 3px;
  `}
  ${({ selectedList }) => (selectedList === 'profile') && `
    min-height: 1000px;
  `}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    grid-template-columns: 1fr;
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
