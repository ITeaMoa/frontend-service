import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import useLikeStatus from '../hooks/useLikeStatus';
import AlertModal from './AlertModal';

const LikeButtonColumn = ({  onLikeChange, feedId }) => {
  const { liked, likesCount, toggleLike, loading } = useLikeStatus(feedId);
  const [error, setError] = useState(null);

  const handleClick = async (e) => {
    e.stopPropagation();
    
    try {
      await toggleLike();
      if (onLikeChange) {
        onLikeChange(liked, likesCount);
      }
    } catch (err) {
      setError('좋아요 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <LikeBox onClick={handleClick} disabled={loading}>
        <FontAwesomeIcon
          icon={liked ? faHeart : regularHeart}
          style={{ color: liked ? '#ff3b3b' : '#222', fontSize: 15, marginBottom: 2 }}
        />
        <span style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>
          {Math.abs(likesCount)}
        </span>
      </LikeBox>
      
      <AlertModal
        isOpen={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </>
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
  transition: background 0.15s, border-color 0.15s;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  
  &:hover {
    border:1px solid #62b9ec;
  }
`;

export default LikeButtonColumn;