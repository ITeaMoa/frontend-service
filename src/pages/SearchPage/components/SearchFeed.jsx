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
import AlertModal from '../../../components/AlertModal';


const SearchFeed = ({ itemList }) => {
  const navigate = useNavigate();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [project, setProject] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { user } = useAuth();
  const [feedType] = useAtom(feedTypeAtom);
  const [, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  
  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`);
    setSelectedProjectDetail(project);
  };

  const handleApplyClick = async (project) => {
    if (!user) {
      setAlertMessage("로그인 후에 신청할 수 있습니다.");
      setShowAlert(true);
      return; 
    }
    try {
      const response = await axios.get('/feed/applications', {
        params: {
          userId: user.id,
        }
      });

      const appliedProjects = response.data.map(app => app.feedId); 
  
      const isAlreadyApplied = appliedProjects.includes(project.pk);
      if (isAlreadyApplied) {
        setPopupMessage("이미 신청한 프로젝트입니다."); 
        setIsSubmitted(true); 
        return; 
      }
    } catch (error) {
      console.error("신청 여부 확인 실패:", error);
    }
  
    setProject(project); 
    setIsRoleModalOpen(true); 
  };
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  
  const handleApplySubmit = async () => {
    if (!selectedRole) {
      setAlertMessage("역할을 선택하세요.");
      setShowAlert(true);
      return;
    }
    setIsRoleModalOpen(false);
    try {
      const applicationData = {
        pk: user.id, 
        sk: project.pk, 
        part: selectedRole,
        feedType: feedType
      };
      await axios.post('/main/application', applicationData);
  
      setPopupMessage("신청이 완료되었습니다.");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setPopupMessage("제출에 실패했습니다. 다시 시도하세요.");
      setIsSubmitted(true);
    }
  };
  
  const handleCloseSubmissionPopup = () => {
    setIsSubmitted(false);
    setPopupMessage(''); 
  };
  

  return (
    <SectionWrapper>
     
    <Section2 
            projects={itemList}
            onProjectClick={handleProjectClick}
            onApplyClick={handleApplyClick}
            isLoggedIn={!!user}
            userId={user?.id}
            feedType={feedType}
          />

      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        project={project}
        selectedRole={selectedRole}
        handleRoleSelect={handleRoleSelect}
        handleApplySubmit={handleApplySubmit}
      />


      {isSubmitted && (
        <Modal isOpen={isSubmitted} onClose={handleCloseSubmissionPopup}>
          <h3>{popupMessage}</h3>
          <CloseButton onClick={handleCloseSubmissionPopup}>Close</CloseButton>
        </Modal>
      )}
      <AlertModal 
        isOpen={showAlert} 
        message={alertMessage} 
        onClose={() => setShowAlert(false)} 
      />
    </SectionWrapper>
  );
};


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

