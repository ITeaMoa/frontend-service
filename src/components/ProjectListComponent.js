import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {  faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import Pagination from './Pagination';


const ProjectListComponent = ({ selectedList, currentProjects, handleProjectClick, projectsPerPage, totalProjects, paginate }) => {
  return (
    <Container>
      <ProjectList>
        {selectedList === 'written' && currentProjects.map((project, index) => (
          <ProjectItem key={project.pk} isLast={index === currentProjects.length - 1}>
            <ProjectHeader>
              <HeaderItem>
                <FontAwesomeIcon icon={regularUser} size="15px" />
                <span>{project.creatorID}</span>
              </HeaderItem>
              <HeaderItem>
                <StyledFontAwesomeIcon icon={faHeart} />
                <span>{project.likesCount}</span>
              </HeaderItem>
            </ProjectHeader>
            <p>{project.title}</p>
            <Tags>
              {project.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag> 
              ))}
            </Tags>
            <Button onClick={() => handleProjectClick(project)}>
              {project.isCompleted ? '모집완료' : '모집 현황'}
            </Button>
          </ProjectItem>
        ))}
      </ProjectList>

      <Pagination 
        projectsPerPage={projectsPerPage} 
        totalProjects={totalProjects} 
        paginate={paginate} 
        onPageChange={paginate}
      />
    </Container>
  );
};

export default ProjectListComponent;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProjectList = styled.div`
  margin-top: 60px;
  padding: 20px;
  padding-bottom: 0px;
  border: 2px solid #A0DAFB;
  border-radius: 20px;
  width: 140%;
`;

const ProjectItem = styled.div`
  border-bottom: ${(props) => (props.isLast ? 'none' : '2px solid #A0DAFB')};
  border-radius: 1px;
  padding: 15px;
  padding-bottom: 30px;
  margin-bottom: 15px;
  position: relative;

  p {
    text-align: left;
    font-weight: bold;
    font-size: 18px;
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


const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: red;
  size: 15px;
  background-color: #BDBDBD;
  border-radius: 50%;
  padding:  4px;
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
  border-color: rgba(160, 218, 251);
  color: #0A8ED9;
`;

const Button = styled.button`
  position: absolute;
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  right: 15px;
  bottom: 30px;

  &:hover {
    background-color: #a0dafb;
  }
`;


