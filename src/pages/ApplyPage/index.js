import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import { useNavigate , useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faComment } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import LikeButton from '../../components/LikeButton';
import Modal from '../../components/Modal'; // 모달 컴포넌트 import

const ApplyPage = ({}) => {
  const navigate = useNavigate(); 
  const {projectId } = useParams(); // URL에서 projectId 가져오기
  //usestate : 컴포넌트 상태 관리에 씀
  //첫번째 요소: 현재 상태 값, 두번째 요소 : 상태를 없데이트하는 값 
  const [commentInput, setCommentInput] = useState('');
  const [project, setProject] = useState(null);
  const [liked, setLiked] = useState(false);
  const isLoggedIn = true; // 또는 false로 설정하여 로그인 상태를 나타냄
  const showSearch = true;
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태

  const fetchProjectDetails = async () => {
    try {
      // projectId를 'FEED#5678' 형태로 변환
      const formattedProjectId = projectId.slice(0, 4) + '#' + projectId.slice(4);
      
      // 데이터 가져오기
      const response = await axios.get('/data.json');
  
      // 가져온 데이터에서 특정 프로젝트 찾기
      const selectedProject = response.data.find(item => item.pk === formattedProjectId);
      // 상태 업데이트
      setProject(selectedProject);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  //selectedProject 변수에 items 배열에서 pk와 projectId가 일치하는 첫번째 프로젝트가 저장됨
  //find() 메서드는 배열에서 조건을 만족하는 첫번쨰 요소(items의 [0]) 반환 
  //item : items 배열의 각 요소를 나타냄( 화살표 함수의 매개변수)

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId])
  //useEffect : 컴포넌트가 렌더링 된 후에 사이드 이펙트 수행을 위함 . 데이터 fecthing등에 사용됨 
  //projecId가 변경될 때 마 실행
  //첫번째 인자: 실행할 함수 , 두번째 인재 의존성 배열

  const handleLike = () => {
    setLiked(prevLiked => {
      const newLikedState = !prevLiked;
      if (project) {
        setProject(prevProject => ({
          ...prevProject,
          likesCount: newLikedState ? prevProject.likesCount + 1 : prevProject.likesCount - 1
        }));
      }
      
      return newLikedState; // 새로운 좋아요 상태 반환
    });
  };

  const handleCommentSubmit = () => {
    if (commentInput.trim() && project) {
      const newComment = {
        userid: "USER#1234",  // 현재 사용자 ID
        comment: commentInput,
        timestamp: new Date().toISOString()  // 현재 시간
      };

      // 기존 댓글 배열에 새로운 댓글 추가
      setProject(prevProject => ({
        ...prevProject,
        comments: [...prevProject.comments, newComment]  // 댓글 추가
      }));

      setCommentInput('');  // 입력 필드 초기화
    }
  };

  // 프로젝트가 로딩 중일 때
  if (!project) {
    return <Container>Project ID:{projectId}</Container>;
  }

  const handleApplyClick = () => {
    setIsRoleModalOpen(true); // 역할 선택 모달 열기
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleApplySubmit = async () => {
    if (!selectedRole) {
      alert("역할을 선택하세요.");
      return;
    }

    // 역할 선택 모달 닫기
    setIsRoleModalOpen(false);

    try {
      // 선택한 역할을 서버에 전송
      await postSelectedRole(selectedRole);

      setPopupMessage("제출되었습니다.");

      // 제출 확인 팝업 표시
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);

      setPopupMessage("제출에 실패했습니다. 다시 시도하세요.");
      
      // 제출 확인 팝업 표시
      setIsSubmitted(true);
    }
  };

  // 제출 확인 팝업 닫기 함수
  const handleCloseSubmissionPopup = () => {
    setIsSubmitted(false);
    setPopupMessage(''); // 메시지 초기화
  };

  // 선택한 역할을 서버에 전송하는 모의 함수
  const postSelectedRole = async (role) => {
    try {
      const response = await axios.post('/api/submitRole', { role });
      return response.data; // 서버로부터의 응답 데이터 반환
    } catch (error) {
      throw new Error('서버 요청 실패');
    }
  };

  return (
    <>
      <Nav isLoggedIn={isLoggedIn} showSearch={showSearch}/>
      <Container>
        <BackButton onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
          이전
        </BackButton>

        <Title> {project.title} </Title>

        <LikeButton 
          initialLiked={liked} 
          initialLikesCount={project.likesCount} 
          onLikeChange={handleLike} // handleLike로 변경
          buttonStyle='apply'
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
                {project.role && Array.isArray(project.role) ? (
                  project.role.map((role, index) => (
                    <span key={index}>{role.name}({role.count})</span>
                  ))
                ) : (
                  <span>역할 정보를 불러오는 중입니다...</span>
                )}
            </Detail>
            <Detail>
                <Label>모집 현황 |</Label> {project.applyNum ? `${project.applyNum}명 / ${project.recruitmentNum}명` : '정보 없음'}
            </Detail>
            <Detail>
                <Label>신청자 수 |</Label> 백엔드(3), 디자이너(1)
            </Detail>
       
        </PostDetails>

          <TagsSection>
          {project.tags.map((tag, index) => (
              <TagButton key={index}>{tag}</TagButton>
            ))}
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

          <AuthorID> <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} /> 작성자: {project.creatorID}</AuthorID>
          </AuthorSection>
        

        <CommentsSection>
          <CommentsTitle>댓글 ({project.comments.length})</CommentsTitle>
      
           <CommentInputWrapper>
            <CommentInput
          
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글을 입력해 주세요."
            />
              <CommentButton onClick={handleCommentSubmit}>등록</CommentButton>

              </CommentInputWrapper> 

              <CommentsList>
            {project.comments.map((comment, index) => (
              <Comment key={index}>

                <Users>
                <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
                <Timestamp>
                <strong >{comment.userID} </strong>
                <span style={{ fontSize: 'small', color: '#aaa' }}>
                {new Date(comment.timestamp).toLocaleDateString()} {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                </Timestamp>

                </Users>

                <Comments>
                {comment.comment}
                </Comments>
              </Comment>
            ))}
          </CommentsList>
          
        </CommentsSection>
      </Container>

      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} modalType="apply">
       
        <RoleButtonContainer>
        <h3>지원할 역할을 선택하세요</h3>
          {project && project.role ? (
            project.role.map((role, index) => (
              <RoleButton
                key={index}
                onClick={() => handleRoleSelect(role)}
                isSelected={selectedRole === role}
              >
                {role.name}
              </RoleButton>
            ))
          ) : (
            <p>역할 정보를 불러오는 중입니다...</p>
          )}
        </RoleButtonContainer>
        <SubmitButton onClick={handleApplySubmit}>제출</SubmitButton>
      </Modal>

      {/* 제출 결과 팝업 */}
      {isSubmitted && (
        <Modal isOpen={isSubmitted} onClose={handleCloseSubmissionPopup}>
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
  margin-top: 250px;
  min-height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: flex-start;
`;

const BackButton = styled.button`
  position: absolute;
  left: 10%;
  top: 5%;
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
  top: 5%;
  cursor: text;
  width: 80%;
  font-size: 24px;
  z-index:-3;
  font-weight: bold;

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
 position: absolute;
 
  bottom: 10%;
  left: 10%;
  flex-wrap: wrap;
`;

const TagButton = styled.button`
  padding: 4px 25px;
  margin-right: 20px;
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

  h3{
    font-size: 24px;
    margin-bottom: 40px;
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












