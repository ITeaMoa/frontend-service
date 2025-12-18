import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import { selectedProjectDetailAtom } from '../../../atoms/AtomStates';
import { useAtom } from 'jotai';
import AlertModal from '../../../components/AlertModal';
import { 
  getProjectDetails, 
  submitComment, 
  submitReply, 
  getReplies, 
  deleteReply, 
  deleteComment, 
  editComment 
} from '../../../api';

const CommentsSection = ({ commentInput, setCommentInput, user, projectId }) => {
  const [replyInput, setReplyInput] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [selectedProjectDetail, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [, setReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentInput, setEditCommentInput] = useState('');
  const [showAlertPopup,setShowAlertPopup] =useState(false)
  const [comments, setComments] = useState(selectedProjectDetail?.comments || []);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);


  const fetchProjectDetails = async () => {
    try {
      if (selectedProjectDetail) {
        const projects = await getProjectDetails(selectedProjectDetail.sk);
        const selectedProject = projects.find(item => item.pk === projectId);
  
        if (selectedProject) {
          const commentsWithReplies = await Promise.all(
            selectedProject.comments.map(async (comment) => {
              const replies = await getReplies(projectId, comment.commentId);
              return {
                ...comment,
                replies: replies
              };
            })
          );
  
          setSelectedProjectDetail(selectedProject);
          setComments(commentsWithReplies);
        } else {
          setSelectedProjectDetail(null);
          setComments([]);
        }
      } else {
        setSelectedProjectDetail(null);
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setSelectedProjectDetail(null);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line
  }, []);

  const handleCommentSubmit = async () => {
    if(!user) {
      return;
    }
    if (commentInput.trim() && selectedProjectDetail) {
      const newComment = {
        userId: user ? user.id : null,
        comment: commentInput,
      };

      try {
        await submitComment(projectId, newComment, selectedProjectDetail.sk);
        setCommentInput('');
        await fetchProjectDetails();
      } catch (error) {
        setShowAlertPopup("댓글 제출에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };


  const handleReplySubmit = async (commentId) => {
    const replyText = replyInput[commentId];
    if (!replyText) return;
  
    try {
      const replyData = {
        content: replyText
      };
      
      await submitReply(projectId, commentId, user.id, replyData);
  
      setReplies(prev => ({
        ...prev,
        [commentId]: [
          ...(prev[commentId] || []),
          {
            nickname: user?.nickname || "익명",
            comment: replyText,
            timestamp: new Date().toISOString(),
          }
        ]
      }));

      await getReplies(projectId, commentId);
  
      setReplyInput(prev => ({ ...prev, [commentId]: '' }));
      setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
      await fetchProjectDetails();
  
    } catch (error) {
      console.error("대댓글 작성 중 오류 발생:", error);
      if (error.response?.data) {
        setAlertMessage(error.response.data);
        setShowAlert(true);
      } else {
        setAlertMessage("대댓글 작성에 실패했습니다.");
        setShowAlert(true);
      }
    }
  };


const handleDeleteReply = async (commentId, replyId, userId) => {
  try {
    await deleteReply(projectId, commentId, replyId, userId);
    await fetchProjectDetails();
  } catch (error) {
    console.error('대댓글 삭제 실패:', error);
    setAlertMessage('대댓글 삭제에 실패했습니다.');
    setShowAlert(true);
  }
};



  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(projectId, commentId, selectedProjectDetail.sk, user.id);
      await fetchProjectDetails();
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      setAlertMessage("댓글 삭제에 실패했습니다.");
      setShowAlert(true);
    }     
  };     
  
  
  const handleEditCommentSave = async (commentId) => {
    if (!editCommentInput.trim()) {
      setAlertMessage('댓글 내용을 입력해주세요');
      setShowAlert(true);
      return;
    }
    
    try {
      const commentData = {
        newContent: editCommentInput
      };
      
      await editComment(projectId, commentId, selectedProjectDetail.sk, user.id, commentData);
      
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.commentId === commentId
            ? { ...comment, comment: editCommentInput }
            : comment
        )
      );
  
      setEditingCommentId(null);
      setEditCommentInput('');
  
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      if (error.response?.data) {
        setAlertMessage(error.response.data);
        setShowAlert(true);
      } else {
        setAlertMessage("댓글 수정에 실패했습니다.");
        setShowAlert(true);
      }
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
                    <span style={{ fontSize: 'small', color: '#aaa', marginLeft: '10px' }}>
                      {formattedDate} {formattedTime}
                    </span>
                  </Timestamp>
                </Users>

                <Comments>
                  {editingCommentId === comment.commentId ? (
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
                
               
              <Actions>
                {editingCommentId === comment.commentId ? (
                  <>
                    <ActionButton onClick={() => handleEditCommentSave(comment.commentId)}>등록</ActionButton>
                    <ActionButton onClick={() => setEditingCommentId(null)}>취소</ActionButton>
                  </>
                ) : (
                  <>
                 {user && (
                  <>
                    {user.id === comment.userId && (
                      <ActionButton
                        onClick={() => {
                          setEditingCommentId(comment.commentId);
                          setEditCommentInput(comment.comment);
                        }}
                      >
                        수정
                      </ActionButton>
                      
                      
                    )} 
                    {user.id === comment.userId && (
                      <ActionButton onClick={() => handleDeleteComment(comment.commentId)}>삭제</ActionButton>
                    )}
                      <ActionButton onClick={() => setShowReplyInput(prev => ({ ...prev, [comment.commentId]: !prev[comment.commentId] }))}>
                      댓글 추가
                    </ActionButton>
                  </>
                )}
                                  </>
                )}
              
                
              </Actions>

                {comment.replies && comment.replies.map((reply, idx) => {
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
                          reply.content
                        )}
                      </Comments>
                      {!reply?.deleted && user?.id === reply?.userId && (
                        <Actions>
                          <ActionButton onClick={() => handleDeleteReply(comment.commentId, reply.replyId, user.id)}>삭제</ActionButton>
                        </Actions>
                      )}
                    </ReplyBox>
                  );
                })}

                {showReplyInput[comment.commentId] && (
                  <ReplyInputWrapper>
                    <CommentInput
                      value={replyInput[comment.commentId] || ''}
                      onChange={(e) => setReplyInput(prev => ({ ...prev, [comment.commentId]: e.target.value }))}
                      placeholder="대댓글을 입력해 주세요."
                    />
                    <CommentButton onClick={() => handleReplySubmit(comment.commentId)}>등록</CommentButton>
                  </ReplyInputWrapper>
                )}
              </Comment>
            );
          })
        ) : (
          <span>댓글 정보가 없습니다.</span>
        )}

        <AlertModal
          isOpen={!!showAlertPopup}
          message={showAlertPopup}
          onClose={() => setShowAlertPopup(false)}
        />
        <AlertModal
          isOpen={showAlert}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      </CommentsList>
    </Container>
   
  );
  

};


export default CommentsSection;


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

