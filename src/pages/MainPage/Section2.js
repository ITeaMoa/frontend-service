import React, { useEffect, useState, useCallback } from 'react';
// import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import axios from 'axios';
import LikeButton from '../../components/LikeButton';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext'
// import axios from '../../api/axios';


const Section2 = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); 
  const navigate = useNavigate();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // 모달 상태 추가
  const [selectedRole, setSelectedRole] = useState(null); // 선택된 역할 상태 추가
  const [project, setProject] = useState(null); // 선택된 프로젝트 상태 추가
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기




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

  const fetchAllProjects = useCallback(async () => {
    try {
      const response = await axios.get('/main?feedType=PROJECT');

      if (!response.data || response.data.length === 0) {
        console.warn('프로젝트 데이터가 없습니다.');
        setAllProjects([]); 
        return;
      }

      const projectsWithLikes = response.data.map((project, index) => ({
        id: index,
        ...project,
        liked: false,
        likesCount: Math.max(project.likesCount || 0, 0)
      }));

      setAllProjects(projectsWithLikes);
    } catch (error) {
      console.error('인기 프로젝트 가져오기 실패:', error);
    }
  }, []);

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
      // state: { 
      //   liked: project.liked, 
      //   likesCount: project.likesCount // likesCount도 함께 전달
      // } 
    });
  };
  


  const handleLikeClick = (index, newLiked, newLikesCount) => {
    setAllProjects((prevProjects) => {
      const newProjects = [...prevProjects];
      const project = newProjects[index];
      project.liked = newLiked;
      project.likesCount = Math.max(newLikesCount, 0);
      return newProjects;
    });
  };

// 페이지네이션 관련
const indexOfLastProject = currentPage * projectsPerPage;
const indexOfFirstProject = indexOfLastProject - projectsPerPage;
const currentProjects = allProjects.slice(indexOfFirstProject, indexOfLastProject); // allProjects에서 가져오기

const paginate = (pageNumber) => setCurrentPage(pageNumber);

// const handleApplyClick = (selectedProject) => {
//   setProject(selectedProject); // 선택된 프로젝트 저장
//   setIsRoleModalOpen(true); // 역할 선택 모달 열기
// };

const handleApplyClick = (project) => {
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
      pk: project.pk, // 프로젝트의 pk를 사용
      sk: user.id, 
      part: selectedRole, // 선택한 역할
      feedType: "PROJECT" // 고정된 값
    };

    await axios.post('/main/application', applicationData); // API 호출

    setPopupMessage("제출되었습니다.");
    // 제출 확인 팝업 표시
    setIsSubmitted(true);
  } catch (error) {
    console.error("Submission failed:", error);
    setPopupMessage("제출에 실패했습니다. 다시 시도하세요.");
    // 제출 확인 팝업 표시
    setIsSubmitted(true);
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
              {project.creatorId}
            </ProjectOwner>
            <LikeButtonWrapper>
              <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} // 내부 상태 업데이트
                apiEndpoint="/main/like" // MainPage API 엔드포인트
                sk={project.pk}
                userId={user ? user.id : null} // user가 null인 경우 처리
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
          {project && project.role ? (
            project.role.map((role, index) => (
              <RoleButton
                key={index}
                onClick={() => handleRoleSelect(role)}
                isSelected={selectedRole === role}
              >
                {role.name}
              </RoleButton>
            ))
          ) : (
            <p>역할 정보를 불러오는 중입니다...</p>
          )}
        </RoleButtonContainer>
        <SubmitButton onClick={handleApplySubmit}>제출</SubmitButton>
      </Modal>

      {/* 제출 결과 팝업 */}
      {isSubmitted && (
        <Modal isOpen={isSubmitted} onClose={handleCloseSubmissionPopup}>
          <h3>{popupMessage}</h3>
          <CloseButton onClick={handleCloseSubmissionPopup}>Close</CloseButton>
        </Modal>
      )}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% / 2 + 100px);
  justify-content: center;
  max-width: 1200px;
  // width: 100%; 
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 40px;


  @media (max-width: 1200px) {
    margin-top: 40px;
    margin-bottom: 30px;
  }

  @media (max-width: 768px) {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
    margin-bottom: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 1200px;
  min-width: 100%;
  align-items: center;
  
  @media (max-width: 1600px) {

    // max-height: 180vh;
  
  }

  @media (max-width: 1200px) {
    // max-height: 160vh;
  
  }

  @media (max-width: 768px) {
    // max-height: 140vh;
  }

  @media (max-width: 480px) {
    // max-height: 120vh;
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
  margin-right: 30px;
  width: calc(100%/2 - 50px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-height: 200px;
  max-height: 800px;
  // min-width: 400px; 
 
 @media (max-width: 1400px) {
    
    max-height: 400px;
     min-width: 350px;
  }



  @media (max-width: 1200px) {
    
    max-height: 400px;
    //  min-width: 350px;
  }

  @media (max-width: 768px) {
   
    margin: 15px 5px;
    max-height: 400px; 
  }

  @media (max-width: 480px) {

    margin: 10px 0; 
    max-height: 300px; 
  }


  &:hover {
    background-color: #A0DAFB;
  }

  @media (max-width: 1200px) {
    width: calc(33.33% - 20px); /* 3열로 조정 */
  }

  @media (max-width: 768px) {
    width: calc(50% - 20px); /* 2열로 조정 */
  }

  @media (max-width: 480px) {
    width: 100%; /* 1열로 조정 */
  }

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

  @media (max-width: 480px) {
  
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
  padding-top: 10px;
  margin-bottom: 5px;
  align-items: space-between;
  
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

  h3{
    font-size: 24px;
    margin-bottom: 40px;
  }
`;

const SubmitButton = styled.button`
  border: none;
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












export default Section2;

