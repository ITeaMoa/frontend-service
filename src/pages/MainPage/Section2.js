import React, { useEffect, useState, useCallback } from 'react';
// import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
//import axios from 'axios';
import LikeButton from '../../components/LikeButton';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios';


const Section2 = ({ feedType }) => {
  const location = useLocation(); // 현재 위치 가져오기
  const query = new URLSearchParams(location.search); // 쿼리 파라미터 파싱
  const initialPage = parseInt(query.get('page')) || 1; // 쿼리에서 페이지 가져오기, 없으면 1로 설정

  const [currentPage, setCurrentPage] = useState(initialPage); // 초기 페이지 설정
  const [allProjects, setAllProjects] = useState([]);
  const [projectsPerPage] = useState(6); 
  const navigate = useNavigate();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // 모달 상태 추가
  const [selectedRole, setSelectedRole] = useState(null); // 선택된 역할 상태 추가
  const [project, setProject] = useState(null); // 선택된 프로젝트 상태 추가
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const [likedProjects, setLikedProjects] = useState([]);




// //실제 연결
//   const fetchAllProjects = async () => {
//     try {
//       const response = await axios.get('/main?feedType=PROJECT'); // API 호출

//       // 응답 데이터가 없거나 빈 배열일 경우 처리
//     if (!response.data || response.data.length === 0) {
//       console.warn('프로젝트 데이터가 없습니다.');
//       setAllProjects([]); // 빈 배열로 초기화
//       return;
//     }

//       const projectsWithLikes = response.data.map((project, index) => ({
//         id: index, // 프로젝트 ID 추가 (또는 실제 ID 사용)
//         ...project,
//         liked: false, // 초기 상태는 좋아요가 눌리지 않은 상태
//         likesCount: project.likesCount || 0 // likesCount가 없으면 0으로 초기화
//       }));

//       setAllProjects(projectsWithLikes);
//     } catch (error) {
//       console.error('프로젝트 가져오기 실패:', error);
//     }
//   };


  // const fetchAllProjects = async () => {
  //   const response = await axios.get('/data.json');
    
  //   // 각 프로젝트에 liked 속성과 초기 likesCount 추가
  //   const projectsWithLikes = response.data.map(project => ({
  //     ...project,
  //     liked: false, // 초기 상태는 좋아요가 눌리지 않은 상태
  //     likesCount: project.likesCount || 0 // likesCount가 없으면 0으로 초기화
  //   }));

  //   setAllProjects(projectsWithLikes);
  // };

  // 사용자 좋아요 상태 가져오기
const fetchUserLikes = useCallback(async () => {
  if (!user) return; // 사용자 정보가 없으면 종료
  try {
    const response = await axios.get(`/main/like?userId=${user.id}`);
    if (response.data) {
      console.log('사용자가 좋아요를 눌렀던 프로젝트:', response.data);
      
      // likedProjects 상태 업데이트
      setLikedProjects(prevLiked => [
        ...prevLiked,
        { id: user.id, liked: response.data.liked || false, likesCount: response.data.likesCount || 0 }
      ]);

      // allProjects 상태 업데이트
      setAllProjects(prevProjects => 
        prevProjects.map(project => ({
          ...project,
          liked: response.data.some(like => like.projectId === project.pk) || false, // 사용자가 좋아요를 눌렀는지 확인
          likesCount: project.likesCount // likesCount 유지
        }))
      );
    }
  } catch (error) {
    console.error('Error fetching user likes:', error);
  }
}, [user]);

// useEffect를 사용하여 컴포넌트가 마운트될 때 사용자 좋아요 상태를 가져옵니다.
useEffect(() => {
  fetchUserLikes();
}, [fetchUserLikes]);

  const fetchAllProjects = useCallback(async () => {
    try {
      const response = await axios.get(`/main?feedType=${feedType}`); // feedType을 쿼리 파라미터로 사용
  
      if (!response.data || response.data.length === 0) {
        console.warn('프로젝트 데이터가 없습니다.');
        setAllProjects([]); 
        return;
      }
  
      const projectsWithLikes = response.data.map((project) => {
        const isLiked = likedProjects.find(likedProject => likedProject.id === project.id);
        return {
          ...project,
          creatorId: project.creatorId,
          liked: isLiked ? isLiked.liked : false,
          likesCount: project.likesCount || 0,
        };
      });
  
      setAllProjects(projectsWithLikes);
      console.log(projectsWithLikes); // 프로젝트 목록을 콘솔에 출력

      return projectsWithLikes; // Return the projectsWithLikes for use in handleApplyClick
    } catch (error) {
      console.error('인기 프로젝트 가져오기 실패:', error);
    }
  }, [feedType, likedProjects]); // user를 의존성 배열에서 제거

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // const handleProjectClick = (project) => {
  //   navigate(`/ApplyPage/${project.pk}`);
  // };

  // const handleProjectClick = (project) => {
  //   navigate(`/ApplyPage/${project.pk}`, { state: { liked: project.liked } }); // 상태 전달
  // };

  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`, { 
      state: { 
        sk: project.sk // sk 값을 상태로 전달
      } 
    });
  };
  


  // const handleLikeClick = (index, newLiked, newLikesCount) => {
  //   setAllProjects((prevProjects) => {
  //     const newProjects = [...prevProjects];
  //     const project = newProjects[index];
  //     project.liked = newLiked;
  //     project.likesCount = Math.max(newLikesCount, 0);
  //     return newProjects;
  //   });
  // };

  const handleLikeClick = (index, newLiked) => {
    setAllProjects(prevProjects => {
      const newProjects = [...prevProjects];
      const project = newProjects[index];
      const newLikesCount = newLiked ? project.likesCount + 1 : Math.max(project.likesCount - 1, 0);
      project.liked = newLiked;
      project.likesCount = newLikesCount;

      // // 배열을 timestamp를 기준으로 정렬
      // return newProjects.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return newProjects; // 원래 자리 유지
    });
  };

// 페이지네이션 관련
const indexOfLastProject = currentPage * projectsPerPage;
const indexOfFirstProject = indexOfLastProject - projectsPerPage;
const currentProjects = allProjects.slice(indexOfFirstProject, indexOfLastProject); // allProjects에서 가져오기

const paginate = (pageNumber) => {
  setCurrentPage(pageNumber);
  navigate(`?page=${pageNumber}`); // 페이지 변경 시 쿼리 파라미터 업데이트
};

// const handleApplyClick = (selectedProject) => {
//   setProject(selectedProject); // 선택된 프로젝트 저장
//   setIsRoleModalOpen(true); // 역할 선택 모달 열기
// };

const handleApplyClick = async (project) => {
  if (!user) { // Check if user is logged in
    setPopupMessage("로그인 후에 신청할 수 있습니다."); // Set popup message for login
    setIsSubmitted(true); // Show submission confirmation popup
    return; // Exit the function if not logged in
  }

  // 자신이 작성한 게시글인지 확인
  if (project && project.creatorId === user.id) {
    alert("자신이 작성한 게시글에는 신청할 수 없습니다."); // 자신이 작성한 경우 알림
    return; // Exit the function if the user is the creator
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

  setProject(project); // 선택한 프로젝트 상태 저장
  setIsRoleModalOpen(true); // 역할 선택 모달 열기
};

const handleRoleSelect = (role) => {
  setSelectedRole(role);
};

const handleApplySubmit = async () => {
  if (!selectedRole) {
    alert("역할을 선택하세요.");
    return;
  }

  // 역할 선택 모달 닫기
  setIsRoleModalOpen(false);

  try {
    // 선택한 역할을 서버에 전송
    const applicationData = {
      pk: user.id, // 프로젝트의 pk를 사용
      sk: project.pk, 
      part: selectedRole, // 선택한 역할
      feedType: feedType // 고정된 값
    };

    await axios.post('/main/application', applicationData); // API 호출

    alert("신청이 완료되었습니다."); // 신청 완료 알림
    // 제출 확인 팝업 표시
    // setIsSubmitted(true);
  } catch (error) {
    console.error("Submission failed:", error);
    alert("제출에 실패했습니다. 다시 시도하세요."); // 제출 실패 알림
    // 제출 확인 팝업 표시
    // setIsSubmitted(true);
  }
};

// 제출 확인 팝업 닫기 함수
const handleCloseSubmissionPopup = () => {
  setIsSubmitted(false);
  setPopupMessage(''); // 메시지 초기화
};



  return (
    <SectionWrapper>
      <SectionTitle>프로젝트 목록</SectionTitle>
      <ProjectList>
      {currentProjects.map((project, index) => (
          <ProjectCard key={index}  onClick={() => handleProjectClick(project)}>
            <ProjectOwner>
              <FontAwesomeIcon icon={regularUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
              {project.nickname}
            </ProjectOwner>
            <LikeButtonWrapper>
              <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} // 내부 상태 업데이트
                sk={project.pk}
                userId={user ? user.id : null} // user가 null인 경우 처리
                feedType={feedType}
              />
            </LikeButtonWrapper>
            <ProjectTitle>{project.title}</ProjectTitle>
              <Content>
                {project.content.length > 400 ? `${project.content.slice(0, 350)}...` : project.content}
              </Content>
            <ProjectInfo>
              <Tags>
                {project.tags.map((tag, tagIndex) => (
                  <Tag key={tagIndex}>{tag}</Tag>
                ))}
              </Tags>
              <Details>
                모집현황 | {project.recruitmentNum}명
              </Details>
              <Details>
                마감일자 | {new Date(project.deadline).toLocaleDateString()}
              </Details>
            </ProjectInfo>
            <ApplyButton onClick={(e) => {
          e.stopPropagation(); // 이벤트 전파 방지
          handleApplyClick(project);
        }}>
        신청하기</ApplyButton>
          </ProjectCard>
        ))}
      </ProjectList>
  
      <Pagination 
        currentPage={currentPage} 
        projectsPerPage={projectsPerPage} 
        totalProjects={allProjects.length} 
        onPageChange={paginate} 
      
      />
      
     
      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} modalType="apply">
        <RoleButtonContainer>
          <h3>지원할 역할을 선택하세요</h3>
          {project && project.roles ? (
            <RoleButtonContainerStyled>
              {Object.entries(project.roles).map(([role, count], index) => (
                <RoleButton
                  key={index}
                  onClick={() => handleRoleSelect(role)}
                  isSelected={selectedRole === role}
                >
                  {role} ({count})
                </RoleButton>
              ))}
              <RoleButton
                onClick={() => {
                  if (selectedRole !== '무관') {
                    handleRoleSelect('무관');
                  }
                }}
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

      {/* 제출 결과 팝업 */}
      {isSubmitted && (
        <Modal isOpen={isSubmitted} onClose={handleCloseSubmissionPopup}>
          <h3 style={{ textAlign: 'center' }}>{popupMessage}</h3>
          <ButtonContainer>
            <ActionButton onClick={() => navigate('/SignupPage')}>회원가입하기</ActionButton>
            <ActionButton onClick={() => navigate('/LoginPage')}>로그인하기</ActionButton>
          </ButtonContainer>
        </Modal>
      )}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // width: calc(100% / 2 + 100px);
  // width: 100%;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 50px;
  // flex-wrap: no-wrap;

  @media (max-width: 1200px) {
    margin-top: 40px;
    margin-bottom: 30px;
    margin-left: 180px;
  }

  @media (max-width: 1100px) {
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 150px;
  }

   @media (max-width: 1000px) {
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 100px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 20px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
    
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 20px;


   @media (max-width: 1200px) {
    margin-left: 200px;
  }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: 100%;
    // margin-left: 200px;
  }

`;

const ProjectList = styled.div`
  // display: flex;
  // // flex-direction: column;
  // flex-wrap: no-wrap;
  // max-height: 1200px;
  // min-width: 100%;
  // align-items: center;
  // max-width: 100%;

  //  display: flex; // Flexbox를 사용하여 수평으로 나열
  // flex-wrap: wrap; // 줄 바꿈을 허용
  // max-height: 800px;
  // min-width: 100%;
  // margin: 0; // 기본 마진 제거


  display: flex;
  flex-direction: row; // 가로 방향으로 정렬
  flex-wrap: wrap; // 줄 바꿈을 허용
  max-height: 1200px; // 최대 높이를 설정하여 세로로 늘어나는 것을 방지
  // overflow-y: auto; // 내용이 넘칠 경우 스크롤이 생기도록 설정
  min-width: 100%;
  align-items: flex-start; // 상단 정렬
  max-width: 100%; // 최대 너비를 100%로 유지
  gap: 30px;
  // margin-left: 200px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: 50%;
    margin: 10px 0;
    
  }
`;

const ProjectCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  // margin-right: 30px;
  width: calc(100%/2 - 50px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-height: 200px;
  max-height: 800px;
  min-width: 450px; 
  // min-width: calc(100%/2 - 50px);

  
 
 @media (max-width: 1400px) {
    
    max-height: 400px;
     min-width: 300px;
  }



  @media (max-width: 1200px) {
    
    max-height: 400px;
    //  min-width: 350px;
  }

  @media (max-width: 768px) {
   
    margin: 15px 5px;
    max-height: 400px; 
   
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    // width: calc(50% - 20px);
    min-width: 250px;
    margin: 10px 0;
    max-height: 300px;
  }

  &:hover {
    background-color: #A0DAFB;
  }

  @media (max-width: 1200px) {
    width: calc(33.33% - 20px); /* 3열로 조정 */
    
  }

  // @media (max-width: 768px) {
  //   width: calc(50% - 20px); /* 2열로 조정 */
  // }

  // @media (max-width: 480px) {
  //   width: 100%; /* 1열로 조정 */
  // }

`;

const LikeButtonWrapper = styled.div`
  position: absolute;
  top: 36px;
  right: 30px;

  @media (max-width: 1200px) {
  
    transform: scale(0.9);

  @media (max-width: 768px) {
  
    transform: scale(0.8); 
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    transform: scale(0.7);
  }
`;

const ProjectOwner = styled.div`
  font-weight: bold;
  text-align: left;
  color: #858585;
  margin-left: 10px;
`;



const ProjectTitle = styled.h3`
  font-size: 20px;
  margin-top:20px;
  margin-bottom: 30px;
`;

const Content = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
  min-height: 50px;
  max-height: 200px;
  overflow: hidden;
  color: #858585;
  text-align: left;

`;

const ProjectInfo = styled.div`
  font-size: 14px;
  color: #777;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap; // 줄 바꿈을 허용
  padding-top: 10px;
  margin-bottom: 5px;
  align-items: flex-start; // 상단 정렬
  white-space: nowrap;
`;

const Tag = styled.div`
  margin-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 14px 14px 1px 14px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-color: rgba(160, 218, 251);
  color: #0A8ED9;
`;

const Details = styled.div`
  text-align: left;
  margin-bottom: 5px;
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


const CloseButton = styled(SubmitButton)`
  margin-top: 20px; 
  margin-left: 120px;
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












export default Section2;


