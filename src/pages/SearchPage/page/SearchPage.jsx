//바끤 피그마
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom } from '../../../Atoms.jsx/AtomStates';
import Footer from '../../../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';  
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import Nav from '../../../components/Nav';
import NavigationBar from '../../../components/NavigationBar';
import ProjectFeedCard from '../components/ProjectFeedCard';
import axios from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext';
import AlertModal from '../../../components/AlertModal';
import Modal from '../../../components/Modal';
import RoleSelectionModal from '../../../components/RoleSelectionModal';
import Pagination from '../../../components/Pagination';





const MainPage = () => {
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
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const showSearch = true;
  // const [isProfileComplete, setIsProfileComplete] = useState(false);


  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  const searchTerm = query.get("q");
  const tags = query.get("tags");


  useEffect(() => {
    const fetchSearchItems = async () => {
        try {
            // 태그가 있을 경우, search-tags API 호출
            const apiUrl = tags 
                ? `/main/search-tags?feedType=${feedType}&tags=${encodeURIComponent(tags)}`
                : `/main/search-keyword?feedType=${feedType}&keyword=${encodeURIComponent(searchTerm)}`;
            
            const response = await axios.get(apiUrl);
            const filteredResults = response.data.filter(item => {
                // 태그가 선택된 경우, 태그 필터링
                return !tags || (item.tags && item.tags.some(tag => tags.split(',').includes(tag)));
            });
            setSearchResults(filteredResults); // 필터링된 결과 설정
            console.log("Filtered search results set:", filteredResults);
        } catch (error) {
            console.error("Error fetching search items:", error);
        }
    };

    fetchSearchItems();
}, [searchTerm, tags, feedType]); // 검색어와 태그가 변경될 때마다 호출

  const handleFeedToggle = (type) => {
    setFeedType(type);
  };


  // 1. 프로젝트 데이터 예시
  const projectList = [
    {
      id: 1,
      title: "재난 대응 어플리케이션 백엔드 구해요!",
      description: "재난 대응 어플리케이션에서 백엔드 개발자를 구합니다. 주요 업무는 ...",
      tags: ["백엔드", "Node.js", "React"],
      people: "2",
      date: "2024.06.08",
      views: 340,
    },
    {
      id: 2,
      title: "재난 대응 어플리케이션 백엔드 구해요!",
      description: "재난 대응 어플리케이션에서 백엔드 개발자를 구합니다. 주요 업무는 ...",
      tags: ["백엔드", "Node.js", "React"],
      people: "2",
      date: "2024.06.08",
      views: 340,
    },
    // ... 여러 개 추가
  ];

  


  const handleProjectClick = (project) => {
    console.log("mainprojecttodetail", project)
    navigate(`/ApplyPage/${project.pk}`);
    setSelectedProjectDetail(project);
  };


  
  
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const response = await axios.get(`/main?feedType=${feedType}`);
        if (!response.data || response.data.length === 0) {
          setAllProjects([]);
          return;
        }
        console.log('모든 게시물:', response.data);
  
        setAllProjects(response.data);
      } catch (error) {
        console.error('프로젝트 가져오기 실패:', error);
        
        // Network error handling - set empty array as fallback
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          console.warn('API 서버에 연결할 수 없습니다. 네트워크 연결 또는 서버 상태를 확인해주세요.');
          setAllProjects([]); // Set empty array as fallback
        } else {
          console.error('API 요청 중 오류가 발생했습니다:', error.message);
          setAllProjects([]);
        }
      }
    };
  
    fetchAllProjects();
  }, [feedType]);


  

  const handleApplyClick = async (project) => {
    if (!user) { 
      setPopupMessage("로그인 후에 신청할 수 있습니다."); 
      setIsSubmitted(true); 
      return; 
    }

    // 자신이 작성한 게시글인지 확인
    if (project && project.creatorId === user.id) {
      // alert("자신이 작성한 게시글에는 신청할 수 없습니다."); 
      setShowAlertPopup("자신이 작성한 게시글에는 신청할 수 없습니다.");
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
        setShowApplyPopup("이미 신청한 프로젝트입니다."); 
        // setPopupMessage("이미 신청한 프로젝트입니다."); // 이미 신청한 경우 메시지 설정
        // setIsSubmitted(true); // 제출 확인 팝업 표시
        return; // Exit the function if already applied
      }
    } catch (error) {
      console.error("신청 여부 확인 실패:", error);
    }
  
    // setProject(project); // 선택한 프로젝트 상태 저장
    setSelectedProject(project);
    setIsRoleModalOpen(true); // 역할 선택 모달 열기
  };
  

  // 프로젝트 신청 처리
  const handleApplySubmit = async (project, role) => {
    if (!user) {
      setPopupMessage("로그인 후에 신청할 수 있습니다.");
      setIsSubmitted(true);
      return;
    }
   
    try {
      const applicationData = {
        pk: user.id,
        sk: selectedProject.pk,
        part: selectedRole,
        feedType: feedType
      };
      console.log('applicationData:', applicationData);
      await axios.post('/main/application', applicationData);
      setShowApplyPopup("신청이 완료되었습니다.");
      setIsRoleModalOpen(false);
    } catch (error) {
      console.error("신청 실패:", error);
      setShowApplyPopup("신청에 실패했습니다.");
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  

  const projectsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);


  const currentProjects = searchResults.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <>
    <ContentsWrap>
    {/* <PageContainer> */}
    {/* <Nav/> */}
    <MainContent Wide1030>
      {/* Header with Logo and Search */}
      <NavigationBar 
 
      />

      {/* Carousel Section */}
     

      {/* <PopularProject projects={popularProjects} handleProjectClick={handleProjectClick} /> */}

      {/* Project Feed Toggle */}
      <FeedToggleSection>
        <SectionTitle>프로젝트 목록</SectionTitle>
        <ToggleContainer>
          <ToggleOption 
            active={feedType === 'STUDY'} 
            onClick={() => handleFeedToggle('STUDY')}
          >
            <ToggleCircle active={feedType === 'STUDY'} outlined={feedType !== 'STUDY'}>
              {feedType === 'STUDY' && <ToggleCheck />}
            </ToggleCircle>
            Study
          </ToggleOption>
          <ToggleOption 
            active={feedType === 'PROJECT'} 
            onClick={() => handleFeedToggle('PROJECT')}
          >
            <ToggleCircle active={feedType === 'PROJECT'} outlined={feedType !== 'PROJECT'} >
              {feedType === 'PROJECT' && <ToggleCheck />}
            </ToggleCircle>
          
          
            Project
          </ToggleOption>
        </ToggleContainer>
      </FeedToggleSection>

      {/* Project Feed */}
      <ProjectFeed style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "32px",
        marginBottom: "32px"
      }}>
        {currentProjects.map(project => (
          <ProjectFeedCard
            key={project.id}
            project={project}
            handleProjectClick={handleProjectClick}
            onApplyClick={handleApplyClick}
          />
        ))}
      </ProjectFeed>

      <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
        <Pagination
          currentPage={currentPage}
          projectsPerPage={projectsPerPage}
          totalProjects={allProjects.length}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Footer */}
      {/* <Footer /> */}
      </MainContent>
    {/* </PageContainer> */}
    </ContentsWrap>



    <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        project={selectedProject}
        selectedRole={selectedRole}
        handleRoleSelect={handleRoleSelect}
        handleApplySubmit={handleApplySubmit}
      />

