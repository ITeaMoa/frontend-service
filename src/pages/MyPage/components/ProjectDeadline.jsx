import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';

const ProjectDeadline = ({ project,  isSaved }) => {
  

  return (
    <ProjectItemColumn isSaved={isSaved} project = {project} >
      <ProjectHeaderColumn>
        <HeaderItemColumn>
          <FontAwesomeIcon icon={regularUser} size="15px" />
          <span>{project.nickname}</span>
        </HeaderItemColumn>
        <ButtonSection>
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



export default ProjectDeadline;