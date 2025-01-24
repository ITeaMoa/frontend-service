import React, { useState, useEffect,useCallback  } from 'react';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import { useNavigate , useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faComment } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
// import axios from 'axios';
import LikeButton from '../../components/LikeButton';
import Modal from '../../components/Modal'; // 모달 컴포넌트 import
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'


const ApplyPage = ({ feedType }) => {
  const navigate = useNavigate(); 
  const {projectId } = useParams(); // URL에서 projectId 가져오기
  const location = useLocation(); // 경로 상태 가져오기
  const { sk } = location.state || {}; // 전달된 sk 값 가져오기
  //usestate : 컴포넌트 상태 관리에 씀
  //첫번째 요소: 현재 상태 값, 두번째 요소 : 상태를 없데이트하는 값 
  const [commentInput, setCommentInput] = useState('');
  
  const [project, setProject] = useState(null);
  const showSearch = false;
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
   const nickname = user ? user.nickname : 'Unknown'; //사용자 닉네임 설정


  const [currentFeedType, setCurrentFeedType] = useState(feedType || "PROJECT"); // Add state for feedType

  // user.id를 콘솔에 출력
  useEffect(() => {
    if (user) {
      console.log('User ID:', user.id); // 로그인한 사용자 ID 출력
    } else {
      console.log('사용자가 로그인하지 않았습니다.');
    }
  }, [user]); // user가 변경될 때마다 실행

  useEffect(() => {
    if (user) {
      console.log('User:', user); // 로그인한 사용자 정보 출력
      console.log('Project Creator ID:', project ? project.creatorId : 'Project is null'); // 프로젝트 생성자 ID 출력
    } else {
      console.log('사용자가 로그인하지 않았습니다.');
    }
  }, [user, project]); // user와 project가 변경될 때마다 실행


  // // fetchProjectDetails를 useCallback으로 래핑하여 메모이제이션
  // const fetchProjectDetails = useCallback(async () => {
  //   try {
  //     const response = await axios.get('/data.json'); // 데이터 가져오기
  //     const selectedProject = response.data.find(item => item.pk === projectId); // 특정 프로젝트 찾기
      
  //     if (selectedProject) {
  //       setProject(selectedProject);
  //       setLikesCount(selectedProject.likesCount || 0); // 초기 좋아요 수 설정
  //     } else {
  //       console.error("Project not found for projectId:", projectId);
  //       setProject(null);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching project details:", error);
  //     setProject(null); 
  //   }
  // }, [projectId]);


  // useEffect(() => {
  //   fetchProjectDetails(); // 프로젝트 세부 정보를 가져옵니다.
  // }, [fetchProjectDetails]); // 의존성 배열에 fetchProjectDetails 추가

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/main?feedType=${sk}`); // sk 값을 사용
      const selectedProject = response.data.find(item => item.pk === projectId); // 특정 프로젝트 찾기
      
      if (selectedProject) {
        console.log("Selected Project:", selectedProject); // 프로젝트 정보 콘솔로 출력
        setProject(selectedProject);
      } else {
        console.error("Project not found for projectId:", projectId);
        setProject(null);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setProject(null); // 오류 발생 시 상태를 null로 설정
    }
  }, [projectId, sk]); // sk를 의존성 배열에 추가

  // const fetchProjectDetails = useCallback(async () => {
  //   try {
  //     const response = await axios.get(`/main?feedType=PROJECT&projectId=${projectId}`); // projectId를 쿼리 파라미터로 추가
  //     const selectedProject = response.data; // 응답 데이터에서 프로젝트 정보 가져오기
  
  //     if (selectedProject) {
  //       setProject(selectedProject);
  //     } else {
  //       console.error("Project not found for projectId:", projectId);
  //       setProject(null);
  //     }
  //   } catch (error) 
  //     console.error("Error fetching project details:", error);
  //     setProject(null); // 오류 발생 시 상태를 null로 설정
  //   }
  // }, [projectId]);

  useEffect(() => {
    fetchProjectDetails(); // 프로젝트 세부 정보를 가져옵니다.
  }, [fetchProjectDetails]);


const handleLikeClick = (newLiked, newLikesCount) => {
  console.log(`Liked: ${newLiked}, Likes Count: ${newLikesCount}`);
};



const handleCommentSubmit = async () => {
  if (commentInput.trim() && project) {
      const newComment = {
          userId: user ? user.id : null, // user가 null인 경우 처리
          comment: commentInput,
      };

      // comment 부분 콘솔로 출력
      console.log("댓글 내용:", newComment.comment);

      try {
          await axios.post(`/feed/${projectId}/comments`, newComment, {
              params: { feedType: currentFeedType } // Use currentFeedType
          });
          setProject(prevProject => {
              const updatedProject = {
                  ...prevProject,
                  comments: [...prevProject.comments, newComment] 
              };
              // 새로고침을 위해 프로젝트 상태를 업데이트
              fetchProjectDetails(); // 댓글 추가 후 프로젝트 세부정보를 다시 가져옵니다.
              console.log("Updated project stateㄴㄴㄴㄴ:", updatedProject); // 추가된 콘솔 로그
              console.log("댓글이 성공적으로 추가되었습니다:", newComment);
              return updatedProject;
          });
          setCommentInput(''); 
      } catch (error) {
          console.error("댓글 제출 중 오류 발생:", error);
          alert("댓글 제출에 실패했습니다."); 
      }
  }
};


  // 프로젝트가 로딩 중일 때
  if (!project) {
    return <Container>Loading project...</Container>;
  }

  const handleApplyClick = async () => {
    if (!user) { // 로그인 여부 확인
      alert("로그인 후 신청할 수 있습니다."); // 로그인하지 않은 경우 알림
      return; // 함수 종료
    }

    // 자신이 작성한 게시글인지 확인
    if (project && project.creatorId === user.id) {
      alert("자신이 작성한 게시글에는 신청할 수 없습니다."); // 자신이 작성한 경우 알림
      return; // 함수 종료
    }

    // 이미 신청한 프로젝트 확인
    try {
      const response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });
      console.log('이미 신청한 프로젝트:', response.data); // 응답 데이터 출력

      const appliedProjects = response.data.map(app => app.feedId); // 신청한 프로젝트의 feedId 목록
      console.log('신청한 프로젝트 feedId 목록:', appliedProjects); // 신청한 프로젝트 feedId 출력

      // 선택한 프로젝트의 pk와 비교
      const isAlreadyApplied = appliedProjects.includes(project.pk);
      if (isAlreadyApplied) {
        setPopupMessage("이미 신청한 프로젝트입니다."); // 이미 신청한 경우 메시지 설정
        setIsSubmitted(true); // 제출 확인 팝업 표시
        return; // Exit the function if already applied
      }
    } catch (error) {
      console.error("신청한 프로젝트를 가져오는 중 오류 발생:", error);
    }

    setIsRoleModalOpen(true); // 역할 선택 모달 열기
  };

  const handleRoleSelect = (role) => {
    console.log(`선택된 역할: ${role}`); // 선택된 역할을 콘솔에 출력
    setSelectedRole(role);
  };

  const handleApplySubmit = async () => {
    if (!selectedRole) {
      alert("역할을 선택하세요.");
      return;
    }

    console.log('제출된 역할:', selectedRole); // 선택된 역할 로깅
    console.log('프로젝트 ID:', projectId); // 프로젝트 ID 로깅
    console.log('사용자 ID:', user?.id); // 사용자 ID 로깅

    setIsRoleModalOpen(false);

    try {
      // 선택한 역할을 서버에 전송
      const response = await postSelectedRole(selectedRole);
      console.log('서버 응답:', response); // 서버 응답 로깅

      setPopupMessage("제출되었습니다.");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setPopupMessage("제출에 실패했습니다. 다시 시도하세요.");
      setIsSubmitted(true);
    }
  };

  // 제출 확인 팝업 닫기 함수
  const handleCloseSubmissionPopup = () => {
    setIsSubmitted(false);
    setPopupMessage(''); // 메시지 초기화
  };

  // // 선택한 역할을 서버에 전송하는 모의 함수
  // const postSelectedRole = async (role) => {
  //   try {
  //     const response = await axios.post('/api/submitRole', { role});
  //     return response.data; // 서버로부터의 응답 데이터 반환
  //   } catch (error) {
  //     throw new Error('서버 요청 실패');
  //   }
  // };



// 선택한 역할을 서버에 전송하는 함수
const postSelectedRole = async (role) => {
  const applicationData = {
    userId: user.id, // 현재 사용자 ID
    feedId: projectId, // 프로젝트 ID
    part: role, // 선택한 역할
  };

  console.log('Sending application data:', applicationData); // 전송할 데이터 콘솔 출력

  try {
    const response = await axios.post(
      `/feed/apply?feedType=PROJECT&projectId=${projectId}`, // projectId를 쿼리 파라미터로 추가
      applicationData
    );
    console.log('서버 응답:', response.data); // 서버 응답을 콘솔에 출력
    return response.data; // 서버로부터의 응답 데이터 반환
  } catch (error) {
    console.error('서버 요청 실패:', error);
    throw error; // 오류 발생 시 적절히 처리
  }
};


const handleToggleChange = (newFeedType) => {
  setCurrentFeedType(newFeedType);
  console.log("Current feedType:", newFeedType);
};



  return (
    <>
      <Nav showSearch={showSearch} onToggleChange={handleToggleChange} />
      <Container>
        <BackButton onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
          이전
        </BackButton>

        <Title> {project.title} </Title>

       {/* <LikeButton 
          initialLiked={liked} 
          initialLikesCount={likesCount} 
          onLikeChange={handleLike} 
          buttonStyle='apply'
          apiEndpoint={`/feed/${projectId}/like`} 
          userId={user ? user.id : null} // user가 null인 경우 처리
          isApplyPage={true} // 또는 false로 설정하여 페이지 구분
         
        />
         */}


              {/* <LikeButton 
                initialLiked={likedProjects.find(like => like.id === projectId)?.liked || false} 
                initialLikesCount={likedProjects.find(like => like.id === projectId)?.likesCount || 0} 
                onLikeChange={handleLikeClick} 
                apiEndpoint="/main/like" 
                buttonStyle='apply'ㅌ
                sk={project.pk}
                userId={user ? user.id : null} 
              /> */}

                  <LikeButton 
                initialLiked={project.liked} 
                initialLikesCount={project.likesCount} 
                onLikeChange={handleLikeClick}
                buttonStyle="apply"
                sk={project.pk}
                userId={user ? user.id : null} // user가 null인 경우 처리
                feedType={project.sk} // Use project.sk as feedType
              />
        
        <Post>
        <PostDetails>
            <Detail>
                <Label>모집 구분 |</Label> 프로젝트
            </Detail>
            <Detail>
                <Label>게시 일자 |</Label> {project.timestamp ? new Date(project.timestamp).toLocaleDateString() : '정보 없음'}
            </Detail>
          
            <Detail>
                <Label>마감일자   |</Label> {project.deadline ? new Date(project.deadline).toLocaleDateString() : '정보 없음'}
            </Detail>
            <Detail>
                <Label>진행 기간 |</Label> {project.period ? `${project.period}개월` : '정보 없음'}
            </Detail>
            <Detail>
                <Label>진행 장소 |</Label> {project.place || '정보 없음'}
            </Detail>
            <Detail>
                <Label>모집 역할 |</Label>
                {project.roles ? (
                    Object.entries(project.roles).map(([role, count], index) => (
                        <span key={index}>{role}({count})</span>
                    ))
                ) : (
                    <span>역할 정보가 없습니다.</span>
                )}
            </Detail>
            <Detail>
                <Label>모집 현황 |</Label> {project.recruitmentNum ? `${project.applyNum}명 / ${project.recruitmentNum}명` : '정보 없음'}
            </Detail>
            <Detail>
                <Label>신청자 수 |</Label>
                {project.recruitmentRoles ? (
                    Object.entries(project.recruitmentRoles).map(([role, count], index) => (
                        <span key={index}>{role}({count})</span>
                    ))
                ) : (
                    <span>역할 정보가 없습니다.</span>
                )}
            </Detail>
       
        </PostDetails>

          <TagsSection>
          {project.tags && Array.isArray(project.tags) ? (
              project.tags.map((tag, index) => (
                <TagButton key={index}>{tag}</TagButton>
              ))
            ) : (
              <span>태그 정보가 없습니다.</span>
            )}
          </TagsSection>

          <ApplyButton onClick={handleApplyClick}>신청하기</ApplyButton>
        
        </Post>

        <PostDescription>

        {project.content}
         
        </PostDescription>

    
        <AuthorSection>
          <ChatButton>
            <FontAwesomeIcon icon={faComment} />
 
          </ChatButton>

          <AuthorID>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
            작성자: {project.nickname}
          </AuthorID>
          </AuthorSection>
        

        <CommentsSection>
          <CommentsTitle>댓글 ({project.comments ? project.comments.length : 0})</CommentsTitle>
      
           <CommentInputWrapper>
            <CommentInput
          
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글을 입력해 주세요."
            />
              <CommentButton onClick={handleCommentSubmit}>등록</CommentButton>

              </CommentInputWrapper> 

              <CommentsList>
            {project.comments && Array.isArray(project.comments) ? (
              project.comments.map((comment, index) => {
                const date = new Date(comment.timestamp);
                const formattedDate = isNaN(date) ? '날짜 정보 없음' : date.toLocaleDateString();
                const formattedTime = isNaN(date) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <Comment key={index}>
                    <Users>
                      <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
                      <Timestamp>
                        <strong>{comment.userID}</strong>
                        <span style={{ fontSize: 'small', color: '#aaa' }}>
                          {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : '날짜 정보 없음'} {comment.timestamp ? new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </Timestamp>
                    </Users>
                    <Comments>{comment.comment}</Comments>
                  </Comment>
                );
              })
            ) : (
              <span>댓글 정보가 없습니다.</span>
            )}
          </CommentsList>
          
        </CommentsSection>
      </Container>

      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} modalType="apply">
      <RoleButtonContainer>
          <h3>지원할 역할을 선택하세요</h3>
          {project && project.roles ? (
            <RoleButtonContainerStyled>
              {Object.entries(project.roles).map(([role, count], index) => (
                <RoleButton
                  key={index}
                  onClick={() => handleRoleSelect(role)}
                  isSelected={selectedRole === role}
                >
                  {role} ({count})
                </RoleButton>
              ))}
              <RoleButton
                onClick={() => {
                  if (selectedRole !== '무관') {
                    handleRoleSelect('무관');
                  }
                }}
                isSelected={selectedRole === '무관'}
              >
                무관
              </RoleButton>
            </RoleButtonContainerStyled>
          ) : (
            <p>역할 정보가 없습니다.</p>
          )}
        </RoleButtonContainer>
        <SubmitButton onClick={handleApplySubmit}>제출</SubmitButton>
      </Modal>

      {/* 제출 결과 팝업 */}
      {isSubmitted && (
        <Modal isOpen={isSubmitted} onClose={handleCloseSubmissionPopup}  modalType="close">
          <h3>{popupMessage}</h3>
          <CloseButton onClick={handleCloseSubmissionPopup}>Close</CloseButton>
        </Modal>
      )}
    </>
  );
};

export default ApplyPage;

const Container = styled.div`
  position: relative;
  padding: 20px;
  // margin-top: calc(100vh - 640px);
  margin-top: 300px;
  min-height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: flex-start;
`;

const BackButton = styled.button`
  position: absolute;
  left: 50px;
  top: 50px;
  background: transparent;
  border: none;
  color: #62b9ec;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;

const Title = styled.div`
  position: absolute;
  left: 10%;
  top: 50px;
  cursor: text;
  width: 80%;
  font-size: 24px;
  z-index:-3;
  font-weight: bold;
  text-align: center;

  &::after {
    content: '';
    display: block;
    border-bottom: 3px solid #62b9ec;
    margin-top: 10px;
    left: 80%;
    width: 100%;
  }
`;


const Post = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% / 2 + 80px);
  transform: translateX(16px);
  margin-top: 100px;
  margin-bottom: 20px;
  padding: 20px;
  border: 3px solid #ddd;
  border-color: rgba(160, 218, 251, 0.5);
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  white-space: nowrap;
`;

const PostDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - 120px);
  margin-bottom: 60px;
  justify-content: center;
  align-items: center;
  // margin-left:100px;
  gap: 10px;
`;

