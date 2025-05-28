import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import LikeButton from '../../components/LikeButton';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
// import { useAuth } from '../../context/AuthContext'; // AuthContext 경로를 맞춰주세요
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'


//searchpage에서 itemslist 가져오기
const SearchFeed = ({ itemList, setSearchResults }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); 
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // 모달 상태 추가
  const [selectedRole, setSelectedRole] = useState(null); // 선택된 역할 상태 추가
  const [project, setProject] = useState(null); // 선택된 프로젝트 상태 추가
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기



 
  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`, { 
      state: { 
        sk: project.sk // sk 값을 상태로 전달
      } 
    });
  };


  const handleLikeClick = (index, newLiked) => {
    setSearchResults(prevProjects => {
      const newProjects = [...prevProjects];
      const project = newProjects[index];
      const newLikesCount = newLiked ? project.likesCount + 1 : Math.max(project.likesCount - 1, 0);
      project.liked = newLiked;
      project.likesCount = newLikesCount;
      return newProjects;
    });
  };


  // 페이지네이션 관련
const indexOfLastProject = currentPage * projectsPerPage;
const indexOfFirstProject = indexOfLastProject - projectsPerPage;
const currentProjects = itemList.slice(indexOfFirstProject, indexOfLastProject); // itemList에서 가져오기
const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
      feedType: "PROJECT" // 고정된 값
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
      <ProjectList>
        {itemList.length === 1 ? ( // 검색 결과가 하나일 때
          <CenteredProjectCard>
            <ProjectCard onClick={() => handleProjectClick(itemList[0])}>
              <ProjectOwner>
                <FontAwesomeIcon icon={regularUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
                {itemList[0].nickname || 'Unknown'}
              </ProjectOwner>

            <LikeButtonWrapper>
            <LikeButton 
                initialLiked={itemList[0].liked} // itemList[0]의 liked 속성 사용
                initialLikesCount={itemList[0].likesCount} // itemList[0]의 likesCount 사용
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(0, newLiked, newLikesCount)} // index 0 사용
                // onLikeChange={handleLikeClick}
                userId={user ? user.id : null} // user가 null인 경우 처리
                feedType={itemList[0].sk} // Use project.sk as feedType
                sk={itemList[0].pk}
              />

{/* <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                onLikeChange={handleLikeClick}
                buttonStyle="apply"
                sk={project.pk}
                userId={user ? user.id : null} // user가 null인 경우 처리
                feedType={project.sk} // Use project.sk as feedType
              /> */}
        
            </LikeButtonWrapper>

              <ProjectTitle>{itemList[0].title}</ProjectTitle>
              <Content>{itemList[0].content}</Content>
              <ProjectInfo>
                <Tags>
                  {itemList[0].tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                </Tags>
                <Details>
                  모집인원 | {itemList[0].recruitmentNum}명
                </Details>
                <Details>
                  마감일자 | {new Date(itemList[0].deadline).toLocaleDateString()}
                </Details>
              </ProjectInfo>
              <ApplyButton onClick={(e) => {
          e.stopPropagation(); // 이벤트 전파 방지
          handleApplyClick(itemList[0]);
        }}>
        신청하기</ApplyButton>
            </ProjectCard>
          </CenteredProjectCard>
        ) :( 
          currentProjects.map((project, index) => ( // 검색 결과가 여러 개일 때
            <ProjectCard key={index} onClick={() => handleProjectClick(project)} >
              <ProjectOwner>
              <FontAwesomeIcon icon={regularUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
              {user ? '나' : project.nickname}
              </ProjectOwner>
           
              <LikeButtonWrapper>
            
              <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} 
                buttonStyle="s1"
                sk={project.pk}
                userId={user ? user.id : null} // user가 null인 경우 처리
                feedType={project.sk} // Use project.sk as feedType
              />
 
              </LikeButtonWrapper>
              <ProjectTitle>{project.title}</ProjectTitle>
              <Content>{project.content}</Content>
              <ProjectInfo>
                <Tags>
                  {project.tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                </Tags>
                <Details>
                  모집인원 | {project.recruitmentNum}명
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
          ))
        )}
      </ProjectList>

      <Pagination 
        currentPage={currentPage} 
        projectsPerPage={projectsPerPage} 
        totalProjects={itemList.length}
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
  width: 100%;
  margin-top: 70px;
  margin-bottom: 40px;
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



  @media (max-width: 1200px) {
    
    max-height: 500px;
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

export default SearchFeed;
