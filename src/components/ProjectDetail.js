import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import Pagination from './Pagination'; 

const ProjectDetail = ({ project, onBack }) => {
    const [visibleButtons, setVisibleButtons] = useState({});
    const [clickedButtons, setClickedButtons] = useState({});
    const [selectedField, setSelectedField] = useState('전체');
    const [currentPage, setCurrentPage] = useState(1);
    const applicantsPerPage = 5;

    // 팝업 상태 추가
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    
    // 버튼 비활성화 상태 추가
    const [disabledButtons, setDisabledButtons] = useState({});

    const applicants = project.applicants || [];
    const filteredApplicants = selectedField === '전체'
        ? applicants
        : applicants.filter(applicant => applicant.field === selectedField);

    const indexOfLastApplicant = currentPage * applicantsPerPage;
    const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
    const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
    const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

    const handleStatusChange = (applicant, status) => {
        if (disabledButtons[applicant.name]) return; // 비활성화된 버튼이면 함수 종료

        setSelectedApplicant(applicant);
        setNewStatus(status);
        setIsPopupVisible(true);
    };

    const confirmStatusChange = () => {
        console.log(`Changing status for ${selectedApplicant.name} to ${newStatus}`);
        setVisibleButtons(prevState => ({ ...prevState, [selectedApplicant.name]: newStatus }));
        setClickedButtons(prevState => ({ ...prevState, [selectedApplicant.name]: newStatus }));
        setDisabledButtons(prevState => ({ ...prevState, [selectedApplicant.name]: true })); // 버튼 비활성화
        setIsPopupVisible(false);
    };

    const cancelStatusChange = () => {
        setIsPopupVisible(false);
    };

    const handleFieldClick = (field) => {
        if (!isPopupVisible) {
            setSelectedField(field);
        }
    };

    const handlePageChange = (pageNumber) => {
        if (!isPopupVisible) {
            setCurrentPage(pageNumber);
        }
    };

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
                    <InfoItem>모집 현황 | {project.applyNum}명 / {project.recruitmentNum}명</InfoItem>
                    <InfoItem>진행 기간 | {project.period}개월</InfoItem>
                    <InfoItem>모집 역할 | 백엔드(2), 디자이너(1)</InfoItem>
                    <InfoItem>신청자 수 | 백엔드(3), 디자이너(1)</InfoItem>
                </DetailInfo>
                <Tags>
                    {project.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                    ))}
                </Tags>
                <ButtonContainerHorizontal>
                    <BackButton onClick={onBack}>목록</BackButton>
                    <Button>모집완료</Button>
                </ButtonContainerHorizontal>
            </LeftSection>
            <RightSection>
                <ApplicationStatus>
                    <HeaderContainer>
                        <h3>신청현황</h3>
                        <FieldButtons>
                            {['전체', '백엔드', '프론트', '디자이너', '데이터분석가'].map(field => (
                                <FieldButton 
                                    key={field} 
                                    onClick={() => handleFieldClick(field)}
                                    $isSelected={selectedField === field}
                                >
                                    {field}
                                </FieldButton>
                            ))}
                        </FieldButtons>
                    </HeaderContainer>
                    {currentApplicants.length > 0 ? (
                        currentApplicants.map((applicant, index) => (
                            <StyledApplicantWrapper key={index}>
                                <Applicant>
                                    <FontAwesomeIcon icon={faComment} style={{ color: '#62b9ec', fontSize: '24px' }} />
                                    <ApplicantName>{applicant.name}</ApplicantName>
                                    <Tags2>
                                        {applicant.skills.map((skill, idx) => (
                                            <Tag key={idx}>{skill}</Tag>
                                        ))}
                                    </Tags2>
                                    <ButtonContainer>
                                        {visibleButtons[applicant.name] === "승인" ? (
                                            <StatusButton 
                                                onClick={() => handleStatusChange(applicant, "승인")}
                                                isClicked={clickedButtons[applicant.name] === "승인"}
                                                disabled={disabledButtons[applicant.name]} // 버튼 비활성화 상태 적용
                                            >
                                                승인
                                            </StatusButton>
                                        ) : visibleButtons[applicant.name] === "반려" ? (
                                            <StatusButton 
                                                onClick={() => handleStatusChange(applicant, "반려")}
                                                isClicked={clickedButtons[applicant.name] === "반려"}
                                                disabled={disabledButtons[applicant.name]} // 버튼 비활성화 상태 적용
                                            >
                                                반려
                                            </StatusButton>
                                        ) : (
                                            <>
                                                <StatusButton 
                                                    onClick={() => handleStatusChange(applicant, "승인")}
                                                    isClicked={clickedButtons[applicant.name] === "승인"}
                                                    disabled={disabledButtons[applicant.name]} // 버튼 비활성화 상태 적용
                                                >
                                                    승인
                                                </StatusButton>
                                                <StatusButton 
                                                    onClick={() => handleStatusChange(applicant, "반려")}
                                                    isClicked={clickedButtons[applicant.name] === "반려"}
                                                    disabled={disabledButtons[applicant.name]} // 버튼 비활성화 상태 적용
                                                >
                                                    반려
                                                </StatusButton>
                                            </>
                                        )}
                                    </ButtonContainer>
                                </Applicant>
                            </StyledApplicantWrapper>
                        ))
                    ) : (
                        <p>신청자가 없습니다.</p>
                    )}
                </ApplicationStatus>
                <StyledPaginationContainer>
                    <Pagination 
                        totalProjects={filteredApplicants.length}
                        currentPage={currentPage} 
                        projectsPerPage={applicantsPerPage} 
                        onPageChange={handlePageChange} 
                    />
                </StyledPaginationContainer>
            </RightSection>

            {/* 팝업 모달 */}
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
    // min-width: 400px;
    max-width: 600px;
    min-height: 600px;
    border: 2px solid #A0DAFB;
    border-radius: 20px;
    // padding: 30px;
    padding-bottom: 5px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;

