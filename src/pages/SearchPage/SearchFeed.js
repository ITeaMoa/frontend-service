import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import LikeButton from '../../components/LikeButton';

//searchpage에서 itemslist 가져오기
const SearchFeed = ({ itemList, setSearchResults }) => {
  const navigate = useNavigate();

  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`);
  };

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

  const handleLikeClick = (index, newLiked, newLikesCount) => {
    setSearchResults((prevProjects) => {
      const newProjects = [...prevProjects];
      const project = newProjects[index];
      project.liked = newLiked;
      project.likesCount = newLikesCount;
      return newProjects;
    });
  };


  return (
    <SectionWrapper>
      <ProjectList>
        {itemList.length === 1 ? ( // 검색 결과가 하나일 때
          <CenteredProjectCard>
            <ProjectCard>
              <ProjectOwner>
                <FontAwesomeIcon icon={regularUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
                {itemList[0].creatorID}
              </ProjectOwner>
                <LikeButton 
                initialLiked={itemList[0].liked} 
                initialLikesCount={itemList[0].likesCount} 
                onLikeChange={(newLiked, newLikesCount) => handleLikeClick(0, newLiked, newLikesCount)} // 내부 상태 업데이트
              />

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
                  마감일 | {new Date(itemList[0].deadLine).toLocaleDateString()}
                </Details>
              </ProjectInfo>
              <ApplyButton onClick={() => handleProjectClick(itemList[0])}>신청하기</ApplyButton>
            </ProjectCard>
          </CenteredProjectCard>
        ) : (
          itemList.map((project, index) => ( // 검색 결과가 여러 개일 때
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
                  마감일 | {new Date(project.deadLine).toLocaleDateString()}
                </Details>
              </ProjectInfo>
              <ApplyButton onClick={() => handleProjectClick(project)}>신청하기</ApplyButton>
            </ProjectCard>
          ))
        )}
      </ProjectList>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 80px;
  margin-bottom: 40px;
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
  justify-content: center;
  width: 50%;
  max-height: 150vh;
  max-width: 1200px;

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
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  padding: 15px;
  margin: 20px 10px;
  width: 350px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-height: 200px;
  max-height: 400px;
`;

const ProjectOwner = styled.div`
  font-weight: bold;
  text-align: left;
  color: #858585;
  margin-left: 10px;
`;

const ProjectLikes = styled.div`
  position: absolute;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 2px 8px;
  color: white;
  font-weight: bold;
  background-color: #C4C4C4;
  transform: translate(300px,-25px);
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

const ApplyButton = styled.button`
  margin-top: 5px;
  margin-left: 5px;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 5px;
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

export default SearchFeed;
