import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { selectedSavedProjectAtom } from '../../../Atoms.jsx/AtomStates';

    

const ProjectItemComponent = ({ project, user, handleCancelApplication, isProjectCanceled, isSaved, isDisabled }) => {
    const navigate = useNavigate();
    const [selectedSavedProject, setSelectedSavedProject] = useAtom(selectedSavedProjectAtom);

    const handleEditClick = () => {
        setSelectedSavedProject(project);
        navigate('/WritePage');
    };

  return (
    <ProjectItem isSaved={isSaved}>
      <ProjectHeader>
        <HeaderItem>
          <FontAwesomeIcon icon={regularUser} size="15px" />
          <span>{project.nickname}</span>
          {!isSaved && (
            <>
              <StyledFontAwesomeIcon2 icon={faHeart} />
              <span>{project.likesCount || 0}</span>
            </>
          )}
        </HeaderItem>
      </ProjectHeader>

      <p>{project.title}</p>

      <Tags>
        {project.tags && project.tags.map((tag, index) => (
          <Tag key={index} isSaved={isSaved}>{tag}</Tag>
        ))}
      </Tags>
      
      {!isDisabled && (isSaved ? (
        <Button2 
        
          status="EDIT"
          style={{ backgroundColor: '#C1C1C1' , marginTop: '80px'}}
          onClick={handleEditClick}
        >
          수정
        </Button2>
      ) : (
        <Button2 
          onClick={() => {
            if (user && user.id && project.feedId) {
              handleCancelApplication(user.id, project.feedId);
            } else {
              console.error("User or project information is missing");
            }
          }}
          disabled={isProjectCanceled(project.feedId) || project.status === "REJECTED" || project.status === "ACCEPTED"}
          status={project.status}
        >
          {project.status === "REJECTED" ? "반려" : project.status === "ACCEPTED" ? "승인 완료" : "신청 취소"}
        </Button2>
      ))}
      
      {!isSaved && (
        <AdditionalInfo>
          <span>지원분야&nbsp;| {project.part}</span>
          <span>모집현황&nbsp;| {project.recruitmentNum}명</span>
          <span>마감일자&nbsp;| {new Date(project.deadline).toLocaleDateString()}</span>
          <span>진행기간&nbsp;| {project.period ? `${project.period}개월` : '정보없음'}</span>
          <span>상태&nbsp; &nbsp; &nbsp;| {project.status === 'completed' ? '완료' : '진행 중'}</span>
        </AdditionalInfo>
      )}
    </ProjectItem>
  );
};

const ProjectItem = styled.div`
//   border: 1px solid #A0DAFB;
  border : ${({ isSaved }) => (isSaved ? '1px solid #C1C1C1' : '1px solid #A0DAFB')};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  position: relative;
  text-align: left; 
  background-color: ${({ isSaved }) => (isSaved ? 'white' : 'white')};

  p {
    font-weight: bold;
    font-size: 18px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 14px;
    width: 100%;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderItem = styled.div`
  display: flex;
  align-items: center; 
  margin-right: 10px; 

  & > span {
    margin-left: 5px; 
    font-weight: bold;
  }
`;

const StyledFontAwesomeIcon2 = styled(FontAwesomeIcon)`
  color: red;
  size: 15px;
  background-color: #BDBDBD;
  border-radius: 50%;
  padding: 4px;
  margin-left: 10px;
`;

const Tags = styled.div`
  display: flex;  
  margin: 10px 0;
  align-items: left;
`;

const Tag = styled.span`
  margin-right: 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 14px 14px 1px 14px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-color: ${({ isSaved }) => (isSaved ? '#C1C1C1' : 'rgba(160, 218, 251)')}; // 저장된 프로젝트일 때 배경색 변경
  color: ${({ isSaved }) => (isSaved ? '#C1C1C1' : '#0A8ED9')};
`;

const Button2 = styled.button`
  position: absolute;
  background-color: ${({ status }) => 
    status === "REJECTED" ? '#C1C1C1' : 
    status === "ACCEPTED" ? '#4ECF42' : 
    '#3563E9'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: ${({ status }) => (status === "REJECTED" || status === "ACCEPTED" || status === "CANCELLED" ? 'not-allowed' : 'pointer')};
  right: 15px;
  top: 20px;
  min-width: 100px;

  &:hover {
    background-color: ${({ status }) => 
      status === "REJECTED" ? '#C1C1C1' : 
      status === "ACCEPTED" ? '#4ECF42' : 
      '#a0dafb'};
  }
`;

const AdditionalInfo = styled.div`
  position: absolute;
  text-align: left;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  right: 15px;
  bottom: 10px;
`;

export { ProjectItem, ProjectHeader, HeaderItem, StyledFontAwesomeIcon2, Tags, Tag, Button2, AdditionalInfo };
export default ProjectItemComponent; 