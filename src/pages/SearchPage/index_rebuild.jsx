import React from 'react';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import ProjectCard from '../../components/ProjectCard';


//xxxxxxx
const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`, { 
      state: { sk: project.sk }
    });
  };

  const handleLikeClick = (projectId, newLiked) => {
    setSearchResults(prevResults => 
      prevResults.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              liked: newLiked,
              likesCount: newLiked ? project.likesCount + 1 : project.likesCount - 1 
            }
          : project
      )
    );
  };

  const handleApplyClick = (project) => {
    if (!user) {
      alert("로그인 후에 신청할 수 있습니다.");
      return;
    }
    navigate(`/ApplyPage/${project.pk}`);
  };

  return (
    <Container>
      <Nav showSearch={showSearch} />
      {searchResults.length > 0 ? (
        <ProjectListWrapper>
          {searchResults.map((project, index) => (
            <ProjectCard
              key={project.id || index}
              project={project}
              onClick={() => handleProjectClick(project)}
              onLikeClick={handleLikeClick}
              onApplyClick={handleApplyClick}
              isLoggedIn={!!user}
              userId={user?.id}
              feedType="PROJECT"
            />
          ))}
        </ProjectListWrapper>
      ) : (
        <NoResults>검색 결과가 없습니다.</NoResults>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ProjectListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const NoResults = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #666;
`;

export default SearchPage;