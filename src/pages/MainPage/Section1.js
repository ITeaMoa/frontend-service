import React, { useEffect, useState, useCallback } from 'react';
// import React, { useEffect, useState} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import axios from 'axios';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import { useNavigate } from 'react-router-dom'; 
import LikeButton from '../../components/LikeButton';
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
//각 섹션의 데이터를 상태로 관리합니다: useState를 사용하여 데이터를 저장하고, 
//useEffect를 통해 컴포넌트가 마운트될 때 데이터를 Fetch

function Section1({ feedType }) {
  const [popularProjects, setPopularProjects] = useState([]);
  //    [ 현재 상태값, 상태 업데이트 함수]
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 생성
  // const [project, setProject] = useState(null);
  const [likedProjects, setLikedProjects] = useState([]);
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  


  // 사용자 좋아요 상태 가져오기
  const fetchUserLikes = useCallback(async () => {
    if (!user) return; // 사용자 정보가 없으면 종료
    try {
      const response = await axios.get(`/main/like?userId=${user.id}`);
      if (response.data) {
        console.log('사용자가 좋아요를 눌렀던 피드:', response.data);
        setLikedProjects(prevLiked => [
          ...prevLiked,
          { id: user.id, liked: response.data.liked || false, likesCount: response.data.likesCount || 0 }
        ]);
        setPopularProjects(prevProjects => 
          prevProjects.map(project => ({
            ...project,
            liked: project.id === user.id ? response.data.liked : false,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  }, [user]);

  const fetchPopularProjects = useCallback(async () => {
    try {
      const response = await axios.get(`/main/liked?feedType=${feedType}`);

      if (!response.data || response.data.length === 0) {
        console.warn('프로젝트 데이터가 없습니다.');
        setPopularProjects([]);
        return;
      }

      console.log('응답 데이터:', response.data);

      const projectsWithLikes = response.data.map((project) => {
        const isLiked = likedProjects.find(likedProject => likedProject.id === project.id);
        return {
          ...project,
          creatorId: project.creatorId,
          liked: isLiked ? isLiked.liked : false,
          likesCount: project.likesCount || 0,
        };
      });
      setPopularProjects(projectsWithLikes);
    } catch (error) {
      console.error('Error fetching popular projects:', error);
    }
  }, [feedType, likedProjects]);


  useEffect(() => {
    fetchPopularProjects();
  }, [fetchPopularProjects, feedType]);

  useEffect(() => {
    fetchUserLikes();
  }, [fetchUserLikes]);

  // 클릭된 프로젝트의 ID를 사용하여 상세 페이지로 이동
// 클릭된 프로젝트의 ID를 사용하여 상세 페이지로 이동
const handleProjectClick = (project, feedType) => {
  navigate(`/ApplyPage/${project.pk}`, { 
    state: { 
      liked: project.liked, 
      likesCount: project.likesCount, // likesCount도 함께 전달
      feedType // 현재 feedType 전달
    } 
  });
};
  
  // const handleLikeClick = (index, newLiked, newLikesCount) => {
  //   // Ensure likesCount is not negative
  //   const updatedLikesCount = newLiked ? newLikesCount : Math.max(newLikesCount - 1, 0); // Ensure likesCount is not negative
  //   setPopularProjects((prevProjects) => {
  //       const newProjects = [...prevProjects];
  //       const project = newProjects[index];
  //       project.liked = newLiked;
  //       project.likesCount = Math.max(updatedLikesCount, 0); // Ensure likesCount is not negative
  //       return newProjects;
  //   });
  // };

  const handleLikeClick = (projectId, newLiked) => {
    setPopularProjects(prevProjects => 
      prevProjects.map(project => {
        if (project.id === projectId) {
          const newLikesCount = newLiked ? project.likesCount + 1 : Math.max(project.likesCount - 1, 0);
          return { ...project, liked: newLiked, likesCount: newLikesCount };
        }
        return project;
      })
    );

    
  
    // likedProjects 상태 업데이트
    setLikedProjects(prev => {
      const existingLike = prev.find(p => p.id === projectId);
      if (existingLike) {
        return prev.map(p => p.id === projectId ? { ...p, liked: newLiked } : p);
      } else {
        return [...prev, { id: projectId, liked: newLiked, likesCount: newLiked ? 1 : 0 }];
      }
    });
  };

  return (
    <SectionWrapper>
      <SectionTitle>인기 프로젝트</SectionTitle>
      <ProjectList>
        {popularProjects.slice(0, 3).map((project, index) => (
          <ProjectCard key={index} onClick={() => handleProjectClick(project)}>
            <AuthorID>
              <FontAwesomeIcon icon={regularUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
              {project.nickname}
            </AuthorID>
            <LikeButtonWrapper>
              <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                // onLikeChange={(newLiked, newLikesCount) => handleLikeClick(project.id, newLiked)}
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(index, newLiked, newLikesCount)} // 내부 상태 업데이트
                buttonStyle="s1"
                sk={project.pk}
                userId={user ? user.id : null} // user가 null인 경우 처리
                feedType={feedType}
              />
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

   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: relative;
    margin: 300px auto 0;
    bottom: auto;
    left: auto;
    margin-left: 100px;
    justify-content: center;
    width: 150%;
    padding: 0 20px;
  }

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

  //  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
  //   width: calc(33.33% - 15px);
  //   padding: 12px;
  // }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: calc(25% - 10px);
    padding: 10px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smobile}) {
    width: calc(33.33% - 8px);
    padding: 8px;
  }
`;

const AuthorID = styled.div`
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