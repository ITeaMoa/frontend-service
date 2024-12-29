import React, {useState, useEffect, useCallback,  useRef } from 'react'
import { useLocation} from 'react-router-dom';
import Nav from "../../components/Nav"; 
import SearchFeed from "./SearchFeed"; 
import styled from 'styled-components';
import axios from 'axios';
// import axios from '../../api/axios'

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태
    const showSearch = true;

    const useQuery = () => {
        return new URLSearchParams(useLocation().search); //현재 경로의 쿼리 문자열 
      }; //url ?뒤의 파라미터들을 가져옴 


      let query = useQuery();
    const searchTerm = query.get("q");
    // const [tags, setTags] = useState([]);
    // const tags = query.get("tags") ? query.get("tags").split(',') : []; // 태그 처리


 
// const fetchSearchItems = useCallback(async (searchTerm, tags) => {
//   try {
//     // 임시 데이터 가져오기
//     const response = await axios.get('/data.json'); // 로컬 JSON 파일에서 데이터 가져오기

//     // 제목에 검색어가 포함된 아이템 필터링
//     const filteredProjects = response.data.filter(item => 
//         item.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     // 태그에 따라 추가 필터링
//     const finalResults = filteredProjects.filter(item => {
//         return selectedTags.length === 0 || (item.tags && selectedTags.some(tag => item.tags.includes(tag)));
//     });

//     setSearchResults(finalResults); // 필터링된 결과 설정
// } catch (error) {
//     console.error("Error fetching search items:", error);
// }
// }, [selectedTags]); // selectedTags를 의존성 배열에 추가


//최종(검색+ 태그)
  const fetchSearchItems = useCallback(async (searchTerm, tags) => {
    try {
        const tagsQuery = tags.join(',');
        const tagResponse = await axios.get(`/main/search-tags?feedType=PROJECT&tags=${encodeURIComponent(tagsQuery)}`);
        const keywordResponse = await axios.get(`/main/search-keyword?feedType=PROJECT&keyword=${encodeURIComponent(searchTerm)}`);

        const combinedResults = [
            ...tagResponse.data,
            ...keywordResponse.data.filter(item => 
                !combinedResults.some(result => result.id === item.id) // 중복 제거
            )
        ];

        // 여기서 selectedTags를 사용하여 결과를 필터링할 수 있습니다.
        const filteredResults = combinedResults.filter(item => {
            // 예시: item.tags가 selectedTags에 포함된 경우
            return selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
        });

        setSearchResults(filteredResults);
    } catch (error) {
        console.error("Error fetching search items:", error);
    }
}, [selectedTags]); // selectedTags를 의존성 배열에 추가


// //최종(검색+ 태그)
// const fetchSearchItems = useCallback(async (searchTerm, tags) => {
//   try {
//       const tagsQuery = tags.join(',');
//       const tagResponse = await axios.get(`/main/search-tags?feedType=PROJECT&tags=${encodeURIComponent(tagsQuery)}`);
//       const keywordResponse = await axios.get(`/main?feedType=PROJECT`);

//       const combinedResults = [
//           ...tagResponse.data,
//           ...keywordResponse.data.filter(item => 
//               !combinedResults.some(result => result.id === item.id) // 중복 제거
//           )
//       ];

//       // 여기서 selectedTags를 사용하여 결과를 필터링할 수 있습니다.
//       const filteredResults = combinedResults.filter(item => {
//           // 예시: item.tags가 selectedTags에 포함된 경우
//           return selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
//       });

//       setSearchResults(filteredResults);
//   } catch (error) {
//       console.error("Error fetching search items:", error);
//   }
// }, [selectedTags]); // selectedTags를 의존성 배열에 추가


const fetchItemsRef = useRef(fetchSearchItems); // useRef를 사용하여 함수 참조 저장
useEffect(() => {
    fetchItemsRef.current = fetchSearchItems; // 참조 업데이트
}, [fetchSearchItems]);

useEffect(() => {
  const tags = query.get("tags") ? query.get("tags").split(',') : []; // URL에서 태그를 가져오기
  setSelectedTags(tags); // URL에서 태그를 상태에 설정
}, [query]); // query가 변경될 때만 실행

useEffect(() => {
  if (searchTerm) {
      fetchItemsRef.current(searchTerm, selectedTags); // 참조를 사용하여 호출
  }
}, [searchTerm, selectedTags]); // searchTerm과 selectedTags가 변경될 때 호출

 

 ////임시 데이터( 검색어만)
      // const fetchSearchItems = async (searchTerm) => {
      //   try {
      //     // 데이터 가져오기
      //     const response = await axios.get('/data.json');
          
      //     // 제목에 검색어가 포함된 아이템 필터링
      //     const filteredProjects = response.data.filter(item => 
      //       item.title.toLowerCase().includes(searchTerm.toLowerCase())
      //     );

      //     // 필터링된 아이템 출력
      //     console.log("search items:", filteredProjects);
      
      //     setSearchResults(filteredProjects); // 필터링된 프로젝트 설정
      //   } catch (error) {
      //     console.error("Error fetching search items:", error);
      //   }
      // };
    




      


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

