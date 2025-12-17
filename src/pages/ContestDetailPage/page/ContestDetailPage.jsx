// TODO: 백엔드 API 개발 완료 시 연동 예정 (현재는 더미 데이터 사용)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faUsers, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { CONTESTS_DETAIL, RELATED_PROJECTS } from '../../../data/contestDetailPageData';

const ContestDetailPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundContest = CONTESTS_DETAIL.find(c => c.id === parseInt(contestId, 10));
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

  const timelineRows = chunk(timelineItems, 5);

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
                <MetaRow>
                  <MetaLabel><FontAwesomeIcon icon={faTrophy} />상금</MetaLabel>
                  <MetaValue>| 6000만원</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaLabel><FontAwesomeIcon icon={faClock} />마감</MetaLabel>
                  <MetaValue>| {contest.tags[1]}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaLabel><FontAwesomeIcon icon={faUsers} />인원</MetaLabel>
                  <MetaValue>| 5명</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaLabel><FontAwesomeIcon icon={faCalendarDays} />기간</MetaLabel>
                  <MetaValue>| {contest.date}</MetaValue>
                </MetaRow>
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
              {RELATED_PROJECTS.map(project => (
                <RelatedProjectCard key={project.id}>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <ProjectTags>
                    {project.tags.map((tag, index) => (
                      <ProjectTag key={index}>{tag}</ProjectTag>
                    ))}
                  </ProjectTags>
                  <ProjectInfo>
                    <span>모집 인원: {project.recruitmentNum}명</span>
                    <span>조회수: {project.views}</span>
                  </ProjectInfo>
                </RelatedProjectCard>
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
  /* height 속성을 제거하여 유진하게 높이가 조절되도록 함 */
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

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const MetaLabel = styled.span`
  display: flex;
  align-items: center;
  width: 60px; /* 고정 너비로 정렬 맞춤 */

  svg {
    margin-right: 10px;
    width: 16px; /* 아이콘 너비 고정 */
    text-align: center;
  }
`;

const MetaValue = styled.span`
  flex: 1;
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
  // padding: 40px;
  border-radius: 8px;
`;

const RelatedProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const RelatedProjectCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
`;

const ProjectTag = styled.span`
  background-color: #f0f0f0;
  color: #333;
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 12px;
  white-space: nowrap;
`;

const ProjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
`;

export default ContestDetailPage;