//사용자 좋아요 ui와 이벤트 처리
import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
// import axios from 'axios';
import axios from '../api/axios'
import { useAtom } from 'jotai';
import { likedProjectsAtom, IS_LOGGED_IN, USER } from '../Atoms.jsx/AtomStates';  
import { useAuth } from '../context/AuthContext'; // AuthContext에서 useAuth 가져오기


const LikeButton = ({ initialLiked, initialLikesCount, onLikeChange, buttonStyle, userId, sk, feedType }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  // const [isLoggedIn, setIsLoggedIn] = useAtom(IS_LOGGED_IN);
  const { isLoggedIn: authIsLoggedIn } = useAuth(); // AuthContext에서 isLoggedIn 가져오기 //나중에 넣기
  // const [user, setUser] = useAtom(USER);
  const [likedProjects, setLikedProjects] = useAtom(likedProjectsAtom);
  const [allProjects, setAllProjects] = useState([]);
  const { user } = useAuth();

  // // 사용자 좋아요 상태를 API 호출로 가져오기
  // const fetchUserLikeStatus = useCallback(async () => {
  //   if (!userId || !sk) return; // userId와 sk가 없으면 종료
  //   try {
  //     const response = await axios.get(`/main/like?userId=${userId}`);
  //     if (response.data) {
  //       console.log('사용자 좋아요 상태ㅇㅇㅇㅇㅇ:', response.data); // API 응답을 콘솔에 출력
        
  //       // 사용자가 좋아요를 눌렀던 피드의 sk가 현재 버튼의 sk와 일치하는지 확인
  //       const userLiked = response.data.some(like => like.sk === sk);
  //       setLiked(userLiked); // liked 상태 설정
  //       //아톰으로 추가한거 -> 테스 해볼것것: 메인페이지와 연동해서?
  //       setLikedProjects(prevLikedProjects => [
  //         ...prevLikedProjects,
  //         { id: user.id, liked: userLiked, likesCount: likesCount }
  //       ]);   //
  //       // setLikesCount(response.data.length); // 총 좋아요 수 설정 (여기서는 단순히 길이로 설정)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user like status:', error);
  //   }
  // }, [userId, sk,isLoggedIn,user,feedType]);

  // // 컴포넌트가 마운트될 때 사용자 좋아요 상태를 가져옴
  // useEffect(() => {
  //   fetchUserLikeStatus();
  // }, [fetchUserLikeStatus]);


 // useCallback 없이 일반 함수로 작성 //uscecallback없이 작성성
const fetchUserLikeStatus = async () => {
  if (!user?.id || !sk) return;
  try {
    const response = await axios.get(`/main/like?userId=${user.id}`);
    if (response.data) {
      console.log('사용자 좋아요 상태:', response.data);
      
      // 사용자가 좋아요를 눌렀던 피드의 sk가 현재 버튼의 sk와 일치하는지 확인
      console.log('response.data:', response.data);
      const userLiked = response.data.some(like => like.sk === sk);
      setLiked(userLiked);
      console.log('userLiked:', userLiked);

      setLikedProjects(prevLikedProjects => [
        ...prevLikedProjects,
        { id: user.id, liked: userLiked, likesCount: likesCount }
      ]);
    }
  } catch (error) {
    console.error('Error fetching user like status:', error);
  }
};


    // // Section2 관련 API 호출 함수들을 MainPage로 이동
//     const fetchAllProjects = useCallback(async () => {
//       try {
//         const response = await axios.get(`/main?feedType=${feedType}`);
//         if (!response.data || response.data.length === 0) {
//           setAllProjects([]);
//           return;
//         }

//   //   const projectsWithLikes = response.data.map((project) => ({
//   //     ...project,
//   //     // creatorId: project.creatorId,
//   //     // atom의 상태를 사용하여 좋아요 여부 확인
//   //     liked: likedProjects.some(
//   //         likedProject => likedProject.id === project.id && likedProject.liked
//   //     ),
//   //     // likesCount: project.likesCount || 0  //있는지 없는지 확인인
//   // }));
//   setAllProjects(response.data);
//       } catch (error) {
//         console.error('프로젝트 가져오기 실패:', error);
//       }
//     }, [feedType, likedProjects]);

//  useEffect(() => {
//     fetchAllProjects();
//   }, [fetchAllProjects, feedType]);


// const fetchUserLikeStatus = async () => {
//   // 조건문 수정
//   if (!user?.id || !sk) {
//       return;
//   }

//   try {
//     // 프로젝트 데이터 가져오기
//     const projectsResponse = await axios.get(`/main?feedType=${feedType}`);
//     if (!projectsResponse.data || projectsResponse.data.length === 0) {
//       setAllProjects([]);
//       return;
//     }
//     setAllProjects(projectsResponse.data);

//       // 좋아요 상태 가져오기
//     if (user?.id && sk) {
//       const likeResponse = await axios.get(`/main/like?userId=${user.id}`);
//       console.log('좋아요 응답:', likeResponse.data);
//       if (likeResponse.data) {
//         // 사용자의 좋아요 상태 확인
//         const userLiked = likeResponse.data.some(like => like.sk === sk);

//         // 프로젝트의 좋아요 상태 확인
//         const projectLiked = projectsResponse.data.some(project => project.sk === sk);
        
//         // 두 상태가 일치하는지 확인
//         if (userLiked === projectLiked) {
//           setLiked(userLiked);
//           // 좋아요 수 설정
//           const likesCount = likeResponse.data.filter(like => like.sk === sk).length;
//           console.log('좋아요 수:', likesCount);
//           setLikesCount(likesCount);
//         } else {
//           console.log('좋아요 상태 불일치:', { userLiked, projectLiked });
//         }
//       }
//     }
//   } catch (error) {
//       console.error('좋아요 상태 조회 실패:', error);
//   }
// };

// useEffect 수정
useEffect(() => {
  fetchUserLikeStatus();
}, [user,sk, authIsLoggedIn, user, feedType]);


  const handleClick = async (e) => {
    if(!user) {
      return;
    }
    e.stopPropagation(); // 이벤트 전파 방지
    const newLiked = !liked;
    console.log('newLiked:', newLiked);
    const newLikesCount = newLiked ? likesCount + 1 : Math.max(likesCount - 1, 0);
    console.log('newLikesCount:', newLikesCount);

    // API 호출 및 상태 업데이트
    const likeData = {
      pk: user?.id,
      sk: sk,
      feedType: feedType
    };

    try {

      const checkResponse = await axios.get(`/main/like?userId=${user.id}`);
        const isAlreadyLiked = checkResponse.data.some(like => like.sk === sk);
        
        // 좋아요 추가 시에만 중복 체크
        if (isAlreadyLiked && !liked) {
            console.log('이미 좋아요가 눌린 상태입니다');
            return;
        }
      if (newLiked) {
        // 좋아요 추가
        await axios.post(`/main/like`, likeData);
        console.log('좋아요 추가 성공');
      } else {
        // 좋아요 제거
        await axios.delete(`/main/like`, { data: likeData });
        console.log('좋아요 제거 성공');
        // setLikesCount(newLikesCount - (newLiked ? 1 : -1));
        const response = await axios.get(`/main/like?userId=${user.id}`);
        console.log('서버 응답ㅅㄹㄹㄹㄹㄹㄹㄹㄹㄹ:', response.data);
      }

      // 상태 업데이트
      setLiked(newLiked);
      console.log('newLiked:', newLiked);
      // 좋아요 상태 다시 가져오기
    //  fetchUserLikeStatus();
      setLikesCount(newLikesCount);
      console.log('현재 liked:', newLiked, '현재 likesCount:', newLikesCount); // 상태 확인
      
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };


  // const handleClick = async (e) => {
  //   e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
  //   const newLiked = !liked;
  //   const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;

  //   setLiked(newLiked);
  //   setLikesCount(newLikesCount);
  //   if (onLikeChange) {
  //     onLikeChange(newLiked, newLikesCount); // 이벤트 객체 생략
  //   }

  //   // API 호출
  //   const data = {
  //     pk: userId,
  //     sk: sk, // sk 변수가 정의되어야 합니다.
  //     feedType: "PROJECT"
  //   };

  //   try {
  //     if (newLiked) {
  //       // 좋아요 추가
  //       await axios.post(apiEndpoint, data);
  //     } else {
  //       // 좋아요 제거
  //       await axios.delete(apiEndpoint, { data });
  //     }
  //   } catch (error) {
  //     console.error('Error updating like status:', error);
  //     // 상태를 원래대로 되돌리기
  //     setLiked(!newLiked);
  //     setLikesCount(newLikesCount - (newLiked ? 1 : -1));
  //   }
  // };





    



  return (
    <Button onClick={handleClick} buttonStyle={buttonStyle}>
      <FontAwesomeIcon icon={liked || likesCount > 0 ? faHeart : regularHeart} style={{ color: liked || likesCount > 0 ? 'red' : 'white', marginRight: '4px' }} />
      {Math.abs(likesCount)}
    </Button>
  );
};

const Button = styled.div`
  border: 1px solid #ddd;
  padding: 2px 8px;
  // width: 50px;
  border-radius: 15px;
  color: white;
  font-weight: bold;
  background-color: #C4C4C4;
  cursor: pointer;
  float: right;
  margin-top: -24px;

  &:hover {
    background-color: #A0DAFB; 
  }

  ${({ buttonStyle }) => buttonStyle === 's1' && `
    margin-top:0px;

  `}


  ${({ buttonStyle }) => buttonStyle === 'apply' && `
    transform: translate(400px,60px);

  `}
`;

export default LikeButton;
