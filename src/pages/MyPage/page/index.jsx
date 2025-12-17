import React, { useEffect, useState,  } from 'react';
import styled from 'styled-components';
import NavigationBar from "../../../components/NavigationBar";
import ProjectDetail from '../components/ProjectDetail';
import { useAuth } from '../../../context/AuthContext'
import axios from '../../../api/axios';
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../../../Atoms.jsx/AtomStates';
import Pagination from '../../../components/Pagination';
import Modal from '../../../components/Modal';
import ProjectItemComponent from '../components/ProjectItemComponent';
import UserProfile from '../components/UserProfile';
import AlertModal from '../../../components/AlertModal';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import ProjectLikeItem from '../components/ProjectLikeItem';
import ProjectItemColumnComponent from '../components/ProjectItemColumnComponent';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import ProjectDeadline from '../components/ProjectDeadline';


const MyPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); 
  const [selectedList, setSelectedList] = useState('applied');
  const [selectedProject, setSelectedProject] = useState(null);
  const [applySelectedProject, setApplySelectedProject] = useState(null);
  const showSearch = false;
  const { user } = useAuth(); 
  const [feedType, ] = useAtom(feedTypeAtom);
  const [applications, setApplications] = useState([]); 
  const [isFading, setIsFading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProjectForCancel, setSelectedProjectForCancel] = useState(null);
  const [, setIsProfileVisible] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [showApplyPopup, setShowApplyPopup] = useState(''); 
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);


useEffect(() => {
  window.scrollTo(0, 0);
}, []);


const dummySavedProjects = [
  {
    "pk": "c0349497-05cb-43ef-99f2-8ac4cc73ba86",
    "sk": "PROJECT",
    "nickname": "brynn",
    "entityType": "FEED",
    "creatorId": "d4487dfc-f001-7052-0905-97df4f00380c",
    "title": "AI 데이터분석 서비스 팀원 모집합니다 !",
    "recruitmentNum": 3,
    "deadline": "2025-03-14T00:00:00",
    "place": "동탄역 근처",
    "period": 0,
    "tags": [
      "웹",
      "인공지능",
      "빅데이터"
    ],
    "likesCount": 1,
    "content": "유저 데이터를 모아서 분석하고, 대시보드화해서 AI로 마케팅 방법을 제안해주는 서비스를 만들어보려고 합니다. 제가 개발을 할 수 있으니 데이터분석 및 AI 활용해서 엔지니어링 할 수 있는 분 구합니다.\n\n궁금한 점은 쪽지 주세요!",
    "comments": [],
    "postStatus": false,
    "timestamp": "2025-02-03T13:42:00.587250944",
    "savedFeed": true,
    "roles": {
      "ai 엔지니어": 1,
      "프론트엔드": 1,
      "빅데이터": 1
    },
    "recruitmentRoles": {
      "ai 엔지니어": 0,
      "프론트엔드": 1,
      "빅데이터": 0
    }
  },
 
  {
    "pk": "c0349497-05cb-43ef-99f2-8ac4cc73ba86",
    "sk": "PROJECT",
    "nickname": "brynn",
    "entityType": "FEED",
    "creatorId": "d4487dfc-f001-7052-0905-97df4f00380c",
    "title": "AI 데이터분석 서비스 팀원 모집합니다 !",
    "recruitmentNum": 3,
    "deadline": "2025-03-14T00:00:00",
    "place": "동탄역 근처",
    "period": 0,
    "tags": [
      "웹",
      "인공지능",
      "빅데이터"
    ],
    "likesCount": 1,
    "content": "유저 데이터를 모아서 분석하고, 대시보드화해서 AI로 마케팅 방법을 제안해주는 서비스를 만들어보려고 합니다. 제가 개발을 할 수 있으니 데이터분석 및 AI 활용해서 엔지니어링 할 수 있는 분 구합니다.\n\n궁금한 점은 쪽지 주세요!",
    "comments": [],
    "postStatus": false,
    "timestamp": "2025-02-03T13:42:00.587250944",
    "savedFeed": true,
    "roles": {
      "ai 엔지니어": 1,
      "프론트엔드": 1,
      "빅데이터": 1
    },
    "recruitmentRoles": {
      "ai 엔지니어": 0,
      "프론트엔드": 1,
      "빅데이터": 0
    }
  },
 
];

