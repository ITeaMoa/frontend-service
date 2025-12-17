import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../Atoms.jsx/AtomStates';
import { getFeedLikes, getUserLikeStatus, addLike, removeLike } from '../api';

const useLikeStatus = (feedId) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [feedType] = useAtom(feedTypeAtom);

  const fetchLikeStatus = async () => {
    if (!feedId || !user?.id) return;

    try {
      const feedResponse = await getFeedLikes(feedId, feedType);
      setLikesCount(feedResponse.data.likesCount || 0);

      const likeResponse = await getUserLikeStatus(user.id, feedId);
      setLiked(likeResponse.data.length > 0);
    } catch (error) {
      console.error('Error fetching like status:', error);
      setLiked(false);
      setLikesCount(0);
    }
  };

  const toggleLike = async () => {
    if (!user || !feedId) return;
    
    const previousLiked = liked;
    const previousLikesCount = likesCount;
    
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : Math.max(0, likesCount - 1));
    setLoading(true);

    try {
      const likeData = { 
        userId: user.id, 
        feedId: feedId, 
        feedType: feedType 
      };

      if (newLiked) {
        await addLike(likeData);
      } else {
        await removeLike(likeData);
      }
    } catch (error) {
      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
      console.error('Error updating like status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [feedId, user?.id, feedType]);

  return {
    liked,
    likesCount,
    loading,
    toggleLike,
    refresh: fetchLikeStatus
  };
};

export default useLikeStatus;