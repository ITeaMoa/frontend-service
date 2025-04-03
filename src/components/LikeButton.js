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



const LikeButton = ({ initialLiked, initialLikesCount, onLikeChange, buttonStyle, userId, sk, feedType }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoggedIn, setIsLoggedIn] = useAtom(IS_LOGGED_IN);
  const [user, setUser] = useAtom(USER);

  // 사용자 좋아요 상태를 API 호출로 가져오기
  const fetchUserLikeStatus = useCallback(async () => {
    if (!userId || !sk) return; // userId와 sk가 없으면 종료
    try {
      const response = await axios.get(`/main/like?userId=${userId}`);
      if (response.data) {
        console.log('사용자 좋아요 상태ㅇㅇㅇㅇㅇ:', response.data); // API 응답을 콘솔에 출력
        
        // 사용자가 좋아요를 눌렀던 피드의 sk가 현재 버튼의 sk와 일치하는지 확인
        const userLiked = response.data.some(like => like.sk === sk);
        setLiked(userLiked); // liked 상태 설정
        // setLikesCount(response.data.length); // 총 좋아요 수 설정 (여기서는 단순히 길이로 설정)
      }
    } catch (error) {
      console.error('Error fetching user like status:', error);
    }
  }, [userId, sk,isLoggedIn,user,feedType]);

  // 컴포넌트가 마운트될 때 사용자 좋아요 상태를 가져옴
  useEffect(() => {
    fetchUserLikeStatus();
  }, [fetchUserLikeStatus]);

  const handleClick = async (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    const newLiked = !liked;
    const newLikesCount = newLiked ? likesCount + 1 : Math.max(likesCount - 1, 0);

    // API 호출 및 상태 업데이트
    const likeData = {
      pk: userId,
      sk: sk,
      feedType: feedType
    };

    try {
      if (newLiked) {
        // 좋아요 추가
        await axios.post(`/main/like`, likeData);
        console.log('좋아요 추가 성공');
      } else {
        // 좋아요 제거
        await axios.delete(`/main/like`, { data: likeData });
        console.log('좋아요 제거 성공');
      }

      // 상태 업데이트
      setLiked(newLiked);
      // 좋아요 상태 다시 가져오기
     fetchUserLikeStatus();
      setLikesCount(newLikesCount);
      console.log('현재 liked:', newLiked, '현재 likesCount:', newLikesCount); // 상태 확인
      if (onLikeChange) {
        onLikeChange(newLiked, newLikesCount);
      }

      // // 현재 URL 확인
      // const currentPath = window.location.pathname;
      // const excludedPaths = ['/ApplyPage']; // 새로고침을 방지할 페이지 목록

      // // 특정 페이지가 아닐 경우에만 새로고침
      // if (!excludedPaths.includes(currentPath)) {
      //   window.location.reload(); // 좋아요 클릭 후 페이지 새로고침
      // }
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
      <FontAwesomeIcon icon={liked ? faHeart : regularHeart} style={{ color: liked ? 'red' : 'white', marginRight: '4px' }} />
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
