import React from 'react';
// 스타일드 컴포넌트 import는 실제 경로에 맞게 수정하세요
import styled from 'styled-components';

const PopularProject = ({ projects, handleProjectClick }) => {
console.log("projects", projects)
    return (
    
  <>
   
    <PopularProjectsGrid>
      {projects && projects.length > 0 ? (
        <>
          {projects.map((project, idx) => (
            <PopularProjectCard key={idx} onClick={() => handleProjectClick && handleProjectClick(project)}>
              <PopularProjectHeader>
                <PopularProjectTitle>{project.title}</PopularProjectTitle>
                <PopularDeadlineTag>
                  {project.deadline
                    ? getDDay(project.deadline) === 0
                      ? '마감'
                      : `D-${getDDay(project.deadline)}`
                    : ''}
                </PopularDeadlineTag>
              </PopularProjectHeader>
              <PopularProjectDescription>
                {project.content}
              </PopularProjectDescription>
              <PopularProjectInfo>
                <PopularProjectDetail>모집 인원 | {project.recruitmentNum}명</PopularProjectDetail>
                <PopularProjectDetail>
                  마감일 | {formatDate(project.deadline)}
                </PopularProjectDetail>
                {/* <PopularProjectDetail>
                  기간 | {project.period}주
                </PopularProjectDetail> */}
                {/* <PopularProjectDetail>
                  장소 | {project.place}
                </PopularProjectDetail> */}
              </PopularProjectInfo>
              <PopularProjectTags>
                {project.tags && project.tags.map((tag, i) => (
                  <PopularProjectTag key={i}>{tag}</PopularProjectTag>
                ))}
              </PopularProjectTags>
              <ArrowCircle>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4L12 10L7 16" stroke="#00AEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ArrowCircle>
              {/* <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>
                <span>❤️ {project.likesCount}</span>
                <span style={{ marginLeft: 12 }}>작성자: {project.nickname}</span>
              </div> */}
            </PopularProjectCard>
          ))}
          {/* 빈 카드로 3개 맞추기 */}
          {Array.from({ length: 3 - projects.length }).map((_, i) => (
            <PopularProjectCard key={`dummy-${i}`} style={{ visibility: 'hidden' }} />
          ))}
        </>
      ) : (
        <div>인기 프로젝트가 없습니다.</div>
      )}
    </PopularProjectsGrid>
    </>
  );
};

export default PopularProject;



const PopularProjectsGrid = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  max-width: 1030px;
  margin: 0 auto 48px auto;
`;

const PopularProjectCard = styled.div`
  background: linear-gradient(135deg, #eaf6ff 80%, #f6fbff 100%);
  border-radius: 16px;
  padding: 24px 20px 18px 20px;
  flex: 1 1 0;
  min-width: 0;
  max-width: none;
  min-height: 250px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  margin: 0;
  /* 카드가 3개일 때와 동일한 크기 보장 */
  flex-basis: calc((100% - 48px) / 3);
  max-width: calc((100% - 48px) / 3);

  &:hover {
    border:1px solid #62b9ec;
  }
`;

const PopularProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #C2E4F8;
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
  color: black;
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

const ArrowCircle = styled.span`
  position: absolute;
  right: 20px;
  bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
//   background: #fff;
//   border-radius: 50%;
  width: 32px;
  height: 32px;
  margin-left: 12px;
  cursor: pointer;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.07);
//   border: 1.5px solid #00aeff;
  transition: background 0.2s;
//   &:hover {
//     background: #eaf6ff;
//   }
  svg {
    display: block;
  }
`;

// D-day 계산 함수
function getDDay(deadline) {
  const end = new Date(deadline);
  const today = new Date();
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// 날짜 포맷 함수
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
