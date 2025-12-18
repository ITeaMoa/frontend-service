import styled from 'styled-components';

const getDDay = (deadline) => {
  const end = new Date(deadline);
  const today = new Date();
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const PopularProject = ({ projects, handleProjectClick }) => {
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
            </PopularProjectCard>
          ))}

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
  width: 32px;
  height: 32px;
  margin-left: 12px;
  cursor: pointer;
  transition: background 0.2s;

  svg {
    display: block;
  }
`;
