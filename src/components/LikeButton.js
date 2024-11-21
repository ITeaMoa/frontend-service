import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
// import axios from 'axios';


const LikeButton = ({ initialLiked, initialLikesCount, onLikeChange, buttonStyle }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  // props가 변경될 때 상태 업데이트
  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(initialLikesCount);
  }, [initialLiked, initialLikesCount]);



const handleClick = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    const newLiked = !liked;
    const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;

    setLiked(newLiked);
    setLikesCount(newLikesCount);
    if (onLikeChange) {
      onLikeChange(newLiked, newLikesCount); // 이벤트 객체 생략
    }

    // // API 호출
    // try {
    //   const data = {
    //     pk: pk,
    //     sk: sk,
    //     feedType: "PROJECT"
    //   };

    //   if (newLiked) {
    //     // 좋아요 추가
    //     await axios.post('http://localhost:8080/main/like', data);
    //   } else {
    //     // 좋아요 제거
    //     await axios.delete('http://localhost:8080/main/like', { data });
    //   }
    // } catch (error) {
    //   console.error('Error updating like status:', error);
    //   // 상태를 원래대로 되돌리기
    //   setLiked(!newLiked);
    //   setLikesCount(newLikesCount - (newLiked ? 1 : -1));
    // }

    
};


  return (
    <Button onClick={handleClick} buttonStyle={buttonStyle}>
      <FontAwesomeIcon icon={liked ? faHeart : regularHeart} style={{ color: liked ? 'red' : 'white', marginRight: '4px' }} />
      {likesCount}
    </Button>
  );
};

const Button = styled.div`
  border: 1px solid #ddd;
  padding: 2px 4px;
  width: 50px;
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
