import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../../components/Modal';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom } from '../../../Atoms.jsx/AtomStates';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import Section2 from '../../MainPage/components/section2';
// import { SelectedProjectDetail } from '../../Atoms.jsx/AtomStates';


const SearchFeed = ({ itemList, setSearchResults }) => {
  const navigate = useNavigate();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [project, setProject] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { user } = useAuth();
  const [feedType] = useAtom(feedTypeAtom);
  const [, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  
  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`);
    setSelectedProjectDetail(project);
  };

  const handleApplyClick = async (project) => {
    if (!user) { // Check if user is logged in
      alert("로그인 후에 신청할 수 있습니다."); // Alert for login
      return; // Exit the function if not logged in
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
        setPopupMessage("이미 신청한 프로젝트입니다."); // 이미 신청한 경우 메시지 설정
        setIsSubmitted(true); // 제출 확인 팝업 표시
        return; // Exit the function if already applied
      }
    } catch (error) {
      console.error("신청 여부 확인 실패:", error);
    }
  
    setProject(project); // 선택한 프로젝트 상태 저장
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
      const applicationData = {
        pk: user.id, // 프로젝트의 pk를 사용
        sk: project.pk, 
        part: selectedRole, // 선택한 역할
        feedType: feedType // 고정된 값
      };
      await axios.post('/main/application', applicationData); // API 호출
  
      setPopupMessage("신청이 완료되었습니다.");
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
  

  return (
    <SectionWrapper>
     
    <Section2 
            projects={itemList}
            onProjectClick={handleProjectClick}
            // onLikeClick={handleLikeClick}
            onApplyClick={handleApplyClick}
            isLoggedIn={!!user}
            userId={user?.id}
            feedType={feedType}
          />
      {/* 모달 컴포넌트들... */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        project={project}
        selectedRole={selectedRole}
        handleRoleSelect={handleRoleSelect}
        handleApplySubmit={handleApplySubmit}
      />

      {/* 제출 결과 모달 */}
      {isSubmitted && (
        <Modal isOpen={isSubmitted} onClose={handleCloseSubmissionPopup}>
          <h3>{popupMessage}</h3>
          <CloseButton onClick={handleCloseSubmissionPopup}>Close</CloseButton>
        </Modal>
      )}
    </SectionWrapper>
  );
};

// 스타일 컴포넌트들...

export default SearchFeed;



const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 70px;
  margin-bottom: 40px;
  margin-top: 250px;
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
  margin-left: 120px;
`;

