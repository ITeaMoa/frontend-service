//바끤 피그마
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faUsers, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
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
import ContestCard from '../components/ContestCard';

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

const relatedProjects = [
  {
    id: 1,
    title: "DACON 교통사고 예측 AI 경진대회 팀원 모집",
    description: "운수종사자 인지특성 데이터를 활용한 교통사고 위험 예측 AI 모델을 함께 개발할 데이터 분석가, 머신러닝 엔지니어를 찾습니다.",
    tags: ["AI", "머신러닝", "데이터분석"],
    recruitmentNum: "2",
    deadline: "2025-08-20T23:59:59",
    views: 580,
    period: 3,
  },
  {
    id: 2,
    title: "실무형 회귀/모델링 스터디 및 공모전 참여",
    description: "Python, Scikit-learn, Tensorflow를 활용한 예측 모델링 스터디를 진행하고, DACON 경진대회에 함께 출전할 멤버를 구합니다.",
    tags: ["Python", "Tensorflow", "회귀모델"],
    recruitmentNum: "3",
    deadline: "2025-08-25T23:59:59",
    views: 450,
    period: 4,
    createdAt: "2025-08-15T00:00:00",
    
  },
  {
    id: 3,
    title: "교통 데이터 시각화 및 AI 모델 개발 팀원 구해요",
    description: "교통사고 위험 예측 AI 경진대회에 참여하여 데이터 시각화 및 분석 파트를 담당해주실 분을 찾습니다. Tableau, Python 경험자 환영!",
    tags: ["데이터시각화", "Tableau", "AI"],
    recruitmentNum: "1",
    deadline: "2025-08-18T23:59:59",
    views: 320,
    period: 3,
  },
  {
    id: 4,
    title: "AI 경진대회 함께할 모델러를 찾습니다 (DACON)",
    description: "운수종사자 데이터를 기반으로 창의적인 피처 엔지니어링과 모델링을 통해 교통사고 위험도를 예측할 모델러를 모집합니다.",
    tags: ["모델링", "피처엔지니어링", "Kaggle"],
    recruitmentNum: "1",
    deadline: "2025-08-22T23:59:59",
    views: 410,
    period: 3,
  }
];

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundContest = contests.find(c => c.id === parseInt(contestId, 10));
    if (foundContest) {
      setContest(foundContest);
    } else {
      // Optional: Handle contest not found, e.g., navigate to a 404 page
      // navigate('/not-found');
    }
  }, [contestId, navigate]);

  if (!contest) {
    return <div>공모전 정보를 불러오는 중...</div>;
  }

  const timelineItems = [
    { label: '참가 신청 시작', date: '09/29', active: true },
    { label: '대회 시작', date: '10/13', active: true },
    { label: '본 평점 마감', date: '11/07', active: false },
    { label: '레이더스 제출 마감', date: '11/13', active: false },
    { label: '시작 종료', date: '11/14', active: false },
    { label: '2차 평가 자료 제출', date: '11/19', active: false },
    { label: '2차 평가 및 전송 마감', date: '11/27', active: false },
    { label: '최종 결과 발표', date: '11/28', active: false },
    { label: '오프라인 시상식', date: '12/03', active: false },
  ];

  const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

  const timelineRows = chunk(timelineItems, 5); // 한 줄에 5개씩 나누기

  return (
    <>
    <ContentsWrap>
      <NavigationBar showSearch={true}/>
      <MainContent Wide1030 style={{ paddingTop: '350px' }} >
        

        {/* Contest Detail Content */}
        <ContestDetailContainer>
          <ContestHeader>
            <ContestImage src={contest.image} alt={contest.title} />
           
            <ContestInfoPanel>
               <ContestTags>
              <ContestTag>{contest.tags[0]}</ContestTag>
              <ContestTag>{contest.tags[1]}</ContestTag>
            </ContestTags>
              <ContestTitle>{contest.title}</ContestTitle>
              <ContestMeta>
                <ContestCategory>
                  <FontAwesomeIcon icon={faTrophy} style={{ marginRight: '8px' }} />
                  상금 | 6000만원
                </ContestCategory>
                <ContestStatus>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
                  마감 | {contest.tags[1]}
                </ContestStatus>
                <ContestPeriod>
                  <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
                  인원 | 5명
                </ContestPeriod>
                <ContestPeriod>
                  <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '8px' }} />
                  기간 | {contest.date}
                </ContestPeriod>
              </ContestMeta>
              {/* <ApplyButton>공모전 지원하기</ApplyButton> */}
              <ProgressTimeline>
                {timelineRows.map((row, rowIndex) => (
                  <TimelineRow key={rowIndex}>
                    {row.map((item, itemIndex) => {
                      const nextItem = row[itemIndex + 1];
                      const showActiveConnector =  item.active && nextItem && nextItem.active;
                      return (
                        <TimelineItem key={itemIndex} active={item.active}>
                          {showActiveConnector && <TimelineConnector />}
                          <TimelineLabel>{item.label}</TimelineLabel>
                          <TimelineDate>{item.date}</TimelineDate>
                          <TimelineDot active={item.active} />
                        </TimelineItem>
                      );
                    })}
                  </TimelineRow>
                ))}
              </ProgressTimeline>
            </ContestInfoPanel>
          </ContestHeader>

          {/* Progress Timeline */}
         
          {/* Navigation Tabs */}
          <Tabs>
            <Tab active={true}>개요</Tab>
            <Tab>평가</Tab>
            <Tab>규칙</Tab>
            <Tab>일정</Tab>
            <Tab>상금</Tab>
            <Tab>동의사항</Tab>
          </Tabs>

          {/* Content Sections */}
          <ContentSection>
            <SectionTitle>[배경]</SectionTitle>
            <SectionContent>
              <p>고통사고는 차량 도로 환경뿐 아니라 운수중사자의 인지 특성에 크게 좌우됩니다.</p>
              <p>실제로 운수중사자는 신규 진입 시 자격 검사를 받고, 이후 정기적으로 자격 유지 검사를 통해 인지 능력과 안전 운전 역량을 점검받습니다.</p>
              <p>이러한 자격 검사 데이터를 활용해 사고 위험도를 예측하는 AI 모델을 개발함으로써, 고통사고 예방과 맞춤형 안전 관리 체계 구축에 기여할 수 있습니다.</p>
            </SectionContent>
          </ContentSection>

          <ContentSection>
            <SectionTitle>[대회 방식]</SectionTitle>
            <SectionContent>
              <p>본 대회는 1차 평가, 2차 평가순으로 진행됩니다.</p>
              <ul>
                <li><strong>1차 평가:</strong> 최종 Public 리더보드 기준 상위 15팀을 2차 평가 진출팀으로 선정합니다.</li>
                <li><strong>2차 평가:</strong> 진출팀은 '모델 개발 보고서'와 '데이터 분석 보고서'를 작성하여 제출해야 하며, 이를 종합적으로 평가하여 최종 상위 7팀을 수상팀으로 선정합니다.</li>
              </ul>
            </SectionContent>
          </ContentSection>

          <ContentSection>
            <SectionTitle>[주제]</SectionTitle>
            <SectionContent>
              <p>운수중사자 인지 특성 데이터를 활용한 교통사고 위험 예측 AI 모델 개발</p>
            </SectionContent>
          </ContentSection>

          <ContentSection>
            <SectionTitle>[설명]</SectionTitle>
            <SectionContent>
              <p>운수중사자 자격검사(A: 신규자격, B: 자격유지) 과정에서 수집된 인지 반응 관련 세부 검사 데이터를 활용하여, 검사 결과 기준 교통사고 위험도에 속할 확률을 예측하는 AI 모델을 개발합니다.</p>
              <p>참가자는 각 운수중사자의 인지적 특성을 종합적으로 분석하여 교통사고 발생 가능성을 정량적으로 추정할 수 있는 예측 모델을 구축해야 합니다.</p>
              <p>대회 종료 후 모델 개발 결과는 1)모델 개발 보고서와 2)데이터 분석 보고서의 형태로 제출되며, 모델의 성능뿐 아니라 데이터 이해도와 분석 과정의 논리성 또한 함께 평가됩니다.</p>
            </SectionContent>
          </ContentSection>

          <ContentSection>
            <SectionTitle>[코드 제출 대회]</SectionTitle>
            <SectionContent>
              <p>본 대회의 제출은 submit.zip 업로드 방식의 '코드 제출 대회'로 진행됩니다. 평가가 정상적으로 실행되기 위해서는 다음 조건을 충족해야 합니다:</p>
              <ul>
                <li>푸른 코드 실행 시간 ≤ 30분</li>
                <li>패키지(라이브러리) 설치 시간 ≤ 10분</li>
                <li>제출 파일 용량 제한 ≤ 10GB</li>
                <li>오프라인 환경 실행 (패키지 설치 외 인터넷 연결 불가능)</li>
                <li>Only CPU : 3 vCPU, 28GB RAM 환경에서 실행</li>
              </ul>
              <p>자세한 사항은 평가 탭과 코드 제출 가이드를 반드시 참고하여 진행하시길 바랍니다.</p>
            </SectionContent>
          </ContentSection>

          <ContentSection>
            <SectionTitle>[참가 자격]</SectionTitle>
            <SectionContent>
              <p>대한민국 국민 누구나</p>
            </SectionContent>
          </ContentSection>

          <ContentSection>
            <SectionTitle>[주최 / 운영]</SectionTitle>
            <SectionContent>
              <p><strong>주최:</strong> 행정안전부, 한국자동차정보화진흥원</p>
              <p><strong>주관:</strong> 한국교통안전공단</p>
              <p><strong>운영:</strong> 데이콘</p>
            </SectionContent>
          </ContentSection>

          <RelatedProjectsSection>
            <ContestCardTitle>해당 공모전 팀원 모집중이예요</ContestCardTitle>
            <RelatedProjectsGrid>
              {relatedProjects.map(project => (
                <ContestCard key={project.id} project={project} />
              ))}
            </RelatedProjectsGrid>
          </RelatedProjectsSection>
        </ContestDetailContainer>
        
        
      </MainContent>
    </ContentsWrap>
  </>
);
};

