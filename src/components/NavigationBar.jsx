import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH, faCommentDots, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const tagOptions = [
  "AWS", "Blockchain", "NodeJS", "React", "Java", "Dapp", "Git", "Backend"
  // 필요시 더 추가
];

const NavigationBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  // 검색 입력 핸들러
  const handleChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      handleAddButtonClick();
    }
  };

  // 검색 버튼 클릭
  const handleAddButtonClick = () => {
    const tagsQuery = selectedTags.length > 0 ? `&tags=${selectedTags.join(',')}` : '';
    navigate(`/SearchPage1?q=${searchValue}${tagsQuery}`);
  };

  // 태그 선택
  const handleTagSelect = (tag) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev : [...prev, tag]);
  };

  // 태그 삭제
  const handleTagRemove = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // 태그 전체 초기화
  const handleResetTags = () => {
    setSelectedTags([]);
  };

  return (
    <>
      <IconBar>
        <FontAwesomeIcon icon={faCommentDots} size="2x" color="#e0dfdb" />
        <FontAwesomeIcon icon={faBell} size="2x" color="#e0dfdb" />
        <IconWrap>
          <FontAwesomeIcon icon={faUserCircle} size="2x" color="#e0dfdb" />
          <RedDot />
        </IconWrap>
      </IconBar>
      <Header>
        <Logo>ITEAMOA</Logo>
        <SearchContainer>
          <SearchBar>
            <FontAwesomeIcon icon={faSearch} />
            <SearchInput
              value={searchValue}
              onChange={handleChange}
              onKeyDown={handleChange}
              placeholder="Search projects"
            />
          </SearchBar>
          <FilterButton>
            <FontAwesomeIcon icon={faSlidersH} />
          </FilterButton>
          <SearchButton onClick={handleAddButtonClick}>
            <FontAwesomeIcon icon={faSearch} style={{ color: 'white' }} />
          </SearchButton>
        </SearchContainer>
        <TagsRow>
          {tagOptions.map(tag => (
            <Tag
              key={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <CloseButton onClick={e => { e.stopPropagation(); handleTagRemove(tag); }}>×</CloseButton>
              )}
            </Tag>
          ))}
          {selectedTags.length > 0 && (
            <ResetButton onClick={handleResetTags}>초기화</ResetButton>
          )}
        </TagsRow>
      </Header>
    </>
  );
};

// styled-components 정의는 기존 코드에서 복사

export default NavigationBar;

const Header = styled.header`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-bottom: 32px;
  position: relative;
`;

const Logo = styled.h1`
  font-family: 'Protest Strike', cursive;
  font-size: 56px;
  color: #00AEFF;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  gap: 8px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #F3F0F0;
  border-radius: 8px;
  padding: 9px 16px;
  flex-grow: 1;
`;

// const SearchIcon = styled.img`
//   margin-right: 8px;
// `;

const SearchIcon = styled.span`
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translate(250%, -50%);
  font-size: 20px;
  cursor: pointer;
  color: #0080ff;

  &:hover {
    color: #62B9EC;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-size: 20px;
  color: #858585;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: #858585;
  }
`;

const FilterButton = styled.button`
  background-color: #F3F0F0;
  border: none;
  border-radius: 8px;
  padding: 13px 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const SearchButton = styled.button`
  background-color: #00AEFF;
  border: none;
  border-radius: 8px;
  padding: 13px 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const Tag = styled.div`
  border: 1px solid #CECECE;
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 16px;
  color: #222;
  background: ${({ selected }) => (selected ? '#62B9EC' : '#fff')};
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 8px;
  transition: background 0.15s, color 0.15s, border 0.15s;
  display: inline-flex;
  align-items: center;
  font-weight: 500;

  &:hover {
    background: #f3f0f0;
    border-color: #62B9EC;
    color: #226FFF;
  }
`;

const IconBar = styled.div`
  position: fixed;
  top: 24px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 32px;
  z-index: 100;
`;

const IconWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const RedDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background: #ff2222;
  border-radius: 50%;
  border: 2px solid #fff;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  font-size: 14px;
`;

const ResetButton = styled.button`
  color: grey;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-left: 10px;
`;