import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import axios from 'axios';
// import LikeButton from '../../components/LikeButton';
import Pagination from '../../components/Pagination';
import ProjectDetail from '../../components/ProjectDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser as regularUser} from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; 
import ProjectListComponent from '../../components/ProjectListComponent';


const MyPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); 
  const [selectedList, setSelectedList] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const isLoggedIn = true; 
  const showSearch = false;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('data.json'); 
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching the projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleListClick = (listType) => {
    setSelectedList(listType);
    setCurrentPage(1); 
    setSelectedProject(null);
  };


  const handleProjectClick = (project) => {
    setSelectedProject(project);
    console.log("Selected project:", project);
  };
  

  const handleBackToList = () => {
    setSelectedProject(null);
  };


  return (
    <Container>
      <Nav isLoggedIn={isLoggedIn} showSearch={showSearch}/>

          <List>
            <ul>
              {['applied', 'interested', 'written', 'saved', 'closed', 'profile'].map((listType) => (
                <li key={listType}>
                  <StyledLink 
                    onClick={() => handleListClick(listType)} 
                    $isSelected={selectedList === listType}
                  >
                    {listType === 'applied' && '신청 목록'}
                    {listType === 'interested' && '관심 목록'}
                    {listType === 'written' && '작성 목록'}
                    {listType === 'saved' && '임시 저장'}
                    {listType === 'closed' && '마감 목록'}
                    {listType === 'profile' && '개인 정보'}
                  </StyledLink>
                </li>
              ))}
            </ul>
          </List>

            {/* 선택된 프로젝트가 있을 때 세부정보 보여줌 */}
      {selectedProject ? (
        <>
         <ProjectDetail project={selectedProject} onBack={handleBackToList} />

        </>
      ) : (
        <ProjectListComponent 
          selectedList={selectedList}
          currentProjects={currentProjects}
          handleProjectClick={handleProjectClick}
          projectsPerPage={projectsPerPage}
          totalProjects={projects.length}
          paginate={paginate}
        />
      )}
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
 margin-top: 20vh;
 min-height: calc(100vh - 250px);
 display: flex;
 padding-top: 30px;
 flex-direction: column;
 align-items: center;
 z-index:1000;
 justify-content: center;
`;


const List = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto; // Allow horizontal scrolling if needed
  white-space: nowrap; // Prevent items from wrapping
  max-width: 100%; // Ensure the container doesn't exceed the screen width
  padding: 20px;

  ul {
    list-style: none;
    display: flex;
    gap: 20px;
    padding: 0;
    margin: 0;
  }

  @media (max-width: 768px) {
    ul {
      gap: 10px;
    }
  }
`;


const StyledLink = styled.a`
  cursor: pointer;
  color: ${(props) => (props.$isSelected ? 'white' : '#0A8ED9')}; 
  background-color: ${(props) => (props.$isSelected ? 'rgba(160, 218, 251)' : 'white')}; 
  font-weight: ${(props) => (props.$isSelected ? 'bold' : 'normal')}; 
  border: 2px solid rgba(160, 218, 251); 
  border-radius: 30px 30px 1px 30px; 
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); 
  padding: 10px 25px; 
  margin-right: 20px; 
  text-decoration: none; 

  &:hover {
    background-color: rgba(160, 218, 251); 
    color: white; 
  }
`;;



