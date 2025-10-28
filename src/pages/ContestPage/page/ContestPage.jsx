//바끤 피그마
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { feedTypeAtom, selectedProjectDetailAtom ,selectedSavedProjectAtom} from '../../../Atoms.jsx/AtomStates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';
// import PopularProject from '../components/PopularProject';
// import ProjectFeedCard from '../components/ProjectFeedCard';
import axios from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext';
import contest1 from '../../../assets/Image/01.jpeg';
import contest2 from '../../../assets/Image/02.jpg.avif';
import contest3 from '../../../assets/Image/03.jpg';
import contest4 from '../../../assets/Image/04.png';
import contest5 from '../../../assets/Image/05.jpeg';
import contest6 from '../../../assets/Image/06.jpg';
import contest7 from '../../../assets/Image/07.jpg';
import contest8 from '../../../assets/Image/08.jpg';
import contest9 from '../../../assets/Image/09.png';
import contest10 from '../../../assets/Image/10.jpg';
import contest11 from '../../../assets/Image/11.jpg';
import contest12 from '../../../assets/Image/12.jpeg';
import contest13 from '../../../assets/Image/13.png';
import contest14 from '../../../assets/Image/14.png';
import contest15 from '../../../assets/Image/15.png';




const tagOptions = [
  "전략/기획", "상품/서비스 기획(PO)", "마케팅/브랜드", "세일즈/BD", "PR/커뮤니케이션", "구매/소싱","재무/회계",
  "UX/UI·리서치", "PM(프로젝트/프로젝트)", "생산/품질/SCM", "HR(조직/채용/리닝)",
  "데이터/AI(분석)", "법무/컴플라이언스", "ESG/지속가능경영", "소프트웨어/플랫폼(백엔드·클라우드)"
];

const tagDetails = {
  "전략/기획": {
    title: "전략/기획",
    description: "사업계획/케이스 스터디(정부·공공·대기업 신사업 아이디어), 정책·산업 아이디어 공모전, 스타트업 IR/피칭 대회(창업진흥원·지자체), 공모전 포털(씽굿·올콘·잡코리아 공모전)"
  },
  "상품/서비스 기획(PO)": {
    title: "상품/서비스 기획(PO)",
    description: "서비스 기획 해커톤(대기업/지자체), 디지털 혁신 아이디어 공모전, 린스타트업 챌린지(캠퍼스/지자체)"
  },
  "마케팅/브랜드": {
    title: "마케팅/브랜드",
    description: "광고·PR 아이디어(에이전시/대기업 주최), 브랜디드 콘텐츠/UCC, 캠페인 제안(Z세대 타깃), 공모전 포털(씽굿·올콘)"
  },
  "세일즈/BD": {
    title: "세일즈/BD",
    description: "B2B 제안/제안서 경진, 파트너 생태계 아이디어, 유통/판로개척 공모전(공공·유관기관)"
  },
  "PR/커뮤니케이션": {
    title: "PR/커뮤니케이션",
    description: "PR 아이디어/보도자료 경진, 브랜드 스토리텔링/영상 공모, CSR 커뮤니케이션 공모전"
  },
  "구매/소싱": {
    title: "구매/소싱",
    description: "원가절감·생산성 제안전, 동반성장/상생 아이디어 공모, ESG 공급망 공모전"
  },
  "재무/회계": {
    title: "재무/회계",
    description: "리서치·기업가치평가 대회(예: 대학생 리서치 챌린지), 증권사 투자아이디어 경진, 재무모델링 대회"
  },
  "UX/UI·리서치": {
    title: "UX/UI·리서치",
    description: "UX/UI 공모전·서비스디자인 경진, 디자인 해커톤(대학/지자체/기업), 사용성 개선 제안전"
  },
  "PM(프로젝트/프로젝트)": {
    title: "PM(프로젝트/프로젝트)",
    description: "디지털 전환(DX) 해커톤, 스마트시티/스마트팩토리 과제형 대회, 애자일 전환 아이디어 공모전"
  },
  "생산/품질/SCM": {
    title: "생산/품질/SCM",
    description: "스마트제조/스마트팩토리 경진, 품질 분임조 경진, SCM 최적화 아이디어"
  },
  "HR(조직/채용/리닝)": {
    title: "HR(조직/채용/리닝)",
    description: "조직문화/복지 아이디어 공모전, 채용브랜딩 콘텐츠 공모, HR 애널리틱스 주제 공모"
  },
  "데이터/AI(분석)": {
    title: "데이터/AI(분석)",
    description: "데이터 사이언스 경진(Dacon·Kaggle), 공공데이터 활용 경진대회, 금융 데이터/퀀트 경진(금융사 주최)"
  },
  "법무/컴플라이언스": {
    title: "법무/컴플라이언스",
    description: "규제혁신·샌드박스 아이디어, 개인정보·윤리 에세이 공모전, 법제개선 제안"
  },
  "ESG/지속가능경영": {
    title: "ESG/지속가능경영",
    description: "ESG 아이디어/탄소감축 솔루션, 사회공헌 기획 공모, 친환경 제품·서비스 경진"
  },
  "소프트웨어/플랫폼(백엔드·클라우드)": {
    title: "소프트웨어/플랫폼(백엔드·클라우드)",
    description: "해커톤(빅테크/통신/지자체), 알고리즘/코딩 테스트 대회, 오픈소스 공헌 챌린지"
  }
};


