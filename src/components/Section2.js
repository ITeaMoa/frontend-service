import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import axios from 'axios';
import LikeButton from './LikeButton';
import Pagination from './Pagination';

const Section2 = ({  }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); 
  const navigate = useNavigate();

  // const fetchAllProjects = async () => {
  //   const response = await axios.get('/data.json');
  //   setAllProjects(response.data);
  // };
  
  const fetchAllProjects = async () => {
    const response = await axios.get('/data.json');
    
    // 각 프로젝트에 liked 속성과 초기 likesCount 추가
    const projectsWithLikes = response.data.map(project => ({
      ...project,
      liked: false, // 초기 상태는 좋아요가 눌리지 않은 상태
      likesCount: project.likesCount || 0 // likesCount가 없으면 0으로 초기화
    }));

    setAllProjects(projectsWithLikes);
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const handleProjectClick = (project) => {
    const modifiedPk = project.pk.replace('#', '');
    navigate(`/ApplyPage/${modifiedPk}`);
  };

  const handleLikeClick = (index, newLiked, newLikesCount) => {
    setAllProjects((prevProjects) => {
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
const currentProjects = allProjects.slice(indexOfFirstProject, indexOfLastProject); // allProjects에서 가져오기

const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <SectionWrapper>
      <SectionTitle>프로젝트 목록</SectionTitle>
      <ProjectList>
      {currentProjects.map((project, index) => (
          <ProjectCard key={index}>
            <ProjectOwner>
              <FontAwesomeIcon icon={regularUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
              {project.creatorID}
            </ProjectOwner>
            <LikeButton 
              initialLiked={project.liked} 
              initialLikesCount={project.likesCount} 
              onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} // 내부 상태 업데이트
            />
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
                모집인원 | {project.recruitmentNum}명
              </Details>
              <Details>
                마감일 | {new Date(project.deadline).toLocaleDateString()}
              </Details>
            </ProjectInfo>
            <ApplyButton onClick={() => handleProjectClick(project)}>신청하기</ApplyButton>
          </ProjectCard>
        ))}
      </ProjectList>
  
      <Pagination 
        currentPage={currentPage} 
        projectsPerPage={projectsPerPage} 
        totalProjects={allProjects.length} 
        onPageChange={paginate} 
      
      />
      
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  width: calc(100vw / 2 + 100px);
  margin-top: 50px;
  margin-bottom: 40px;
  align-items:center; //수평정렬


  @media (max-width: 1200px  {
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
  // justify-content: center;
  max-height: 150vh;
  // max-width: 1200px;

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

const ProjectCard = styled.div`
  position: relative;
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  padding: 15px;
  margin-top:20px;
  margin-bottom:20px;
  margin-right: 30px;
  // width: 430px;
  width: calc(100%/2 - 50px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-height: 200px;
  max-height: 800px;



  @media (max-width: 1200px) {
    width: 350px; 
    max-height: 500px;
  }

  @media (max-width: 768px) {
    width: 300px; 
    margin: 15px 5px;
    max-height: 400px; 
  }

  @media (max-width: 480px) {
    width: 100%;
    margin: 10px 0; 
    max-height: 300px; 
  }


`;

const ProjectOwner = styled.div`
  font-weight: bold;
  text-align: left;
  color: #858585;
  margin-left: 10px;
`;

// const ProjectLikes = styled.div`
//   position: absolute;
//   border: 1px solid #ddd;
//   border-radius: 15px;
//   padding: 2px 2px;
//   color: white;
//   font-weight: bold;
//   background-color: #C4C4C4;
//   right: 10%;
//   top:4%;
//   // transform: translate(300px,-25px);
//   width: 50px;
// `;

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
  margin-top: 5px;
  margin-left: 5px;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 8px;
  width: calc(100% / 4);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #62B9EC;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transform: translateX(130px);
  border-radius: 14px 14px 1px 14px; 

  &:hover {
    background-color: #A0DAFB;
  }
`;

// const Pagination = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// `;

// const PageNumber = styled.button`
//   color: ${({ active }) => (active ? '#6AB2E1' : 'black')};
//   margin-top: 40px;
//   margin-left: 5px;
//   cursor: pointer;
//   border: none;
//   background: none;
//   font-weight: bold;
//   font-size: 16px;
// `;

export default Section2;