<AlertModal
isOpen={!!showAlertPopup}
message={showAlertPopup}
onClose={() => setShowAlertPopup(false)}
/>

{showApplyPopup && (
<Modal isOpen={showApplyPopup} onClose={() => setShowApplyPopup(false)}>
      <h3 style={{ textAlign: 'center',fontSize:'16px' }}>{showApplyPopup}</h3>
      <ButtonContainer>
        <ModalButton onClick={() => setShowApplyPopup(false)}>확인</ModalButton>
        {/* <ModalButton onClick={() => setIsConfirmModalOpen(false)}>취소</ModalButton> */}
      </ButtonContainer>
    </Modal>  

)}
</>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Pretendard', sans-serif;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  margin-bottom: 32px;
`;

const Logo = styled.h1`
  font-family: 'Protest Strike', cursive;
  font-size: 56px;
  color: #00AEFF;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  gap: 8px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #F3F0F0;
  border-radius: 8px;
  padding: 9px 16px;
  flex-grow: 1;
`;

// const SearchIcon = styled.img`
//   margin-right: 8px;
// `;

const SearchIcon = styled.span`
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translate(250%, -50%);
  font-size: 20px;
  cursor: pointer;
  color: #0080ff;

  &:hover {
    color: #62B9EC;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-size: 20px;
  color: #858585;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: #858585;
  }
`;

const FilterButton = styled.button`
  background-color: #F3F0F0;
  border: none;
  border-radius: 8px;
  padding: 13px 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SearchButton = styled.button`
  background-color: #00AEFF;
  border: none;
  border-radius: 8px;
  padding: 13px 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  border: 1px solid #CECECE;
  border-radius: 4100px;
  padding: 12px 18px;
  font-size: 18px;
  color: #1A1A1A;
  cursor: pointer;
  
  &:hover {
    background-color: #F3F0F0;
  }
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CarouselArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.15s;
  &:hover {
    background: #eaf6ff;
    color: #00aeff;
  }