const recommendContest = [
  {
    id: 1,
    image: contest1,
    title: "전국 대학생 SW창업 아이디어톤(대구 대-다산벤처스)",
    detail: "신규 서비스/사업 아이디어 / 사용자 패인포인트 발굴→MVP 기획 실전.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["상품/서비스 기획(PO)", "모집중"],
    description: "신규 서비스/사업 아이디어 / 사용자 패인포인트 발굴→MVP 기획 실전."
  },
  {
    id: 3,
    image: contest3,
    title: "공공 AI 혁신 대국민 아이디어 공모전(행안부-NIA)",
    detail: "공공서비스 혁신 아이디어 / 빅데이터 GTM·정책/서비스 기획 경청차 쌓기.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["상품/서비스 기획(PO)", "모집중"],
    description: "공공서비스 혁신 아이디어 / 빅데이터 GTM·정책/서비스 기획 경청차 쌓기."
  },
   {
    id: 12,
    image:  contest12,
    title: "2025 DATA-AI 분석 경진대회(KISTI)",
    detail: "재무 KPI/리스크 분석 지표 설계 프레임 연습에 유용(문제발굴-해결 모두).",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["재무/회계", "모집중"],
    description: "재무 KPI/리스크 분석 지표 설계 프레임 연습에 유용(문제발굴-해결 모두)."
  }

]

