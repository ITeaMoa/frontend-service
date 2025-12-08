import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import axios from '../../../api/axios';
import { selectedProjectDetailAtom } from '../../../Atoms.jsx/AtomStates';
import { useAtom } from 'jotai';
import AlertModal from '../../../components/AlertModal';

const CommentsSection2= ({ commentInput, setCommentInput, user, projectId }) => {
  const [replyInput, setReplyInput] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});   
  const [selectedProjectDetail, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [, setReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentInput, setEditCommentInput] = useState('');
  const [showAlertPopup,setShowAlertPopup] =useState(false)
  const [comments, setComments] = useState(selectedProjectDetail?.comments || []);



  const fetchProjectDetails = async () => {
    try {
      if (selectedProjectDetail) {
        const response = await axios.get(`/main?feedType=${selectedProjectDetail.sk}`);
        const selectedProject = response.data.find(item => item.pk === projectId);
  
        // 각 댓글에 대한 대댓글을 가져와서 구조화
        const commentsWithReplies = await Promise.all(
          selectedProject.comments.map(async (comment) => {
            const replyResponse = await axios.get(`/feed/${projectId}/comments/${comment.commentId}/replies`);
            return {
              ...comment,
              replies: replyResponse.data
            };
          })
        );
  
        setSelectedProjectDetail(selectedProject);
        setComments(commentsWithReplies);
        // setReplies는 더 이상 필요하지 않음
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
      }

      try {
        await axios.post(`/feed/${projectId}/comments`, newComment, {
          params: { feedType: selectedProjectDetail.sk }
        });

            
      // 댓글 입력 필드 초기화
      setCommentInput('');
      
      // 프로젝트 상세 정보 새로고침
      await fetchProjectDetails();
      } catch (error) {
        console.error("댓글 제출 중 오류 발생:", error);
        // alert("댓글 제출에 실패했습니다.");
        setShowAlertPopup("댓글 제출에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      console.log("댓글 입력이 없거나, project 데이터가 존재하지 않음", { commentInput, selectedProjectDetail });
    }
  };


  const handleReplySubmit = async (commentId) => {
    const replyText = replyInput[commentId];
    if (!replyText) return;
  
    try {
      const replyData = {
        content: replyText
      }
       await axios.post(
        `/feed/${projectId}/comments/${commentId}/replies?userId=${user.id}`,
        replyData
      );
  
      // 대댓글 목록 업데이트
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

     await axios.get(`/feed/${projectId}/comments/${commentId}/replies`);
  
      // 입력 필드 초기화
      setReplyInput(prev => ({ ...prev, [commentId]: '' }));
      setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
      await fetchProjectDetails();
  
    } catch (error) {
      console.error("대댓글 작성 중 오류 발생:", error);
      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("대댓글 작성에 실패했습니다.");
      }
    }
  };



const handleDeleteReply = async (commentId, replyId, userId) => {

  try {
    await axios.delete(
      `/feed/${projectId}/comments/${commentId}/replies/${replyId}`,
      { params: { userId } }
    );
    await fetchProjectDetails();
  } catch (error) {
    console.error('대댓글 삭제 실패:', error);
    alert('대댓글 삭제에 실패했습니다.');
  }
};


  

  const handleDeleteComment = async (commentId) => {

    try {
      const response = await axios.delete(`/feed/${projectId}/comments/${commentId}`, {
        params: { feedType: selectedProjectDetail.sk, userId: user.id }
      });
      
      if (response.data) {
  
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      await fetchProjectDetails();
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      alert("댓글 삭제에 실패했습니다.");
    }     
  };     
  
  

  // 수정 저장 핸들러
  const handleEditCommentSave = async (commentId) => {
    if (!editCommentInput.trim()) {
      alert('댓글 내용을 입력해주세요');
      return;
    }
  
    try {
     const commentData = {
      newContent: editCommentInput
     }
      await axios.put(
        `/feed/${projectId}/comments/${commentId}?feedType=${selectedProjectDetail.sk}&userId=${user.id}`, 
        commentData
      );   
      // 댓글 목록 업데이트
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.commentId === commentId
            ? { ...comment, comment: editCommentInput }
            : comment
        )
      );
  
      // 수정 모드 종료
      setEditingCommentId(null);
      setEditCommentInput('');
  
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    }
  };

  
  return (
    <Container>
      <CommentsContainer>
      <CommentsTitle>댓글 ({comments ? comments.length : 0})</CommentsTitle>
      <CommentInputWrapper>
      <UserSection>
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px',  }} />
                 <strong>{user?.nickname}</strong>
                </UserSection>
        <CommentInput
          as="textarea"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글을 입력해 주세요."
        />
        <CommentButton onClick={handleCommentSubmit}>등록하기</CommentButton>
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
                  {/* <CommentDate>
                  <span style={{ fontSize: 'small', color: '#aaa', marginLeft: '10px' }}>
                      {formattedDate} {formattedTime}
                    </span>
                  </CommentDate> */}
                </Users>
                {/* <Comments>{comment.comment}</Comments> */}
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
                  // 수정 중일 때
                  <>
                    <ActionButton onClick={() => handleEditCommentSave(comment.commentId)}>등록</ActionButton>
                    <ActionButton onClick={() => setEditingCommentId(null)}>취소</ActionButton>
                  </>
                ) : (
                  // 평소
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

                {/* 대댓글 입력창 */}
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
      </CommentsList>
      </CommentsContainer>
    </Container>
   
  );
  

};


