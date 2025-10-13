//바끤 피그마
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom ,selectedSavedProjectAtom} from '../../../Atoms.jsx/AtomStates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';
// import PopularProject from '../components/PopularProject';
// import ProjectFeedCard from '../components/ProjectFeedCard';
import axios from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext';
import AlertModal from '../../../components/AlertModal';
import AuthModal from '../../../components/AuthModal';
import Modal from '../../../components/Modal';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import Pagination from '../../../components/Pagination';
import ProfileModal from '../../../components/ProfileModal';
import { faPen } from '@fortawesome/free-solid-svg-icons'; // Import the pencil icon

const tagOptions = [
  "전략/기획", "상품/서비스 기획(PO)", "마케팅/브랜드", "세일즈/BD", "PR/커뮤니케이션", "구매/소싱","재무/회계",
  "UX/UI·리서치", "PM(프로젝트/프로젝트)", "생산/품질/SCM", "HR(조직/채용/리닝)",
  "데이터/AI(분석)", "법무/컴플라이언스", "ESG/지속가능경영", "소프트웨어/플랫폼(백엔드·클라우드)"
];

const tagDetails = {
  "전략/기획": {
    title: "전략/기획",
    description: "기업의 장기적인 목표와 방향을 설정하고 실행하는 역할입니다. 시장 동향 분석, 경쟁사 분석, 마케팅 전략 수립 등이 포함됩니다."
  },
  "상품/서비스 기획(PO)": {
    title: "상품/서비스 기획(PO)",
    description: "사용자에게 제공될 상품이나 서비스의 기능, 디자인, 사용자 경험 등을 기획하는 역할입니다. 사용자 요구사항 분석, 시장 조사, 기능 정의 등이 포함됩니다."
  },
  "마케팅/브랜드": {
    title: "마케팅/브랜드",
    description: "제품이나 서비스를 시장에 알리고 사용자에게 인식시키는 역할입니다. 마케팅 전략 수립, 광고 캠페인 실행, 브랜드 이미지 관리 등이 포함됩니다."
  },
  "세일즈/BD": {
    title: "세일즈/BD",
    description: "제품이나 서비스를 판매하고 비즈니스 파트너와 협력을 맺는 역할입니다. 고객 관계 관리, 판매 전략 수립, 파트너십 협상 등이 포함됩니다."
  },
  "PR/커뮤니케이션": {
    title: "PR/커뮤니케이션",
    description: "기업의 이미지와 메시지를 사회에 전달하고 관계를 유지하는 역할입니다. 미디어 관계 관리, 소셜 미디어 운영, 이슈 관리 등이 포함됩니다."
  },
  "구매/소싱": {
    title: "구매/소싱",
    description: "제품이나 서비스를 제작하기 위해 필요한 자원을 구매하고 관리하는 역할입니다. 공급망 관리, 비용 절감, 품질 관리 등이 포함됩니다."
  },
  "재무/회계": {
    title: "재무/회계",
    description: "기업의 재무 상태를 관리하고 분석하는 역할입니다. 재무 계획 수립, 예산 관리, 세무 관리 등이 포함됩니다."
  },
  "UX/UI·리서치": {
    title: "UX/UI·리서치",
    description: "사용자 경험을 개선하고 사용자 인터페이스를 설계하는 역할입니다. 사용자 연구, 인터페이스 디자인, 사용성 테스트 등이 포함됩니다."
  },
  "PM(프로젝트/프로젝트)": {
    title: "PM(프로젝트/프로젝트)",
    description: "프로젝트를 계획하고 실행하며 완료시키는 역할입니다. 프로젝트 계획 수립, 리스크 관리, 팀 관리 등이 포함됩니다."
  },
  "생산/품질/SCM": {
    title: "생산/품질/SCM",
    description: "제품이나 서비스를 생산하고 품질을 관리하는 역할입니다. 생산 계획 수립, 품질 검사, 공급망 관리 등이 포함됩니다."
  },
  "HR(조직/채용/리닝)": {
    title: "HR(조직/채용/리닝)",
    description: "인력을 관리하고 조직을 운영하는 역할입니다. 채용, 교육, 조직 설계 등이 포함됩니다."
  },
  "데이터/AI(분석)": {
    title: "데이터/AI(분석)",
    description: "데이터를 분석하고 인공지능을 활용하는 역할입니다. 데이터 수집, 분석, AI 모델 개발 등이 포함됩니다."
  },
  "법무/컴플라이언스": {
    title: "법무/컴플라이언스",
    description: "기업의 법적 위험을 관리하고 준수하는 역할입니다. 법률 조사, 계약 관리, 규제 준수 등이 포함됩니다."
  },
  "ESG/지속가능경영": {
    title: "ESG/지속가능경영",
    description: "환경, 사회, 경영진의 윤리적 책임을 고려한 경영을 실천하는 역할입니다. 환경 보호, 사회적 책임, 윤리적 경영 등이 포함됩니다."
  },
  "소프트웨어/플랫폼(백엔드·클라우드)": {
    title: "소프트웨어/플랫폼(백엔드·클라우드)",
    description: "소프트웨어나 플랫폼을 개발하고 운영하는 역할입니다. 백엔드 개발, 클라우드 서비스 관리 등이 포함됩니다."
  }
};

