import React, { useState } from 'react';
import styled from 'styled-components';
import ProjectCard from '../../components/ProjectCard';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAtom } from 'jotai';
import { feedTypeAtom, likedProjectsAtom, selectedProjectDetailAtom } from '../../Atoms.jsx/AtomStates';
import RoleSelectionModal from '../../components/RoleSelectionModal';
import Section2 from '../MainPage/section2';
// import { SelectedProjectDetail } from '../../Atoms.jsx/AtomStates';


const SearchFeed = ({ itemList, setSearchResults }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [project, setProject] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { user } = useAuth();
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [likedProjects, setLikedProjects] = useAtom(likedProjectsAtom);
  const [selectedProjectDetail, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);

  // 페이지네이션 관련
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = itemList.slice(indexOfFirstProject, indexOfLastProject);

  // 이벤트 핸들러들...
  // const handleProjectClick = (project) => {
  //   navigate(`/ApplyPage/${project.pk}`, { 
  //     state: { sk: project.sk }
  //   });
  // };
  
  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`);
    console.log(project);
    setSelectedProjectDetail(project);
  };


  //없어도 되는지 테스트 해보기
  const handleLikeClick = (index, newLiked) => {
    setSearchResults(prevProjects => {
      const newProjects = [...prevProjects];
      const project = newProjects[index];
      project.liked = newLiked;
      project.likesCount = newLiked ? project.likesCount + 1 : Math.max(project.likesCount - 1, 0);
      return newProjects;
    });
  };
  const handleApplyClick = async (project) => {
    if (!user) { // Check if user is logged in
      alert("로그인 후에 신청할 수 있습니다."); // Alert for login
      return; // Exit the function if not logged in
    }
  
    // const projectsWithLikes = await fetchAllProjects(); // Get projectsWithLikes from fetchAllProjects
  
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
        setPopupMessage("이미 신청한 프로젝트입니다."); // 이미 신청한 경우 메시지 설정
        setIsSubmitted(true); // 제출 확인 팝업 표시
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
  
      setPopupMessage("신청이 완료되었습니다.");
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
      {/* <ProjectList> */}
        {/* {itemList.length === 1 ? (
          <CenteredProjectCard>
            <ProjectCard
              project={itemList[0]}
              onClick={() => handleProjectClick(itemList[0])}
            //   onLikeClick={(newLiked) => handleLikeClick(0, newLiked)}
              onApplyClick={() => handleApplyClick(itemList[0])}
              isLoggedIn={!!user}
              userId={user?.id}
              feedType={itemList[0].sk}
            />
          </CenteredProjectCard>
        ) : (
          currentProjects.map((project, index) => (
            <ProjectCard
              key={`${project.id}-${index}`}
              project={project}
              onClick={() => handleProjectClick(project)}
            //   onLikeClick={(newLiked) => handleLikeClick(index, newLiked)}
              onApplyClick={() => handleApplyClick(project)}
              isLoggedIn={!!user}
              userId={user?.id}
              feedType={project.sk}
            />
          ))
        )} */}

<Section2 
            projects={itemList}
            onProjectClick={handleProjectClick}
            // onLikeClick={handleLikeClick}
            onApplyClick={handleApplyClick}
            isLoggedIn={!!user}
            userId={user?.id}
            feedType={feedType}
          />
      {/* </ProjectList> */}

      {/* <Pagination 
        currentPage={currentPage}
        projectsPerPage={projectsPerPage}
        totalProjects={itemList.length}
        onPageChange={setCurrentPage}
      /> */}

      {/* 모달 컴포넌트들... */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        project={project}
        selectedRole={selectedRole}
        handleRoleSelect={handleRoleSelect}
        handleApplySubmit={handleApplySubmit}
      />

      {/* 제출 결과 모달 */}
      {isSubmitted && (
        <Modal isOpen={isSubmitted} onClose={handleCloseSubmissionPopup}>
          <h3>{popupMessage}</h3>
          <CloseButton onClick={handleCloseSubmissionPopup}>Close</CloseButton>
        </Modal>
      )}
    </SectionWrapper>
  );
};

// 스타일 컴포넌트들...

export default SearchFeed;



const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 70px;
  margin-bottom: 40px;
  margin-top: 250px;
`;



const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  width: 50%;
  max-height: 150vh;
  max-width: 1200px;
  align-items: center;

  @media (max-width: 1200px) {
    width: 80%;
  }

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CenteredProjectCard = styled.div`
  display: flex;
  justify-content: center; 
  width: 100%;
`;

// const ProjectCard = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   border: 2px solid #A0DAFB;
//   border-radius: 30px 30px 1px 30px;
//   padding: 15px;
//   margin-top: 10px;
//   margin-bottom: 10px;
//   margin-right: 30px;
//   width: calc(100%/2 - 50px);
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   background-color: white;
//   min-height: 200px;
//   max-height: 800px;



//   @media (max-width: 1200px) {
    
//     max-height: 500px;
//   }

//   @media (max-width: 768px) {
   
//     margin: 15px 5px;
//     max-height: 400px; 
//   }

//   @media (max-width: 480px) {

//     margin: 10px 0; 
//     max-height: 300px; 
//   }


//   &:hover {
//     background-color: #A0DAFB;
//   }

//   @media (max-width: 1200px) {
//     width: calc(33.33% - 20px); /* 3열로 조정 */
//   }

//   @media (max-width: 768px) {
//     width: calc(50% - 20px); /* 2열로 조정 */
//   }

//   @media (max-width: 480px) {
//     width: 100%; /* 1열로 조정 */
//   }

// `;



const ProjectOwner = styled.div`
  font-weight: bold;
  text-align: left;
  color: #858585;
  margin-left: 10px;
`;


const ProjectTitle = styled.h3`
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const Content = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
  min-height: 50px;
  max-height: 100px;
  overflow: hidden;
  color: #858585;
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