const Detail = styled.div`
  flex: 1 1 calc(100%/2 - 100px);
  min-width: 250px;
  max-width: 400px;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: bold;

  & > span:first-child {
    width: 100px;
    display: inline-block;
  }
`;

const Label = styled.span`
    color: gray; 
    width: 100px; 

`;

const PostDescription = styled.p`
  font-size: 16px;
  margin: 30px 0;
  width: calc(100% / 2 + 80px);
  text-align: left;
  color: #858585;
  min-height: 200px;

`;

const TagsSection = styled.div`
  // position: absolute;
  // bottom: 10%;
  // left: %;
  flex-wrap: wrap;
  display: flex;
  width: 800px;
  // padding-top: 30px;
  margin-left:-50px;
  gap:20px;
`;

const TagButton = styled.button`
  padding: 4px 25px;
  // margin-right: 20px;

  margin-bottom: 10px;
  border: 1px solid;
  border-radius: 14px 14px 1px 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-color: rgba(160, 218, 251);
  background-color: white;
  color: #0A8ED9;
  font-size: 16px;
`;




const ApplyButton = styled.button`
position: absolute;
 right: 5%;
 top: 82%;
  border: none;
  border-radius: 30px 30px 1px 30px;
  padding: 10px 30px;
  background-color: #62b9ec;
  color: white;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #a0dafb;
  }
`;


