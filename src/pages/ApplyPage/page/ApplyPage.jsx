import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faComment } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useAtom } from 'jotai';

import ApplyLikeButton from '../../../components/ApplyLikeButton';
import Modal from '../../../components/Modal';
import ReplySection from '../components/ReplySection';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import AuthModal from '../../../components/AuthModal';
import AlertModal from '../../../components/AlertModal';
import NavigationBar from '../../../components/NavigationBar';
import { getUserApplications, submitApplication, deleteFeed } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import { selectedProjectDetailAtom, selectedSavedProjectAtom } from '../../../atoms/AtomStates';

const ApplyPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [commentInput, setCommentInput] = useState('');
  const [project, setProject] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showAlertPopup, setShowAlertPopup] = useState('');

  const { user } = useAuth();
  const [, setSelectedSavedProject] = useAtom(selectedSavedProjectAtom);
  const [selectedProjectDetail] = useAtom(selectedProjectDetailAtom);

  useEffect(() => {
    setProject(selectedProjectDetail);
  }, [selectedProjectDetail]);

  useEffect(() => {
    if (!selectedProjectDetail) {
      navigate('/', { replace: true });
    }
  }, [selectedProjectDetail, navigate]);

  if (!project) {
    return <Container>Loading project...</Container>;
  }

  const handleApplyClick = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const appliedFeedIds = await getUserApplications(user.id);
      const isAlreadyApplied = appliedFeedIds.includes(project.pk);

      if (isAlreadyApplied) {
        setShowAlertPopup("이미 신청한 프로젝트입니다.");
        return;
      }
    } catch (error) {
      console.error("신청한 프로젝트를 가져오는 중 오류 발생:", error);
    }

    setIsRoleModalOpen(true);
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
        feedType: project.sk,
      };

      await submitApplication(applicationData);

      setProject(prevProject => {
        const updatedRecruitmentRoles = {
          ...prevProject.recruitmentRoles,
          [selectedRole]: (prevProject.recruitmentRoles[selectedRole] || 0) + 1,
        };
        return {
          ...prevProject,
          recruitmentRoles: updatedRecruitmentRoles,
        };
      });

      setShowAlertPopup("제출되었습니다.");
      setIsAuthModalOpen(false);
      setIsRoleModalOpen(false);
    } catch (error) {
      console.error("Submission failed:", error);
      setShowAlertPopup("제출에 실패했습니다. 다시 시도하세요.");
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleSignUp = () => {
    navigate('/SignupPage');
  };

  const handleLogin = () => {
    navigate('/LoginPage');
  };

  const handleEdit = () => {
    setSelectedSavedProject(project);
    navigate('/WritePage1');
  };

  const handleDelete = async () => {
    try {
      await deleteFeed(project.pk, project.sk, user.id);
      setShowAlertPopup('게시물이 삭제되었습니다.');
      setPopupMessage(false);
      navigate('/');
    } catch (error) {
      console.error('게시물 삭제 실패:', error);
      setShowAlertPopup('게시물 삭제에 실패했습니다.');
    }
  };

  const handleChatClick = () => {
    if (user && user?.id !== project.creatorId) {
      navigate(`/messagePage`, { state: { selectedPersonId: project.creatorId } });
    }
  };

  return (
    <>
      <ContentsWrap>
        <MainContent Wide1030>
          <NavigationBar showSearch={true} />

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
                feedId={project.pk}
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
              <FontAwesomeIcon icon={faComment} onClick={() => handleChatClick()} />
            </ChatButton>
          </AuthorSection>
        </MainContent>
      </ContentsWrap>

      <ReplySection
        comments={project.comments}
        commentInput={commentInput}
        setCommentInput={setCommentInput}
        project={project}
        user={user}
        projectId={projectId}
      />

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
`;

const Container = styled.div`
  position: relative;
  padding: 20px;
  margin-top: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-bottom: 20px;
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
