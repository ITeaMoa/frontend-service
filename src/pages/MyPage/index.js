import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import axios from 'axios';
import LikeButton from '../../components/LikeButton';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser as regularUser} from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons'; 


const MyPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); 
  const [selectedList, setSelectedList] = useState('');
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
                  isSelected={selectedList === listType}
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
      <ProjectList>
        {selectedList === 'written' && currentProjects.map((project, index) => (
          <ProjectItem key={project.pk} isLast={index === currentProjects.length - 1}>
            <ProjectHeader>
              <HeaderItem>
                <FontAwesomeIcon icon={regularUser} size="15px" />
                <span>{project.creatorID}</span>
              </HeaderItem>
              <HeaderItem>
                <FontAwesomeIcon icon={faHeart} color="red" size="15px" />
                <span>{project.likesCount}</span>
              </HeaderItem>
            </ProjectHeader>
            <p>{project.title}</p>
            <Tags>
              {project.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag> 
              ))}
            </Tags>
            <Button>모집 현황</Button>
          </ProjectItem>
        ))}
      </ProjectList>


      {/* 페이지네이션 컴포넌트 사용 */}
      <Pagination 
        projectsPerPage={projectsPerPage} 
        totalProjects={projects.length} 
        paginate={paginate} 
        onPageChange={paginate} // 페이지 변경 핸들러 전달
      />

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
`;


const List = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ul {
    list-style: none;
    display: flex;
    gap: 20px;
  }


`;


const StyledLink = styled.a`
  cursor: pointer;
  color: ${(props) => (props.isSelected ? 'white' : '#0A8ED9')}; 
  background-color: ${(props) => (props.isSelected ? 'rgba(160, 218, 251)' : 'white')}; 
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')}; 
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




const ProjectList = styled.div`
  margin-top: 60px;
  padding: 20px;
  padding-bottom: 0px;
  border: 2px solid #A0DAFB;
  border-radius: 20px;
  width: 50%;
`;

const ProjectItem = styled.div`
  border-bottom: ${(props) => (props.isLast ? 'none' : '2px solid #A0DAFB')}; // 마지막 항목일 경우 밑줄 제거
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

  & > span { //> : 현재 요소의 자식 자식 (빼도 됨)
    margin-left: 5px; 
  }

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

  
`;

