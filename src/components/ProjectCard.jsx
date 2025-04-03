import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import LikeButton from './LikeButton';

const ProjectCard = ({ 
  project, 
  onClick, 
  onLikeClick, 
  onApplyClick,
  isLoggedIn,
  userId,
  feedType 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <CardWrapper onClick={onClick}>
      <ProjectOwner>
        <FontAwesomeIcon 
          icon={regularUser} 
          style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} 
        />
        {project.nickname}
      </ProjectOwner>
      <LikeButtonWrapper>
        <LikeButton 
          // initialLiked={project.liked}
          initialLikesCount={project.likesCount}
          // onLikeChange={(newLiked) => onLikeClick(project.id, newLiked)}
          sk={project.pk}
          userId={userId}
          feedType={feedType}
        />
      </LikeButtonWrapper>
      <ProjectTitle>{project.title}</ProjectTitle>
      <Content 
        isExpanded={isExpanded}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        {project.content}
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
      {/* <ApplyButton 
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
      </ApplyButton> */}
      <ApplyButton 
  onClick={(e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onApplyClick(project); // 바로 상위 컴포넌트로 전달
  }}
>
  신청하기
</ApplyButton>
    </CardWrapper>
  );
};

// Styled components
const CardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: calc(100%/2 - 50px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-height: 200px;
  min-width: 400px;

  &:hover {
    background-color: #A0DAFB;
  }

  @media (max-width: 1400px) {
    min-width: 300px;
  }

  @media (max-width: 1200px) {
    width: calc(33.33% - 20px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: 250px;
    margin: 10px 0;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
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
  color: #858585;
  text-align: left;
  
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.isExpanded ? 'none' : '3'};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
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

const ApplyButton = styled.button`
  align-self: flex-end;
  margin-top: auto;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 14px 14px 1px 14px; 
  padding: 8px 25px;
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

export default ProjectCard;
