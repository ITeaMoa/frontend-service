import React, { useState, useEffect,  } from 'react';
import styled from 'styled-components';
// import Nav from '../../../components/Nav';
import { useNavigate , useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faComment } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
// import axios from 'axios';
import ApplyLikeButton from '../../../components/ApplyLikeButton';
import Modal from '../../../components/Modal'; // 모달 컴포넌트 import
import axios from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext'
// import items from '../../data'; // items를 import 추가
import CommentsSection2 from '../components/CommentsSection2'; // CommentsSection import 추가
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import AuthModal from '../../../components/AuthModal';
import { useAtom } from 'jotai';
import {  selectedProjectDetailAtom, selectedSavedProjectAtom,  } from '../../../Atoms.jsx/AtomStates';
import AlertModal from '../../../components/AlertModal';
// import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';



const ApplyPage = () => {
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  //  const nickname = user ? user.nickname : 'Unknown'; //사용자 닉네임 설정
  //  const [user, setUser] = useAtom(USER);
  //  const [, setIsLoggedIn] = useAtom(IS_LOGGED_IN);
  const [, setSelectedSavedProject] = useAtom(selectedSavedProjectAtom);
  // const [popupDeleteMessage, setPopupDeleteMessage] = useState(false);
  // const [feedType, setFeedType] = useAtom(feedTypeAtom);
  // const [userProfile, setUserProfile] = useAtom(USER_PROFILE);
  const [selectedProjectDetail, ] = useAtom(selectedProjectDetailAtom);
  const [showAlertPopup, setShowAlertPopup] = useState('');





  //이것만 사용해도 될스도 있음. 위에거 삭제하고
useEffect(() => {
  setProject(selectedProjectDetail);
}, [selectedProjectDetail]);
  // setProject(selectedProjectDetail);   -> d아톰 이용    댓글 바뀔때도 리렌더링 되게 해야함 



useEffect(() => {

  if (!selectedProjectDetail) {
    navigate('/', { replace: true });
  }
}, [selectedProjectDetail, navigate]);



  // 프로젝트가 로딩 중일 때
  if (!project) {
    return <Container>Loading project...</Container>;
  }

  const handleApplyClick = async () => {

    if (!user) { 
      setIsAuthModalOpen(true); 
      return; 
    }

    try {
      const response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });
 
      const appliedProjects = response.data.map(app => app.feedId); // 신청한 프로젝트의 feedId 목록

      // 선택한 프로젝트의 pk와 비교
      const isAlreadyApplied = appliedProjects.includes(project.pk);
      if (isAlreadyApplied) {
        setShowAlertPopup("이미 신청한 프로젝트입니다."); // 이미 신청한 경우 메시지 설정

        return; 
      }
    } catch (error) {
      console.error("신청한 프로젝트를 가져오는 중 오류 발생:", error);
    }

    setIsRoleModalOpen(true); // 역할 선택 모달 열기
  };



  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleApplySubmit = async () => {
    if (!selectedRole) {
      setShowAlertPopup("역할을 선택하세요.");
      return;
    }


    try {
     
      const applicationData = {
        pk: user.id,
        sk: project.pk,
        part: selectedRole,
        feedType: project.sk
      };

  
      const response = await axios.post('/main/application', applicationData);
      

       // // 제출 후 프로젝트 상태를 즉시 업데이트
      setProject(prevProject => {
        const updatedRecruitmentRoles = {
          ...prevProject.recruitmentRoles,
          [selectedRole]: (prevProject.recruitmentRoles[selectedRole] || 0) + 1 // 선택한 역할의 수를 증가
        };
        return {
          ...prevProject,
          recruitmentRoles: updatedRecruitmentRoles // recruitmentRoles 업데이트
        };
      });
      
      setShowAlertPopup("제출되었습니다.");
      setIsAuthModalOpen(false);
      setIsRoleModalOpen(false);
    } catch (error) {
      console.error("Submission failed:", error);
      setShowAlertPopup("제출에 실패했습니다. 다시 시도하세요.");
      // setIsAuthModalOpen(true);
    }
  };

  

  // 인증 팝업 닫기 핸들러
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 회원가입 페이지로 이동
  const handleSignUp = () => {
    navigate('/SignupPage');
  };

  // 로그인 페이지로 이동
  const handleLogin = () => {
    navigate('/LoginPage');
  };

  


// const handleToggleChange = (newFeedType) => {
//   setCurrentFeedType(newFeedType);
//   console.log("Current feedType:", newFeedType);
// };

const handleEdit = () => {
  setSelectedSavedProject(project);
  navigate('/WritePage1');
};

