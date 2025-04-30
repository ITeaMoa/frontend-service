import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';
import ProjectCard from '../../components/ProjectCard';
import { useAtom } from 'jotai';
import { feedTypeAtom } from '../../Atoms.jsx/AtomStates';


//xxxxxxx
const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const showSearch = true;
  const [feedType, setFeedType] = useAtom(feedTypeAtom);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  let query = useQuery();
  const searchTerm = query.get("q");
  const tags = query.get("tags");
    
  const handleProjectClick = (project) => {
    navigate(`/ApplyPage/${project.pk}`, { 
      state: { sk: project.sk }
    });
  };

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
              // onLikeClick={handleLikeClick}
              onApplyClick={handleApplyClick}
              isLoggedIn={!!user}
              userId={user?.id}
              feedType={feedType}
            />
          ))}
        </ProjectListWrapper>
      ) : (
        <NoResults>찾고자하는 검색어 "{searchTerm}"에 맞는 아이템이 없습니다.</NoResults>
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