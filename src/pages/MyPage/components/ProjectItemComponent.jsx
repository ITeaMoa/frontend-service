import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { selectedSavedProjectAtom } from '../../../Atoms.jsx/AtomStates';
import { faPen } from '@fortawesome/free-solid-svg-icons'; // Import the pencil icon

    

const ProjectItemComponent = ({ project, user, handleCancelApplication, isProjectCanceled, isSaved, isDisabled, handleButtonClick }) => {
    const navigate = useNavigate();
    const [, setSelectedSavedProject] = useAtom(selectedSavedProjectAtom);

    const handleEditClick = () => {
        setSelectedSavedProject(project);
        navigate('/WritePage');
    };

      const isProjectCompleted = (projectId) => {
      const saved = localStorage.getItem('completedProjects');
      if (saved) {
        const completedArray = JSON.parse(saved);
        return completedArray.includes(projectId);
      }
      return false;
    };
  

  return (
    <ProjectItem isSaved={isSaved}>
      <ProjectHeader>
        <HeaderItem>
          <FontAwesomeIcon icon={regularUser} size="15px" />
          <span>{project.nickname}</span>
        </HeaderItem>
      </ProjectHeader>

      <p>{project.title}</p>

      <BottomSection2>

        <Tags>
        {project.tags && project.tags.map((tag, index) => (
          <Tag key={index} isSaved={isSaved}>{tag}</Tag>
        ))}

             {!isDisabled && (isSaved ? (
              <BottomContainer>
            <Button2 
              status="EDIT"
              style={{ backgroundColor: '#535353', fontWeight: 'bold', }}
              onClick={handleEditClick}
            >
              <FontAwesomeIcon icon={faPen} style={{ color: '#fff', fontSize: '16px', marginRight: '5px' }} /> {/* FontAwesome icon */}
              글 수정하기
            </Button2>
            </BottomContainer>
          ) : (

             <BottomContainer>
              <LikeCountContainer>
              <StyledFontAwesomeIcon2 icon={regularHeart} />
              <span>{project.likesCount || 0}</span>
              </LikeCountContainer>
              
          <Button2 
            onClick={() => handleButtonClick(project)}
            disabled={isProjectCompleted(project.pk)}
            style={{ 
              backgroundColor: (!project.postStatus && !project.savedFeed) ? '#808080' : '#3563E9',
              opacity: (!project.postStatus && !project.savedFeed) ? 0.6 : 1,
              // marginTop: '80px'
            }}
          >
            {isProjectCompleted(project.pk) || (!project.postStatus && !project.savedFeed) ? '모집완료' : '모집 현황'}
          </Button2>

   </BottomContainer>
      ))}
      

      </Tags>
      </BottomSection2>
      {/* {!isSaved && (
        <AdditionalInfo>
          {(!isDisabled) && <span>지원분야&nbsp;| {project.part}</span>}
          <span>모집현황&nbsp;| {project.recruitmentNum}명</span>
          <span>마감일자&nbsp;| {new Date(project.deadline).toLocaleDateString()}</span>
          <span>진행기간&nbsp;| {project.period ? `${project.period}개월` : '정보없음'}</span>
          <span>상태&nbsp; &nbsp; &nbsp;| {project.status === 'completed' ? '완료' : '진행 중'}</span>
        </AdditionalInfo>
      )} */}
    </ProjectItem>
  );
};

const ProjectItem = styled.div`
//   border: 1px solid #A0DAFB;
  border : ${({ isSaved }) => (isSaved ? '2px solid #E3F5FF' : '2px solid #E3F5FF')};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  position: relative;
  text-align: left; 
  background-color: white;

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
  // color: red;
  size: 15px;
  // background-color: #BDBDBD;
  // border-radius: 50%;
  padding: 4px;
  margin-right: 5px;
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
  border-radius: 14px 14px 14px 14px; 
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #E3F5FF;
  border-color: ${({ isSaved }) => (isSaved ? '#E3F5FF' : 'rgba(160, 218, 251)')}; // 저장된 프로젝트일 때 배경색 변경
  color: ${({ isSaved }) => (isSaved ? '#00AEFF' : '#0A8ED9')};
`;

const Button2 = styled.button`
  // position: absolute;
  background-color: ${({ status }) => 
    status === "REJECTED" ? '#C1C1C1' : 
    status === "ACCEPTED" ? '#4ECF42' : 
    '#3563E9'};
  color: white;
  border: none;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 5px;
  cursor: ${({ status }) => (status === "REJECTED" || status === "ACCEPTED" || status === "CANCELLED" ? 'not-allowed' : 'pointer')};
  // right: 15px;
  // top: 20px;
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

const BottomContainer = styled.div`
 position: absolute;
 display: flex;
  // align-items: center;
  justify-content: flex-end;
  // margin-top: 80px;
  right: 15px;
  top: 110px;


`;

const LikeCountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EDEDED;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  min-width: 40px;
  max-width: 40px;
  height: 24px;
  margin-right: 8px;
`;


const BottomSection2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export { ProjectItem, ProjectHeader, HeaderItem, StyledFontAwesomeIcon2, Tags, Tag, Button2, AdditionalInfo };
export default ProjectItemComponent; 