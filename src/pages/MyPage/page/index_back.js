import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Nav from "../../../components/Nav";
// import axios from 'axios';
import ProjectDetail from './ProjectDetail';
import ProjectListComponent from '../component/ProjectListComponent';
import { useAuth } from '../../../context/AuthContext'
import axios from '../../../api/axios';
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../../../Atoms.jsx/AtomStates';


const MyPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); 
  const [selectedList, setSelectedList] = useState('applied');
  const [selectedProject, setSelectedProject] = useState(null);
  // const isLoggedIn = true; 
  const showSearch = false;
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [applications, setApplications] = useState([]); // 지원자 정보를 위한 새로운 state

  // user.id를 콘솔에 출력
useEffect(() => {
  if (user) {
    console.log('User ID:', user.id); // 로그인한 사용자 ID 출력
  } else {
    console.log('사용자가 로그인하지 않았습니다.');
  }
}, [user]); // user가 변경될 때마다 실행

// const handleToggleChange = (newFeedType) => {
//   setFeedType(newFeedType); // feedType 업데이트
//   console.log("현재 feedType:", newFeedType); // 콘솔에 현재 feedType 출력
// };


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
    "pk": "914e8da3-b10b-41dd-b959-2e5cf634e692",
    "sk": "PROJECT",
    "nickname": "알파카",
    "entityType": "FEED",
    "creatorId": "04e8ddec-70d1-702c-9257-1f0078fe9c83",
    "title": "이색동물 키우는 사람~~",
    "recruitmentNum": 4,
    "deadline": "2025-07-16T00:00:00",
    "place": "죽전역",
    "period": 5,
    "tags": [
      "웹",
      "AWS",
      "React",
      "Spring Boot",
      "Git",
      "모바일"
    ],
    "likesCount": 2,
    "content": "알파카랑 카피바라같이 이색동물 키우는 사람들의 모임어플을 만들려고 합니다. 서로 자기 동물 자랑하면 재밌을것같아용\n산책이나 모임, 먹이 공유 같은 기능을 만들어보려고 합니다^^",
    "comments": [],
    "postStatus": true,
    "timestamp": "2025-02-03T13:30:26.152048694",
    "savedFeed": false,
    "roles": {
      "백엔드": 2,
      "프론트엔드": 2
    },
    "recruitmentRoles": {
      "백엔드": 1,
      "프론트엔드": 1,
      "무관": 0
    }
  }
];

//진짜ㅏㅏㅏㅏㅏㅏ
// useCallback을 사용하여 함수 메모이제이션
// const refreshProjects = useCallback(async () => {
//   if (!user) return; // 사용자가 없으면 실행하지 않음

//   try {
//     if (selectedList === 'applied') {
//       const response = await axios.get('/feed/applications', {
//         params: {
//           userId: user.id,
//         }
//       });
//       console.log("Fetched applied projects:", response.data);
//       setProjects(response.data || []);
//     } else if (selectedList === 'written') {
//       const params = {
//         creatorId: user.id,
//         // creatorId:'null',
//         sk: feedType
//       };
//       const response = await axios.get('/my/writing', { params });
//       setProjects(response.data || []);
//     }
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     // setProjects([]); // 이전 상태를 유지하는 것이 더 나은 사용자 경험일 수 있음
//     // setProjects(prevProjects => prevProjects); // 이전 상태 유지
//   }
// }, [user, selectedList, feedType]); // 필요한 의존성만 포함

// // 초기 데이터 로드를 위한 useEffect
// useEffect(() => {
//   refreshProjects();
// }, [ selectedList, user?.id, feedType, refreshProjects]); // refreshProjects 추가



// useCallback을 사용하여 함수 메모이제이션
const refreshProjects = useCallback(async () => {
  // if (!user) return; // 사용자가 없으면 실행하지 않음

  try {
  
    if (selectedList === 'applied') {
      const response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });
      console.log("Fetched applied projects:", response.data);
      setProjects(response.data || []);
    } else if (selectedList === 'written') {
      const params = {
        creatorId: user.id,
        sk: feedType
      };
      const response = await axios.get('/my/writing', { params });
      setProjects(response.data || []);
    } else if (selectedList === 'saved') {
      // 저장된 프로젝트를 가져오는 API 호출
      setProjects(dummySavedProjects); // 더미 데이터 사용
    } else if (selectedList === 'interested') {
      // 좋아요한 프로젝트를 가져오는 API 호출
      setProjects(likeProjects); // 더미 데이터 사용
    }

    // setProjects(fetchedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    // setProjects([]); // 이전 상태를 유지하는 것이 더 나은 사용자 경험일 수 있음
  }
}, [user, selectedList, feedType]); // 필요한 의존성만 포함

// 초기 데이터 로드를 위한 useEffect
useEffect(() => {
  refreshProjects();
}, [selectedList, user?.id, feedType, refreshProjects]); // refreshProjects 추가

  // 선택된 목록이 변경될 때 신청 프로젝트를 가져오는 새로운 useEffect
 
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
    console.log('Page changed to:', pageNumber);
    console.log('Showing projects:', indexOfFirstProject, 'to', indexOfLastProject);
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
        alert('모집 완료 처리 중 문제가 발생했습니다.');
    }
};



  return (
    <Container>
      {/* <Nav  showSearch={showSearch}  onToggleChange={handleToggleChange}/> */}
      <Nav  showSearch={showSearch}  />

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
          currentPage={currentPage}
          refreshProjects={refreshProjects}
          // setPopupMessage={setPopupMessage}
          // project={selectedProject}
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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ul {
      gap: 5px;

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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
`;



