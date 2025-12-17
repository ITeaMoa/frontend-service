import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import useLikeStatus from '../hooks/useLikeStatus';
import AlertModal from './AlertModal';

const ApplyLikeButton = ({ buttonStyle, feedId }) => {
  const { liked, likesCount, toggleLike, loading } = useLikeStatus(feedId);
  const [error, setError] = useState(null);

  const handleClick = async (e) => {
    e.stopPropagation();
    
    try {
      await toggleLike();
    } catch (err) {
      setError('좋아요 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Button onClick={handleClick} buttonStyle={buttonStyle} disabled={loading}>
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
      
      <AlertModal
        isOpen={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </>
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
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
`;

export default ApplyLikeButton;