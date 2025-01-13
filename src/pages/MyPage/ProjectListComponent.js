import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import Pagination from '../../components/Pagination';
import axios from '../../api/axios'; // Axios import 추가
// import axios from 'axios';
import { useAuth, useProject } from '../../context/AuthContext'
import Modal from '../../components/Modal';  // Modal 컴포넌트 import

const ProjectListComponent = ({ 
  selectedList, 
  currentProjects = [], 
  handleProjectClick, 
  projectsPerPage, 
  totalProjects, 
  paginate, 
  currentPage,
  refreshProjects,  // 새로 추가된 prop
  setPopupMessage
}) => {
  const [isFading, setIsFading] = useState(false);
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const { completedProjects = [], markProjectAsCompleted } = useProject(); // 기본값을 빈 배열로 설정
  // eslint-disable-next-line no-unused-vars
  const [projects, setProjects] = useState(currentProjects);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProjectForCancel, setSelectedProjectForCancel] = useState(null);

  // localStorage 데이터 로드를 위한 useEffect 수정
  useEffect(() => {
    const loadCompletedProjects = () => {
        const saved = localStorage.getItem('completedProjects');
        if (saved) {
            try {
                const completedArray = JSON.parse(saved);
                const savedProjects = new Set(completedArray);
                
                // 현재 완료된 프로젝트 배열 확인
                const currentCompleted = Array.isArray(completedProjects) 
                    ? completedProjects 
                    : [];
                
                // 완료된 프로젝트를 업데이트할 필요가 있는지 확인
                const projectsToMark = [...savedProjects].filter(projectId => 
                    !currentCompleted.includes(projectId)
                );

                // 상태 업데이트를 최소화
                if (projectsToMark.length > 0) {
                    projectsToMark.forEach(projectId => {
                        markProjectAsCompleted(projectId);
                    });
                }
            } catch (error) {
                console.error('완료된 프로젝트 로드 중 오류:', error);
            }
        } else {
            // localStorage가 비어있을 경우, 모든 프로젝트 완료 상태 초기화
            completedProjects.forEach(projectId => {
                markProjectAsCompleted(projectId); // 모든 프로젝트 완료 상태 초기화
            });
        }
    };

    loadCompletedProjects();
  }, [completedProjects, markProjectAsCompleted]); // markProjectAsCompleted 추가

  // selectedList 변경 시 데이터를 새로 불러오는 useEffect
  useEffect(() => {
    if (selectedList === 'applied' && refreshProjects) {
      refreshProjects();
      console.log('Refreshing applied projects data...');
    }
  }, [selectedList, refreshProjects]);

  useEffect(() => {
    console.log('Current projects data:', currentProjects);
    console.log('Current state:', {
      selectedList,
      projectsCount: currentProjects?.length,
      projects: currentProjects
    });
  }, [selectedList, currentProjects]);

  // 프로젝트 완료 처리 함수 수정
  const handleButtonClick = (project) => {
    // 프로젝트가 완료되지 않은 경우에만 완료 처리
    if (!isProjectCompleted(project.pk)) {
        setIsFading(true);
        setTimeout(() => {
            handleProjectClick(project);
            setIsFading(false);
            
            // localStorage에서 완료된 프로젝트 목록 초기화
            localStorage.removeItem('completedProjects'); // 완료된 프로젝트 목록 삭제
            
            // 모든 프로젝트의 완료 상태를 초기화
            setProjects(prevProjects => 
                prevProjects.map(p => ({ ...p, completed: false })) // 모든 프로젝트의 completed 상태를 false로 설정
            );
        }, 100);
    } else {
        console.log("이미 완료된 프로젝트입니다."); // 디버깅용 로그
    }
  };

  // 프로젝트 상태 확인 함수 추가
  const isProjectCompleted = (projectId) => {
    const saved = localStorage.getItem('completedProjects');
    if (saved) {
      const completedArray = JSON.parse(saved);
      return completedArray.includes(projectId);
    }
    return false;
  };

  const handleCancelApplication = async (userId, feedId) => {
    if (!userId || !feedId) {
        console.error("userId 또는 feedId가 null입니다.");
        return;
    }

    // 취소할 프로젝트 정보 저장하고 모달 열기
    setSelectedProjectForCancel({ userId, feedId });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    const { userId, feedId } = selectedProjectForCancel;
    
    try {
        const response = await axios.patch('/my/writing/cancel', {
            pk: userId,
            sk: feedId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('응답:', response.data);
        setProjects(prevProjects => prevProjects.filter(project => project.pk !== feedId));
        setPopupMessage('신청이 취소되었습니다.');
    } catch (error) {
        console.error('오류 세부정보:', error);
        setPopupMessage(`신청 취소 중 오류가 발생했습니다. (${error.response?.data || '알 수 없는 오류'})`);
    }
    
    // 모달 닫기
    setIsConfirmModalOpen(false);
  };

  return (
    <Container>
      <ProjectList isFading={isFading}>
        {selectedList === 'applied' ? (
          <>
            {currentProjects.length === 0 ? (
              <p>신청한 프로젝트가 없습니다.</p>
            ) : (
              currentProjects.map((project, index) => (
                <ProjectItem 
                  key={`applied-${project.pk || project.sk || index}`}
                >
                  <ProjectHeader>
                    <HeaderItem>
                      <FontAwesomeIcon icon={regularUser} size="15px" />
                      <span>{project.nickname}</span>
                      <StyledFontAwesomeIcon2 icon={faHeart} />
                      <span>{project.likesCount || 0}</span>
                    </HeaderItem>
                  </ProjectHeader>

                  <p>{project.title}</p>
                
                  <Tags>
                    {project.tags && project.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </Tags>
                  <Button2 onClick={() => {
                    if (user && user.id && project.feedId) {
                      console.log("User ID:", user.id);
                      console.log("Project Feed ID:", project.feedId);
                      handleCancelApplication(user.id, project.feedId);
                    } else {
                      console.error("User or project information is missing");
                      console.log("User:", user);
                      console.log("User ID:", user ? user.id : "없음");
                      console.log("Project:", project);
                      console.log("Project Feed ID:", project ? project.feedId : "없음");
                    }
                  }}>
                    신청 취소
                  </Button2>
                  <AdditionalInfo>
                    <span>지원분야: {project.part}</span>
                    <span>모집현황: {project.recruitmentNum}명</span>
                    <span>마감일자: {new Date(project.deadline).toLocaleDateString()}</span>
                    <span>진행기간: {project.period ? `${project.period}개월` : '정보없음'}</span>
                    <span>상태: Pending</span>
                  </AdditionalInfo>
                </ProjectItem>
              ))
            )}
          </>
        ) : (
          // written 목록 렌더링 부분은 그대로 유지
          currentProjects && currentProjects.map((project, index) => (
            <ProjectItem 
              key={`written-${project.pk || project.sk || index}`}
            >
              <ProjectHeader>
                <HeaderItem>
                  <FontAwesomeIcon icon={regularUser} size="15px" />
                  <span>{project.nickname}</span>
                </HeaderItem>
                <HeaderItem>
                  <StyledFontAwesomeIcon icon={faHeart} />
                  <span>{project.likesCount}</span>
                </HeaderItem>
              </ProjectHeader>
              <p>{project.title}</p>
              <Tags>
                {Array.isArray(project.tags) && project.tags.length > 0 ? (
                  project.tags.map((tag, tagIndex) => (
                    <Tag key={`${project.pk}-tag-${tagIndex}`}>{tag}</Tag>
                  ))
                ) : (
                  <span>태그가 없습니다.</span>
                )}
              </Tags>
              <Button 
                onClick={() => handleButtonClick(project)}
                disabled={isProjectCompleted(project.pk)}
              >
                {isProjectCompleted(project.pk) ? '모집완료' : '모집 현황'}
              </Button>
            </ProjectItem>
          ))
        )}
      </ProjectList>

      <Pagination 
        currentPage={currentPage}
        projectsPerPage={projectsPerPage} 
        totalProjects={totalProjects} 
        onPageChange={paginate} 
      />

      {/* 취소 확인 모달 */}
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
        <h3 style={{ textAlign: 'center' }}>정말로 신청을 취소하시겠습니까?</h3>
        <ButtonContainer>
          <ModalButton onClick={handleConfirmCancel}>확인</ModalButton>
          <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton>
        </ButtonContainer>
      </Modal>
    </Container>
  );
};
export default ProjectListComponent;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProjectList = styled.div`
  margin-top: 60px;
  padding: 20px;
  padding-bottom: 0px;
  border: 2px solid #A0DAFB;
  border-radius: 20px;
  width:50vw;
  max-width: 800px; 
  overflow-x: auto;
  transition: transform 0.5s ease;
  transform: ${(props) => (props.isFading ? 'translateX(100%)' : 'translateX(0)')};
`;



const ProjectItem = styled.div`
  border-bottom: ${(props) => (props.isLast ? 'none' : '2px solid #A0DAFB')};
  border-radius: 1px;
  padding: 15px;
  padding-bottom: 30px;
  margin-bottom: 15px;
  position: relative;
  text-align: left; 

  p{
    font-weight: bold;
    font-size: 18px;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderItem = styled.div`  display: flex;
  align-items: center; 
  margin-right: 10px; 

  & > span {
    margin-left: 5px; 
    font-weight: bold;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: red;
  size: 15px;
  background-color: #BDBDBD;
  border-radius: 50%;
  padding:  4px;
`;

const StyledFontAwesomeIcon2 = styled(FontAwesomeIcon)`
  color: red;
  size: 15px;
  background-color: #BDBDBD;
  border-radius: 50%;
  padding: 4px;
  margin-left: 10px;
`;

const Tags = styled.div`
  display: flex;  
  margin: 10px 0;
  align-items: left;
  // min-height: 50px;
`;

const Tag = styled.span`
  margin-right: 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 14px 14px 1px 14px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-color: rgba(160, 218, 251);
  color: #0A8ED9;
`;

const Button = styled.button`
  position: absolute;
  background-color: ${props => props.disabled ? '#808080' : '#3563E9'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  right: 15px;
  bottom: 30px;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    background-color: ${props => props.disabled ? '#808080' : '#a0dafb'};
  }
`;

const Button2 = styled.button`
  position: absolute;
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  right: 15px;
  top:20px;

  &:hover {
    background-color: #a0dafb;
  }
`;

const AdditionalInfo = styled.div`
  position: absolute;
  text-align: left;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  right: 15px;
  bottom: 30px;
  
  
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

