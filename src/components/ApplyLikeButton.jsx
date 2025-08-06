//사용자 좋아요 ui와 이벤트 처리
import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
// import axios from 'axios';
import axios from '../api/axios'
import { useAtom } from 'jotai';
import { likedProjectsAtom, IS_LOGGED_IN, USER, feedTypeAtom } from '../Atoms.jsx/AtomStates';  
import { useAuth } from '../context/AuthContext'; // AuthContext에서 useAuth 가져오기


const ApplyLikeButton = ({ initialLiked, initialLikesCount, onLikeChange, buttonStyle, userId, sk,  }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  // const [isLoggedIn, setIsLoggedIn] = useAtom(IS_LOGGED_IN);
  const { isLoggedIn: authIsLoggedIn } = useAuth(); // AuthContext에서 isLoggedIn 가져오기 //나중에 넣기
  // const [user, setUser] = useAtom(USER);
  const [likedProjects, setLikedProjects] = useAtom(likedProjectsAtom);
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [allProjects, setAllProjects] = useState([]);
  const { user } = useAuth();
  const location = useLocation(); // 현재 경로를 가져옵니다.

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

// useEffect(() => {
//   setLikesCount(initialLikesCount);
// }, [initialLikesCount]);
 // useCallback 없이 일반 함수로 작성 //uscecallback없이 작성성
 const fetchUserLikeStatus = async () => {
    try {
      // 1. 좋아요 수는 항상 가져옴
      const feedResponse = await axios.get(`/main?feedType=${feedType}`);
      if (feedResponse.data) {
        const thisFeed = feedResponse.data.find(feed => feed.pk === sk);
        if (thisFeed) {
          setLikesCount(thisFeed.likesCount || 0);
        } else {
          setLikesCount(0);
        }
      }

      // 2. 로그인한 경우에만 내 좋아요 상태 확인
      if (user && user.id) {
        const likeResponse = await axios.get(`/main/like?userId=${user.id}`);
        const userLiked = likeResponse.data.some(like => like.sk === sk);
        setLiked(userLiked);
      } else {
        setLiked(false);
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  }

useEffect(() => {
  fetchUserLikeStatus();
}, [user, sk, authIsLoggedIn, feedType, location.pathname]);
   
// useEffect 수정

  const handleClick = async (e) => {
    if (!user) return;
    e.stopPropagation();

    const likeData = { pk: user?.id, sk, feedType };

    try {
      if (!liked) {
        // 좋아요 추가
        console.log('좋아요 추가');
        const checkResponse = await axios.get(`/main/like?userId=${user.id}`);
        const isAlreadyLiked = checkResponse.data.some(like => like.sk === sk);
        if (isAlreadyLiked) {
          console.log('이미 좋아요가 눌린 상태입니다');
          return;
        }
        await axios.post(`/main/like`, likeData);
      } else {
        // 좋아요 취소
        console.log('좋아요 취소');
        await axios.delete(`/main/like`, { data: likeData });
      }

      // 서버에서 최신 상태로 동기화
      await fetchUserLikeStatus();
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  

  return (
    <Button onClick={handleClick} buttonStyle={buttonStyle}>
      <FontAwesomeIcon
        icon={liked ? faHeart : regularHeart}
        style={{
          color: liked ? '#00aeff' : '#00aeff',
          marginRight: '6px',
          fontSize: '16px',
          verticalAlign: 'middle'
        }}
      />
      <span
        style={{
          color: '#00aeff',
          fontSize: '16px',
          verticalAlign: 'middle'
        }}
      >
        좋아요 {likesCount}
      </span>
    </Button>
  );
};

const Button = styled.div`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  box-shadow: none;
  font-family: inherit;
`;

export default ApplyLikeButton;

