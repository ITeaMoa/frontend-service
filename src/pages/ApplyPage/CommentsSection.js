import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import axios from '../../api/axios';
import { selectedProjectDetailAtom } from '../../Atoms.jsx/AtomStates';
import { useAtom } from 'jotai';

const CommentsSection = ({ comments, commentInput, setCommentInput, project, user, projectId, fetchProjectDetails }) => {
  const [replyInput, setReplyInput] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(null);   
  const [selectedProjectDetail, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [replies, setReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
const [editCommentInput, setEditCommentInput] = useState('');
  // const [project, setProject] = useState(null);
  // setProject(selectedProjectDetail);
  //projectId를 -> 여기서 찾아도 될듯/ comment도?

  const handleCommentSubmit = async () => {
    console.log("handleCommentSubmit 호출", { commentInput, project });
    
    if (commentInput.trim() && project) {
      const newComment = {
        userId: user ? user.id : null,
        comment: commentInput,
      };

      console.log("댓글 내용:", newComment.comment);
      console.log("Current feedType:", project.sk);

      try {
        await axios.post(`/feed/${projectId}/comments`, newComment, {
          params: { feedType: project.sk }
        });
        setSelectedProjectDetail(prevProject => {
          const updatedProject = {
            ...prevProject,
            comments: [...prevProject.comments, newComment]
          };
          // fetchProjectDetails();
          console.log("Updated project state:", updatedProject);
          return updatedProject;
        });
        setCommentInput('');
      } catch (error) {
        console.error("댓글 제출 중 오류 발생:", error);
        alert("댓글 제출에 실패했습니다.");
      }
    } else {
      console.log("댓글 입력이 없거나, project 데이터가 존재하지 않음", { commentInput, project });
    }
  };

  // const handleReplySubmit = async (commentId) => {
  //   const newReply = {
  //     content: replyInput[commentId], // userId 제거
  //   };

  //   try {
  //     await axios.post(`/feed/${projectId}/comments/${commentId}/replies`, newReply, {
  //       params: { userId: user.id }
  //     });
  //     setReplyInput(prev => ({ ...prev, [commentId]: '' }));
  //     fetchProjectDetails(); // Refresh project details to include new reply
  //   } catch (error) {
  //     console.error("대댓글 제출 중 오류 발생:", error);
  //     alert("대댓글 제출에 실패했습니다.");
  //   }
  // };

  //임의
  const handleReplySubmit = (commentId) => {
    const replyText = replyInput[commentId];
    if (!replyText) return;
  
    setReplies(prev => ({
      ...prev,
      [commentId]: [ 
        ...(prev[commentId] || []),
        {
          nickname: user?.nickname || "익명",
          comment: replyText,
          timestamp: new Date().toISOString(),
          // deleted: false, // 필요시
        }
      ]
    }));
  
    setReplyInput(prev => ({ ...prev, [commentId]: '' }));
    setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
  };

const handleDeleteReply = (commentId, replyId) => {
  setReplies(prev => ({
    ...prev,
    [commentId]: prev[commentId].map(reply =>
      reply.id === replyId ? { ...reply, deleted: true } : reply
    )
  }));
};

// const handleDeleteReply = async (commentId, replyId, userId) => {
//   try {
//     await axios.delete(
//       `/feed/${projectId}/comments/${commentId}/replies/${replyId}`,
//       { params: { userId } }
//     );
//     // 성공 시 프론트 상태도 갱신
//     setReplies(prev => ({
//       ...prev,
//       [commentId]: prev[commentId].filter(reply => reply.id !== replyId)
//     }));
//   } catch (error) {
//     console.error('대댓글 삭제 실패:', error);
//     alert('대댓글 삭제에 실패했습니다.');
//   }
// };
  const handleEditComment = async (commentId) => {
    try {
      const response = await axios.put(`/feed/${projectId}/comments/${commentId}`, {
        newContent: editedComment[commentId], // 수정할 댓글 내용
        params: { feedType: project.sk, userId: user.id }
      });
      console.log("댓글 수정 성공:", response.data);
      fetchProjectDetails();  //혹은 아톰이용
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/feed/${projectId}/comments/${commentId}`, {
        params: { feedType: project.sk, userId: user.id }
      });
      console.log("댓글 삭제 성공:", response.data);  
      fetchProjectDetails();  //혹은 아톰이용
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };
  const handleEditCommentSave = async (commentId) => {
    setEditingCommentId(null);
    try {
      const response = await axios.put(`/feed/${projectId}/comments/${commentId}`, {
        newContent: editedComment[commentId], // 수정할 댓글 내용
        params: { feedType: project.sk, userId: user.id }
      });
      console.log("댓글 수정 성공:", response.data);
      fetchProjectDetails();  //혹은 아톰이용
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };
  
  return (
    <Container>
      <CommentsTitle>댓글 ({comments ? comments.length : 0})</CommentsTitle>
      <CommentInputWrapper>
        <CommentInput
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글을 입력해 주세요."
        />
        <CommentButton onClick={handleCommentSubmit}>등록</CommentButton>
      </CommentInputWrapper>
      <CommentsList>
        {comments && Array.isArray(comments) ? (
          comments.map((comment, index) => {
            const dateObj = new Date(comment.timestamp);
            const formattedDate = isNaN(dateObj) ? '날짜 정보 없음' : dateObj.toLocaleDateString();
            const formattedTime = isNaN(dateObj) ? '' : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <Comment key={index}>
                <Users>
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
                  <Timestamp>
                    <strong>{comment.nickname}</strong>
                    <span style={{ fontSize: 'small', color: '#aaa' }}>
                      {formattedDate} {formattedTime}
                    </span>
                  </Timestamp>
                </Users>
                {/* <Comments>{comment.comment}</Comments> */}
                <Comments>
                  {editingCommentId === comment.id ? (
                    <>
                      <CommentEditInput
                        value={editCommentInput}
                        onChange={e => setEditCommentInput(e.target.value)}
                      />
          
                    </>
                  ) : (
                    comment.comment
                  )}
                </Comments>
                
                {/* <Actions>
                  {!editingCommentId ? (
                    <>
                      <ActionButton onClick={() => handleEditComment(comment.id)}>수정</ActionButton>
                      <ActionButton onClick={() => handleDeleteComment(comment.id)}>삭제</ActionButton>
                      <ActionButton onClick={() => setShowReplyInput(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}>댓글 추가</ActionButton>
                    </>
                  ) : (
                    <ActionButton onClick={() => handleEditComment(comment.id)}>수정</ActionButton>
                  )}
                </Actions>

           */}

<Actions>
  {editingCommentId === comment.id ? (
    // 수정 중일 때
    <>
      <ActionButton onClick={() => handleEditCommentSave(comment.id)}>등록</ActionButton>
      <ActionButton onClick={() => setEditingCommentId(null)}>취소</ActionButton>
    </>
  ) : (
    // 평소
    <>
      <ActionButton
        onClick={() => {
          setEditingCommentId(comment.id);
          setEditCommentInput(comment.comment);
        }}
      >
        수정
      </ActionButton>
      <ActionButton onClick={() => handleDeleteComment(comment.id)}>삭제</ActionButton>
      <ActionButton onClick={() => setShowReplyInput(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}>댓글 추가</ActionButton>
    </>
  )}
</Actions>

{replies[comment.id] && replies[comment.id].map((reply, idx) => {
                  const replyDateObj = new Date(reply.timestamp);
                  const replyFormattedDate = isNaN(replyDateObj) ? '' : replyDateObj.toLocaleDateString();
                  const replyFormattedTime = isNaN(replyDateObj) ? '' : replyDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <ReplyBox key={idx}>
                      <Users>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: '18px', marginRight: '6px',}} />
                        <Timestamp>
                          <strong style={{  }}>{reply.nickname}</strong>
                          <span style={{ fontSize: 'small', color: '#aaa', marginLeft: 8 }}>
                            {replyFormattedDate} {replyFormattedTime}
                          </span>
                        </Timestamp>
                      </Users>
                      <Comments>
                        {reply.deleted ? (
                          <DeletedBox>삭제된 댓글입니다</DeletedBox>
                        ) : (
                          reply.comment
                        )}
                      </Comments>
                      {!reply.deleted && (
                        <Actions>
                          {/* <ActionButton onClick={() => handleEditReplyStart()}>수정</ActionButton> */}
                          <ActionButton onClick={() => handleDeleteReply()}>삭제</ActionButton>
                          {/* <ActionButton onClick={() => handleDeleteReply(comment.id, reply.id, user.id)}>
  삭제
</ActionButton> */}
                        </Actions>
                      )}
                    </ReplyBox>
                  );
                })}

                {/* 대댓글 입력창 */}
                {showReplyInput[comment.id] && (
                  <ReplyInputWrapper>
                    <CommentInput
                      value={replyInput[comment.id] || ''}
                      onChange={(e) => setReplyInput(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      placeholder="대댓글을 입력해 주세요."
                    />
                    <CommentButton onClick={() => handleReplySubmit(comment.id)}>등록</CommentButton>
                  </ReplyInputWrapper>
                )}
{/* 
                {showReplyInput[comment.id] && (
                  <CommentInputWrapper>
                    <CommentInput
                      value={replyInput[comment.id] || ''}
                      onChange={(e) => setReplyInput(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      placeholder="대댓글을 입력해 주세요."
                    />
                    <CommentButton onClick={() => handleReplySubmit(comment.id)}>등록</CommentButton>
                  </CommentInputWrapper>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginLeft: '20px' }}>
                    {comment.replies.map((reply, replyIndex) => (
                      <div key={replyIndex}>
                        <Comments>{reply.comment}</Comments>
                      </div>
                    ))}
                  </div>
                )} */}
              </Comment>
            );
          })
        ) : (
          <span>댓글 정보가 없습니다.</span>
        )}
      </CommentsList>
    </Container>
  );
};

export default CommentsSection;

// Styled Components
const Container = styled.div`
  position: relative;
  width: calc(100% / 2 + 80px);
  border-top: 1px solid #ddd;
  margin-top: 20px;
  padding-top: 20px;
  margin-bottom: 20px;
`;

const CommentsTitle = styled.h3`
  position: absolute;
  font-size: 20px;
`;

const CommentsList = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const Comment = styled.div`
  margin: 5px 0;
  padding: 14px;
  padding-left: 20px;
  border: none;
  border-bottom: 2px solid rgba(160, 218, 251);
`;

const Users = styled.div`
  display: flex;
`;

const Timestamp = styled.div`
  display: flex;
  flex-direction: row;

  span {
    margin-top: 2px;
  }
`;

const Comments = styled.div`
  margin: 10px 10px;
`;

const CommentInputWrapper = styled.div`
  margin-top: 60px;
  display: flex;
  align-items: center;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 15px;
  border: 3px solid #62b9ec;
  border-radius: 15px;
  margin-right: 10px;
  background-color: white;
`;

const CommentButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #a0dafb;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    background-color: #a0dafb;
  }
`; 

const DeletedBox = styled.div`
  background: #eee;
  color: #888;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 8px 0;
`;

const ReplyBox = styled.div`
  margin-left: 32px;
  margin-top: 8px;
  background: #f8fafd;
  border-radius: 8px;
  padding: 10px 10px 10px 16px;
  border-left: 3px solid #a0dafb;
`;

const ReplyInputWrapper = styled(CommentInputWrapper)`
  margin-left: 32px;
  margin-top: 10px;
`
const CommentEditInput = styled(CommentInput)`
  border: 3px solid #62b9ec;
  border-radius: 15px;
  margin-right: 10px;
  background-color: white;
  width: 88%;
`;

