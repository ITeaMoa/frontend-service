import React, { useEffect, useState,  } from 'react';
import styled from 'styled-components';
import NavigationBar from "../../../components/NavigationBar";
// import axios from 'axios';
import ProjectDetail from '../components/ProjectDetail';
// import ProjectListComponent from './ProjectListComponent_del';
import { useAuth } from '../../../context/AuthContext'
import axios from '../../../api/axios';
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../../../Atoms.jsx/AtomStates';
import Pagination from '../../../components/Pagination';
import Modal from '../../../components/Modal';
import ProjectItemComponent from '../components/ProjectItemComponent';
import UserProfile from '../components/UserProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import AlertModal from '../../../components/AlertModal';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import ProjectLikeItem from '../components/ProjectLikeItem';
import ProjectItemColumnComponent from '../components/ProjectItemColumnComponent';
import RoleSelectionModal from '../../../components/RoleSelectionModal';

const MyPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); 
  const [selectedList, setSelectedList] = useState('applied');
  const [selectedProject, setSelectedProject] = useState(null);
  const [applySelectedProject, setApplySelectedProject] = useState(null);
  // const isLoggedIn = true; 
  const showSearch = false;
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const [feedType, ] = useAtom(feedTypeAtom);
  const [applications, setApplications] = useState([]); // 지원자 정보를 위한 새로운 state
  const [isFading, setIsFading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProjectForCancel, setSelectedProjectForCancel] = useState(null);
  const [, setIsProfileVisible] = useState(false);
  // const [userProfile, setUserProfile] = useState({});
  // const [savedProjects, setSavedProjects] = useState([]);
  // const [likedProjects, setLikedProjects] = useState([]);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [showApplyPopup, setShowApplyPopup] = useState(''); 
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = '';

  // user.id를 콘솔에 출력
useEffect(() => {
  if (user) {
    console.log('User ID:', user.id); // 로그인한 사용자 ID 출력
  } else {
    console.log('사용자가 로그인하지 않았습니다.');
  }
}, [user]); // user가 변경될 때마다 실행

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

