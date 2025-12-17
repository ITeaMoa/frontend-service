import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import useLikeStatus from '../hooks/useLikeStatus'; // [면접관용 설명] 관심사 분리를 위해 비즈니스 로직을 custom hook으로 분리
import AlertModal from './AlertModal'; // [면접관용 설명] 에러 발생 시 사용자에게 알림을 제공하기 위해 추가

const LikeButton = ({ buttonStyle, sk }) => {
  // [면접관용 설명] custom hook을 사용하여 like 상태와 관련된 모든 로직을 분리
  const { liked, likesCount, toggleLike, loading } = useLikeStatus(sk);
  const [error, setError] = useState(null);

  const handleClick = async (e) => {
    e.stopPropagation();
    
    try {
      await toggleLike();
    } catch (err) {
      // [면접관용 설명] 에러 발생 시 사용자에게 알림 표시
      setError('좋아요 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Button onClick={handleClick} buttonStyle={buttonStyle} disabled={loading}>
        <FontAwesomeIcon 
          icon={liked ? faHeart : regularHeart} 
          style={{ 
            color: liked ? 'red' : 'white', 
            marginRight: '4px' 
          }} 
        />
        {Math.abs(likesCount)}
      </Button>
      
      {/* [면접관용 설명] 에러 발생 시 모달로 알림 표시 */}
      <AlertModal
        isOpen={!!error}
        message={error}
        onClose={() => setError(null)}
      />
    </>
  );
};

const Button = styled.div`
  border: 1px solid #ddd;
  padding: 2px 8px;
  border-radius: 15px;
  color: white;
  font-weight: bold;
  background-color: #C4C4C4;
  cursor: pointer;
  float: right;
  margin-top: -24px;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};

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