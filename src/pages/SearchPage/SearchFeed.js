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
    if (project) { // project가 null이 아닐 때만 navigate 호출
        navigate(`/ApplyPage/${project.pk}`);
    }
  };

 

  const handleLikeClick = (index, newLiked, newLikesCount) => {
    setSearchResults((prevProjects) => {
      const newProjects = [...prevProjects];
      const project = newProjects[index];
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


const handleApplyClick = (project) => {
  setProject(project); // 선택한 프로젝트 상태 저장
  setIsRoleModalOpen(true); // 역할 선택 모달 열기
};

const handleRoleSelect = (role) => {
  setSelectedRole(role);
};

// 역할 신청 제출
const handleApplySubmit = async () => {
  if (!selectedRole) {
    alert("역할을 선택하세요.");
    return;
  }

  if (!project) {
    alert("프로젝트를 선택하세요.");
    return;
  }

  setIsRoleModalOpen(false);

  // try {
  //   const applicationData = {
  //     pk: project.pk,
  //     sk: user.id, // 실제 사용자 ID로 대체
  //     part: selectedRole,
  //     feedType: "PROJECT"
  //   };

  //   const response = await axios.post('/main/application', applicationData);
  //   setPopupMessage("제출되었습니다.");
  //   setIsSubmitted(true);
  // } catch (error) {
  //   console.error("Submission failed:", error);
  //   setPopupMessage("제출에 실패했습니다. 다시 시도하세요.");
  //   setIsSubmitted(true);
  // }
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
                {itemList[0].creatorId || 'Unknown'}
              </ProjectOwner>

            <LikeButtonWrapper>
            <LikeButton 
                initialLiked={itemList[0].liked} // itemList[0]의 liked 속성 사용
                initialLikesCount={itemList[0].likesCount} // itemList[0]의 likesCount 사용
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(0, newLiked, newLikesCount)} // index 0 사용
                apiEndpoint="/main/like" // MainPage API 엔드포인트
                pk={itemList[0].pk} 
                sk={itemList[0].sk}
              />
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
              {user ? '나' : project.creatorId}
              </ProjectOwner>
           
              <LikeButtonWrapper>
            
              <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} 
                buttonStyle="s1"
                apiEndpoint="/main/like"
                sk={project.pk}
                userId={user ? user.id : null} // user가 null인 경우 처리
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
  width: 100%;
  margin-top: 30px;
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

export default SearchFeed;
