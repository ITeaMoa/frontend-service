import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Dropdown = ({ options, placeholder, showCountButtons, onTagSelect = () => {}, dropdownType, customInputStyle, value}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [peopleCounts, setPeopleCounts] = useState({}); // 각 옵션에 대한 인원수 상태 추가

    const dropdownRef = useRef(null); // 드롭다운 참조 추가

    // 옵션 필터링: 검색어를 포함하는 옵션만 표시
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
        console.log(`Option clicked: ${option.label}`); // 릭된 옵션 로그 추가
        if (!selectedOptions.includes(option.label)) {
            setSelectedOptions(prevSelected => [...prevSelected, option.label]);
            handleCountChange(option, 1); // 옵션 선택 시 카운트 증가
            console.log(`Selected option: ${option.label}`); // 선택된 옵션을 콘솔에 출력
        } else {
            handleCountChange(option, -1); // 옵션 선택 해제 시 카운트 감소
        }
    };

      // value(selectedRoles)가 바뀔 때 peopleCounts도 동기화
    useEffect(() => {
        if (value && Array.isArray(value)) {
        const counts = {};
        value.forEach(roleObj => {
            counts[roleObj.role] = roleObj.count;
        });
        setPeopleCounts(counts);
        }
    }, [value]);

    // 카운트 버튼 클릭 핸들러
   
      // count 변경 핸들러
  const handleCountChange = (option, change) => {
    const currentCount = peopleCounts[option.label] || 0;
    const newCount = currentCount + change;
    if (newCount > 0) {
      onTagSelect(option, newCount);
    } else {
      onTagSelect(option, 0);
    }
    // peopleCounts는 부모에서 value가 바뀌면 useEffect로 동기화됨
  };


    const handlePlaceholderClick = () => {
        setIsOpen(prevState => !prevState);
        setSearchTerm('');
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };
 
  

      useEffect(() => {
        if (value) {
            if (dropdownType === "profile") {
             
            }else{
                setSelectedOptions(Array.isArray(value) ? value : [value]);
            }
          console.log('selectedOptionsdddddddddd', selectedOptions);
        }
      }, [value],);
    
    //   --- placeholder 텍스트 분기 ---
      const getPlaceholderText = () => {
        if (selectedOptions.length === 0) return placeholder;
    
        // if (dropdownType === "roles") {
        //   // 객체 배열: [{role, count}, ...]
        // // 
        // return selectedOptions
        // .map(opt => opt.role || opt.label || opt.value || '')
        // .filter(Boolean)
        // .join(', ');
        if (dropdownType === "roles") {
            // 객체 배열: [{role, count}, ...]
            return selectedOptions
              .map(opt => {
                const name = opt.role || opt.label || opt.value || '';
                // count가 있으면 (count) 표시
                return opt.count !== undefined && opt.count !== null
                  ? `${name} (${opt.count})`
                  : name;
              })
              .filter(Boolean)
              .join(', ');
          
        } else if (dropdownType === "profile") {
          // 문자열 배열: ['5개월', ...]
          if (selectedOptions.length > 8) {
            return `${selectedOptions.slice(0, 8).join(', ')}...`;
          }
          return selectedOptions.join(', ');
        }else if (dropdownType === "tags") {
            return (selectedOptions || []).join(', ');
        }else{
            return selectedOptions[0] && (selectedOptions[0].label || selectedOptions[0].value || selectedOptions[0]);
        }
      };
    

    // 카운트 버튼 렌더링
    const renderCountButtons = (option) => {
        const count = peopleCounts[option.label] || 0; // 현재 카운트 가져오기
        return (
            <CountContainer>
                <Button onClick={() => handleCountChange(option, -1)}>-</Button>
                <Count>{count}</Count>
                <Button onClick={() => handleCountChange(option, 1)}>+</Button>
            </CountContainer>
        );
    };

    return (
        <DropdownWrapper ref={dropdownRef} dropdownType={dropdownType}>
            <DropdownHeader 
                onClick={handlePlaceholderClick} 
                isFocused={isFocused}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                dropdownType={dropdownType}
            >
                <SearchInput
                    type="text"
                    placeholder={getPlaceholderText()} // 플레이스홀더 텍스트 업데이트
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    isSelected={selectedOptions.length > 0}
                    style={customInputStyle}
                />
                <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown} 
                    style={{ color:  '#858585', fontSize:"1.2em" }}
                />
            </DropdownHeader>
            {isOpen && (
                <DropdownList  dropdownType={dropdownType}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <DropdownItem 
                                key={option.value} 
                                isSelected={selectedOptions.includes(option.label)}
                                onClick={() => {
                                    if (!showCountButtons) {
                                        handleOptionClick(option); // 옵션 클릭 시
                                    } else {
                                        if (!selectedOptions.includes(option.label)) {
                                            setSelectedOptions(prevSelected => [...prevSelected, option.label]);
                                        }
                                    }
                                }} 
                            >
                                {option.label}
                                {showCountButtons && renderCountButtons(option)}
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

    ${({ dropdownType }) => dropdownType === 'main' && `
  
    width: 110%;
    left: -30px;
        
    `}
     ${({ dropdownType }) => dropdownType === 'profile' && `
  
    width: 100%;
    left: -30px;  `}

    ${({ dropdownType }) => dropdownType === 'roles' && `
    
        width: 100%;
            // left: -20px;
            left:-20px;
            

            
        `}




    
`;

const DropdownHeader = styled.div`
  border: 1px solid ${({ isFocused, dropdownType }) => 
    dropdownType === 'roles' ? '#858585' : (isFocused ? '#007BFF' : '#A0DAFB')};
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
  border: 1px solid ${({ dropdownType }) => 
    dropdownType === 'roles' ? '#858585' : '#A0DAFB'};
  border-radius: 15px;
  background: white;
  width: 92%;
  max-height: 250px;
  overflow-y: auto;
  z-index: 2000;
  margin-top: 3px;
  margin-left: 20px;
`;

const SearchInput = styled.input`
    padding: 4px;
    border: none;
    width: 100%;
    box-sizing: border-box;
    outline: none;
        // z-index: 1000;
    z-index: 1;

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
    border: 1px solid #858585;
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
    background-color: ${({ isSelected }) => (isSelected ? 'rgba(160, 218, 251, 0.5)' : 'white')};

    &:hover {
        background-color: rgba(160, 218, 251, 0.5);
    }
`;

const NoOptions = styled.div`
    padding: 10px;
    color: #aaa;
`;

export default Dropdown;