// Add these styled components at the top of the file
const ContestDetailContainer = styled.div`
  max-width: 1030px;
  margin: 0 auto;
  padding: 20px;
`;

const ContestHeader = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: stretch; /* 자식 요소들이 같은 높이를 갖도록 변경 */
`;

const ContestImage = styled.img`
  width: 400px;
  /* height 속성을 제거하여 유연하게 높이가 조절되도록 함 */
  object-fit: contain;
  border-radius: 8px;
`;

const ContestInfoPanel = styled.div`
  flex: 1; /* 남은 공간을 모두 차지 */
  display: flex;
  flex-direction: column;
`;

const ContestTags = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 15px; /* 제목과의 간격 */
`;

const ContestTag = styled.span`
  background-color: #f0f0f0;
  color: #333;
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
`;
const ApplyButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #00AEFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover { background-color: #008fcc; }
`;

const ContestTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
  margin-bottom:30px;
`;

const ContestMeta = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(194, 228, 248, 0.4); /* C2E4F8 with 40% opacity */
  gap: 8px;
  padding: 20px;
  border-radius: 8px;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #000000;
  font-weight: bold;
  gap:12px;
`;

const ContestCategory = styled.span`
  font-size: 14px;
  color: #000000;
  display: flex;
  align-items: center;
  // gap: 8px;
