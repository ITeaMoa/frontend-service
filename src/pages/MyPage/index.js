import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
// import axios from 'axios';
import ProjectDetail from './ProjectDetail';
import ProjectListComponent from './ProjectListComponent';
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios';


const MyPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); 
  const [selectedList, setSelectedList] = useState('applied');
  const [selectedProject, setSelectedProject] = useState(null);
  // const isLoggedIn = true; 
  const showSearch = false;
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const [feedType, setFeedType] = useState('PROJECT'); // feedType 상태 추가
  const [applications, setApplications] = useState([]); // 지원자 정보를 위한 새로운 state

  // user.id를 콘솔에 출력
useEffect(() => {
  if (user) {
    console.log('User ID:', user.id); // 로그인한 사용자 ID 출력
  } else {
    console.log('사용자가 로그인하지 않았습니다.');
  }
}, [user]); // user가 변경될 때마다 실행

const handleToggleChange = (newFeedType) => {
  setFeedType(newFeedType); // feedType 업데이트
  console.log("현재 feedType:", newFeedType); // 콘솔에 현재 feedType 출력
};


  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await axios.get('data.json'); 
  //       if (response.data && response.data.length > 0) {
  //         setProjects(response.data);
  //       } else {
  //         console.warn("No projects found in data.json");
  //         setProjects([]); // 데이터가 없을 경우 빈 배열로 초기화
  //       }
  //     } catch (error) {
  //       console.error("Error fetching the projects:", error);
  //     }
  //   };

  //   fetchProjects();
  // }, []);

  // 선택된 목록이 변경될 때 신청 프로젝트를 가져오는 새로운 useEffect
 
//신청목록
  useEffect(() => {
    const fetchAppliedProjects = async () => {
      if (selectedList === 'applied' && user) {
        try {
          const response = await axios.get('/feed/applications', {
            params: {
              userId: user.id,
            }
          });
          console.log("Fetched applied projects:", response.data);
      
         
        } catch (error) {
          console.error("신청 프로젝트를 가져오는 중 오류 발생:", error);
          setProjects([]); // 오류 발생 시에도 빈 배열로 초기화
        }
      }
    };

    fetchAppliedProjects();
  }, [selectedList, user, feedType]); // feedType 추가



//written === Response Details ===
//index.js:102 Status: 200
//index.js:103 Data: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
useEffect(() => {
  const fetchCreatorProjects = async () => {
    if (selectedList === 'written' && user) {
      try {
        console.log('=== Request Details ===');
        console.log('Creator Nickname:', user.nickname);
        console.log('Feed Type:', feedType);

        const params = {
          // creatorId: user.nickname,
          creatorId: 'null',
          sk: feedType
        };

        console.log('Request Params:', { creatorId: user.nickname, sk: feedType });

        const response = await axios.get('/my/writing', { params });

        console.log('=== Response Details ===');
        console.log('Status:', response.status);
        console.log('Data:', response.data);

        setProjects(response.data || []);
      } catch (error) {
        console.error("API Error Details:", {
          status: error.response?.status,
          data: error.response?.data,
          params: error.config?.params,
          requestData: error.config?.data
        });
      }
    }
  };

  fetchCreatorProjects();
}, [selectedList, user, feedType]);


// //특정 프로젝트 누를때 실행 되는거 // 툭종 프로젝트의 지원자 정보 가져오는?? 
//     {
//   "pk": "f448fd8c-5061-702c-8c22-3636be5d18c9",
//   "sk": "6b26a3bc-0f6c-453e-9ef3-3b00d110a8cf",
//   "entityType": "APPLICATION",
//   "part": "developer",
//   "status": "REJECTED",
//   "feedType": "PROJECT",
//   "timestamp": "2024-12-06T10:07:23.249026"
// }
  useEffect(() => {
    const fetchApplications = async (feedId) => {
      try {
        const response = await axios.get(`my/writing/application`, {
          params: {
            feedId: feedId
          }
        });

        if (response.data) {
          setApplications(response.data); // 지원자 정보는 별도의 state에 저장
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("지원자 정보를 가져오는 중 오류 발생:", error);
        setApplications([]);
      }
    };

    if (selectedProject?.pk) {
      fetchApplications(selectedProject.pk);
    }
  }, [selectedProject]);



  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject) || [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  //    // 선택된 프로젝트의 세부정보 가져오기
  // // 특정 프로젝트의 세부정보 가져오기
  // useEffect(() => {
  //   const fetchProjectDetail = async (projectId) => {
  //     try {
  //       const response = await axios.get(`/main`, {
  //         params: { feedType } // feedType을 올바르게 전달
  //       });

  //       // projectId에서 'APPLICATION#' 부분을 제거
  //       const strippedProjectId = projectId.replace('APPLICATION#', '');

  //       // pk와 strippedProjectId가 같은 프로젝트 찾기
  //       const specificProject = response.data.find(project => project.pk === strippedProjectId);
  //       if (specificProject) {
  //         console.log("Fetched project details:", specificProject); // Fetch된 프로젝트 세부정보를 콘솔에 출력
  //         setSelectedProject(specificProject);
  //       } else {
  //         console.warn("No specific project found with the given ID:", strippedProjectId); // 추가된 로그
  //         setSelectedProject(null);
  //       }
  //     } catch (error) {
  //       console.error("프로젝트 세부정보를 가져오는 중 오류 발생:", error);
  //     }
  //   };

  //   // selectedProject의 sk를 사용하여 세부정보 가져오기
  //   if (selectedProject) {
  //     fetchProjectDetail(selectedProject.sk); // selectedProject.sk를 사용하여 세부정보 가져오기
  //   }
  // }, [selectedProject, feedType]); // feedType 추가


  const handleListClick = (listType) => {
    setSelectedList(listType);
    setCurrentPage(1); 
    setSelectedProject(null);
  };


  //특정 프로젝트 클릭했을때 실행 
  // 클릭된 프로젝트의 데이터는 ProjectListComponent로부터 전달받은 currentProjects 배열에서 가져옴
  //currentProjects는 신청 목록일 때: /feed/applications
//작성 목록일 때: /my/writing 에서 가져온 데 이터 
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    console.log("Selected project:", project);
  };
  

  const handleBackToList = () => {
    setSelectedProject(null);
  };


// const handleProjectClose = (projectId) => {
//   setProjects(prevProjects => 
//       prevProjects.map(project => 
//           project.pk === projectId ? { ...project, isCompleted: true } : project
//       )
//   );
// };

const handleProjectClose = async (projectId, feedType) => {
    try {
        // 문제: feedType이 객체 형태로 전달되고 있음
        const requestData = {
            pk: projectId,
            sk: feedType  // 여기서 feedType이 아닌 'PROJECT'가 들어가야 함
        };

        console.log('요청 데이터:', requestData); // 디버깅용

        await axios.patch('my/writing/close', requestData);
            
        // 성공 시 상태 업데이트
        setProjects(prevProjects => 
            prevProjects.map(project => 
                project.pk === projectId 
                    ? { ...project, isCompleted: true } 
                    : project
            )
        );
    } catch (error) {
        console.error('Error:', error);
        alert('모집 완료 처리 중 문제가 발생했습니다.');
    }
};



  return (
    <Container>
      <Nav  showSearch={showSearch}  onToggleChange={handleToggleChange}/>

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
         <ProjectDetail 
                    project={selectedProject}
                    applications={applications}
                    onBack={handleBackToList} 
                    onClose={(projectId) => handleProjectClose(projectId, 'PROJECT')}
                />
         

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
`;