const handleDelete = async () => {
  try {
    await axios.delete(
      `/feed/${project.pk}`,
      {
        params: {
          feedType: project.sk,
          userId: user.id
        }
      }
    );
    // 삭제 성공 후 원하는 동작 (예: 메인 페이지로 이동)
    setShowAlertPopup('게시물이 삭제되었습니다.');
    setPopupMessage(false);
    navigate('/');
    // 예시: navigate('/') 또는 window.location.href = '/'
  } catch (error) {
    console.error('게시물 삭제 실패:', error);
    setShowAlertPopup('게시물 삭제에 실패했습니다.');
  }
};


const handleChatClick = () => {
  if(user && user?.id !== project.creatorId) {
    navigate(`/messagePage`, { state: { selectedPersonId: project.creatorId } });
  } else if (user?.id === project.userId) {
    return;
  } else {
    return;
  } 
  };

  // useEffect(() => {
  //   // 새로고침 시(페이지가 처음 마운트될 때) /로 이동
  //   if (performance && performance.navigation.type === 1) {
  //     navigate('/', { replace: true });
  //   }
  // }, [navigate]);


  return (
    <>
    <ContentsWrap>
    <MainContent Wide1030>
      <NavigationBar showSearch={true}/>


        <BackButton onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
          이전
        </BackButton>

        <TopBox>
          <TopTitleRow>
            <div>
              <TopTitle>{project.title}</TopTitle>
              <TagRow>
                {project.tags?.map((tag, i) => (
                  <Tag key={i}>{tag}</Tag>
                ))}
              </TagRow>
            </div>
          </TopTitleRow>
          <InfoTable>
            <InfoRow>
              <InfoCell><InfoLabel>모집 구분</InfoLabel> {project.type || '프로젝트'}</InfoCell>
              <InfoCell><InfoLabel>마감일</InfoLabel> {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}</InfoCell>
            </InfoRow>
            <InfoRow>
              <InfoCell><InfoLabel>모집 인원</InfoLabel> {project.recruitmentRoles ? Object.values(project.recruitmentRoles).reduce((a, b) => a + b, 0) : 0}/{project.recruitmentNum}</InfoCell>
              <InfoCell><InfoLabel>게시 일자</InfoLabel> {project.timestamp ? new Date(project.timestamp).toLocaleDateString() : '-'}</InfoCell>
            </InfoRow>
            <InfoRow>
              <InfoCell><InfoLabel>진행 기간</InfoLabel> {project.period ? `${project.period}개월` : '-'}</InfoCell>
              <InfoCell><InfoLabel>진행 장소</InfoLabel> {project.place || '-'}</InfoCell>
            </InfoRow>
            <InfoRow>
              <InfoCell>
                <InfoLabel>신청자 수</InfoLabel>
                {project.recruitmentRoles
                  ? Object.entries(project.recruitmentRoles).map(([role, count], idx) => (
                      <span key={idx}>{role}({count}){idx < Object.entries(project.recruitmentRoles).length - 1 ? ', ' : ''}</span>
                    ))
                  : '-'}
              </InfoCell>
              <InfoCell>
                <InfoLabel>모집 역할</InfoLabel>
                {project.roles
                  ? Object.entries(project.roles).map(([role, count], idx) => (
                      <span key={idx}>{role}({count}){idx < Object.entries(project.roles).length - 1 ? ', ' : ''}</span>
                    ))
                  : '-'}
              </InfoCell>
            </InfoRow>
          </InfoTable>


          {user && user.id === project.creatorId ? (
                    <AuthorActions>
                    <ActionButton onClick={handleEdit}>수정</ActionButton>
                    <ActionButton onClick={() => setPopupMessage(true)}>삭제</ActionButton>
                  </AuthorActions>
          ) : (
            <ApplyButton onClick={handleApplyClick}>신청하기</ApplyButton>
          
          )}
        </TopBox>

        <PostDescription>
          {project.content}
        </PostDescription>

        <BottomRow>
        
          <BottomInfo>
            <ApplyLikeButton 
              initialLikesCount={project.likesCount} 
              buttonStyle="apply"
              sk={project.pk}
              feedType={project.sk} 
            />
            <span style={{ color: '#888' }}>
              조회 {project.views ?? 0}
            </span>
          </BottomInfo>
        </BottomRow>

        <AuthorSection>
        <AuthorID>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} />
            작성자: {project.nickname}
          </AuthorID>
          <ChatButton>
            <FontAwesomeIcon icon={faComment} onClick={() => handleChatClick()}/>
          </ChatButton>

         
        
          </AuthorSection>
        
          </MainContent>
    {/* </PageContainer> */}
    </ContentsWrap>
        <CommentsSection2
          comments={project.comments} 
          commentInput={commentInput} 
          setCommentInput={setCommentInput} 
          project={project} 
          user={user} 
          projectId={projectId} 
          // fetchProjectDetails={fetchProjectDetails} 
          
        />
      {/* </Container> */}

      

        <RoleSelectionModal 
          isOpen={isRoleModalOpen} 
          onClose={() => setIsRoleModalOpen(false)} 
          project={project} 
          selectedRole={selectedRole} 
          handleRoleSelect={handleRoleSelect} 
          handleApplySubmit={handleApplySubmit} 
        />