const likeProjects = [ 
  {
    "pk": "4fccc2dd-58a7-4db1-a549-b44603b9fbbb",
    "sk": "PROJECT",
    "nickname": "바다상어",
    "entityType": "FEED",
    "creatorId": "f4f84d4c-90c1-7027-d639-96212513682e",
    "title": "ITeaMoa 프로젝트 팀원 구합니다",
    "recruitmentNum": 5,
    "deadline": "2025-02-28T00:00:00",
    "place": "강남역",
    "period": 0,
    "tags": [
      "웹",
      "모바일",
      "AWS",
      "Git",
      "Github",
      "Spring Boot",
      "React"
    ],
    "likesCount": 5,
    "content": "안녕하세요.\n\n\"IT관련 프로젝트 팀원 모집 플랫폼\" 프로젝트 진행하실 팀원 구합니다~\n\n많은 관심 바라요:)",
    "comments": [
      {
        "userId": "84b8ddac-3081-70eb-e79d-e8f5deef4892",
        "comment": "질문이 있습니다",
        "timestamp": "2025-02-05T01:20:34.78452235",
        "name": null
      },
      {
        "userId": "84b8ddac-3081-70eb-e79d-e8f5deef4892",
        "comment": "질문 받아주세요!!",
        "timestamp": "2025-02-05T01:26:31.379855213",
        "name": null
      }
    ],
    "postStatus": true,
    "timestamp": "2025-02-03T13:21:40.743217531",
    "savedFeed": false,
    "roles": {
      "백엔드": 2,
      "프론트엔드": 1,
      "기획자": 1,
      "pm": 1
    },
    "recruitmentRoles": {
      "백엔드": 1,
      "프론트엔드": 0,
      "기획자": 1,
      "pm": 0
    }
  },
  {
    "pk": "4fccc2dd-58a7-4db1-a549-b44603b9fbbb",
    "sk": "PROJECT",
    "nickname": "바다상어",
    "entityType": "FEED",
    "creatorId": "f4f84d4c-90c1-7027-d639-96212513682e",
    "title": "ITeaMoa 프로젝트 팀원 구합니다",
    "recruitmentNum": 5,
    "deadline": "2025-02-28T00:00:00",
    "place": "강남역",
    "period": 0,
    "tags": [
      "웹",
      "모바일",
      "AWS",
      "Git",
      "Github",
      "Spring Boot",
      "React"
    ],
    "likesCount": 5,
    "content": "안녕하세요.\n\n\"IT관련 프로젝트 팀원 모집 플랫폼\" 프로젝트 진행하실 팀원 구합니다~\n\n많은 관심 바라요:)",
    "comments": [
      {
        "userId": "84b8ddac-3081-70eb-e79d-e8f5deef4892",
        "comment": "질문이 있습니다",
        "timestamp": "2025-02-05T01:20:34.78452235",
        "name": null
      },
      {
        "userId": "84b8ddac-3081-70eb-e79d-e8f5deef4892",
        "comment": "질문 받아주세요!!",
        "timestamp": "2025-02-05T01:26:31.379855213",
        "name": null
      }
    ],
    "postStatus": true,
    "timestamp": "2025-02-03T13:21:40.743217531",
    "savedFeed": false,
    "roles": {
      "백엔드": 2,
      "프론트엔드": 1,
      "기획자": 1,
      "pm": 1
    },
    "recruitmentRoles": {
      "백엔드": 1,
      "프론트엔드": 0,
      "기획자": 1,
      "pm": 0
    }
  },
 
];

const appliedproject = 
[
  {
    "userId": "a4a8fd8c-d0b1-7054-7d1c-d0285599d299",
    "feedId": "a3e74975-5bd9-4c57-a3b4-33aa5828e702",
    "part": "프론트",
    "status": "PENDING",
    "applicationTimestamp": "2025-05-01T10:14:05.6506286",
    "creatorId": "USER#a4a8fd8c-d0b1-7054-7d1c-d0285599d299",
    "title": "테스트1",
    "content": "테스트1",
    "tags": [
      "c",
      "c++"
    ],
    "recruitmentNum": 5,
    "deadline": "2024-12-31T23:59:59",
    "period": 3,
    "likesCount": 1,
    "recruitmentRoles": {
      "프론트엔드": 0,
      "백엔드": 0,
      "프론트": 2
    },
    "nickname": "brynn_"
  },
  {
    "userId": "a4a8fd8c-d0b1-7054-7d1c-d0285599d299",
    "feedId": "a3e74975-5bd9-4c57-a3b4-33aa5828e702",
    "part": "프론트",
    "status": "REJECTED",
    "applicationTimestamp": "2025-05-01T10:14:05.6506286",
    "creatorId": "USER#a4a8fd8c-d0b1-7054-7d1c-d0285599d299",
    "title": "테스트1",
    "content": "테스트1",
    "tags": [
      "c",
      "c++"
    ],
    "recruitmentNum": 5,
    "deadline": "2024-12-31T23:59:59",
    "period": 3,
    "likesCount": 1,
    "recruitmentRoles": {
      "프론트엔드": 0,
      "백엔드": 0,
      "프론트": 2
    },
    "nickname": "brynn_"
  }
]

