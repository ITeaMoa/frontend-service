import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';
// import { useAtom } from 'jotai';
// import { selectedSavedProjectAtom } from '../../../Atoms.jsx/AtomStates';
// import { faPen } from '@fortawesome/free-solid-svg-icons';

const ProjectDeadline = ({ project, user, handleCancelApplication, isProjectCanceled, isSaved, isDisabled }) => {
    // const navigate = useNavigate();
  

  return (
    <ProjectItemColumn isSaved={isSaved} project = {project} >
      <ProjectHeaderColumn>
        <HeaderItemColumn>
          <FontAwesomeIcon icon={regularUser} size="15px" />
          <span>{project.nickname}</span>
        </HeaderItemColumn>
        <ButtonSection>
            {/* <StyledFontAwesomeIconColumn icon={faHeart} /> */}
            <LikeCountContainer>
              <StyledFontAwesomeIconColumn icon={regularHeart} />{project.likesCount || 0}
              </LikeCountContainer>
        </ButtonSection>
      </ProjectHeaderColumn>

      <ProjectTitleColumn>{project.title}</ProjectTitleColumn>

   
        <TagsColumn>
        {project.tags && project.tags.map((tag, index) => (
          <TagColumn key={index} isSaved={isSaved}>{tag}</TagColumn>
        ))}
      </TagsColumn>
    
       
     
    </ProjectItemColumn>
  );
};

const ProjectItemColumn = styled.div`
  border: 2px solid #EDEDED;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  // width: 400px;
  width: 90%;
  // min-height: 350px;
//   height: 200px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    min-height: auto;
  }
`;

const ProjectHeaderColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
`;

const HeaderItemColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & > span {
    font-weight: bold;
    color: #333;
  }
`;


const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  self-align: flex-end;
  
`;

const StyledFontAwesomeIconColumn = styled(FontAwesomeIcon)`
  // color: red;
  // background-color: #BDBDBD;
  border-radius: 50%;
  padding: 4px;
  margin-right:5px;

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
  height: 24px;
  margin-right: 8px;
`;

const ProjectTitleColumn = styled.h3`
  font-weight: bold;
  font-size: 20px;
  margin: 0;
  color: #2c3e50;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const TagsColumn = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  // margin: 10px 0;
  margin-top: 10px;
`;

const TagColumn = styled.span`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: #E3F5FF;
  border-color: ${({ isSaved }) => (isSaved ? '#E3F5FF' : 'rgba(160, 218, 251)')};
  color: ${({ isSaved }) => (isSaved ? '#00AEFF' : '#0A8ED9')};
  font-size: 12px;
  font-weight: 500;
`;

const AdditionalInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  // margin: 15px 0;
  flex: 1;
  margin-bottom: -15px;
`;

const InfoItem = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
`;

// const ButtonContainerColumn = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: auto;
//   padding-top: 15px;
// `;

const ButtonColumn = styled.button`
  background-color: ${({ status }) => 
    status === "REJECTED" ? '#C1C1C1' : 
    status === "ACCEPTED" ? '#4ECF42' : 
    '#3563E9'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: ${({ status }) => (status === "REJECTED" || status === "ACCEPTED" || status === "CANCELLED" ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.2s ease;
  width: 100%;
  

  &:hover {
    background-color: ${({ status }) => 
      status === "REJECTED" ? '#C1C1C1' : 
      status === "ACCEPTED" ? '#4ECF42' : 
      '#2952cc'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;


export default ProjectDeadline;