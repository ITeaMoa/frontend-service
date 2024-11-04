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
            <LikeButtonWrapper>
              <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} // 내부 상태 업데이트
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
                모집인원 | {project.recruitmentNum}명
              </Details>
              <Details>
                마감일자 | {new Date(project.deadline).toLocaleDateString()}
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
  align-items: center; //가운데ㅐ 정렬
  width: calc(100% / 2 + 100px);
  justify-content: center;
  max-width: 1200px;
  // width: 100%; 
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 40px;


 
  // max-width: 1200px; // Set a maximum width for the section
  // width: 100%; // Allow the section to take full width up to the max-width
  // margin: 0 auto; // Center the section horizontally
  // margin-top: 50px;
  // margin-bottom: 40px;

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
  max-height: 150vh;
  
  @media (max-width: 1600px) {

    max-height: 200vh;
  
  }

  @media (max-width: 1200px) {
    max-height: 200vh;
  
  }

  @media (max-width: 768px) {
    max-height: 200vh;
  }

  @media (max-width: 480px) {
    max-height: 200vh;
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


`;

const LikeButtonWrapper = styled.div`
  position: absolute;
  top: 35px;
  right: 30px;
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
  align-self: flex-end; // Aligns the button to the right
  margin-top: auto; // Pushes the button to the bottom
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 14px 14px 1px 14px; 
  padding: 8px;
  width: calc(100% / 4);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #62B9EC;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #A0DAFB;
  }
`;



export default Section2;