export default CommentsSection2;

// Styled Components
const Container = styled.div`
  position: relative;
  width: 100%;
  // width: calc(100% / 2 + 80px);
  // border-top: 1px solid #ddd;
  padding-bottom: 20px;
  // margin-bottom: 20px;
  background: rgba(237, 237, 237, 0.5);
  display: flex;
  justify-content: center;
  align-items: center; /* 필요에 따라 제거 가능 */
`;

const CommentsContainer = styled.div`
  position: relative;
  // width: calc(100% / 2 + 350px);
  align-items: center;
  padding-top: 20px;
  // margin-bottom: 20px;
  background:rgba(237, 237, 237, 0);
  width: 100%;
   max-width: 1030px;
  box-sizing: border-box;

`;

const CommentsTitle = styled.h3`
  position: absolute;
  font-size: 20px;
  margin-bottom:20px;
`;

const CommentsList = styled.div`
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const Comment = styled.div`
  margin: 5px 0;
  padding: 14px 12px; // CommentInput과 동일하게!
  border: none;
  border-top: #EDEDED;
  border-bottom: 2px solid #EDEDED;
  width: 100%;
  box-sizing: border-box;
  position: relative;
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
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  // align-items: center;
  margin-left:20px;
   border-bottom: 2px solid #EDEDED;

`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 80px;
  resize: none;
  padding: 14px 12px; // Comment와 동일하게!
  font-size: 16px;
  box-sizing: border-box;
  border: 1.5px solid #ededed;   // 테두리 색 고정
  outline: none;                  // 기본 outline 제거
  background-color: white;

  &::placeholder {
    text-align: left;
    vertical-align: top;
    transform: translateY(-2px);
    color: #bdbdbd; // placeholder 색상은 필요시 조정
  }

  &:focus {
    border: 1.5px solid #ededed; // 포커스 시에도 테두리 색 고정
    outline: none;
  }
`;

const CommentButton = styled.button`
  padding: 10px 20px;
  margin-top:20px;
  margin-bottom: 20px;
  border: none;
  border-radius: 6px;
  background-color: #3D3D3F;
  color: white;
  font-weight: bold;
  cursor: pointer;
  // width:80px;

  align-self: flex-end;  /* 오른쪽 끝 정렬 */
  // margin-right:15px;

  // &:hover {
  //   background-color: #a0dafb;
  // }
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
 background-color: #3D3D3F;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-left: 5px;

  // &:hover {
  //   background-color: #a0dafb;
  // }
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
  // background: #f8fafd;
  background: white;
  border-radius: 8px;
  padding: 10px 10px 10px 16px;
  // border-left: 3px solid #a0dafb;
   border-left: 3px solid #3D3D3F;
`;

const ReplyInputWrapper = styled(CommentInputWrapper)`
  margin-left: 32px;
  margin-top: 10px;
`
const CommentEditInput = styled(CommentInput)`
  border: 2px solid #ededed;
  // border-radius: 15px;
  margin-right: 10px;
  background-color: white;
  width: 88%;
`;

const UserSection = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