const ChatButton = styled.button`
position: absolute;
right: 25%;
  background: none;
  border: none;
  cursor: pointer;
  color: #62b9ec;
  font-size: 24px;

  &:hover {
    color: #a0dafb;
  }
  
`;

const AuthorSection = styled.div`
  display: flex; 
  margin-top: 20px;
  margin-bottom: 20px;
`;

const AuthorID = styled.div`
  left:25%;
  position: absolute;
  font-size: 20px;
  color: black;
  font-weight: bold;
  
`;

const CommentsSection = styled.div`
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
// width: calc(100% / 2 + 80px);
width: 100%;

`;

const Comment = styled.div`
  margin: 5px 0;
  padding: 14px;
  padding-left: 20px;
   border: 1px solid #e0e0e0;
  text-align: left;
  border: none;
  border-bottom: 2px solid rgba(160, 218, 251);

  strong{
   margin-left: 15px;
  }
  span{
    margin-left: 15px;
  }
`;

const Users= styled.div`

display: flex;
`;

const Timestamp = styled.div`
  display: flex;
  flex-direction: column;
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
  border-radius: 5px;
  margin-right: 10px;
  border-radius: 15px;
  background-color: white;

  // ::placeholder {
  //   color: #A7D6F2;
  //   opacity: 1; /* 크롬에서 기본 opacity가 0.5로 설정되어 있기 때문에 1로 설정 */
  // }


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

const RoleButton = styled.button`
  padding: 24px 25px;
  margin-bottom: 20px;
  border: 1px solid;
  border-radius: 14px 14px 1px 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-color: rgba(160, 218, 251);
  background-color: ${({ isSelected }) => (isSelected ? 'rgba(160, 218, 251)' : 'white')};
  color: #0A8ED9;
  font-size: 16px;
  white-space: nowrap;
  font-size: 18px;
  min-width: 60%;
  padding: 10px 20px;

  &:hover {
    background-color: rgba(160, 218, 251);
  }
`;

const RoleButtonContainer = styled.div`
  // margin-top: -20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; // 최대 높이 설정
  overflow-y: auto; // 세로 스크롤 가능

  position: relative; // 위치 고정을 위한 설정

  h3 {
    font-size: 24px;
    margin-bottom: 40px;
    position: sticky; // 스크롤 시 고정
    top: 0; // 상단에 고정
    background-color: white; // 배경색 설정 (필요시)
    z-index: 1; // 다른 요소 위에 표시되도록 설정
    //  padding: 20px;
  }
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 15px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 70px;


  &:hover {
    background-color: #a0dafb;
  }
`;


const CloseButton = styled(SubmitButton)`
  margin-top: 20px; 

`;

const RoleButtonContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  max-height: 400px; // 최대 높이 설정
  overflow-y: auto; // 세로 스크롤 가능
  // height: 800px;

  position: relative; // 위치 고정을 위한 설정

`;













