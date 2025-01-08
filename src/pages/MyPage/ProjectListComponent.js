import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import Pagination from '../../components/Pagination';
import axios from '../../api/axios'; // Axios import 추가
// import axios from 'axios';
import { useAuth } from '../../context/AuthContext'

const ProjectListComponent = ({ selectedList, currentProjects = [], handleProjectClick, projectsPerPage, totalProjects, paginate, currentPage }) => {
  const [isFading, setIsFading] = useState(false);
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  // const [projects, setProjects] = useState(currentProjects);
  // const [projects, setProjects] = useState([]); // 초기값을 빈 배열로 설정


  const handleButtonClick = (project) => {
    setIsFading(true);
    setTimeout(() => {
      handleProjectClick(project);
      setIsFading(false);
      
    }, 100);
  };


  const handleCancelApplication = async (userId, feedId) => {
    if (!userId || !feedId) {
        console.error("userId 또는 feedId가 null입니다.");
        return;
    }

    const requestData = {
        pk: userId,
        sk: feedId
    };

    try {
        console.log('전송할 데이터:', requestData);
        
        // 전체 URL을 사용하여 PATCH 요청
        const response = await axios.patch('/my/writing/cancel', requestData, {
            headers: {
                'Content-Type': 'application/json' // JSON 형식으로 전송
            }
        });
        console.log('응답:', response.data);
        alert('신청이 취소되었습니다.');

        // sk에서 숫자 부분 추출
        const skNumber = feedId.split('#')[1]; // "APPLICATION#6b26a3bc-0f6c-453e-9ef3-3b00d110a8cf"에서 숫자 부분 추출

        // GET 요청을 통해 PROJECT 데이터 가져오기
        const projectResponse = await axios.get(`/main?feedType=PROJECT`);
        console.log('프로젝트 데이터:', projectResponse.data); // 응답 데이터 확인

        // pk가 skNumber와 같은 항목 찾기
        const matchedProject = projectResponse.data.find(project => project.pk === skNumber);
        
        if (matchedProject) {
            // 필요한 데이터 처리 로직 추가
            console.log('찾은 프로젝트 데이터:', matchedProject);
            // 예: likesCount, creatorId 등을 UI에 표시
            alert(`Likes Count: ${matchedProject.likesCount}, Creator ID: ${matchedProject.creatorId}`);
        } else {
            console.log('일치하는 프로젝트를 찾을 수 없습니다.'); // 이 로그가 출력되는지 확인
        }

        window.location.reload();
    } catch (error) {
        console.error('오류 세부정보:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
        alert(`신청 취소 중 오류가 발생했습니다. (${error.response?.data || '알 수 없는 오류'})`);
    }
}
 

//   const handleCancelApplication = async (userId, feedId) => {
//     if (!userId || !feedId) {
//         console.error("userId or feedId is null");
//         return;
//     }

//     const requestData = {
//         pk: userId,
//         sk: feedId,
//         status: "CANCEL"  // 또는 "CANCELLED" (백엔드 팀과 정확한 enum 값 확인 필요)
//     };

//     try {
//         console.log('Sending request with data:', requestData);
        
//         const response = await axios.patch('/api/my/writing/cancel', requestData);
//         console.log('Response:', response.data);
//         alert('신청이 취소되었습니다.');
//         window.location.reload();
//     } catch (error) {
//         console.error('Error details:', {
//             status: error.response?.status,
//             data: error.response?.data,
//             config: error.config
//         });
//         alert(`신청 취소 중 오류가 발생했습니다. (${error.response?.data || '알 수 없는 오류'})`);
//     }
// }

//   const handleCloseApplication = (projectId) => {
//     // 모집 완료 상태를 업데이트
//     setProjects(prevProjects => 
//         prevProjects.map(project => 
//             project.pk === projectId ? { ...project, isCompleted: true } : project
//         )
//     );
// };



// // onClose 콜백을 props로 받아와서 사용
// const handleProjectClose = (projectId) => {
//   handleCloseApplication(projectId);
// };


  //<ProjectItem key={project.pk} isLast={index === currentProjects.length - 1}>

  return (
    <Container>
      <ProjectList isFading={isFading}>
      {selectedList === 'written' && currentProjects && currentProjects.map((project, index) => (
  <ProjectItem key={project.pk}>
    <ProjectHeader>
      <HeaderItem>
        <FontAwesomeIcon icon={regularUser} size="15px" />
        <span>{project.creatorId}</span>
      </HeaderItem>
      <HeaderItem>
        <StyledFontAwesomeIcon icon={faHeart} />
        <span>{project.likesCount}</span>
      </HeaderItem>
    </ProjectHeader>
    <p>{project.title}</p>
    <Tags>
      {Array.isArray(project.tags) && project.tags.length > 0 ? (
        project.tags.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))
      ) : (
        <span>태그가 없습니다.</span> // 태그가 없을 때 표시할 메시지
      )}
    </Tags>
    <Button 
      onClick={() => handleButtonClick(project)}
      disabled={project.isCompleted} // 모집 완료 시 버튼 비활성화
    >
      {project.isCompleted ? '모집완료' : '모집 현황'}
            </Button> 
            {/* <Button 
                onClick={() => handleCloseApplication(project.pk)}
                disabled={project.isCompleted} // 모집 완료 시 버튼 비활성화
            >
                모집완료
            </Button> */}
            {/* <Button onClick={() => handleButtonClick(project)}>
            {project.isCompleted ? '모집완료' : '모집 현황'}
            </Button> */}

<Button 
    onClick={() => handleButtonClick(project)}
    disabled={project.isCompleted} // 모집 완료 시 버튼 비활성화
>
    {project.isCompleted ? '모집완료' : '모집 현황'}
</Button>
          </ProjectItem>
        ))}

        {selectedList === 'applied' && currentProjects.length === 0 && (
          <p>신청한 프로젝트가 없습니다.</p>
        )}
        {selectedList === 'applied' && currentProjects.map((project, index) => (
          <ProjectItem key={project.sk}>
            <ProjectHeader>
              <HeaderItem>
                <FontAwesomeIcon icon={regularUser} size="15px" />
                <span>{project.creatorId}</span>
                <StyledFontAwesomeIcon2 icon={faHeart} />
                <span>{project.likesCount || 0}</span>
              </HeaderItem>
            </ProjectHeader>
          
            <Tags>
              {project.tags && project.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Tags>
            <Button2 onClick={() => {
              if (user && user.id && project.sk) {
                handleCancelApplication(user.id, project.sk);
              } else {
                console.error("User or project information is missing");
              }
            }}>
              신청 취소
            </Button2>
            <AdditionalInfo>
            <span>Part: {project.part}</span>
              <span>상태: Pending</span>
              <span>신청 일자: {new Date(project.timestamp).toLocaleDateString()}</span>
            </AdditionalInfo>
          </ProjectItem>
        ))}
      </ProjectList>


      <Pagination 
        currentPage={currentPage}
        projectsPerPage={projectsPerPage} 
        totalProjects={totalProjects} 
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

const HeaderItem = styled.div`  display: flex;
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
  min-height: 50px;
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