const contests = [
  {
    id: 1,
    image: contest1,
    title: "전국 대학생 SW창업 아이디어톤(대구 대-다산벤처스)",
    detail: "신규 서비스/사업 아이디어 / 사용자 패인포인트 발굴→MVP 기획 실전.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["상품/서비스 기획(PO)", "모집중"],
    description: "신규 서비스/사업 아이디어 / 사용자 패인포인트 발굴→MVP 기획 실전."
  },
  {
    id: 2,
    image: contest2,
    title: "물류데이터 활용·분석 아이디어 공모전 (대전정보문화산업진흥원)",
    detail: "수요예측·물류적재화·지표설계 역량.",
    date: "2025.08.15 ~ 2025.09.30",
    tags: ["생산/품질/SCM", "모집중"],
    description: "수요예측·물류적재화·지표설계 역량."
  },
  {
    id: 3,
    image: contest3,
    title: "공공 AI 혁신 대국민 아이디어 공모전(행안부-NIA)",
    detail: "공공서비스 혁신 아이디어 / 빅데이터 GTM·정책/서비스 기획 경청차 쌓기.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["상품/서비스 기획(PO)", "모집중"],
    description: "공공서비스 혁신 아이디어 / 빅데이터 GTM·정책/서비스 기획 경청차 쌓기."
  },
  {
    id: 4,
    image: contest4,
    title: "제8회 전국 청년 아이디어톤(수원시-아주대)",
    detail: "아이디어에선→프로토타이핑→퍼팅.",
    date: "2025.10.01 ~ 2025.11.01",
    tags: ["PM(프로젝트/프로덕트)", "모집중"],
    description: "아이디어에선→프로토타이핑→퍼팅."
  },
  {
    id: 5,
    image: contest5,
    title: "국립생태원 '생태디자인' 공모전(텍스타일 패턴)",
    detail: "리서치 기반 콘셉팅-퍼즐 시스템 설계.",
    date: "2025.09.15 ~ 2025.10.31",
    tags: ["UX/UI-리서치", "모집중"],
    description: "리서치 기반 콘셉팅-퍼즐 시스템 설계."
  },
  {
    id: 6,
    image: contest6,
    title: "2025 인문가치 논문 공모전(한국정신문화재단)",
    detail: "조직문화-러닝 디자인 관점의 리서치-정책 제안에 활용 가능.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["HR(조직/채용/리닝)", "모집중"],
    description: "조직문화-러닝 디자인 관점의 리서치-정책 제안에 활용 가능."
  },
  {
    id: 7,
    image: contest7,
    title: "2025 스페이스 해커톤",
        detail: "데이터/임베디드/플랫폼 과제 / 대규모 프로젝트 협업•배포 플로우 학습.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["소프트웨어/플랫폼(백엔드·클라우드)", "모집중"],
    description: "지배구조-윤리경영-내부통제 체계 관련 문서화/평가 대응 실무에 유의미."
  },
  {
    id: 8,
    image: contest8,
    title: "2025 미래한국 아이디어 공모전(카드 뉴스/영상 부문)",
    detail: "광고·퍼포먼스 마케팅과 교집합",
    date: "2025.09.01 ~ 2025.10.15",
      tags: ["마케팅/브랜드", "모집중"],
    description: "ESG 메시지 설계-캠페인 기획 실전."
  },
  {
    id: 9,
    image: contest9,
    title: "Toss NEXT ML Challenge: CTR 예측(DACON)",
    detail: "메시지 설계-스토리텔링-콘텐츠 그로스 감각 검증",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["데이터/AI(분석)", "모집중"],
    description: "메시지 설계-스토리텔링-콘텐츠 그로스 감각 검증"
  },
  {
    id: 10,
    image: contest10,
    title: "캠퍼스온에어 ESG 영상 공모전",
    detail: " ESG 메시지 설계·캠페인 기획 실전.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["ESG/지속가능경영", "모집중"],
    description: "지배구조-윤리경영-내부통제 체계 관련 문서화/평가 대응 실무에 유의미."
  },
  {
    id: 11,
    image: contest11,
    title: "대한민국 ESG경영 혁신대상(한경)",
    detail: "지배구조·윤리경영·내부통제 체계 관점 문서화/평가 대응 실무에 유의미.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["법무/컴플라이언스", "모집중"],
    description: "재무 KPI/리스크 분석 지표 설계 프레임 연습에 유용(문제발굴-해결 모두)."
  },
  {
    id: 12,
    image:  contest12,
    title: "2025 DATA-AI 분석 경진대회(KISTI)",
    detail: "재무 KPI/리스크 분석 지표 설계 프레임 연습에 유용(문제발굴-해결 모두).",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["재무/회계", "모집중"],
    description: "재무 KPI/리스크 분석 지표 설계 프레임 연습에 유용(문제발굴-해결 모두)."
  },
  {
    id: 13,
    image:  contest13,
    title: "제14회 도로경관디자인 대전(한국도로공사) ",
    detail: "사용자 맥락/환경요인 리서치→설계.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["UX/UI·리서치", "모집중"],
  },
  {
    id: 14,
    image:  contest14,
    title: "운수종사자 인지특성 기반 교통사고 위험 예측 AI 경진대회(DACON)",
    detail: "실무형 회귀/모델링",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["재무/회계", "모집중"],
  },
  {
    id: 15,
    image:  contest15,
    title: "2025 신문·방송 독자 데이터 분석 아이디어 경진대회(DACON) ",
    detail: "시각화·인사이트 도출.",
    date: "2025.09.01 ~ 2025.10.15",
    tags: ["데이터/AI(분석)", "모집중"],
  }

];
// // Update tagOptions to include all unique tags from the contests
// const tagOptions = [...new Set(contests.flatMap(contest => contest.tags))];
// // ... existing code ...