const likeProjects = [ // 더미 데이터 업데이트
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
 
// 그냥 일반 함수로 작성
const refreshProjects = async () => {
  try {
    let response;
    console.log('selectedList', selectedList);
    
    if (selectedList === 'applied') {
      // response = await axios.get('/feed/applications', {
      //   params: {
      //     userId: user.id,
      //   }
      // });
      setProjects(appliedproject);
    } else if (selectedList === 'written') {
      // response = await axios.get('/my/writing', {
      //   params: {
      //     creatorId: user.id,
      //     sk: feedType
      //   }
      // });
      setProjects(writtenProjects)
     
    } else if (selectedList === 'saved') {
      // response = await axios.get('/my/temp', {
      //   params: {
      //     creatorId: user.id,
      //     feedType: feedType
      //   }
      // });
      setProjects(dummySavedProjects);
    } else if (selectedList === 'interested') {
      // response = await axios.get('/my/like', { 
      //   params: {
      //     userId: user.id,
      //     feedType: feedType
      //   }
      // });
      setProjects(likeProjects);
    }

    console.log(`${selectedList} 목록:`, response.data);
    if (response && response.data) {
      setProjects(response.data);
      console.log('프로젝트 데이터 로드 성공:', response.data);
    } else {
      console.error('응답 데이터가 없습니다:', response);
      setProjects([]); // 빈 배열로 초기화
    }
    
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

// useEffect에서 사용
useEffect(() => {
  refreshProjects();
}, [selectedList, user?.id, feedType]); // refreshProjects는 의존성 배열에서 제거

//신청목록
  useEffect(() => {
    const fetchApplications = async (feedId) => {
      if (!feedId) {
        console.error('feedId is undefined. Cannot fetch applications.');
        return; // feedId가 없으면 요청을 보내지 않음
      }

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
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // console.log('Page changed to:', pageNumber);
    // console.log('Showing projects:', indexOfFirstProject, 'to', indexOfLastProject);
  };


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

    // 특정 리스트 타입에 대해 프로젝트를 빈 배열로 설정
    if (listType === 'saved' || listType === 'closed' || listType === 'interested' || listType === 'applied' || listType === 'written') {
      setProjects([]); // 프로젝트를 빈 배열로 설정
    }
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

    // //  userProfile 불러오기
    // useEffect(() => {
    //   const fetchUserProfile = async () => {
    //     try {
    //       if (user && user.id) {
    //         const response = await axios.get(`/my/profile/${user.id}`);
    //         console.log('사용자 프로필:', response.data);
    //         if (response.data) {
    //           setUserProfile(response.data);
    //         } else {
    //           setUserProfile({
    //             avatarUrl: '',
    //             headLine: '',
    //             tags: [],
    //             experiences: [],
    //             educations: [],
    //             personalUrl: ''
    //           });
    //         }
    //       }
    //     } catch (error) {
    //       console.error('사용자 프로필 조회 중 오류 발생:', error);
    //     }
    //   };
  
    //   fetchUserProfile();
    // }, [user, setUserProfile]);
// UserProfile.js
// useEffect(() => {
//   const fetchUserProfile = async () => {
//       try {
//           if (user && user.id) {
//               // MainPage와 동일한 형식으로 API 호출
//               const response = await axios.get(`/my/profile/${user.id}`);
//               console.log('사용자 프로필:', response.data);
//               if (response.data) {
//                   setUserProfile(response.data);
//               } else {
//                   setUserProfile({
//                       avatarUrl: '',
//                       headLine: '',
//                       tags: [],
//                       experiences: [],
//                       educations: [],
//                       personalUrl: ''
//                   });
//               }
//           }
//       } catch (error) {
//           console.error('사용자 프로필 조회 중 오류 발생:', error);
//       }
//   };

//   fetchUserProfile();
// }, [user]);

    // 프로젝트 완료 처리 함수 수정
    const handleButtonClick = (project) => {
      // 프로젝트가 완료되지 않은 경우에만 완료 처리
      if (!isProjectCompleted(project.pk)) {
          setIsFading(true);
          setTimeout(() => {
              handleProjectClick(project);
              setIsFading(false);
              
              // localStorage에서 완료된 프로젝트 목록 초기화
              localStorage.removeItem('completedProjects'); // 완료된 프로젝트 목록 삭제
              
              // 모든 프로젝트의 완료 상태를 초기화
              setProjects(prevProjects => 
                  prevProjects.map(p => ({ ...p, completed: false })) // 모든 프로젝트의 completed 상태를 false로 설정
              );
          }, 100);
      } else {
          console.log("이미 완료된 프로젝트입니다."); // 디버깅용 로그
      }
    };
  
     // 프로젝트 상태 확인 함수 추가
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
        // 문제: feedType이 객체 형태로 전달되고 있음
        const requestData = {
            pk: projectId,
            sk: feedType  
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
        setShowAlertPopup('모집 완료 처리 중 문제가 발생했습니다.');
    }
};

const handleCancelApplication = async (userId, feedId) => {
    if (!userId || !feedId) {
      console.error("userId 또는 feedId가 null입니다.");
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
      console.error('오류 세부정보:', error);
      if (error.response) {
        setShowAlertPopup(`신청 취소 중 오류가 발생했습니다. (${error.response.data})`);
      } else {
        setShowAlertPopup(`신청 취소 중 오류가 발생했습니다. (${error.message})`);
      }
    }
  };

  const isProjectCanceled = (projectId) => {
    const project = currentProjects.find(p => p.feedId === projectId);
    return project ? project.canceled : false; // canceled 상태 확인
  };


  

  const handleApplyClick = async (project) => {
    // if (!user) { 
    //   setPopupMessage("로그인 후에 신청할 수 있습니다."); 
    //   setIsSubmitted(true); 
    //   return; 
    // }

    // 자신이 작성한 게시글인지 확인
    if (project && project.creatorId === user.id) {
      // alert("자신이 작성한 게시글에는 신청할 수 없습니다."); 
      setShowAlertPopup("자신이 작성한 게시글에는 신청할 수 없습니다.");
      return; 
    }
  
    try {
      const response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });
  
      const appliedProjects = response.data.map(app => app.feedId); // 신청한 프로젝트의 feedId 목록
  
      // 선택한 프로젝트의 pk와 비교
      const isAlreadyApplied = appliedProjects.includes(project.pk);
      if (isAlreadyApplied) {
        setShowApplyPopup("이미 신청한 프로젝트입니다."); 
        // setPopupMessage("이미 신청한 프로젝트입니다."); // 이미 신청한 경우 메시지 설정
        // setIsSubmitted(true); // 제출 확인 팝업 표시
        return; // Exit the function if already applied
      }
    } catch (error) {
      console.error("신청 여부 확인 실패:", error);
    }
  
    // setProject(project); // 선택한 프로젝트 상태 저장
    console.log('선택한 프로젝트:', selectedProject);
    setApplySelectedProject(project);
    setIsRoleModalOpen(true); // 역할 선택 모달 열기
  };
  
  // 프로젝트 신청 처리
  const handleApplySubmit = async (project, role) => {
   
   
    try {
      const applicationData = {
        pk: user.id,
        sk: applySelectedProject.pk,
        part: selectedRole,
        feedType: feedType
      };
      console.log('applicationData:', applicationData);
      await axios.post('/main/application', applicationData);
      setShowApplyPopup("신청이 완료되었습니다.");
      setIsRoleModalOpen(false);
    } catch (error) {
      console.error("신청 실패:", error);
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
          ) : (

      
            
            <ProjectList></ProjectList>
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


// Define the styled component for the tab button
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

  //  ${({ selectedList }) => (selectedList === 'applied'  ) && `
  //  margin-top

  // `}
  
  ${({ selectedList }) => (selectedList === 'applied' || selectedList === 'saved' || selectedList === 'interested' || selectedList === 'profile') && `
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
  background-color: ${props => props.disabled ? '#808080' : '#3563E9'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  right: 15px;
  bottom: 30px;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    background-color: ${props => props.disabled ? '#808080' : '#a0dafb'};
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
