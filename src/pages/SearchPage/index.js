import React, {useState, useEffect} from 'react'
import { useLocation} from 'react-router-dom';
import Nav from "../../components/Nav"; 
import SearchFeed from "./SearchFeed"; 
import styled from 'styled-components';
import axios from 'axios';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태
    const showSearch = true;

    const useQuery = () => {
        return new URLSearchParams(useLocation().search); //현재 경로의 쿼리 문자열 
      }; //url ?뒤의 파라미터들을 가져옴 


      let query = useQuery();
      const searchTerm = query.get("q");

      useEffect(()=> {
        if (searchTerm) { //만약 searchTerm이 존재한다면 
            fetchSearchItems(searchTerm);
        }
      }, [searchTerm]);

      // useEffect(() => {
      //   if (searchTerm) {
      //     fetchSearchItems(searchTerm);
      //   }
      // }, [searchTerm, selectedTags]); // selectedTags 추가
    


      const fetchSearchItems = async (searchTerm) => {
        try {
          // 데이터 가져오기
          const response = await axios.get('/data.json');
          
          // 제목에 검색어가 포함된 아이템 필터링
          const filteredProjects = response.data.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          );

          // 필터링된 아이템 출력
          console.log("search items:", filteredProjects);
      
          setSearchResults(filteredProjects); // 필터링된 프로젝트 설정
        } catch (error) {
          console.error("Error fetching search items:", error);
        }
      };
      
      //(태그만)
      // const fetchSearchItems = async (searchTerm) => {
      //   try {
      //     const tags = selectedTags.join(','); // 선택된 태그를 문자열로 변환
    
      //     // 태그와 검색어를 기반으로 API 호출
      //     const response = await axios.get(`http://localhost:8080/main/search-tags?feedType=PROJECT&tags=${encodeURIComponent(tags)}&keyword=${encodeURIComponent(searchTerm)}`);
    
      //     // API 호출 결과 설정
      //     setSearchResults(response.data);
      //   } catch (error) {
      //     console.error("Error fetching search items:", error);
      //   }
      // };
    
      // const handleTagAdd = (tag) => {
      //   if (!selectedTags.includes(tag)) {
      //     setSelectedTags((prevTags) => [...prevTags, tag]);
      //   }
      // };
    
      // const handleTagRemove = (tag) => {
      //   setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
      // };
    
      // const handleResetTags = () => {
      //   setSelectedTags([]);
      // };


      //합친거 ( 태그 + 키워드)
      // const fetchSearchItems = async (searchTerm) => {
      //   try {
      //     const tags = selectedTags.join(','); // 선택된 태그를 문자열로 변환
    
      //     // 태그와 키워드를 기반으로 API 호출
      //     const tagResponse = await axios.get(`http://localhost:8080/main/search-tags?feedType=PROJECT&tags=${encodeURIComponent(tags)}`);
      //     const keywordResponse = await axios.get(`http://localhost:8080/main/search-keyword?feedType=PROJECT&keyword=${encodeURIComponent(searchTerm)}`);
    
      //     // 두 결과를 결합
      //     const combinedResults = [...tagResponse.data, ...keywordResponse.data];
    
      //     // 결과 상태 업데이트
      //     setSearchResults(combinedResults);
      //   } catch (error) {
      //     console.error("Error fetching search items:", error);
      //   }
      // };
    
      // const handleTagAdd = (tag) => {
      //   if (!selectedTags.includes(tag)) {
      //     setSelectedTags((prevTags) => [...prevTags, tag]);
      //   }
      // };
    
      // const handleTagRemove = (tag) => {
      //   setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
      // };
    
      // const handleResetTags = () => {
      //   setSelectedTags([]);
      // };
      


        return (
            <Container>
            <Nav  showSearch={showSearch}/>
{/* 

            {selectedTags.length > 0 && (
        <TagContainer>
          {selectedTags.map((tag) => (
            <Tag key={tag}>
              {tag}
              <CloseButton onClick={() => handleTagRemove(tag)}>X</CloseButton>
            </Tag>
          ))}
          <ResetButton onClick={handleResetTags}>초기화</ResetButton>
        </TagContainer>
      )} */}

          {searchResults.length > 0 ? (
            <>
              <ResultMessage>“{searchTerm}”에 대한 결과</ResultMessage>
            </>
          ) : (
            <NoResults>찾고자하는 검색어 "{searchTerm}"에 맞는 아이템이 없습니다.</NoResults>
          )}
          
             <SearchFeed itemList={searchResults} setSearchResults={setSearchResults} />
            
    
            </Container>
            
 
  )
}

export default SearchPage;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding: 20px;
  width: 100%;
  margin-top: 250px;

`;


const NoResults = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #777;


`;


const ResultMessage = styled.p`
  font-size: 24px;
  font-weight: bold;

  color: #777;
`;

// const TagContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   margin-bottom: 10px;
// `;

// const Tag = styled.span`
//   background-color: #e0e0e0;
//   border-radius: 4px;
//   padding: 5px 10px;
//   margin-right: 5px;
// `;

// const CloseButton = styled.button`
//   margin-left: 5px;
//   background: none;
//   border: none;
//   color: red;
//   cursor: pointer;
// `;

// const ResetButton = styled.button`
//   margin-left: 10px;
//   cursor: pointer;
// `;