const writtenProjects = [
  {
    "pk": "bfcd417e-5f0b-456f-94ae-78628ba050ac",
    "sk": "PROJECT",
    "nickname": "청갈치",
    "entityType": "FEED",
    "creatorId": "34f8fd4c-a001-7051-2a4e-64beb057470f",
    "title": "두번째테스트",
    "recruitmentNum": 5,
    "deadline": "2024-12-31T23:59:59",
    "place": "강남",
    "period": 3,
    "tags": [
      "c",
      "c++"
    ],
    "likesCount": 0,
    "content": "두번째테스트",
    "comments": [],
    "postStatus": true,
    "timestamp": "2025-01-16T08:31:10.900805343",
    "savedFeed": false,
    "roles": {
      "frontend": 1,
      "backend": 2
    },
    "recruitmentRoles": {
      "backend": 1,
      "frontend": 0,
      "무관": 1
    }
  },
  {
    "pk": "5bd04ed7-a3f6-4a4e-b909-6e1ad6724fa9",
    "sk": "PROJECT",
    "nickname": "청갈치",
    "entityType": "FEED",
    "creatorId": "34f8fd4c-a001-7051-2a4e-64beb057470f",
    "title": "3",
    "recruitmentNum": 5,
    "deadline": "2024-12-31T23:59:59",
    "place": "강남",
    "period": 3,
    "tags": [
      "c",
      "c++"
    ],
    "likesCount": 0,
    "content": "3",
    "comments": [],
    "postStatus": true,
    "timestamp": "2025-01-14T14:24:14.8894676",
    "savedFeed": false,
    "roles": {
      "frontend": 1,
      "backend": 2
    },
    "recruitmentRoles": {
      "backend": 0,
      "frontend": 0
    }
  },
  {
    "pk": "b213afa5-cb05-413d-b934-6e30c46e68be",
    "sk": "PROJECT",
    "nickname": "청갈치",
    "entityType": "FEED",
    "creatorId": "34f8fd4c-a001-7051-2a4e-64beb057470f",
    "title": "USER#붙임",
    "recruitmentNum": 5,
    "deadline": "2024-12-31T23:59:59",
    "place": "강남",
    "period": 3,
    "tags": [
      "c",
      "c++"
    ],
    "likesCount": 0,
    "content": "USER#붙임",
    "comments": [],
    "postStatus": true,
    "timestamp": "2025-01-16T19:09:34.184155",
    "savedFeed": false,
    "roles": {
      "frontend": 1,
      "backend": 2
    },
    "recruitmentRoles": {
      "backend": 1,
      "frontend": 0,
      "무관": 2
    }
  },
  {
    "pk": "518d95b1-597f-4ecb-a214-9b1f9ed4f788",
    "sk": "PROJECT",
    "nickname": "청갈치",
    "entityType": "FEED",
    "creatorId": "34f8fd4c-a001-7051-2a4e-64beb057470f",
    "title": "첫테스트",
    "recruitmentNum": 5,
    "deadline": "2024-12-31T23:59:59",
    "place": "강남",
    "period": 3,
    "tags": [
      "c",
      "c++"
    ],
    "likesCount": 0,
    "content": "첫테스트",
    "comments": [],
    "postStatus": true,
    "timestamp": "2025-01-16T19:07:25.831017",
    "savedFeed": false,
    "roles": {
      "frontend": 1,
      "backend": 2
    },
    "recruitmentRoles": {
      "backend": 1,
      "frontend": 0
    }
  }
]
 

