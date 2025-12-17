import React, { useState } from 'react';
import styled from 'styled-components';

const TagSelector = ({ options, onTagSelect, selectedTags  }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleTagClick = (option) => {
        if (selectedTags.includes(option.label)) return; 

        if (selectedTags.length < 8) {
            onTagSelect(option); 
        }
    };


    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DropdownWrapper>
            <DropdownHeader>
                <SearchInput
                    type="text"
                    placeholder={selectedTags.length > 0 ? selectedTags.join(', ') : '태그를 선택하세요'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchTerm(searchTerm)} 
                />
     
            </DropdownHeader>
      
            <TagContainer>
                {filteredOptions.length > 0 ? (
                    filteredOptions.map(option => (
                        <Tag
                            key={option.value}
                            onClick={() => handleTagClick(option)}

                            isSelected={selectedTags.includes(option.label)} 
                            disabled={selectedTags.includes(option.label)} 
                        >
                            
                            {option.label}
                        </Tag>
                    ))
                ) : (
                    <NoOptions>옵션이 없습니다.</NoOptions>
                )}
            </TagContainer>
        </DropdownWrapper>
    );
};

const DropdownWrapper = styled.div`
    position: relative;
    min-width: 620px;
    margin-top: 10px;

`;

const DropdownHeader = styled.div`
    border: 2px solid #A0DAFB;
    border-radius: 15px;
    padding: 8px;   
    background-color: #fff;
    display: flex;
    width: 400px;
    // align-items: center;
    // justify-content: space-between;
    margin-left:80px;
`;

const SearchInput = styled.input`
    padding: 4px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    outline: none;

    &::placeholder {
        color: grey;
    }
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap; 
    min-height: 240px;
    max-height: 240px;
    overflow-y: auto;
    border-radius: 15px;
    background: white;
    z-index: 1000;
    margin-top: 3px;
    padding: 10px; /* 패딩 추가 */
`;

const Tag = styled.div`
    background-color: ${({ isSelected }) => (isSelected ? '#A0DAFB' : 'white')};
    border: 2px solid #A0DAFB;
    border-radius: 15px;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 5px; 
      height: 20px;   

    &:hover {
        background-color: rgba(160, 218, 251, 0.5);
    }
`;

const NoOptions = styled.div`
    padding: 10px;
    color: #aaa;
`;

// const PlusIcon = styled.div`
//     font-size: 20px;
//     font-weight: bold;
//     color: grey;

//     cursor: pointer;
    
// `;

// const HeaderContainer = styled.div`
//     display: flex;
//     align-items: center;

// `;


export default TagSelector;


