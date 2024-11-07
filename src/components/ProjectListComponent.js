import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import Pagination from './Pagination';


const ProjectListComponent = ({ selectedList, currentProjects, handleProjectClick, projectsPerPage, totalProjects, paginate, currentPage }) => {
  const [isFading, setIsFading] = useState(false);


  const handleButtonClick = (project) => {
    setIsFading(true);
    setTimeout(() => {
      handleProjectClick(project);
      setIsFading(false);
      
    }, 100);
  };

  return (
    <Container>
      <ProjectList isFading={isFading}>
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
            <Button onClick={() => handleButtonClick(project)}>
            {project.isCompleted ? '모집완료' : '모집 현황'}
            </Button>
          </ProjectItem>
        ))}

        {selectedList === 'applied' && currentProjects.map((project, index) => (
          <ProjectItem key={project.pk} isLast={index === currentProjects.length - 1}>
            <ProjectHeader>
              <HeaderItem>
                <FontAwesomeIcon icon={regularUser} size="15px" />
                <span>{project.creatorID}</span>
                <StyledFontAwesomeIcon2 icon={faHeart} />
                <span>{project.likesCount}</span>
              </HeaderItem>
            </ProjectHeader>
            <p>{project.title}</p>
            <Tags>
              {project.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Tags>
            <Button2>
              {project.isCompleted ? '모집완료' : '신청 취소'}
              {/* <Button2>
              {project.status === 'accepted' ? '합격 취소' : project.status === 'applied' ? '신청 취소' : '반려'}
            </Button2> */}
            </Button2>
            <AdditionalInfo>
              <span>지원 분야 | 백엔드</span>
              <span>모집 현황 | {project.applyNum} / {project.recruitmentNum}</span>
              <span>마감 일자 | {new Date(project.deadline).toLocaleDateString()}</span>
              <span>진행 기간 | {project.period}개월</span>
            </AdditionalInfo>
          </ProjectItem>
        ))}
      </ProjectList>


      <Pagination 
        currentPage={currentPage}
        projectsPerPage={projectsPerPage} 
        totalProjects={totalProjects} 
        paginate={paginate} 
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
  width:50vw;
  max-width: 800px; 
  overflow-x: auto;
  transition: transform 0.5s ease;
  transform: ${(props) => (props.isFading ? 'translateX(100%)' : 'translateX(0)')};
`;



const ProjectItem = styled.div`
  border-bottom: ${(props) => (props.isLast ? 'none' : '2px solid #A0DAFB')};
  border-radius: 1px;
  padding: 15px;
  padding-bottom: 30px;
  margin-bottom: 15px;
  position: relative;
  text-align: left; 

  p{
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

const Button2 = styled.button`
  position: absolute;
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  right: 15px;
  top:20px;

  &:hover {
    background-color: #a0dafb;
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
  bottom: 30px;
  
`;