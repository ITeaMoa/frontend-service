import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import Pagination from '../../components/Pagination';
import axios from '../../api/axios'; // Axios import 추가
// import axios from 'axios';
import { useAuth, useProject } from '../../context/AuthContext'
import Modal from '../../components/Modal';  // Modal 컴포넌트 import
// import {  faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
// import { useAtom } from 'jotai'; // jotai import 추가
// import { userProfileAtom } from '../../atoms/userProfileAtom'; // userProfileAtom import 추가

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
  const [isProfileVisible, setIsProfileVisible] = useState(false); // 프로필 내용 표시 상태 추가
  const [userProfile, setUserProfile] = useState({}); // 초기 상태를 빈 객체로 설정

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

  useEffect(() => {
    console.log('현재 프로젝트 목록:', projects); // 현재 프로젝트 목록 로그
  }, [projects]);

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
    };

    fetchUserProfile();
  }, [user, setUserProfile]);

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
    
    console.log('선택된 프로젝트 정보:', selectedProjectForCancel); // 선택된 프로젝트 정보 로그
    console.log('선택된 프로젝트의 feedId:', feedId); // feedId 로그

    try {
        const response = await axios.delete(`feed/apply-cancel?userId=${userId}&feedId=${feedId}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log('응답:', response.data);
        console.log('응답 상태 코드:', response.status); // 응답 상태 코드 로그
        
        // 200 상태 코드도 성공으로 처리
        if (response.status === 200 || response.status === 204) { // 200 또는 204 처리
            // 취소한 프로젝트의 정보를 출력
            console.log('취소한 프로젝트 정보:', {
                userId,
                feedId
            });

            // 프로젝트 목록에서 해당 프로젝트 제거 (중복 제거)
            setProjects(prevProjects => 
                prevProjects.filter(project => project.feedId !== feedId) // feedId로 필터링
            );

            // currentProjects를 새로 고침
            if (refreshProjects) {
                await refreshProjects(); // 프로젝트 목록을 새로 고침
            }

            alert('신청이 취소되었습니다.'); // 사용자에게 피드백 제공
        } else {
            console.log('신청 취소 실패, 상태 코드:', response.status); // 실패 시 상태 코드 로그
            alert('신청 취소에 실패했습니다.'); // 실패 시 피드백
        }

        setIsConfirmModalOpen(false);
    } catch (error) {
        console.error('오류 세부정보:', error);
        if (error.response) {
            alert(`신청 취소 중 오류가 발생했습니다. (${error.response.data})`);
        } else {
            alert(`신청 취소 중 오류가 발생했습니다. (${error.message})`);
        }
    }
  };

  const isProjectCanceled = (projectId) => {
    const project = currentProjects.find(p => p.feedId === projectId);
    return project ? project.canceled : false; // canceled 상태 확인
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
                  <Button2 
                    onClick={() => {
                      if (user && user.id && project.feedId) {
                        console.log("User ID:", user.id);
                        console.log("Project Feed ID:", project.feedId);
                        if (project.status === "REJECTED") {
                          console.log("반려 버튼 클릭");
                        } else if (project.status === "ACCEPT") {
                          console.log("승인 완료");
                        } else {
                          handleCancelApplication(user.id, project.feedId);
                        }
                      } else {
                        console.error("User or project information is missing");
                      }
                    }}
                    disabled={isProjectCanceled(project.feedId) || project.status === "REJECTED" || project.status === "ACCEPTED"}
                    status={project.status}
                  >
                    {project.status === "REJECTED" ? "반려" : project.status === "ACCEPTED" ? "승인 완료" : "신청 취소"}
                  </Button2>
                  <AdditionalInfo>
                    <span>지원분야&nbsp;| {project.part}</span>
                    <span>모집현황&nbsp;| {project.recruitmentNum}명</span>
                    <span>마감일자&nbsp;| {new Date(project.deadline).toLocaleDateString()}</span>
                    <span>진행기간&nbsp;| {project.period ? `${project.period}개월` : '정보없음'}</span>
                    <span>상태&nbsp; &nbsp; &nbsp;| {project.status === 'completed' ? '완료' : '진행 중'}</span>
                  </AdditionalInfo>
                </ProjectItem>
              ))
            )}
          </>
        ) : selectedList === 'profile' ? ( // selectedList가 'profile'일 때 사용자 정보 표시
          <ProfileContainer>
            <ProfileImageSection>
            <ProfileImage>
                <img src={userProfile.avatarUrl || 'default-avatar.png'} alt="Profile" style={{ width: '100%', borderRadius: '50%' }} />
              </ProfileImage>
              <h3>{user.nickname || '닉네임이 없습니다.'}</h3>
              {/* <FontAwesomeIcon icon={faEdit} /> */}
            </ProfileImageSection>
            <ProfileContent>
              <h2>프로필 설정</h2>
              <ProfileField>
                <ProfileTitle>
                  <Label>Phone</Label> <FontAwesomeIcon icon={faEdit} />
                </ProfileTitle>
                <p>{userProfile.phone || '정보가 없습니다.'}</p>
              </ProfileField>
              <ProfileField>
                <ProfileTitle>
                  <Label>E-mail</Label> <FontAwesomeIcon icon={faEdit} />
                </ProfileTitle>
                <p>{user.email || '정보가 없습니다.'}</p>
              </ProfileField>
              <ProfileField>
                <ProfileTitle>
                  <Label>Password</Label> <FontAwesomeIcon icon={faEdit} />
                </ProfileTitle>
                <p>********</p>
              </ProfileField>
              <ProfileField>
                <ProfileTitle>
                  <Label>자기소개</Label> <FontAwesomeIcon icon={faEdit} />
                </ProfileTitle>
                <p>{userProfile.headLine || '정보가 없습니다.'}</p>
              </ProfileField>
              <ProfileField>
                <ProfileTitle>
                  <Label>기술 스택</Label> <FontAwesomeIcon icon={faEdit} />
                </ProfileTitle>
                <p>{userProfile.tags && userProfile.tags.length > 0 ? userProfile.tags.join(', ') : '정보가 없습니다.'}</p>
              </ProfileField>
              <ProfileField>
                <ProfileTitle>
                  <Label>학교/전공</Label> <FontAwesomeIcon icon={faEdit} />
                </ProfileTitle>
                <p>{userProfile.experiences && userProfile.experiences.length > 0 ? userProfile.experiences : '정보가 없습니다.'}</p>
              </ProfileField>
              <ProfileField>
                <ProfileTitle>
                  <Label>개인 링크</Label> <FontAwesomeIcon icon={faEdit} />
                </ProfileTitle>
                <p>{typeof userProfile.personalUrl === 'string' && userProfile.personalUrl.trim() !== '' ? userProfile.personalUrl : '정보가 없습니다.'}</p>
              </ProfileField>
              <CloseButton onClick={() => setIsProfileVisible(false)}>회원탈퇴</CloseButton>
            </ProfileContent>
          </ProfileContainer>
        ) : (
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
                style={{ 
                  backgroundColor: (!project.postStatus && !project.savedFeed) ? '#808080' : '#3563E9',
                  opacity:  (!project.postStatus && !project.savedFeed)? 0.6 : 1
                }}
              >
                {isProjectCompleted(project.pk) || (!project.postStatus && !project.savedFeed) ? '모집완료' : '모집 현황'}
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
  min-height: 700px;
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
  background-color: ${({ status }) => 
    status === "REJECTED" ? '#C1C1C1' : 
    status === "ACCEPTED" ? '#4ECF42' : 
    '#3563E9'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: ${({ status }) => (status === "REJECTED" || status === "ACCEPTED" || status === "CANCELLED" ? 'not-allowed' : 'pointer')};
  right: 15px;
  top: 20px;
  min-width: 100px;

  &:hover {
    background-color: ${({ status }) => 
      status === "REJECTED" ? '#C1C1C1' : 
      status === "ACCEPTED" ? '#4ECF42' : 
      '#a0dafb'};
  }
`;

const AdditionalInfo = styled.div`  position: absolute;
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

const ProfileContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 20px;
`;

const ProfileImage = styled.div`
  // background-color: gray; // 배경 색상을 회색으로 설정
  border: 1px solid gray;
  // opacity: 0.3;

  border-radius: 50%; // 원형으로 만들기 위해 border-radius를 50%로 설정
  // width: 100px;
  // height: 100px;
  display: flex; // 아이콘을 중앙에 배치하기 위해 flex 사용
  align-items: center; // 수직 중앙 정렬
  // min-width: 200px;
  justify-content: center; // 수평 중앙 정렬
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;

  h3{
    margin-top: 20px;
    font-weight: bold;
    color:black;
  }
`;

const ProfileContent = styled.div`  // background-color: #f9f9f9;
  padding: 20px;
  border-radius: 30px 30px 1px 30px;
  border: 3px solid #A0DAFB;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;

  h2{
    text-align: center;
    color: #1489CE;
    font-weight: bold;
  }
`;

const ProfileField = styled.div`
  margin-bottom: 15px;
  min-height: 50px;
  border-bottom: 1px solid #A0DAFB;
`;

const ProfileTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1489CE;
`;

const Label = styled.label`
  font-weight: bold;
  color: #1489CE;
`;

const CloseButton = styled.button`
  background-color: grey;
  opacity: 0.5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #a0dafb;
  }
`;

export default ProjectListComponent;



