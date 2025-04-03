//바끤 피그마
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../../Atoms.jsx/AtomStates';
import Footer from '../../components/Footer';

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

  return (
    <PageContainer>
      {/* Header with Logo and Search */}
      <Header>
        <Logo>ITEAMOA</Logo>
        <SearchContainer>
          <SearchBar>
            <SearchIcon src="/images/search_icon.svg" alt="Search" />
            <SearchInput 
              placeholder="Search projects" 
              onKeyPress={handleSearch}
            />
          </SearchBar>
          <FilterButton>
            <img src="/images/filter_icon.svg" alt="Filter" />
          </FilterButton>
          <SearchButton>
            <img src="/images/search_button_icon.svg" alt="Search" />
          </SearchButton>
        </SearchContainer>
        
        <TagsRow>
          <Tag>AWS</Tag>
          <Tag>Blockchain</Tag>
          <Tag>NodeJS</Tag>
          <Tag>React</Tag>
          <Tag>Java</Tag>
          <Tag>Dapp</Tag>
          <Tag>DID</Tag>
          <Tag>Backend</Tag>
        </TagsRow>
      </Header>

      {/* Carousel Section */}
      <CarouselSection>
        <CarouselItem active={currentSlide === 0}>
          <CarouselContent purple>
            <CarouselTextContent>
              <CarouselSubtitle>일 잘하는 사람들을 위한</CarouselSubtitle>
              <CarouselTitle>인기있는 프로젝트<br/>모아보기</CarouselTitle>
            </CarouselTextContent>
            <CarouselImage src="/images/code_graphic.png" alt="Code graphic" />
            <CtaButton>바로가기</CtaButton>
          </CarouselContent>
        </CarouselItem>

        <CarouselItem active={currentSlide === 1}>
          <CarouselContent primary>
            <CarouselTextContent>
              <CarouselSubtitle>2025 트렌드가 궁금하다면?</CarouselSubtitle>
              <CarouselTitle>IT 최신 트렌드<br/>한눈에 살펴보기</CarouselTitle>
            </CarouselTextContent>
            <CarouselImage>
              <img src="/images/laptop_it.png" alt="Laptop IT" />
              <img src="/images/bulb_3d.png" alt="Bulb 3D" />
            </CarouselImage>
            <CtaButton blue>바로가기</CtaButton>
            <SlideIndicator>01 / 04</SlideIndicator>
          </CarouselContent>
        </CarouselItem>

        <CarouselItem active={currentSlide === 2}>
          <CarouselContent blue>
            <CarouselTextContent>
              <CarouselSubtitle>시간과 비용을 절약하고 싶다면?</CarouselSubtitle>
              <CarouselTitle>개발자들 몰래 보는<br/>꿀팁 사이트 보러가기</CarouselTitle>
            </CarouselTextContent>
            <CarouselImage src="/images/developer_image.png" alt="Developer" />
            <CtaButton white>바로가기</CtaButton>
          </CarouselContent>
        </CarouselItem>
      </CarouselSection>

      {/* Popular Projects Section */}
      <SectionHeader>
        <SectionTitle>인기 프로젝트</SectionTitle>
        <ViewMoreLink>
          자세히 알아보기
          <ArrowIcon src="/images/arrow_up.svg" alt="Arrow" />
        </ViewMoreLink>
      </SectionHeader>

      <PopularProjectsGrid>
        <ProjectCard>
          <ProjectHeader>
            <ProjectTitle>블록체인 Dapp 프로젝트</ProjectTitle>
            <DeadlineTag>D-54</DeadlineTag>
          </ProjectHeader>
          <ProjectDescription>
            이번 블록체인 Dapp 프로젝트에서 백엔드를
            맡아주실 개발자 분을 구하고 있습니다...
          </ProjectDescription>
          <ProjectInfo>
            <ProjectDetail>모집 인원 | 3~4명</ProjectDetail>
            <ProjectDetail>마감일 25.03.15</ProjectDetail>
          </ProjectInfo>
          <ProjectTags>
            <ProjectTag>AWS</ProjectTag>
            <ProjectTag>Blockchain</ProjectTag>
            <ProjectTag>React</ProjectTag>
          </ProjectTags>
        </ProjectCard>

        <ProjectCard>
          <ProjectHeader>
            <ProjectTitle>하이브리드 웹 개발자 양성</ProjectTitle>
            <DeadlineTag>D-64</DeadlineTag>
          </ProjectHeader>
          <ProjectDescription>
            안녕하세요! 저희는 이번에 하이브리드 웹 개발자
            양성을 위하여 새로운 신입 멤버를 모집하고 있...
          </ProjectDescription>
          <ProjectInfo>
            <ProjectDetail>모집 인원 | 3~4명</ProjectDetail>
            <ProjectDetail>마감일 25.04.06</ProjectDetail>
          </ProjectInfo>
          <ProjectTags>
            <ProjectTag>Hybrid</ProjectTag>
            <ProjectTag>Web</ProjectTag>
            <ProjectTag>front</ProjectTag>
          </ProjectTags>
        </ProjectCard>

        <ProjectCard>
          <ProjectHeader>
            <ProjectTitle>알고리즘 프로젝트 모집!</ProjectTitle>
            <DeadlineTag>D-70</DeadlineTag>
          </ProjectHeader>
          <ProjectDescription>
            안녕하세요 저희는 뉴알고리즘을 만들고자 새로운
            능력자분을 모시고 있습니다 저희는 디앱 기반 ...
          </ProjectDescription>
          <ProjectInfo>
            <ProjectDetail>모집 인원 | 5~7명</ProjectDetail>
            <ProjectDetail>마감일 25.04.30</ProjectDetail>
          </ProjectInfo>
          <ProjectTags>
            <ProjectTag>Newproject</ProjectTag>
            <ProjectTag>Algorithm</ProjectTag>
            <ProjectTag>AWS</ProjectTag>
          </ProjectTags>
        </ProjectCard>
      </PopularProjectsGrid>

      {/* Project Feed Toggle */}
      <FeedToggleSection>
        <SectionTitle>프로젝트 목록</SectionTitle>
        <ToggleContainer>
          <ToggleOption 
            active={feedType === 'STUDY'} 
            onClick={() => handleFeedToggle('STUDY')}
          >
            <ToggleCircle active={feedType === 'STUDY'}>
              {feedType === 'STUDY' && <ToggleCheck />}
            </ToggleCircle>
            Study
          </ToggleOption>
          <ToggleOption 
            active={feedType === 'PROJECT'} 
            onClick={() => handleFeedToggle('PROJECT')}
          >
            <ToggleCircle active={feedType === 'PROJECT'} outlined={feedType !== 'PROJECT'} />
            Project
          </ToggleOption>
        </ToggleContainer>
      </FeedToggleSection>

      {/* Project Feed */}
      <ProjectFeed>
        {/* Project items would be rendered here */}
        {/* This would normally be a component or a map over data */}
      </ProjectFeed>

      {/* Footer */}
      <Footer />
    </PageContainer>
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

const SearchIcon = styled.img`
  margin-right: 8px;
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
  gap: 16px;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  border: 1px solid #CECECE;
  border-radius: 4100px;
  padding: 16px 24px;
  font-size: 24px;
  color: #1A1A1A;
  cursor: pointer;
  
  &:hover {
    background-color: #F3F0F0;
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
  height: 300px;
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
  font-size: 40px;
  font-weight: 600;
  color: #000000;
  margin: 0;
`;

const ViewMoreLink = styled.a`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 24px;
  font-weight: 300;
  color: #1A1A1A;
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
`;

const ProjectCard = styled.div`
  background-color: #F1F1F1;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 316px;
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
  border: 1px solid #CECECE;
  border-radius: 50px;
  padding: 7.5px 12px;
  font-size: 12px;
  color: #1A1A1A;
  background-color: white;
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

export default MainPage; 