const refreshProjects = async () => {
  try {
    let response;

    if (selectedList === 'applied') {
      response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });
      setProjects(appliedproject);
    } else if (selectedList === 'written') {
      response = await axios.get('/my/writing', {
        params: {
          creatorId: user.id,
          sk: feedType
        }
      });
      setProjects(writtenProjects)
     
    } else if (selectedList === 'saved') {
      response = await axios.get('/my/temp', {
        params: {
          creatorId: user.id,
          feedType: feedType
        }
      });
      setProjects(dummySavedProjects);
    } else if (selectedList === 'interested') {
      response = await axios.get('/my/like', { 
        params: {
          userId: user.id,
          feedType: feedType
        }
      });
      setProjects(likeProjects);
    } else{
      setProjects(appliedproject);
    }
    if (response && response.data) {
      setProjects(response.data);
    } else {
  
      setProjects([]); 
    }
    
  } catch (error) {
  }
};


useEffect(() => {
  refreshProjects();
  // eslint-disable-next-line
}, [selectedList, user?.id, feedType]); 


  useEffect(() => {
    const fetchApplications = async (feedId) => {
      if (!feedId) {

        return; 
      }

      try {
        const response = await axios.get(`my/writing/application`, {
          params: {
            feedId: feedId
          }
        });

        if (response.data) {
          setApplications(response.data); 
        } else {
          setApplications([]);
        }
      } catch (error) {
        setApplications([]);
      }
    };

    if (selectedProject?.pk) {
      fetchApplications(selectedProject.pk);
    }
  }, [selectedProject]);



  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleListClick = (listType) => {
    setSelectedList(listType);
    setCurrentPage(1); 
    setSelectedProject(null); 

    if (listType === 'saved' || listType === 'closed' || listType === 'interested' || listType === 'applied' || listType === 'written') {
      setProjects([]);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);

  };
  

  const handleBackToList = () => {
    setSelectedProject(null);
  };


    const handleButtonClick = (project) => {
      if (!isProjectCompleted(project.pk)) {
          setIsFading(true);
          setTimeout(() => {
              handleProjectClick(project);
              setIsFading(false);
            
              localStorage.removeItem('completedProjects');
              
              setProjects(prevProjects => 
                  prevProjects.map(p => ({ ...p, completed: false }))
              );
          }, 100);
      } else {
      }
    };
  
     const isProjectCompleted = (projectId) => {
      const saved = localStorage.getItem('completedProjects');
      if (saved) {
        const completedArray = JSON.parse(saved);
        return completedArray.includes(projectId);
      }
      return false;
    };
  

const handleProjectClose = async (projectId, feedType) => {
    try {

        const requestData = {
            pk: projectId,
            sk: feedType  
        };

        await axios.patch('my/writing/close', requestData);
            
        setProjects(prevProjects => 
            prevProjects.map(project => 
                project.pk === projectId 
                    ? { ...project, isCompleted: true } 
                    : project
            )
        );
    } catch (error) {
        setShowAlertPopup('모집 완료 처리 중 문제가 발생했습니다.');
    }
};

const handleCancelApplication = async (userId, feedId) => {
    if (!userId || !feedId) {
      return;
    }
    setSelectedProjectForCancel({ userId, feedId });
    setIsConfirmModalOpen(true);
  };

