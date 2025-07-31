import React from 'react';
import styled from 'styled-components';
import LikeButtonColumn from '../../../components/LikeButtonColumn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';

// 필요한 스타일드 컴포넌트 import 또는 아래처럼 정의
// ProjectCard, ProjectTitle, ProjectTag, ProjectDescription, ProjectDetail, VerticalLikeButton, ApplyButton 등

const ProjectFeedCard = ({ project, handleProjectClick, onApplyClick }) => (
  <ProjectCard onClick={() => handleProjectClick && handleProjectClick(project)}>
    <CardHeader>
      <ProfileWrap>
        <ProfileCircle>
          {project.avatarUrl || project.profile ? (
            <ProfileImg
              src={project.avatarUrl ? encodeURI(project.avatarUrl) : project.profile}
              alt="profile"
            />
          ) : (
            <FontAwesomeIcon
              icon={regularUser}
              style={{ fontSize: '22px', color: '#bbb' }}
            />
          )}
        </ProfileCircle>
        <Nickname>{project.nickname}</Nickname>
      </ProfileWrap>
      <Views>
        <FontAwesomeIcon icon={faEye} style={{ marginRight: 4 }} />
        {project.views ?? 0}
      </Views>
    </CardHeader>
    <ProjectTitle>{project.title}</ProjectTitle>
    <ProjectTags>
      {project.tags && project.tags.map(tag => (
        <ProjectTag key={tag}>{tag}</ProjectTag>
      ))}
    </ProjectTags>
    <ProjectDescription>{project.content}</ProjectDescription>
    <ProjectInfo>
      <ProjectDetail>
        <b>모집인원</b> | {project.recruitmentNum}명
      </ProjectDetail>
      <ProjectDetail>
        <b>마감일</b> | {formatDate(project.deadline)}
      </ProjectDetail>
    </ProjectInfo>
    <CardFooter>
      <LikeButtonColumn 
        sk={project.pk}
      />
      <ApplyButton
        onClick={(e) => {
          e.stopPropagation(); // 이벤트 버블링 방지
          onApplyClick(project); // 상위 컴포넌트로 이벤트 전달
        }}
      >
        신청하기
      </ApplyButton>
    </CardFooter>
  </ProjectCard>
);

export default ProjectFeedCard;

// 스타일드 컴포넌트 정의는 기존 코드에서 복사/이동

const ProjectCard = styled.div`
background: #fff;
border-radius: 16px;
box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
padding: 28px 24px 20px 24px;
display: flex;
flex-direction: column;
min-height: 350px;
justify-content: space-between;
border: 1px solid #e6eaf2;
 cursor: pointer;
 &:hover {
    border:1px solid #62b9ec;
  }

`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 8px;
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const Nickname = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Views = styled.span`
  color: #b0b0b0;
  font-size: 15px;
`;

const ProjectTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin: 8px 0 10px 0;
`;

const ProjectTags = styled.div`
  display: flex;
  gap: 8px;
  // margin-bottom: 8px;
`;

const ProjectTag = styled.span`
  background: #eaf6ff;
  color: #009cff;
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 500;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 15px;
  color: #888;
  margin-bottom: 12px;
`;

const ProjectDetail = styled.span`
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

// const LikeButton = styled.button`
//   width: 44px;
//   height: 44px;
//   background: #f5f5f5;
//   border-radius: 8px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   font-size: 18px;
//   color: #222;
//   box-shadow: none;
//   padding: 0;
//   user-select: none;
// `;

const ApplyButton = styled.button`
  flex: 1;
  height: 44px;
  background: linear-gradient(90deg, #36c6ff 0%, #3a8dff 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #62b9ec;
  }
`;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