`;

const ContestStatus = styled.span`
  font-size: 14px;
  display: flex;
  align-items: center;
  // gap: 8px;
`;

const ContestDeadline = styled.span`
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContestPeriod = styled.span`
  font-size: 14px;
  // color: #666;
  display: flex;
  align-items: center;
  // gap: 8px;
`;

const ProgressTimeline = styled.div`
  display: flex;
  flex-direction: column; /* 줄들을 세로로 쌓음 */
  gap: 40px; /* 줄 사이의 간격 */
  margin: 30px 0;
`;

const TimelineRow = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e0e0e0;
    transform: translateY(-50%);
    z-index: 1;
  }
`;

const TimelineItem = styled.div`
  flex: 1;
  text-align: center; /* 텍스트 중앙 정렬 */
  position: relative; /* 점과 텍스트 위치 조정을 위한 기준점 */
  z-index: 2; /* 가로 막대 위에 위치 */
  display: flex;
  flex-direction: column; /* 내부 요소 세로 정렬 */
  align-items: center; /* 내부 요소 중앙 정렬 */
  justify-content: center; /* 내부 요소 세로 중앙 정렬 */
  height: 80px; /* 아이템 높이 고정 */

  ${props => props.active && `
    /* 활성화된 아이템에 대한 추가 스타일 (예: 텍스트 색상 변경 등) */
  `}
  /* 각 아이템이 막대를 그리지 않도록 수정 */
`;

const TimelineLabel = styled.div`
  font-size: 14px;
  color: #333;
  width: 100%; /* 부모 너비에 맞춤 */
  position: absolute; /* 점 위에 위치 */
  bottom: calc(50% + 8px); /* 점과 막대 위로 띄움 */
  word-break: keep-all; /* 단어 단위로 줄바꿈 */
`;

const TimelineDate = styled.div`
  font-size: 12px;
  color: #666;
  position: absolute; /* 점 아래에 위치 */
  top: calc(50% + 8px); /* 점과 막대 아래로 띄움 */
`;

const TimelineConnector = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #00AEFF; /* 활성화 색상 */
  transform: translateY(-50%);
  z-index: 2; /* 회색 막대 위, 점 아래 */
`;

const TimelineDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${props => props.active ? '#00AEFF' : '#e0e0e0'};
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

const Tabs = styled.div`
  display: flex;
  margin: 30px 0;
  // border-bottom: 1px solid #e0e0e0;
  width: 100%;
`;

const Tab = styled.div`
  flex: 1;
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: ${props => props.active ? '#00AEFF' : 'transparent'};
  border-radius: 4px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  ${props => props.active && `
    color: white; /* 활성 탭 텍스트 색상 변경 */
    border-bottom-color: #00AEFF; /* 밑줄 색상 유지 */
  `}
`;

const ContentSection = styled.div`
  margin: 30px 0;
`;

const ContestCardTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  // border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  // border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
`;

const SectionContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #666;
`;

const RelatedProjectsSection = styled.div`
  margin-top: 60px;
  // background-color: #f7f7f7;
  padding: 40px;
  border-radius: 8px;
`;

const RelatedProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

export default ContestDetailPage; 