const handleConfirmCancel = async () => {
    const { userId, feedId } = selectedProjectForCancel;
    try {
      const response = await axios.delete(`feed/apply-cancel?userId=${userId}&feedId=${feedId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200 || response.status === 204) {
        setProjects(prevProjects => 
          prevProjects.filter(project => project.feedId !== feedId)
        );
        if (refreshProjects) {
          await refreshProjects();
        }
        setShowAlertPopup('신청이 취소되었습니다.');
      } else {
        setShowAlertPopup('신청 취소에 실패했습니다.');
      }
      setIsConfirmModalOpen(false);
    } catch (error) {
      if (error.response) {
        setShowAlertPopup(`신청 취소 중 오류가 발생했습니다. (${error.response.data})`);
      } else {
        setShowAlertPopup(`신청 취소 중 오류가 발생했습니다. (${error.message})`);
      }
    }
  };

  const isProjectCanceled = (projectId) => {
    const project = currentProjects.find(p => p.feedId === projectId);
    return project ? project.canceled : false; 
  };


  

  const handleApplyClick = async (project) => {

    if (project && project.creatorId === user.id) {
      setShowAlertPopup("자신이 작성한 게시글에는 신청할 수 없습니다.");
      return; 
    }
  
    try {
      const response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });
  
      const appliedProjects = response.data.map(app => app.feedId); 
  
      const isAlreadyApplied = appliedProjects.includes(project.pk);
      if (isAlreadyApplied) {
        setShowApplyPopup("이미 신청한 프로젝트입니다."); 
        return; 
      }
    } catch (error) {

    }
  
    setApplySelectedProject(project);
    setIsRoleModalOpen(true); 
  };
  
  const handleApplySubmit = async (project, role) => {
    try {
      const applicationData = {
        pk: user.id,
        sk: applySelectedProject.pk,
        part: selectedRole,
        feedType: feedType
      };

      await axios.post('/main/application', applicationData);
      setShowApplyPopup("신청이 완료되었습니다.");
      setIsRoleModalOpen(false);
    } catch (error) {
      setShowApplyPopup("신청에 실패했습니다.");
    }
  };


  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
 


  return (
    <>
       <ContentsWrap>
       <MainContent Wide1030>
    
        <NavigationBar  showSearch={showSearch}  />

        <TabWrapType3 Border>
        {['applied', 'interested', 'written', 'saved', 'closed', 'profile'].map((tabType) => (
          <TabButtonType3
            key={tabType}
            onClick={() => handleListClick(tabType)}
            isActive={selectedList === tabType}
            className={selectedList === tabType ? "active" : ""}
          >
            {tabType === 'applied' && '신청 목록'}
            {tabType === 'interested' && '관심 목록'}
            {tabType === 'written' && '작성 목록'}
            {tabType === 'saved' && '임시 저장'}
            {tabType === 'closed' && '마감 목록'}
            {tabType === 'profile' && '개인 정보'}
          </TabButtonType3>
        ))}
      </TabWrapType3>

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
        <ProjectList isFading={isFading} selectedList={selectedList}>
          {selectedList === 'applied' ? (
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                나의 신청 목록 ({currentProjects.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {currentProjects.length === 0 ? (
                  <p style={{ gridColumn: '1 / -1' }}>신청한 프로젝트가 없습니다.</p>
                ) : (
                  currentProjects.map((project, index) => (
                    <ProjectItemColumnComponent
                      key={`applied-${project.pk || project.sk || index}`}
                      project={project}
                      user={user}
                      handleCancelApplication={handleCancelApplication}
                      isProjectCanceled={isProjectCanceled}
                    />
                  ))
                )}
              </div>
            </div>
          ) : selectedList === 'saved' ? (
            <>
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                나의 임시저장글({currentProjects.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}></div>
              {currentProjects.filter(project => project.savedFeed).length === 0 ? (
                <p>저장한 프로젝트가 없습니다.</p>
              ) : (
                currentProjects.filter(project => project.savedFeed).map((project, index) => (
                  <ProjectItemComponent 
                    key={`saved-${project.pk || project.sk || index}`}
                    project={project}
                    user={user}
                    handleCancelApplication={handleCancelApplication}
                    isProjectCanceled={isProjectCanceled}
                    isSaved={true}
                  />
                ))
              )}
              </div>
            </>
          ) : selectedList === 'interested' ? (
            <>
        
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                나의 관심 목록 ({currentProjects.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {currentProjects.filter(project => project.postStatus).length === 0 ? (
                <p>좋아요한 프로젝트가 없습니다.</p>
              ) : (
                currentProjects.filter(project => project.postStatus).map((project, index) => (
                  <ProjectLikeItem 
                    key={`interested-${project.pk || project.sk || index}`}
                    project={project}
                    user={user}
                    // handleProjectClick={handleProjectClick}
                    onApplyClick={handleApplyClick}
                 
                  />
                ))
              )}
              </div>
              </div>
            </>
          ) : selectedList === 'profile' ? (
            <UserProfile 
              // userProfile={userProfile}
              user={user} 
              setIsProfileVisible={setIsProfileVisible} 
              setShowAlertPopup={setShowAlertPopup}
            />
          ) : selectedList === 'written' ? (
            <>
              <div style={{ gridColumn: '1 / -1', width: '100%' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
                  나의 작성 목록 ({currentProjects.length})
                </h2>
                <div style={{ display: 'grid',  gap: '10px' }}>
                  {currentProjects.filter(project => project.postStatus).length === 0 ? (
                    <p>작성한 프로젝트가 없습니다.</p>
                  ) : (
                    currentProjects && currentProjects.map((project, index) => (
                      <ProjectItemComponent 
                        key={`written-${project.pk || project.sk || index}`}
                        project={project}
                        handleButtonClick={handleButtonClick}
                        isProjectCompleted={isProjectCompleted}
                        isSaved={false}
                      />  
                    ))
                  )}
                </div>
              </div>
            </>
          ) : ( <> 
          <div style={{ gridColumn: '1 / -1', width: '100%' }}> 
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0 30px 0' }}>
            나의 프로젝트 ({currentProjects.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
             {currentProjects.length === 0 ? (
                    <p>참여한 공모전이 없습니다.</p>
                  ) : (
                    currentProjects && currentProjects.map((project, index) => (
                      <ProjectDeadline
                      key={`deadline-${project.pk || project.sk || index}`}
                      project={project}
                   
                    />
                    ))
                  )}
          </div>
          </div>  
          </>
          )}
        </ProjectList>
      )} 

</MainContent>
</ContentsWrap>

      {selectedList !== 'profile' && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
                <Pagination 
                  currentPage={currentPage}
                  projectsPerPage={projectsPerPage}
                  totalProjects={projects.length}
                  onPageChange={paginate} 
                />
              </div>
            )}

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
              <h3 style={{ textAlign: 'center' }}>정말로 신청을 취소하시겠습니까?</h3>
              <ButtonContainer>
                <ModalButton onClick={handleConfirmCancel}>확인</ModalButton>
                <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton>
              </ButtonContainer>
            </Modal>
        

      <AlertModal
            isOpen={!!showAlertPopup}
            message={showAlertPopup}
            onClose={() => setShowAlertPopup(false)}
          />


      {showApplyPopup && (
      <Modal isOpen={showApplyPopup} onClose={() => setShowApplyPopup(false)}>
            <h3 style={{ textAlign: 'center',fontSize:'16px' }}>{showApplyPopup}</h3>
            <ButtonContainer>
              <ModalButton onClick={() => setShowApplyPopup(false)}>확인</ModalButton>
              {/* <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton> */}
            </ButtonContainer>
          </Modal>  

      )}

      <RoleSelectionModal
              isOpen={isRoleModalOpen}
              onClose={() => setIsRoleModalOpen(false)}
              project={applySelectedProject}
              selectedRole={selectedRole}
              handleRoleSelect={handleRoleSelect}
              handleApplySubmit={handleApplySubmit}
            />
          </>
   
  );
};

export default MyPage;

const TabWrapType3 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto; 
  white-space: nowrap; 
  max-width: 100%; 
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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ul {
      gap: 5px;

    }
    
  }
`;


const TabButtonType3 = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #000; // Default text color
  cursor: pointer;
  padding: 10px 20px; // Adjust padding as needed
  position: relative;
  margin-right: 25px;

  &.active {
    color: #00aeff; // Active tab color
    font-weight: bold; // Make active tab bold
  }

  &:hover {
    color: #00aeff; // Change color on hover
  }

  // Add underline effect for active tab
  &.active::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -0px; // Adjust position as needed
    transform: translateX(-50%);
    width: 80%; // Full width underline
    height: 2px; // Underline thickness
    background-color: #00aeff; // Underline color
  }
`;

const ProjectList = styled.div`
  margin-top: 20px;
  padding: 20px;
  padding-bottom: 0px;
  // border: 2px solid #A0DAFB;
  border-radius: 20px;
  // width:50vw;
  // max-width: 800px; 
  overflow-x: auto;
  transition: transform 0.5s ease;
  transform: ${(props) => (props.isFading ? 'translateX(100%)' : 'translateX(0)')};
  min-height: 700px;
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
  // gap: 20px;

  ${({ selectedList }) => (selectedList === 'applied' || selectedList === 'interested' ) && `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    

  `}

  
  ${({ selectedList }) => (selectedList === 'applied' || selectedList === 'saved' || selectedList === 'interested' || selectedList === 'profile' || selectedList === 'written') && `
    border: none;
    padding: 3px;
  `}
  ${({ selectedList }) => (selectedList === 'profile') && `
    min-height: 1000px;
  `}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    grid-template-columns: 1fr;
  }
`;



const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #a0dafb;
  }
`;