// ... existing code ...
const contests = [
  {
    id: 1,
    image: "https://via.placeholder.com/300x180.png?text=AI+기반+추천+시스템",
    title: "전국 대학생 SW창업 아이디어톤(대구 대-다산벤처스)",
    detail: "신규 서비스/사업 아이디어 / 사용자 패인포인트 발굴→MVP 기획 실전.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["생산/품질/SCM", "모집중"]
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300x180.png?text=블록체인+기반+투표",
    title: "물류데이터 활용·분석 아이디어 공모전 (대전정보문화산업진흥원)",
    detail: "수요예측·물류적재화·지표설계 역량.",
    date: "2025.08.15 ~ 2025.09.30",
    tags: ["생산/품질/SCM", "모집중"]
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300x180.png?text=공공+AI+혁신",
    title: "공공 AI 혁신 대국민 아이디어 공모전(행안부-NIA)",
    detail: "공공서비스 혁신 아이디어 / 빅데이터 GTM·정책/서비스 기획 경청차 쌓기.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["상품/서비스 기획(PO)", "모집중"]
  },
  {
    id: 4,
    image: "https://via.placeholder.com/300x180.png?text=AI+케이",
    title: "제8회 전국 청년 아이디어톤(수원시-아주대)",
    detail: "아이디어에선→프로토타이핑→퍼팅.",
    date: "2025.10.01 ~ 2025.11.01",
    tags: ["PM(프로젝트/프로덕트)", "모집중"]
  },
  {
    id: 5,
    image: "https://via.placeholder.com/300x180.png?text=생태디자인",
    title: "국립생태원 '생태디자인' 공모전(텍스타일 패턴)",
    detail: "리서치 기반 콘셉팅-퍼즐 시스템 설계.",
    date: "2025.09.15 ~ 2025.10.31",
    tags: ["UX/UI-리서치", "모집중"]
  },
  {
    id: 6,
    image: "https://via.placeholder.com/300x180.png?text=인문학",
    title: "2025 인문가치 논문 공모전(한국정신문화재단)",
    detail: "조직문화-러닝 디자인 관점의 리서치-정책 제안에 활용 가능.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["HR(조직/채용/리닝)", "모집중"]
  },
  {
    id: 7,
    image: "https://via.placeholder.com/300x180.png?text=무인수상정",
    title: "대한민국 ESG경영 혁신대상(한경)",
    detail: "지배구조-윤리경영-내부통제 체계 관련 문서화/평가 대응 실무에 유의미.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["법무/컴플라이언스", "모집중"]
  },
  {
    id: 8,
    image: "https://via.placeholder.com/300x180.png?text=ESG+성장",
    title: "캠퍼스온에어 ESG 성장 공모전",
    detail: "ESG 메시지 설계-캠페인 기획 실전.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["ESG/지속가능경영", "모집중"]
  },
  {
    id: 9,
    image: "https://via.placeholder.com/300x180.png?text=데이터+AI",
    title: "2025 DATA-AI 분석 경진대회(KISTI)",
    detail: "재무 KPI/리스크 분석 지표 설계 프레임 연습에 유용(문제발굴-해결 모두).",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["재무/회계", "모집중"]
  }
];

// // Update tagOptions to include all unique tags from the contests
// const tagOptions = [...new Set(contests.flatMap(contest => contest.tags))];
// // ... existing code ...


