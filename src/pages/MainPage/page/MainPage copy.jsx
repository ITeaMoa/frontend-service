//바끤 피그마
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../../../Atoms.jsx/AtomStates';
import Footer from '../../../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';  
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import Nav from '../../../components/Nav';
import NavigationBar from '../components/NavigationBar';
import PopularProject from '../components/PopularProject';
import ProjectFeedCard from '../components/ProjectFeedCard';

const MainPage = () => {
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?query=${e.target.value}`);
    }
  };

  const handleFeedToggle = (type) => {
    setFeedType(type);
  };

  const handleAddButtonClick = () => {
    const tagsQuery = selectedTags.length > 0 ? `&tags=${selectedTags.join(',')}` : '';
    // const feedType = toggleActive ? 'PROJECT' : 'STUDY'; // 현재의 토글 값에 따라 feedType 설정
    navigate(`/SearchPage?q=${searchValue}${tagsQuery}&feedType=${feedType}`); // 검색어, 선택된 태그, feedType을 URL로 전달
  };
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태 추가

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

  const popularProjects = [
    {
      title: '블록체인 Dapp 프로젝트',
      deadlineTag: 'D-54',
      description: '이번 블록체인 Dapp 프로젝트에서 백엔드를 맡아주실 개발자 분을 구하고 있습니다...',
      recruitInfo: '모집 인원 | 3~4명',
      deadlineInfo: '마감일 25.03.15',
      tags: ['AWS', 'Blockchain', 'React']
    },
    {
      title: '하이브리드 웹 개발자 양성',
      deadlineTag: 'D-64',
      description: '안녕하세요! 저희는 이번에 하이브리드 웹 개발자 양성을 위하여 새로운 신입 멤버를 모집하고 있...',
      recruitInfo: '모집 인원 | 3~4명',
      deadlineInfo: '마감일 25.04.06',
      tags: ['Hybrid', 'Web', 'front']
    },
    {
      title: '알고리즘 프로젝트 모집!',
      deadlineTag: 'D-70',
      description: '안녕하세요 저희는 뉴알고리즘을 만들고자 새로운 능력자분을 모시고 있습니다 저희는 디앱 기반 ...',
      recruitInfo: '모집 인원 | 5~7명',
      deadlineInfo: '마감일 25.04.30',
      tags: ['Newproject', 'Algorithm', 'AWS']
    }
  ];

  const slideCount = 3; // 슬라이드 개수(캐러셀 아이템 개수와 맞추세요)

  // // 2. 카드 컴포넌트
  // const ProjectFeedCard = ({ project }) => (
  //   <ProjectCard>
  //     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <img src={project.profile} alt="profile" style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8, objectFit: "cover" }} />
  //         <span style={{ fontWeight: 600 }}>{project.nickname}</span>
  //       </div>
  //       <span style={{ color: "#b0b0b0", fontSize: 15 }}>👁 {project.views}</span>
  //     </div>
  //     <ProjectTitle style={{ fontSize: 18, fontWeight: 700, margin: "8px 0 10px 0" }}>{project.title}</ProjectTitle>
  //     <div style={{ marginBottom: 8 }}>
  //       {project.tags.map(tag => (
  //         <ProjectTag key={tag}>{tag}</ProjectTag>
  //       ))}
  //     </div>
  //     <ProjectDescription style={{
  //       fontSize: 14,
  //       color: "#666",
  //       marginBottom: 16,
  //       overflow: "hidden",
  //       textOverflow: "ellipsis",
  //       display: "-webkit-box",
  //       WebkitLineClamp: 2,
  //       WebkitBoxOrient: "vertical"
  //     }}>{project.description}</ProjectDescription>
  //     <div style={{ display: "flex", textAlign: "left", marginBottom: 8, flexDirection: "column", gap: 8 }}>
  //       <ProjectDetail>모집인원 | {project.people}</ProjectDetail>
  //       <ProjectDetail>마감일 | {project.date}</ProjectDetail>
  //     </div>
  //     <div style={{ display: "flex", alignItems: "center" }}>
  //       <VerticalLikeButton>
  //         <svg width="18" height="18" viewBox="0 0 20 20" fill="#222" xmlns="http://www.w3.org/2000/svg">
  //           <path d="M10 17.5l-1.45-1.32C4.4 12.36 2 10.28 2 7.5 2 5.5 3.5 4 5.5 4c1.04 0 2.09.54 2.7 1.44C8.41 5.54 9.46 5 10.5 5 12.5 5 14 6.5 14 8.5c0 2.78-2.4 4.86-6.55 8.68L10 17.5z"/>
  //         </svg>
  //         <span>2</span>
  //       </VerticalLikeButton>
  //       <ApplyButton>신청하기</ApplyButton>
  //     </div>
  //   </ProjectCard>
  // );

  return (
    <ContentsWrap>
    {/* <PageContainer> */}
    {/* <Nav/> */}
    <MainContent Wide1030>
      {/* Header with Logo and Search */}
      <NavigationBar 
        handleSearch={handleSearch} 
        handleAddButtonClick={handleAddButtonClick} 
      />

<>
<CarouselWrapper>
        <CarouselArrow
          style={{ left: -18 }}
          onClick={() => setCurrentSlide((prev) => prev > 0 ? prev - 1 : slideCount - 1)}
          aria-label="이전"
        >
          {/* 왼쪽 화살표 SVG */}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M13 16L8 10L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </CarouselArrow>

        <CarouselSection $currentSlide={currentSlide}>
          <CarouselItem>
            <CarouselContent purple>
              <CarouselTextContent>
                <CarouselSubtitle>일 잘하는 사람들을 위한</CarouselSubtitle>
                <CarouselTitle>인기있는 프로젝트<br/>모아보기</CarouselTitle>
              </CarouselTextContent>
              <CarouselImage>
                <img src="/images/code_graphic.png" alt="Code graphic" />
              </CarouselImage>
              <CtaButton>바로가기</CtaButton>
            </CarouselContent>
          </CarouselItem>

          <CarouselItem>
            <CarouselContent primary>
              <CarouselTextContent>
                <CarouselSubtitle>2025 트렌드가 궁금하다면?</CarouselSubtitle>
                <CarouselTitle>IT 최신 트렌드<br/>한눈에 살펴보기</CarouselTitle>
              </CarouselTextContent>
              <CarouselImage>
                {/* <img src="/images/laptop_it.png" alt="Laptop IT" />
                <img src="/images/bulb_3d.png" alt="Bulb 3D" /> */}
              </CarouselImage>
              <CtaButton blue>바로가기</CtaButton>
              <SlideIndicator>01 / 04</SlideIndicator>
            </CarouselContent>
          </CarouselItem>

          <CarouselItem>
            <CarouselContent blue>
              <CarouselTextContent>
                <CarouselSubtitle>시간과 비용을 절약하고 싶다면?</CarouselSubtitle>
                <CarouselTitle>개발자들 몰래 보는<br/>꿀팁 사이트 보러가기</CarouselTitle>
              </CarouselTextContent>
              <CarouselImage>
                <img src="/images/developer_image.png" alt="Developer" />
              </CarouselImage>
              <CtaButton white>바로가기</CtaButton>
            </CarouselContent>
          </CarouselItem>
        </CarouselSection>

        <CarouselArrow
          style={{ right: -18 }}
          onClick={() => setCurrentSlide((prev) => prev < slideCount - 1 ? prev + 1 : 0)}
          aria-label="다음"
        >
          {/* 오른쪽 화살표 SVG */}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 4L12 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </CarouselArrow>
      </CarouselWrapper>
</>

      {/* Popular Projects Section */}
      <SectionHeader>
        <SectionTitle>인기 프로젝트</SectionTitle>
        <ViewMoreLink>
          자세히 알아보기 
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 4L12 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {/* <ArrowIcon src="/images/arrow_up.svg" alt="Arrow" /> */}
        </ViewMoreLink>
      </SectionHeader>
{/* 
      <PopularProjectsGrid>
        <PopularProjectCard>
          <PopularProjectHeader>
            <PopularProjectTitle>블록체인 Dapp 프로젝트</PopularProjectTitle>
            <PopularDeadlineTag>D-54</PopularDeadlineTag>
          </PopularProjectHeader>
          <PopularProjectDescription>
            이번 블록체인 Dapp 프로젝트에서 백엔드를
            맡아주실 개발자 분을 구하고 있습니다...
          </PopularProjectDescription>
          <PopularProjectInfo>
            <PopularProjectDetail>모집 인원 | 3~4명</PopularProjectDetail>
            <PopularProjectDetail>마감일 25.03.15</PopularProjectDetail>
          </PopularProjectInfo>
          <PopularProjectTags>
            <PopularProjectTag>AWS</PopularProjectTag>
            <PopularProjectTag>Blockchain</PopularProjectTag>
            <PopularProjectTag>React</PopularProjectTag>
          </PopularProjectTags>
        </PopularProjectCard>

        <PopularProjectCard>
          <PopularProjectHeader>
            <PopularProjectTitle>하이브리드 웹 개발자 양성</PopularProjectTitle>
            <PopularDeadlineTag>D-64</PopularDeadlineTag>
          </PopularProjectHeader>
          <PopularProjectDescription>
            안녕하세요! 저희는 이번에 하이브리드 웹 개발자
            양성을 위하여 새로운 신입 멤버를 모집하고 있...
          </PopularProjectDescription>
          <PopularProjectInfo>
            <PopularProjectDetail>모집 인원 | 3~4명</PopularProjectDetail>
            <PopularProjectDetail>마감일 25.04.06</PopularProjectDetail>
          </PopularProjectInfo>
          <PopularProjectTags>
            <PopularProjectTag>Hybrid</PopularProjectTag>
            <PopularProjectTag>Web</PopularProjectTag>
            <PopularProjectTag>front</PopularProjectTag>
          </PopularProjectTags>
        </PopularProjectCard>

        <PopularProjectCard>
          <PopularProjectHeader>
            <PopularProjectTitle>알고리즘 프로젝트 모집!</PopularProjectTitle>
            <PopularDeadlineTag>D-70</PopularDeadlineTag>
          </PopularProjectHeader>
          <PopularProjectDescription>
            안녕하세요 저희는 뉴알고리즘을 만들고자 새로운
            능력자분을 모시고 있습니다 저희는 디앱 기반 ...
          </PopularProjectDescription>
          <PopularProjectInfo>
            <PopularProjectDetail>모집 인원 | 5~7명</PopularProjectDetail>
            <PopularProjectDetail>마감일 25.04.30</PopularProjectDetail>
          </PopularProjectInfo>
          <PopularProjectTags>
            <PopularProjectTag>Newproject</PopularProjectTag>
            <PopularProjectTag>Algorithm</PopularProjectTag>
            <PopularProjectTag>AWS</PopularProjectTag>
          </PopularProjectTags>
        </PopularProjectCard>
      </PopularProjectsGrid> */}
      <PopularProject projects={popularProjects} />

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
        {projectList.map(project => (
          <ProjectFeedCard key={project.id} project={project} />
        ))}
      </ProjectFeed>

      {/* Footer */}
      {/* <Footer /> */}
      </MainContent>
    {/* </PageContainer> */}
    </ContentsWrap>
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

export default MainPage; 