`;

const CarouselSection = styled.section`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  opacity: ${props => props.active ? 1 : 0.8};
`;

const CarouselContent = styled.div`
  position: relative;
  border-radius: 28px;
  padding: 40px;
  height: 250px;
  width: 480px;
  background-color: ${props => props.purple ? '#662CC2' : props.blue ? '#00AEFF' : '#1A1A1A'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CarouselTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1;
`;

const CarouselSubtitle = styled.h3`
  font-size: 30px;
  font-weight: 300;
  color: white;
  margin: 0;
`;

const CarouselTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const CarouselImage = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const CtaButton = styled.button`
  position: absolute;
  bottom: 40px;
  left: 40px;
  border-radius: 100px;
  padding: 16px 36px;
  font-size: 24px;
  font-weight: 600;
  background-color: ${props => props.blue ? '#00AEFF' : props.white ? '#FFFFFF' : '#FFFFFF'};
  color: ${props => props.white ? '#00AEFF' : props.blue ? '#FFFFFF' : '#662CC2'};
  border: none;
  cursor: pointer;
  z-index: 1;
`;

const SlideIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(109, 109, 109, 0.5);
  border-radius: 50px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const ViewMoreLink = styled.a`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 18px;
  font-weight: 300;
  color: #1A1A1A;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
`;

const ArrowIcon = styled.img`
  transform: rotate(90deg);
`;

const PopularProjectsGrid = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 48px;
   max-width: 100%;
`;

const PopularProjectCard = styled.div`
  background: linear-gradient(135deg, #eaf6ff 80%, #f6fbff 100%);
  border-radius: 16px;
  padding: 24px 20px 18px 20px;
  // min-width: 300px;
  max-width: 33%;
  min-height: 200px;
  // max-width: 100%;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PopularProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PopularProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin: 0;
`;

const PopularDeadlineTag = styled.span`
  background: #00aeff;
  color: #fff;
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 500;
`;

const PopularProjectDescription = styled.p`
  font-size: 14px;
  color: #444;
  margin: 12px 0 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PopularProjectInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #555;
  margin-bottom: 8px;
`;

const PopularProjectTags = styled.div`
  display: flex;
  gap: 8px;
`;

const PopularProjectTag = styled.span`
  background: #fff;
  color: #00aeff;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e0f0ff;
`;

const ProjectCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
  padding: 28px 24px 20px 24px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  justify-content: space-between;
  border: 1px solid #e6eaf2;

`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const DeadlineTag = styled.span`
  background-color: #D4D4D4;
  border-radius: 50px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #888888;
`;

const ProjectDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #888888;
  margin: 0;
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProjectDetail = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #888888;
`;

const ProjectTags = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProjectTag = styled.span`
  background: #eaf6ff;
  color: #009cff;
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 500;
  margin-right: 6px;
`;

const FeedToggleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 27px;
`;

const ToggleOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#000000' : '#888888'};
  cursor: pointer;
`;

const ToggleCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#00AEFF' : 'transparent'};
  border: ${props => props.outlined ? '1.5px solid #00AEFF' : 'none'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToggleCheck = styled.div`
  width: 12px;
  height: 12px;
  background-color: white;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
`;

const ProjectFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
`;

const ApplyButton = styled.button`
  flex: 1;
  height: 44px;
  // background: linear-gradient(90deg, #36c6ff 0%, #3a8dff 100%);
  background: #00BEFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

const PopularProjectDetail = styled.span`
  font-size: 13px;
  color: #555;
  margin-right: 12px;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border: 1px solid #e6eaf2;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 16px;
  color: #888;
  cursor: pointer;
  margin-right: 12px;
  transition: background 0.15s;
  &:hover {
    background: #eaf6ff;
    color: #00aeff;
  }
  svg {
    margin-right: 6px;
    font-size: 18px;
  }
`;

const VerticalLikeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  margin-right: 12px;
  cursor: pointer;
  font-size: 15px;
  color: #222;
  box-shadow: none;
  padding: 0;
  transition: background 0.2s;
  &:hover {
    background: #e0e0e0;
  }
  svg {
    margin-bottom: 2px;
  }
`;

// const ContentsWrap = styled.div`
//   transform: scale(0.9);
//   transform-origin: top center;
// `;


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


export default MainPage; 