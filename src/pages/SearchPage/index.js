import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from "../../components/Nav"; 
import SearchFeed from "./SearchFeed"; 
import styled from 'styled-components';
// import axios from 'axios';
import axios from '../../api/axios';


const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const showSearch = true;

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    let query = useQuery();
    const searchTerm = query.get("q");
    const tags = query.get("tags");

     // 로컬 스토리지에서 feedType을 가져와 초기값으로 설정
  const initialFeedType = localStorage.getItem('feedType') || 'PROJECT'; // 기본값 'PROJECT'
  const [feedType, setFeedType] = useState(initialFeedType); // 초기값 설정
    // const feedType = query.get("feedType") || 'PROJECT';


     useEffect(() => {
    // feedType을 섹션에 전달하는 로직
    console.log("현재 feedType:", feedType);
    // 여기서 feedType을 Section1과 Section2에 전달하는 로직을 추가할 수 있습니다.
  }, [feedType])

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

    return (
        <Container>
            <Nav showSearch={showSearch} />
            {searchResults.length > 0 ? (
                <SearchFeed itemList={searchResults} setSearchResults={setSearchResults} />
            ) : (
                <NoResults>찾고자하는 검색어 "{searchTerm}"에 맞는 아이템이 없습니다.</NoResults>
            )}
        </Container>
    );
};

export default SearchPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 300px;
`;

const NoResults = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #777;
`;

