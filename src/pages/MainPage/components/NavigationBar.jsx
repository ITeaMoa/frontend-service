import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = ({ handleSearch, handleAddButtonClick }) => (
  <Header>
    <Logo>ITEAMOA</Logo>
    <SearchContainer>
      <SearchBar>
        <FontAwesomeIcon icon={faSearch} />
        <SearchInput 
          placeholder="Search projects" 
          onKeyPress={handleSearch}
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
      <Tag>AWS</Tag>
      <Tag>Blockchain</Tag>
      <Tag>NodeJS</Tag>
      <Tag>React</Tag>
      <Tag>Java</Tag>
      <Tag>Dapp</Tag>
      <Tag>DID</Tag>
      <Tag>Backend</Tag>
    </TagsRow>
  </Header>
);

// styled-components 정의는 기존 코드에서 복사

export default NavigationBar;



const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  margin-bottom: 32px;
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
`;

const Tag = styled.div`
  border: 1px solid #CECECE;
  border-radius: 4100px;
  padding: 12px 18px;
  font-size: 18px;
  color: #1A1A1A;
  cursor: pointer;
  
  &:hover {
    background-color: #F3F0F0;
  }
`;