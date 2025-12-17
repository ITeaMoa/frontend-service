import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import axios from '../api/axios'
import { useAtom } from 'jotai';
import {  feedTypeAtom } from '../Atoms.jsx/AtomStates';  
import { useAuth } from '../context/AuthContext';


const ApplyLikeButton = ({  buttonStyle, sk,  }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { isLoggedIn: authIsLoggedIn } = useAuth();
  const [feedType, ] = useAtom(feedTypeAtom);
  const { user } = useAuth();
  const location = useLocation(); 

  
 const fetchUserLikeStatus = async () => {
    try {
      const feedResponse = await axios.get(`/main?feedType=${feedType}`);
      if (feedResponse.data) {
        const thisFeed = feedResponse.data.find(feed => feed.pk === sk);
        if (thisFeed) {
          setLikesCount(thisFeed.likesCount || 0);
        } else {
          setLikesCount(0);
        }
      }

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
   

  const handleClick = async (e) => {
    if (!user) return;
    e.stopPropagation();

    const likeData = { pk: user?.id, sk, feedType };

    try {
      if (!liked) {
        const checkResponse = await axios.get(`/main/like?userId=${user.id}`);
        const isAlreadyLiked = checkResponse.data.some(like => like.sk === sk);
        if (isAlreadyLiked) {
          return;
        }
        await axios.post(`/main/like`, likeData);
      } else {
        await axios.delete(`/main/like`, { data: likeData });
      }

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

