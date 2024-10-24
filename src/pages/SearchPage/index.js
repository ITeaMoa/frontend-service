import React, {useState, useEffect} from 'react'
import { useLocation} from 'react-router-dom';
import Nav from "../../components/Nav"; 
import SearchFeed from "../../components/SearchFeed"; 
import styled from 'styled-components';
import axios from 'axios';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
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
      


        return (
            <Container>
            <Nav  showSearch={showSearch}/>

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

export default SearchPage


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding: 20px;
  width: 100%;
  margin-top: 15%;

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
