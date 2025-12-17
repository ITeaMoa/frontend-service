import React, { useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../components/Pagination'; 
import { getFeedApplications, closeFeed, acceptApplication, rejectApplication, getFeedApplicationsByPart } from '../../../api';
import Modal from '../../../components/Modal';
import { useAtom } from 'jotai';
import { currentApplicantsAtom } from '../../../Atoms.jsx/AtomStates';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../../components/AlertModal';

const ProjectDetail = ({ project, onBack, onClose}) => {
    const navigate = useNavigate();
    const [applicants, setApplicants] = useAtom(currentApplicantsAtom);
    const [visibleButtons, setVisibleButtons] = useState({});
    const [clickedButtons, setClickedButtons] = useState({});
    const [selectedField, setSelectedField] = useState('전체');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const applicantsPerPage = 5;
    const [isClosed, setIsClosed] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [disabledButtons, setDisabledButtons] = useState({});
    const [currentApplicants, setCurrentApplicants] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const roles = project && project.roles ? 
        ['전체', ...Object.entries(project.roles).map(([roleName, count]) => ({ name: roleName, count }))] : 
        [];



    const fetchApplications = useCallback(async (feedId) => {
        if (!feedId) {
            console.error('feedId가 정의되지 않았습니다. 지원자를 가져올 수 없습니다.');
            return;
        }

        try {
            const response = await getFeedApplications(feedId);

            if (response.data) {
                setApplicants(response.data);
            } else {
                setApplicants([]);
            }
        } catch (error) {
            console.error("지원자 정보를 가져오는 중 오류 발생:", error);
            setApplicants([]);
        }
    }, [setApplicants]);


    useEffect(() => {
        if (project?.pk) {
            fetchApplications(project.pk);
        }
    }, [fetchApplications, project]);


    useEffect(() => {
        const initialStatus = localStorage.getItem(`projectStatus_${project.pk}`);
        if (initialStatus) {
            const parsedStatus = JSON.parse(initialStatus);
            setVisibleButtons(parsedStatus);
            setIsClosed(parsedStatus[project.pk] === 'completed');
        }
    }, [project.pk]);


     useEffect(() => {
        if (selectedField === '전체') {
            setCurrentApplicants(applicants || []);
        } else {
            setCurrentApplicants(applicants.filter(applicant => applicant.part === selectedField));
        }
    }, [selectedField, applicants]);
     
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    const handleStatusChange = (applicant, status) => {
        if (disabledButtons[applicant.name]) return; // 비활성화된 버튼이면 함수 종료

        setSelectedApplicant(applicant);
        setNewStatus(status);
        setIsPopupVisible(true);
    };


    const confirmStatusChange = async () => {
        const requestData = {
            pk: selectedApplicant.pk, // 선택한 지원자의 pk
            sk: project.pk // feedId
        };

        const url = newStatus === "반려" ? 'my/writing/reject' : 'my/writing/accept';

        try {
           if (url === 'my/writing/accept') {
             await acceptApplication(requestData);
           } else {
             await rejectApplication(requestData);
           }

    
            setVisibleButtons(prevState => ({ ...prevState, [selectedApplicant.nickname]: newStatus }));
            setClickedButtons(prevState => ({ ...prevState, [selectedApplicant.nickname]: newStatus }));
            setDisabledButtons(prevState => ({ ...prevState, [selectedApplicant.nickname]: true }));
            setAlertMessage(newStatus === "반려" ? "지원자가 반려되었습니다." : "지원자가 승인되었습니다.");
            setShowAlert(true);
        } catch (error) {
            console.error(`Error changing status for ${selectedApplicant.nickname}:`, error);
        } finally {
            setIsPopupVisible(false);
        }
    };


    const cancelStatusChange = () => {
        setIsPopupVisible(false);
    };

    const handleFieldClick = async (field) => {
        setSelectedField(field);
        if (project && project.pk) {
            try {
                if (field === '전체') {
                    await fetchApplications(project.pk); 
                } else {
                    const response = await getFeedApplicationsByPart(project.pk, field);
                    setApplicants(response.data);
                }
            } catch (error) {
                console.error("역할에 따른 지원서 가져오는 중 오류 발생:", error);
            }
        }
    };
 

    const handleCloseApplication = () => {
        setIsConfirmModalOpen(true); 
    };

    const handleConfirmClose = () => {
        try {
            onClose(project.pk, 'completed'); 
            const updatedStatus = { ...visibleButtons, [project.pk]: 'completed' }; 
            setVisibleButtons(updatedStatus);
            localStorage.setItem(`projectStatus_${project.pk}`, JSON.stringify(updatedStatus)); 
            setIsClosed(true); 
        } catch (error) {
            console.error('오류:', error);
            setAlertMessage('모집 완료 처리 중 문제가 발생했습니다.');
            setShowAlert(true);
        } finally {
            setIsConfirmModalOpen(false); 
        }
    };

    useEffect(() => {
        const checkStatus = () => {
        localStorage.getItem(`projectStatus_${project.pk}`);
        };
        checkStatus();
    }, [project.pk]);

    return (
        <DetailContainer>
            <LeftSection>
                <DetailHeader>
                    <h2>{project.title}</h2>
                </DetailHeader>
                <DetailInfo>
                    <InfoItem>모집 구분 | 프로젝트</InfoItem>
                    <InfoItem>게시 일자 | {new Date(project.timestamp).toLocaleDateString()}</InfoItem>
                    <InfoItem>마감 일자  | {new Date(project.deadline).toLocaleDateString()}</InfoItem>
                    <InfoItem>진행 장소 | {project.place}</InfoItem>
                    <InfoItem>모집 현황 | {project.recruitmentRoles && Object.entries(project.recruitmentRoles).length > 0 ? (
                        Object.entries(project.recruitmentRoles).reduce((total, [, count]) => total + count, 0)
                    ) : 0}명 / {project.recruitmentNum}명</InfoItem>
                    <InfoItem>진행 기간 | {project.period}개월</InfoItem>
                    <InfoItem>모집 역할 | {roles && roles.length > 0 ? (
                        roles.filter(role => role !== '전체').map((role, index) => ( 
                            typeof role === 'string' ? (
                                <span key={index}>{role}</span>
                            ) : (
                                <span key={index}>{role.name}({role.count})</span>
                            )
                        ))
                    ) : (
                        <span>역할 정보가 없습니다.</span>
                    )}</InfoItem>
                
                    <InfoItem>신청자 수 | {project.recruitmentRoles && Object.entries(project.recruitmentRoles).length > 0 ? (
                  Object.entries(project.recruitmentRoles).map(([role, count], index) => (
                    <span key={index}>{role}({count}){index < Object.entries(project.recruitmentRoles).length - 1 ? ', ' : ''}</span>
                  ))
                ) : (
                  <span>신청자가 없습니다.</span>
                )}</InfoItem>
                </DetailInfo>
                <Tags>
                    {project.tags && Array.isArray(project.tags) && project.tags.length > 0 ? (
                        project.tags.map((tag, index) => (
                            <Tag key={index}>{tag}</Tag>
                        ))
                    ) : (
                        <span>태그가 없습니다.</span>
                    )}
                </Tags>
                <ButtonContainerHorizontal>
                    <BackButton onClick={onBack}>목록</BackButton>
                    <Button 
                        onClick={handleCloseApplication}
                        isClicked={isClosed}
                        disabled={isClosed || (project.postStatus === false && project.savedFeed === false)} 
                        style={{ backgroundColor: (project.postStatus === false && project.savedFeed === false) ? '#808080' : undefined, opacity: (project.postStatus === false && project.savedFeed === false) ? 0.6 : 1 }} // 버튼 색상 및 불투명도 변경
                    >
                        모집완료
                    </Button>
                </ButtonContainerHorizontal>
            </LeftSection>
            <RightSection>
                <ApplicationStatus>
                    <HeaderContainer>
                        <h3>신청현황</h3>
                        <FieldButtons>
                            {Array.isArray(roles) && roles.length > 0 ? (
                                roles.map((field, index) => {
                                    const fieldName = typeof field === 'string' ? field : field.name;
                                    return (
                                        <FieldButton 
                                            key={index} 
                                            onClick={() => handleFieldClick(fieldName)}
                                            $isSelected={selectedField === fieldName}
                                        >
                                            {fieldName}
                                        </FieldButton>
                                    );
                                })
                            ) : (
                                <span>역할 정보가 없습니다.</span>
                            )}
                        </FieldButtons>
                    </HeaderContainer>
                    { currentApplicants.length === 0 ? (
                        <p>신청자가 없습니다.</p>
                    ) : (
                        currentApplicants.map((applicant, index) => {
                            return (
                                <StyledApplicantWrapper key={index}>
                                    <Applicant>
                                    <FontAwesomeIcon icon={faComment} onClick={() => navigate(`/messagePage`, { state: { selectedPersonId: applicant.pk } })} style={{ color: '#62b9ec', fontSize: '24px', marginLeft: '20px' }} />
                                    <ApplicantName >{applicant.nickname}</ApplicantName>
                                    <Tags2>
                                
                                            {/* 태그가 있을 경우 추가 */}
                                            {applicant.tags && applicant.tags.length > 0 ? (
                                                applicant.tags.map((tag, idx) => (
                                                    <Tag key={idx}>{tag}</Tag>
                                                ))
                                            ) : (
                                                <Tag>none</Tag>
                                            )}
                                        </Tags2>

                                
                                        <ButtonContainer singleButton={currentApplicants.length === 1}>
                                            {applicant.status === "REJECTED" ? (
                                                <StatusButton 
                                                    onClick={() => handleStatusChange(applicant, "반려")}
                                                    isClicked={true}
                                                    disabled={disabledButtons[applicant.nickname]}
                                                >
                                                    반려
                                                </StatusButton>
                                            ) : applicant.status === "ACCEPTED" ? (
                                                <StatusButton 
                                                    onClick={() => handleStatusChange(applicant, "승인")}
                                                    isClicked={true}
                                                    disabled={disabledButtons[applicant.nickname]}
                                                >
                                                    승인
                                                </StatusButton>
                                            ) : (
                                                <>
                                                    <StatusButton 
                                                        onClick={() => handleStatusChange(applicant, "승인")}
                                                        isClicked={clickedButtons[applicant.nickname] === "승인"}
                                                        disabled={disabledButtons[applicant.nickname]}
                                                    >
                                                        승인
                                                    </StatusButton>
                                                    <StatusButton 
                                                        onClick={() => handleStatusChange(applicant, "반려")}
                                                        isClicked={clickedButtons[applicant.nickname] === "반려"}
                                                        disabled={disabledButtons[applicant.nickname]}
                                                    >
                                                        반려
                                                    </StatusButton>
                                                </>
                                            )}
                                        </ButtonContainer>
                                    </Applicant>
                                </StyledApplicantWrapper>
                            );
                        })
                    )}
                </ApplicationStatus>
                <StyledPaginationContainer>
                     <Pagination 
                        currentPage={currentPage}
                        totalProjects={applicants.length}
                        projectsPerPage={applicantsPerPage} 
                        onPageChange={paginate} 
                    />
                </StyledPaginationContainer>
            </RightSection>

 
            {isPopupVisible && (
                <PopupOverlay>
                    <Popup>
                        <PopupHeader>확인</PopupHeader>
                        <PopupMessage>
                            {newStatus === "반려" 
                                ? "정말로 반려하시겠습니까?" 
                                : "정말로 승인하겠습니까?"}
                        </PopupMessage>
                        <PopupButtonContainer>
                            <PopupButton onClick={confirmStatusChange}>예</PopupButton>
                            <PopupButton onClick={cancelStatusChange}>아니오</PopupButton>
                        </PopupButtonContainer>
                    </Popup>
                </PopupOverlay>
            )}

        <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
                <h3 style={{ textAlign: 'center' }}>정말로 모집완료 하시겠습니까?</h3>
                <ButtonContainer>
                    <ModalButton onClick={handleConfirmClose}>확인</ModalButton>
                    <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton>
                </ButtonContainer>
            </Modal>
            <AlertModal 
                isOpen={showAlert} 
                message={alertMessage} 
                onClose={() => setShowAlert(false)} 
            />
        </DetailContainer>
    );
};
const DetailContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 60px;
    animation: slideIn 0.1s ease-out;
 

    @keyframes slideIn {
        from {
            transform: translateX(-50%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

const LeftSection = styled.div`
    position: relative;
    flex: 1;
    margin-right: 20px; 
    max-height: 400px;
    border: 2px solid #A0DAFB;
    border-radius: 20px;
    background: white;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;    
    justify-content: center;

`;

const RightSection = styled.div`
    position: relative;
    max-width: 600px;
    min-height: 600px;
    border: 2px solid #A0DAFB;
    border-radius: 20px;
    padding-bottom: 5px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;

`;

const DetailHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DetailInfo = styled.div`
    margin: 20px 0;
    display: grid;
    text-align: left;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;
    margin-bottom: 20px;
`;

const InfoItem = styled.p`
    margin: 5px 0;
`;

const Tags = styled.div`
    position: absolute;
    margin-top: 200px;
    display: flex;
    // justify-content: flex-start;
    left: 30px;
  
    
`;

const Tags2 = styled.div`
    margin-top:1px;
    display: flex;
    flex-wrap: wrap;
    // margin-left: 36px;
    // min-height: 20px;
    margin-left:-120px;
    
    
`;

const Tag = styled.span`
    padding: 5px 10px;
    margin: 5px;
    font-size: 14px;
    border: 1px solid ;
    border-radius: 14px 14px 1px 14px; //반시계 ㅔ방향
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-color: rgba(160, 218, 251);
    background-color: white;
    color: #0A8ED9 ;
`;

const ApplicationStatus = styled.div`
    text-align: left;
    width: 100%; 
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; 
    align-items: center;
    padding-top: 20px; 
`;

const StyledApplicantWrapper = styled.div`
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

`;

const Applicant = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:5px;
    border-bottom: 2px solid #A0DAFB;
    border-radius: 1px;
    min-width: 600px;
    box-sizing: border-box;
    margin-top: 10px;
    text-align: left;
`;

// const ButtonContainer = styled.div`
//     margin-left: auto; 
//     display: flex;
//     gap: 5px; 
// `;

const ApplicantName = styled.span`
    font-weight: bold;
    // margin-left: px;
    font-size: 18px;
    margin-left: -80px;
    min-width: 120px;
    
`;

const StatusButton = styled.button`
    background: ${({ children, isClicked }) => 
        isClicked && children === "승인" ? "#F4F7FF" : 
        isClicked && children === "반려" ? "#EEEEEE" : 
        children === "승인" ? "#3563E9" : "white"};
    color: ${({ children, isClicked }) => 
        isClicked && children === "승인" ? "#2851E3" : 
        isClicked && children === "반려" ? "gray" : 
        children === "승인" ? "white" : "#3563E9"};
    border: ${({ children, isClicked }) => 
        isClicked && children === "승인" ? "none" : 
        isClicked && children === "반려" ? "none" : 
        children === "승인" ? "none" : "1px solid #3563E9"};
    padding: ${({ isClicked, children }) => 
        isClicked ? 
        (children === "승인" ? '10px 25px' : 
        children === "반려" ? '10px 25px' : '6px 18px') : 
        '6px 18px'}; // 클릭 상태일 때만 다르게 설정
    margin: ${({ isClicked, children }) => 
        isClicked ? 
        (children === "승인" ? '0px 0px 0px 30px' : 
        children === "반려" ? '0px 0px 0px 30px' : '0') : 
        '0'}; // 클릭 상태일 때만 다르게 설정
    border-radius: 5px;
    cursor: pointer;
    opacity: 1;
`;

// const Button = styled.button`
//     background-color: #3563E9;
//     color: white;
//     border: none;
//     padding: 10px 25px;
//     border-radius: 5px;
//     cursor: pointer;

// `;


const Button = styled.button`
    background-color: ${({ isClicked }) => isClicked ? '#808080' : '#3563E9'};
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 5px;
    cursor: pointer;
    opacity: ${({ isClicked }) => isClicked ? 0.6 : 1};

    &:hover {
        background-color: ${({ isClicked }) => isClicked ? '#808080' : '#2e51a3'};
    }
`;

const BackButton = styled.button`
    background: rgba(170, 168, 168, 0.69);
    color: white;
    border: none;
    padding: 10px 35px;
    border-radius: 5px;
    cursor: pointer;
`;

const ButtonContainerHorizontal = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 100px; 
    gap: 300px;
    flex-wrap:  nowrap;
    white-space: nowrap;
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    top: 20px;
    margin-left: 40px;
    width: 100%;
    overflow-x: auto;
    position: relative;
    margin-bottom: 20px; 
    h3 {
        margin-top: 2px;
        font-size: 24px;
        min-width: 100px;
    }
`;

const FieldButtons = styled.div`
    display: flex;
    gap: 20px;
    margin-left: 40px;
    margin-top: -20px;
    flex-wrap: nowrap; 
    overflow-x: auto; 
    white-space: nowrap; 
    max-width: 70%;
`;

const FieldButton = styled.span`
    cursor: pointer;
    border: 2px solid;
    background-color: ${(props) => (props.$isSelected ? '#a0dafb' : 'white')};
    border-radius: 30px 30px 1px 30px; // 반시계 방향
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-color: rgba(160, 218, 251);
    color: ${(props) => (props.$isSelected ? 'white' : '#0A8ED9')};
    font-weight: ${(props) => (props.$isSelected ? 'bold' : 'normal')};
    font-size: 16px;
    padding: 5px 20px; 
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
`;

const StyledPaginationContainer = styled.div`    position: absolute;
    margin-top: 500px;
    display: flex;
    justify-content: center;
    margin-bottom: -20px;
`;


// 팝업 스타일
const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 다른 요소 위에 나타나도록 설정 */
`;

const Popup = styled.div`
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 500px;
    height: 300px;
`;

const PopupHeader = styled.h3`
    margin: 80px 0 10px;
    font-size: 24px;
`;

const PopupMessage = styled.p`
    margin: 30px 0;
`;

const PopupButtonContainer = styled.div`
    display: flex;
    // justify-content: space-around;
    // margin-top: 50px;
    margin-top: -20px;
    justify-content: center;
`;

const PopupButton = styled.button`
    background-color: #3563E9;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 15px;
    margin-right: 15px;

    &:hover {
        background-color: #2851E3;
    }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: center;
  margin-left: 10px;
  min-width: 150px;
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



export default ProjectDetail;