const ContestPage = () => {
  const { isLoggedIn, user } = useAuth();
  // const [isLoggedIn, setIsLoggedIn] = useAtom(IS_LOGGED_IN);
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [selectedProjectDetail, setSelectedProjectDetail] = useAtom(selectedProjectDetailAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProjects, setPopularProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [showApplyPopup, setShowApplyPopup] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUserProfileLoaded, setIsUserProfileLoaded] = useState(false);
  const [modalOpenedOnce, setModalOpenedOnce] = useState(false);
  const [hasProfileModalOpened, setHasProfileModalOpened] = useState(false);
  // const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [selectedSavedProject,setSelectedSavedProject] = useAtom(selectedSavedProjectAtom); // 아톰에서 프로젝트 정보 가져오기
  const [selectedTags, setSelectedTags] = useState([]); // 태그 상태 추가
  const [selectedTagDetails, setSelectedTagDetails] = useState([]);

  const navigate = useNavigate();
  
  const handleTagSelect = (e, tag) => {
    e.stopPropagation();
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  useEffect(() => {
    const selectedDetails = selectedTags.map(tag => tagDetails[tag]).filter(Boolean);
    setSelectedTagDetails(selectedDetails);
  }, [selectedTags]);

  const handleResetTags = (e) => {
    e.stopPropagation();
    setSelectedTags([]);
    setSelectedTagDetails([]);
  };

  const projectsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  // const [projectsPerPage] = useState(6); 

  //페이지네이션방법 1
  // const indexOfLastProject = currentPage * projectsPerPage;
  // const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  // const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    //페이지네이션방법 2
  const currentProjects = allProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredContests = selectedTags.length > 0
    ? contests.filter(contest => 
        contest.tags.some(tag => selectedTags.includes(tag))
      )
    : contests;


  return (
    <>
    <ContentsWrap>
      <NavigationBar showSearch={true} showTag={false} />
      <MainContent Wide1030 style={{ paddingTop: '300px' }}>
        
        {/* Tag Section */}
        <TagTitle>공모분야</TagTitle>
        <TagsRow>
          {tagOptions.map(tag => (
            <Tag
              key={tag}
              selected={selectedTags.includes(tag)}
              onClick={(e) => handleTagSelect(e, tag)}
            >
              {tag}
            </Tag>
          ))}
          {selectedTags.length > 0 && (
            <ResetButton onClick={handleResetTags}>초기화</ResetButton>
          )}
        </TagsRow>

        {/* Tag Detail Content */}
     
        {selectedTagDetails.length > 0 && (
<>
         <TagTitle style={{marginTop: '60px'}}>고르신 직군은 이런 공모전 유형을 추천해요 </TagTitle>
            
          <TagDetailContainer>
            {selectedTagDetails.map((detail, index) => (
              <TagDetailCard key={index}>
                <TagDetailTitle>{detail.title}</TagDetailTitle>
                <TagDetailDescription>{detail.description}</TagDetailDescription>
              </TagDetailCard>
            ))}
          </TagDetailContainer>
          </>
        )}

        <TagTitle style={{marginTop: '80px', marginBottom: '10px'}}>
          {selectedTags.length > 0
            ? "지금 모집 중인 공모전이예요"
            : "지금 인기있는 공모전을 알려드려요"}
        </TagTitle>
        
        <ContestGrid>
  {filteredContests.map(contest => (
    <>
    <ContestCard key={contest.id}>
      <ContestImage src={contest.image} alt={contest.title} />
      <ContestContent>
        <ContestTitle>{contest.title}</ContestTitle>
        <ContestInfo>
          <ContestDetail>{contest.detail}</ContestDetail>
          {/* <ContestDate>{contest.date}</ContestDate> */}
        </ContestInfo>
        <ContestButtons>
         
        </ContestButtons>
         </ContestContent>
        <ContestTags>
          {contest.tags.map((tag, index) => (
            <ContestTag key={index}>{tag}</ContestTag>
          ))}
        </ContestTags>
     
    </ContestCard>
    </>
  ))}
</ContestGrid>

        <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
          <Pagination
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            totalProjects={allProjects.length}
            onPageChange={handlePageChange}
          />
        </div>
      </MainContent>
    </ContentsWrap>
  </>
);
};




const TagTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  margin-bottom: 16px;
`;


const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
//   margin-top: 8px;
  width: 100%;
  max-width: 1030px;
  margin-left: auto;
  margin-right: auto;
  // z-index:2000;
`;

const Tag = styled.div`
  border: ${({ selected }) => (selected ? '#00AEFF' : '1px solid #CECECE')};
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 16px;
  color:  ${({ selected }) => (selected ? 'white' : '#222')};
  background: ${({ selected }) => (selected ? '#00AEFF' : '#fff')};
  margin-right: 10px;
  margin-bottom: 8px;
  transition: background 0.15s, color 0.15s, border 0.15s;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f3f0f0;
    border-color: #62B9EC;
    color: #226FFF;
  }
`;

const ResetButton = styled.button`
  color: grey;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 16px;
  padding: 8px 20px;
  border-radius: 999px;
  &:hover {
    background: #f3f0f0;
  }
`;



const TagDetailContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const TagDetailCard = styled.div`
  flex: 1;
 width: 300px;
 max-width: 300px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  //  flex-basis: calc(100% / 3);
`;

const TagDetailTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: #333;
  text-align: center;
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  padding: 8px 16px;
  background-color: #00AEFF;
  color: white;
  border-radius: 20px;
  z-index: 1;
  font-size: 16px;
  white-space: nowrap;
`;

const TagDetailDescription = styled.p`
  font-size: 14px;
  color: #F2F2F;
  line-height: 1.5;
  text-align: left;
  margin: 0;
  margin-top:20px;
`;

const ContestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ContestCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ContestImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const ContestContent = styled.div`
  padding: 16px;
  flex-grow: 1;
`;

const ContestTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
`;

const ContestInfo = styled.div`
  margin-bottom: 12px;
`;

const ContestDetail = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
`;

const ContestDate = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0;
`;

const ContestButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ContestTags = styled.div`
  display: flex;
  gap: 4px;
  padding: 16px;
  padding-top:0;
`;

const ContestTag = styled.span`
  background-color: #f0f0f0;
  color: #333;
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
`;



export default ContestPage; 