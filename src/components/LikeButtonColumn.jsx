//사용자 좋아요 ui와 이벤트 처리
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import axios from '../api/axios'
import { useAtom } from 'jotai';
import { likedProjectsAtom, feedTypeAtom } from '../Atoms.jsx/AtomStates';  
import { useAuth } from '../context/AuthContext';

const LikeButtonColumn = ({ initialLiked, initialLikesCount, onLikeChange, userId, sk, feedType }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { isLoggedIn: authIsLoggedIn } = useAuth();
  const [likedProjects, setLikedProjects] = useAtom(likedProjectsAtom);
  const [globalFeedType] = useAtom(feedTypeAtom);
  const { user } = useAuth();
  const location = useLocation();

  // feedType prop 우선, 없으면 globalFeedType 사용
  const effectiveFeedType = feedType || globalFeedType;

  const fetchUserLikeStatus = async () => {
    if (!user?.id || !sk) return;
    try {
      // 1. 내 좋아요 상태 확인
      const likeResponse = await axios.get(`/main/like?userId=${user.id}`);
      const userLiked = likeResponse.data.some(like => like.sk === sk);
      setLiked(userLiked);

      // 2. 전체 피드에서 해당 sk의 좋아요 수 찾기
      const feedResponse = await axios.get(`/main?feedType=${effectiveFeedType}`);
      if (feedResponse.data) {
        const thisFeed = feedResponse.data.find(feed => feed.pk === sk);
        if (thisFeed) {
          setLikesCount(thisFeed.likesCount || 0);
        } else {
          setLikesCount(0);
        }
      }
    } catch (error) {
      console.error('Error fetching user like status:', error);
    }
  };

  useEffect(() => {
    fetchUserLikeStatus();
    // eslint-disable-next-line
  }, [user, sk, authIsLoggedIn, effectiveFeedType, location.pathname]);

  const handleClick = async (e) => {
    if (!user) return;
    e.stopPropagation();
    const likeData = { pk: user?.id, sk, feedType: effectiveFeedType };
    try {
      if (!liked) {
        // 좋아요 추가
        const checkResponse = await axios.get(`/main/like?userId=${user.id}`);
        const isAlreadyLiked = checkResponse.data.some(like => like.sk === sk);
        if (isAlreadyLiked) return;
        await axios.post(`/main/like`, likeData);
      } else {
        // 좋아요 취소
        await axios.delete(`/main/like`, { data: likeData });
      }
      // 서버에서 최신 상태로 동기화
      await fetchUserLikeStatus();
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <LikeBox onClick={handleClick}>
      <FontAwesomeIcon
        icon={liked ? faHeart : regularHeart}
        style={{ color: liked ? '#ff3b3b' : '#222', fontSize: 15, marginBottom: 2 }}
      />
      <span style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>{Math.abs(likesCount)}</span>
    </LikeBox>
  );
};

const LikeBox = styled.div`
  min-width: 50px;
  min-height: 44px;
  max-height:44px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #222;
  box-shadow: none;
  padding: 0;
  user-select: none;
  border: none;
  cursor: pointer;
`;

export default LikeButtonColumn;

