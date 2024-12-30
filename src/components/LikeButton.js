//사용자 좋아요 ui와 이벤트 처리


import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import axios from 'axios';
// import axios from '../api/axios'


const LikeButton = ({ initialLiked, initialLikesCount, onLikeChange, buttonStyle, apiEndpoint, userId, sk }) => {
  const [liked, setLiked] = useState(() => {
    const storedLiked = localStorage.getItem(`liked_${userId}_${sk}`);
    return storedLiked === 'true' ? true : initialLiked; // 올바른 초기화 보장
  });
  const [likesCount, setLikesCount] = useState(() => {
    const storedLikesCount = localStorage.getItem(`likesCount_${userId}_${sk}`);
    return storedLikesCount ? Math.abs(parseInt(storedLikesCount, 10)) : Math.abs(initialLikesCount); // 음수일 경우 절대값으로 초기화
  });

  // props가 변경될 때 상태 업데이트
  useEffect(() => {
    const storedLiked = localStorage.getItem(`liked_${userId}_${sk}`);
    setLiked(storedLiked === 'true' ? true : initialLiked);
    setLikesCount(initialLikesCount);
  }, [initialLiked, initialLikesCount, userId, sk]);

  const handleClick = async (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    const newLiked = !liked;
    const newLikesCount = newLiked ? likesCount + 1 : Math.max(likesCount - 1, 0);

    // API 호출 및 로컬 스토리지 업데이트
    const likeData = {
        pk: userId,
        sk: sk,
        feedType: "PROJECT"
    };

    try {
        if (newLiked) {
            // 좋아요 추가
            const response = await axios.post(apiEndpoint, likeData);
            console.log('좋아요 추가 성공:', response.data); // API 응답 로그
        } else {
            // 좋아요 제거
            const response = await axios.delete(apiEndpoint, { data: likeData });
            console.log('좋아요 제거 성공:', response.data); // API 응답 로그
        }

        // 상태 업데이트
        setLiked(newLiked);
        setLikesCount(newLikesCount < 0 ? 0 : newLikesCount);
        if (onLikeChange) {
            onLikeChange(newLiked, newLikesCount);
        }

        // 상태를 로컬 스토리지에 저장
        localStorage.setItem(`liked_${userId}_${sk}`, newLiked);
        localStorage.setItem(`likesCount_${userId}_${sk}`, newLikesCount);
    } catch (error) {
        console.error('Error updating like status:', error);
        // 상태를 원래대로 되돌리기
        setLiked(liked); // 원래 상태로 복원
        setLikesCount(likesCount); // 원래 likesCount로 복원
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
