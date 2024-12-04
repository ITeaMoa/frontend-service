import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import { useNavigate } from 'react-router-dom'; 
import LikeButton from '../../components/LikeButton';

//각 섹션의 데이터를 상태로 관리합니다: useState를 사용하여 데이터를 저장하고, 
//useEffect를 통해 컴포넌트가 마운트될 때 데이터를 Fetch

function Section1( ) {
  const [popularProjects, setPopularProjects] = useState([]);
  //    [ 현재 상태값, 상태 업데이트 함수]
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 생성
  // const [project, setProject] = useState(null);

  // // API에서 사용자 좋아요 피드를 가져오는 함수
  // const fetchUserLikedProjects = async (userId) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8080/main/like?userId=${userId}`);
  //     return response.data; // 사용자가 좋아요를 누른 프로젝트 목록 반환
  //   } catch (error) {
  //     console.error('Error fetching liked projects:', error);
  //     return [];
  //   }
  // };

  // // API에서 인기 프로젝트 데이터를 가져오는 함수
  // const fetchPopularProjects = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8080/main/liked?feedType=PROJECT'); // API 호출
  //     const userId = 1; // 예시로 사용자 ID를 1로 설정
  //     const likedProjects = await fetchUserLikedProjects(userId);

  //     // API 응답에서 받은 데이터 처리
  //     const projectsWithLikes = response.data.map(project => {
  //       const isLiked = likedProjects.some(likedProject => likedProject.id === project.id); // 좋아요 여부 확인
  //       return {
  //         ...project,
  //         liked: isLiked, // 사용자가 좋아요를 눌렀다면 true
  //         likesCount: project.likesCount || 0 // likesCount가 없으면 0으로 초기화
  //       };
  //     });
  //     setPopularProjects(projectsWithLikes);
  //   } catch (error) {
  //     console.error('Error fetching popular projects:', error);
  //   }
  // };

    const fetchPopularProjects = async () => {
    try {
      const response = await axios.get('/data.json');
      // 각 프로젝트에 liked 속성과 초기 likesCount 추가
      const projectsWithLikes = response.data.map(project => ({
        ...project,
        liked: false, // 초기 상태는 좋아요가 눌리지 않은 상태
        likesCount: project.likesCount || 0 // likesCount가 없으면 0으로 초기화
      }));
      setPopularProjects(projectsWithLikes);
    } catch (error) {
      console.error('Error fetching popular projects:', error);
    }
  };

  useEffect(() => {
    fetchPopularProjects();
  }, []);

  // 클릭된 프로젝트의 ID를 사용하여 상세 페이지로 이동
  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`); // 수정된 pk로 상세 페이지로 이동
  };
  
  const handleLikeClick = (index, newLiked, newLikesCount) => {
    setPopularProjects((prevProjects) => {
      const newProjects = [...prevProjects];
      const project = newProjects[index];
      project.liked = newLiked;
      project.likesCount = newLikesCount;
      return newProjects; // 업데이트된 배열 반환
    });
};


  return (
    <SectionWrapper>
      <SectionTitle>인기 프로젝트</SectionTitle>
      <ProjectList>
        {popularProjects.slice(0, 3).map((project, index) => (
          <ProjectCard key={index} onClick={() => handleProjectClick(project)}>
            <ProjectOwner> <FontAwesomeIcon icon={regularUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />{project.creatorID}</ProjectOwner>
            <LikeButtonWrapper>
              <LikeButton 
                  initialLiked={project.liked} 
                  initialLikesCount={project.likesCount} 
                  onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} 
                  buttonStyle="s1"
                />

{/* <LikeButton 
  initialLiked={project.liked} 
  initialLikesCount={project.likesCount} 
  onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} 
  buttonStyle="s1"
  pk={project.pk} // 프로젝트의 pk
  sk={project.sk} // 프로젝트의 sk
/> */}
            </LikeButtonWrapper>
            <ProjectTitle>{project.title}</ProjectTitle>
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
          </ProjectCard>
        ))}
      </ProjectList>
    </SectionWrapper>
  );
}


const SectionWrapper = styled.div`
  width: calc(100% / 2 + 100px);
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: rgba(160, 218, 251, 0.5);

`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const ProjectList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const ProjectCard = styled.div`
  position: relative;
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  padding: 15px;
  margin-bottom: 20px;
  width: calc(100% / 4);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  cursor: pointer;

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
  position: absolute;
  color: #858585;
`;



const ProjectTitle = styled.div`
  font-size: 20px;
  margin: 20px 0;
  margin-top:40px;
  font-weight: bold;
  min-height: 40px;
  text-align: left;
`;

const ProjectInfo = styled.div`
  font-size: 14px;
  color: #777;
`;

const Tags = styled.div`
  display: flex;
  margin-bottom: 5px;
  align-items: space-between;
`;

const Tag = styled.div`
  margin-bottom: 5px;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 14px 14px 1px 14px; //반시계 ㅔ방향
  padding: 5px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-color: rgba(160, 218, 251);
  color: #0A8ED9;


  @media (max-width: 1800px) {
    font-size: 12px; 
    padding: 4px 8px;
  }

  @media (max-width: 480px) {
    font-size: 8px; 
    padding: 3px 6px; 
  }


`;

const Details = styled.div`
    display: flex;
    justify-content: space-between;

`;



const LikeButtonWrapper = styled.div`
  position: absolute;
  top: 13px;
  right: 25px;

  @media (max-width: 1200px) {
   
    transform: scale(0.9); // Adjust the scale as needed
  }

  @media (max-width: 768px) {
    
    transform: scale(0.8); // Adjust the scale as needed
  }

  @media (max-width: 480px) {
   
    transform: scale(0.7); // Adjust the scale as needed
  }
`;

export default Section1;