`;

const DetailHeader = styled.div`
    display: flex;
    // justify-content: space-between;
    align-items: center;
    justify-content: center;
`;

const DetailInfo = styled.div`
    margin: 20px 0;
    display: grid;
    text-align: left;
    grid-template-columns: repeat(2, 1fr); /* 2 열로 배치 */
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
    margin-left: 36px;
    
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
    padding: 10px;
    border-bottom: 2px solid #A0DAFB;
    border-radius: 1px;
    min-width: 600px;
    box-sizing: border-box;
    margin-top: 10px;
    text-align: left;
`;

const ButtonContainer = styled.div`
    margin-left: auto; 
    display: flex;
    gap: 5px; 
`;

const ApplicantName = styled.span`
    font-weight: bold;
    margin-left: 20px;
    font-size: 18px;
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
    padding: 5px 15px;
    border-radius: 5px;
    margin-left: 5px;
    cursor: pointer;
    opacity: 1;

`;

const Button = styled.button`
    background-color: #3563E9;
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 5px;
    cursor: pointer;

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
    border: 2px solid ;
    background-color: ${(props) => (props.$isSelected ?  '#a0dafb' : ' white')};
    border-radius: 30px 30px 1px 30px; //반시계 ㅔ방향
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-color: rgba(160, 218, 251);
    color: ${(props) => (props.$isSelected ?  'white' : '  #0A8ED9')};
    font-weight: ${(props) => (props.$isSelected ?  'bold' : 'normal')};
    font-size: 16px;
    padding: 5px 20px; 
    white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */

`;

const StyledPaginationContainer = styled.div`
    position: absolute;
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
`;

const PopupHeader = styled.h3`
    margin: 0 0 10px;
`;

const PopupMessage = styled.p`
    margin: 10px 0;
`;

const PopupButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
`;

const PopupButton = styled.button`
    background-color: #3563E9;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #2851E3;
    }
`;


export default ProjectDetail;