<AlertModal
  isOpen={!!showAlertPopup}
  message={showAlertPopup}
  onClose={() => setShowAlertPopup(false)}
/>


      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
          handleSignUp={handleSignUp}
          handleLogin={handleLogin}
        />
      )}
       
       {popupMessage && (
    <Modal
      isOpen={!!popupMessage}
      onClose={() => setPopupMessage('')}
    showFooter={true}
    onConfirm={handleDelete}
    >
     <h3 style={{ textAlign: 'center' }}>정말로 삭제 하시겠습니까?</h3>
      
    </Modal>
  )}

<AlertModal
  isOpen={!!showAlertPopup}
  message={showAlertPopup}
  onClose={() => setShowAlertPopup(false)}
/>
    </>
  );
};

export default ApplyPage;

 const ContentsWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  gap: ${(props) => (props.isMobile ? "20px" : "40px")};
  padding: ${(props) => (props.isMobile ? "20px" : "0 4px 0 0")};
  min-height: 100vh;

`;

 const MainContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${(props) =>
    props.Wide
      ? "1024px"
      : props.Wide1030
      ? "1030px"
      : props.Wide1240
      ? "1240px"
      : "820px"};
  width: 100%;
  justify-content: flex-start;
  padding: 57px 0 40px;
  margin: 0 auto;
  // padding: ${(props) => (props.isMobile ? "0" : "0 20px")};
`;


const Container = styled.div`
  position: relative;
  padding: 20px;
  // margin-top: calc(100vh - 640px);
  margin-top: 300px;
  // min-height: calc(100vh - 250px);
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

const TopBox = styled.div`
  background: #f5fbff;
  border-radius: 12px;
  padding: 32px 32px 60px 32px;
  margin-bottom: 32px;
`;

const TopTitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const TopTitle = styled.h2`
  font-size: 26px;
  font-weight: bold;
  color: #222;
  margin: 0;
  margin-right: 30px;
  margin-bottom:20px;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Tag = styled.div`
  background: #00aeff;
  color: #fff;
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 15px;
  font-weight: 500;
`;

const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 32px;
`;

const InfoCell = styled.div`
  flex: 1;
  font-size: 16px;
  color: #222;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoLabel = styled.span`
  color: #888;
  font-weight: 600;
  margin-right: 6px;
`;

const PostDescription = styled.p`
  font-size: 16px;
  margin: 30px 0;
  width: 100%;
  text-align: left;
  color: #222;
  min-height: 200px;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  margin-top: 24px;
`;

const BottomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
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
  // max-width: 400px;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: bold;
   flex-wrap: wrap;

  & > span:first-child {
    width: 100px;
    display: inline-block;
  }
`;

const Label = styled.span`
    color: gray; 
    width: 100px; 

`;

// const PostDescription = styled.p`
//   font-size: 16px;
//   margin: 30px 0;
//   width: calc(100% / 2 + 80px);
//   text-align: left;
//   color: #858585;
//   min-height: 200px;

// `;

const TagsSection = styled.div`
  // position: absolute;
  // bottom: 10%;
  // left: %;
  flex-wrap: wrap;
  display: flex;
  // width: 700px;
  width: 80%;
  // padding-top: 30px;
  margin-left:-100px;
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
 top: 55%;
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
// position: absolute;
// left: 12%;
  background: none;
  border: none;
  cursor: pointer;
  color: #62b9ec;
  font-size: 20px;


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
  // left:25%;
  // position: absolute;
  font-size: 20px;
  color: black;
  font-weight: bold;
  
`;

const AuthorActions = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
 right: 5%;
 top: 55%;
`;

const ActionButton = styled.button`
  padding: 5px 12px;
  border: none;
  border-radius: 5px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #a0dafb;
  }
`;





const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #a0dafb;
  }
`;






