import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';


const Dropdown = ({ options, placeholder, showCountButtons, onTagSelect = () => {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [isFocused, setIsFocused] = useState(false);
    const [peopleCounts, setPeopleCounts] = useState({}); // 각 옵션에 대한 인원수 상태 추가

    const dropdownRef = useRef(null); // 드롭다운 참조 추가
    //useRef: 리액트 컴포넌트에서 직접 DOM 조작

    //옵션 필터링 : 검색어를 표함하는 옵션만 표시
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // 드롭다운 닫기
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (option) => {
        if (!selectedOptions.includes(option.label)) {
            if (selectedOptions.length < 8) {
                setSelectedOptions([...selectedOptions, option.label]);
                onTagSelect(option); // 선택된 태그 전달
            }
        } else {
            // 이미 선택된 경우에는 선택 해제하지 않음
        }
    };

    const handlePlaceholderClick = () => {
        // setIsOpen(isOpen);
        setIsOpen(prevState => !prevState);
        setSearchTerm('');

    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const incrementCount = (option) => {
        setPeopleCounts(prevCounts => ({
            ...prevCounts,
            [option.label]: (prevCounts[option.label] || 0) + 1
        }));
    };

    const decrementCount = (option) => {
        setPeopleCounts(prevCounts => {
            const newCount = (prevCounts[option.label] || 0) - 1;
            if (newCount > 0) {
                return {
                    ...prevCounts,
                    [option.label]: newCount
                };
            } else {
                // 카운트가 0이 되면 선택 해제
                setSelectedOptions(selectedOptions.filter(selected => selected !== option.label));
                return {
                    ...prevCounts,
                    [option.label]: 0 // 0일 때는 카운트를 0으로 유지
                };
            }
        });
    };

    const getPlaceholderText = () => {
        if (selectedOptions.length === 0) return placeholder;
        if (selectedOptions.length > 8) {
            return `${selectedOptions.slice(0, 8).join(', ')}...`;
        }
        return selectedOptions.join(', ');
    };

  

    return (
        <DropdownWrapper ref={dropdownRef}> {/* 드롭다운 참조 추가 */}
            <DropdownHeader 
                onClick={handlePlaceholderClick} 
                isFocused={isFocused}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <SearchInput
                    type="text"
                    placeholder={getPlaceholderText()} // 플레이스홀더 텍스트 업데이트
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    isSelected={selectedOptions.length > 0}
                />
                <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown} 
                    style={{ color:  '#A0DAFB', fontSize:"1.2em"  }} // 열릴 때와 닫힐 때 색상 다르게 설정
                    // onClick={handlePlaceholderClick} // 화살표 클릭 시 드롭다운 토글
                 

                    />
            </DropdownHeader>
            {isOpen && (
                <DropdownList>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <DropdownItem 
                                key={option.value} 
                                onClick={() => handleOptionClick(option)} 
                                isSelected={selectedOptions.includes(option.label)}
                            >
                                {option.label}
                                {showCountButtons && (
                                    <CountContainer>
                                        <Button onClick={() => decrementCount(option)}>-</Button>
                                        <Count>{peopleCounts[option.label] || 0}</Count>
                                        <Button onClick={() => incrementCount(option)}>+</Button>
                                    </CountContainer>
                                )}
                            </DropdownItem>
                        ))
                    ) : (
                        <NoOptions>옵션이 없습니다.</NoOptions>
                    )}
                </DropdownList>
            )}
        </DropdownWrapper>
    );
};


const DropdownWrapper = styled.div`
    position: relative;
    width: 300px;
`;

const DropdownHeader = styled.div`
    border: 2px solid ${({ isFocused }) => (isFocused ? '#007BFF' : '#A0DAFB')};
    border-radius: 15px;
    padding: 8px;   
    cursor: pointer;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;
    font-size: 14px;
    color: black;
`;

const DropdownList = styled.div`
    position: absolute;
    border: 2px solid #A0DAFB;
    border-radius: 15px;
    background: white;
    width: 92%;
    max-height: 250px;
    overflow-y: auto;
    z-index: 1000;
    margin-top: 3px;
    margin-left: 20px;


`;

const SearchInput = styled.input`
    padding: 4px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    outline: none;

    &::placeholder {
        color: ${({ isSelected }) => (isSelected ? 'black' : 'grey')};
    }
`;

const CountContainer = styled.div`
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const Button = styled.button`
    border: 1px solid #A0DAFB;
    background: white;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 8px;
`;

const Count = styled.span`
    margin: 0 10px;
`;

const DropdownItem = styled.div`
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        background-color: rgba(160, 218, 251, 0.5);
    }
`;

const NoOptions = styled.div`
    padding: 10px;
    color: #aaa;
`;

export default Dropdown;
