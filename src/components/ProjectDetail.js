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
    const applicantsPerPage = 5; // Number of applicants per page

    const applicants = project.applicants || [];

    const handleStatusChange = (applicant, newStatus) => {
        console.log(`Changing status for ${applicant.name} to ${newStatus}`);
        setVisibleButtons(prevState => ({
            ...prevState,
            [applicant.name]: newStatus
        }));
        setClickedButtons(prevState => ({
            ...prevState,
            [applicant.name]: newStatus
        }));
    };

    const handleTagClick = (tag) => {
        console.log(`Filtering applicants by tag: ${tag}`);
        
    };

    const handleFieldClick = (field) => {
        setSelectedField(field);
    };

    const filteredApplicants = selectedField === '전체'
        ? project.applicants
        : project.applicants.filter(applicant => applicant.field === selectedField);

    // Calculate the current applicants to display
    const indexOfLastApplicant = currentPage * applicantsPerPage;
    const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
    const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

    const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                            {['전체', '백엔드', '프론트', '디자이너'].map(field => (
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
                            <Applicant key={index}>
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
                                        >
                                            승인
                                        </StatusButton>
                                    ) : visibleButtons[applicant.name] === "반려" ? (
                                        <StatusButton 
                                            onClick={() => handleStatusChange(applicant, "반려")}
                                            isClicked={clickedButtons[applicant.name] === "반려"}
                                        >
                                            반려
                                        </StatusButton>
                                    ) : (
                                        <>
                                            <StatusButton 
                                                onClick={() => handleStatusChange(applicant, "승인")}
                                                isClicked={clickedButtons[applicant.name] === "승인"}
                                            >
                                                승인
                                            </StatusButton>
                                            <StatusButton 
                                                onClick={() => handleStatusChange(applicant, "반려")}
                                                isClicked={clickedButtons[applicant.name] === "반려"}
                                            >
                                                반려
                                            </StatusButton>
                                        </>
                                    )}
                                </ButtonContainer>
                            </Applicant>
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
        </DetailContainer>
    );
};


const DetailContainer = styled.div`
    display: flex;
    justify-content: space-between; /* 두 섹션을 양쪽으로 배치 */
    margin-top: 60px;
`;

const LeftSection = styled.div`
    flex: 1;
    margin-right: 20px; 
    max-height: 400px;
    border: 2px solid #A0DAFB;
    border-radius: 20px;
    padding: 40px;
    background: white;
    padding-bottom: 20px;
    padding-top: 20px;
    display: flex;
    flex-direction: column;

`;

const RightSection = styled.div`
    position: relative;
    flex: 0 0 300px; /* 오른쪽 섹션의 고정 너비 설정 */
    min-width: 600px;
    min-height: 600px;
    border: 2px solid #A0DAFB;
    border-radius: 20px;
    padding: 20px;
    padding-bottom: 5px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;

`;

const DetailHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    margin-top:1px;
    display: flex;
    flex-wrap: wrap;
    
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
    margin-top: 20px;
    text-align: left;

    h3{
    margin-top: 20px;
    font-size: 24px;
    }
`;

const Applicant = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding: 10px;
    border-bottom: 2px solid #A0DAFB;
    border-radius: 1px;
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

    
    // &:hover {
    //     animation: hoverEffect 1s forwards;
    // }

    // @keyframes hoverEffect {
    //     0%, 100% {
    //         background-color: #a0dafb;
    //     }
    // }
`;

const Button = styled.button`
    background-color: #3563E9;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

`;

const BackButton = styled.button`
    background: rgba(170, 168, 168, 0.69);
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 5px;
    cursor: pointer;
`;

const ButtonContainerHorizontal = styled.div`
    display: flex;
    justify-content: space-between; 
    margin-top: 30px; 
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: -20px;
    margin-bottom: 15px;
`;

const FieldButtons= styled.div`
    display: flex;
    gap: 20px;
    margin-left: 65px;
    margin-top: -5px;
    
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

`;

const StyledPaginationContainer = styled.div`
    position: absolute;
    margin-top: 500px;
    display: flex;
    justify-content: center;
    margin-bottom: -20px;
`;

export default ProjectDetail;