const ContestPage = () => {
  const { isLoggedIn, user } = useAuth();
  const [allProjects, setAllProjects] = useState([]);
  const [selectedSavedProject,setSelectedSavedProject] = useAtom(selectedSavedProjectAtom); // 아톰에서 프로젝트 정보 가져오기
  const [selectedTags, setSelectedTags] = useState([]); // 태그 상태 추가
  const [selectedTagDetails, setSelectedTagDetails] = useState([]);
  const [tagsRowZIndex, setTagsRowZIndex] = useState(2000);
  const tagsRowRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tagsRowRef.current) {
        const tagsRowTop = tagsRowRef.current.getBoundingClientRect().top;
        // NavigationBar의 고정된 부분의 높이를 80px로 가정합니다.
        if (tagsRowTop <= 250) {
          setTagsRowZIndex(0);
        } else {
          setTagsRowZIndex(2000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
        <TagsRow ref={tagsRowRef} style={{ zIndex: tagsRowZIndex }}>
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
     
        {selectedTags.length > 0 ? (
          <RecommendSection>
            <div style={{ maxWidth: '1030px', margin: '0 auto', width: '100%' }}>
              <TagTitle style={{ marginTop: '50px', color: 'black', marginBottom: '30px' }}>
                고르신 직군은 이런 공모전 유형을 추천해요
              </TagTitle>
              <TagDetailContainer>
                {selectedTagDetails.map((detail, index) => (
                  <TagDetailCard key={index}>
                    <TagDetailHeader color={index === 0 ? '#00AEFF' : index === 1 ? '#333333' : '#555555'}>
                      <TagDetailTitle>{detail.title}</TagDetailTitle>
                    </TagDetailHeader>
                    <TagDetailContent>
                      <TagDetailDescription>{detail.description}</TagDetailDescription>
                      <LearnMoreButton onClick={() => {/* Handle more info click */}}>
                        더 알아보기
                      </LearnMoreButton>
                    </TagDetailContent>
                  </TagDetailCard>
                ))}
              </TagDetailContainer>
            </div>
          </RecommendSection>
        ) : (
          <FullWidthBlueSection>
            <div style={{ maxWidth: '1030px', margin: '0 auto', width: '100%' }}>
              <TagTitle style={{marginTop: '50px', color: 'white'}}> {user?.nickname}님께 이런 공모전을 추천드려요</TagTitle>
              <ContestGrid>
                {recommendContest.map(contest => (
                  <ContestCard key={contest.id} onClick={() => navigate(`/ContestDetailPage/${contest.id}`)}>
                    <ContestImage src={contest.image} alt={contest.title} />
                    <ContestContent>
                      <ContestTitle>{contest.title}</ContestTitle>
                      <ContestDetail>{contest.detail}</ContestDetail>
                    </ContestContent>
                    <ContestTags>
                      {contest.tags.map((tag, index) => (
                        <ContestTag key={index}>{tag}</ContestTag>
                      ))}
                    </ContestTags>
                  </ContestCard>
                ))}
              </ContestGrid>
            </div>
          </FullWidthBlueSection>
        )}

        <TagTitle style={{marginTop: '80px', marginBottom: '10px'}}>
          {selectedTags.length > 0
            ? "지금 모집 중인 공모전이예요"
            : "지금 인기있는 공모전을 알려드려요"}
        </TagTitle>
        
        <ContestGrid>
  {filteredContests.map(contest => (
    <>
    <ContestCard key={contest.id} onClick={() => navigate(`/ContestDetailPage/${contest.id}`)}>
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

        {/* <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
          <Pagination
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            totalProjects={allProjects.length}
            onPageChange={handlePageChange}
          />
        </div> */}
      </MainContent>
    </ContentsWrap>
  </>
);
};

 const ContentsWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  // gap: ${(props) => (props.isMobile ? "20px" : "40px")};
  // padding: ${(props) => (props.isMobile ? "20px" : "0 4px 0 0")};
  min-height: 100vh;
  overflow-x: hidden;
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
  // padding: ${(props) => (props.isMobile ? "0" : "0 20px")};
`;


const TagTitle = styled.h2`
  font-size: 24px;
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
  margin-bottom: 40px;
`;

const Tag = styled.div`
  border: ${({ selected }) => (selected ? '#00AEFF' : 'none')};
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 16px;
  color:  ${({ selected }) => (selected ? 'white' : '#222')};
  background: ${({ selected }) => (selected ? '#00AEFF' : '#EDEDED')};
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
  flex-wrap: wrap;
  gap: 20px;
  // justify-content: space-between;
`;

const TagDetailCard = styled.div`
 flex: 1;
 width: 200px;
 max-width: 250px;
 min-height: 120px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
`;

const TagDetailHeader = styled.div`
  background-color: ${props => props.color || '#00AEFF'};
  color: white;
  padding: 16px 20px;
  text-align: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  // white-space: nowrap;
  
`;

const TagDetailTitle = styled.h3`
  font-size: clamp(12px, 1.5vw, 16px);
  font-weight: bold;
  margin: 0;

`;

const TagDetailContent = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 30px;
  

`;

const TagDetailDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #333;
  max-height: 100px;
`;

const LearnMoreButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
  min-height:350px;
  background-color: white;
  max-width: 300px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ContestImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: top;
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

const FullWidthBlueSection = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw; /* This is already correct for full width */
  margin-right: -50vw; /* This is already correct for full width */
  background: linear-gradient(180deg, #00AEFF 20%, #FBFBFB 100%);
  // padding: 20px 0;
  padding-bottom: 40px;
`;


const RecommendSection = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw; /* This is already correct for full width */
  margin-right: -50vw; /* This is already correct for full width */
  background: #F9F9F9;
  // padding: 20px 0;
  padding-bottom: 40px;
`;

export default ContestPage; 