import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import LikeButton from '../../../components/LikeButton';
import Pagination from '../../../components/Pagination';
import ProjectCard from '../../../components/ProjectCard';

const Section2 = ({
  projects,                    // 전체 프로젝트 목록            
  onProjectClick,            // 프로젝트 클릭 핸들러
  onLikeClick,              // 좋아요 클릭 핸들러
  onApplyClick,             // 신청하기 클릭 핸들러
  isLoggedIn,               // 로그인 상태
  userId,                   // 사용자 ID
  feedType                  // 피드 타입
}) => {
  // 현재 페이지에 표시할 프로젝트 계산
  const navigate = useNavigate();

  const location = useLocation(); // 현재 위치 가져오기
  const query = new URLSearchParams(location.search); // 쿼리 파라미터 파싱

  // const initialPage = parseInt(query.get('page')) || 1; // 쿼리에서 페이지 가져오기, 없으면 1로 설정
  // const [currentPage, setCurrentPage] = useState(initialPage);  // 단순히 1페이지부터 시작
  const projectsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  // const [projectsPerPage] = useState(6); 

  //페이지네이션방법 1
  // const indexOfLastProject = currentPage * projectsPerPage;
  // const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  // const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    //페이지네이션방법 2
  const currentProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );




  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <SectionWrapper>
      <SectionTitle>프로젝트 목록</SectionTitle>
     
        <ProjectList>
        {currentProjects.map((project, index) => (
          <ProjectCard 
            key={project.id || index}
            project={project}
            onClick={() => onProjectClick(project)}
            // onLikeClick={onLikeClick}
            onApplyClick={onApplyClick}
            isLoggedIn={isLoggedIn}
            userId={userId}
            feedType={feedType}
          />
        ))} 
      </ProjectList>

      {/* <Pagination 
        currentPage={currentPage}
        projectsPerPage={projectsPerPage}
        totalProjects={projects.length}
        onPageChange={onPageChange}
      /> */}

<Pagination 
        currentPage={currentPage}
        projectsPerPage={projectsPerPage}
        totalProjects={projects.length}
        onPageChange={handlePageChange}
      />
      

           
      
    </SectionWrapper>
  );
};

export default Section2;


const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // width: calc(100% / 2 + 400px);
  // width: 100%;
  width: 70%;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 50px;
  // flex-wrap: no-wrap;

 
  

   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 70px;
    justify-content: center;
    width: 150%;
    padding: 0 20px;
  }
    
  }
`;


const SectionTitle = styled.h2`
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 20px;


  //  @media (max-width: 1200px) {
  //   margin-left: 200px;
  // }

  //   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
  //   min-width: 100%;
  //   // margin-left: 200px;
  // }

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
  gap: 20px;
  // margin-left: 100px;
  margin-left:8px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: 60%;
    margin: 10px 0;
    
  }
`;


 {/* <ProjectList>
        {currentProjects.map((project, index) => (
          <ProjectCard 
            key={index} 
            onClick={() => onProjectClick(project)}
          >
            <ProjectOwner>
              <FontAwesomeIcon 
                icon={regularUser} 
                style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} 
              />
              {project.nickname}
            </ProjectOwner>
            <LikeButtonWrapper>
              <LikeButton 
                initialLiked={project.liked}
                initialLikesCount={project.likesCount}
                onLikeChange={(newLiked) => onLikeClick(project.id, newLiked)}
                sk={project.pk}
                userId={userId}
                feedType={feedType}
              />
            </LikeButtonWrapper>
            <ProjectTitle>{project.title}</ProjectTitle>
            <Content>
              {project.content.length > 400 
                ? `${project.content.slice(0, 350)}...` 
                : project.content}
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
            <ApplyButton 
              onClick={(e) => {
                e.stopPropagation();
                if (!isLoggedIn) {
                  alert("로그인 후에 신청할 수 있습니다.");
                  return;
                }
                if (project.creatorId === userId) {
                  alert("자신이 작성한 게시글에는 신청할 수 없습니다.");
                  return;
                }
                onApplyClick(project);
              }}
            >
              신청하기
            </ApplyButton>
          </ProjectCard>
        ))}
      </ProjectList> */}