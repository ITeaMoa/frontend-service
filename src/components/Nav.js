import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faBell as regularBell, faCommentDots as regularComment, faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import Modal from './Modal';
import TagSelector from './TagSelector';
import { useAuth } from '../context/AuthContext'; // AuthContext에서 useAuth 가져오기




const Nav = ({showSearch, onToggleChange}) => {

const option3 = [
  { value: '웹', label: '웹' },
  { value: '모바일', label: '모바일' },
  { value: '정보보안', label: '정보보안' },
  { value: 'AWS', label: 'AWS' },
  { value: 'Git', label: 'Git' },
  { value: 'Github', label: 'Github' },
  { value: '클라우드', label: '클라우드' },
  { value: '블록체인', label: '블록체인' },
  { value: '인공지능', label: '인공지능' },
  { value: '빅데이터', label: '빅데이터' },
  { value: 'Spring Boot', label: 'Spring Boot' },
  { value: 'React', label: 'React' },
  { value: 'Vue', label: 'Vue' },
  { value: 'Python', label: 'Python' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: '게임', label: '게임' },
  { value: 'UI/UX', label: 'UI/UX' },
  { value: '알고리즘', label: '알고리즘' },
  { value: '자료구조', label: '자료구조' },
  { value: 'C/C++', label: 'C/C++' },
  { value: 'C#', label: 'C#' },
  { value: 'SQL', label: 'SQL' },
  { value: 'NoSQL', label: 'NoSQL' },
  { value: 'Django', label: 'Django' },
  { value: 'Figma', label: 'Figma' },
  { value: 'Swift', label: 'Swift' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'React Native', label: 'React Native' },
  { value: 'Android', label: 'Android' },
  { value: 'iOS', label: 'iOS' },
  { value: 'GCP', label: 'GCP' },
  { value: 'Kubernetes', label: 'Kubernetes' },
  { value: 'Docker', label: 'Docker' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'R', label: 'R' },
  { value: 'Go', label: 'Go' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'Express', label: 'Express' },
  { value: 'Firebase', label: 'Firebase' },
  { value: 'Linux/Unix', label: 'Linux/Unix' },
  { value: '데이터마이닝', label: '데이터마이닝' },
  { value: 'Solidity', label: 'Solidity' },
];

  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth(); // logout 함수 가져오기
  const { isLoggedIn: authIsLoggedIn } = useAuth(); // AuthContext에서 isLoggedIn 가져오기

  // const [toggleActive, setToggleActive] = useState(false); // 토글 상태 추가
  //로컬 스토리지에서 초기값 가져오기
  const [toggleActive, setToggleActive] = useState(() => {
    // 로컬 스토리지에서 초기값 가져오기
    const storedToggleState = localStorage.getItem('toggleActive');
    return storedToggleState !== null ? JSON.parse(storedToggleState) : false;
  });

  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태 추가

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태



  useEffect(() => {
    // 로컬 스토리지에서 토글 상태 가져오기
    const storedToggleState = localStorage.getItem('toggleActive');
    if (storedToggleState !== null) {
      setToggleActive(JSON.parse(storedToggleState));
    } else {
      // 로컬 스토리지에 값이 없을 경우 기본값 설정
      localStorage.setItem('toggleActive', JSON.stringify(false));
    }
  }, []);

  useEffect(() => {
    // 토글 상태가 변경될 때마다 로컬 스토리지에 저장
    localStorage.setItem('toggleActive', JSON.stringify(toggleActive));
  }, [toggleActive]);



  const handleToggleChange = () => {
    const newToggleState = !toggleActive;
    setToggleActive(newToggleState);
    
    // 페이지 새로고침
    window.location.reload();

    if (onToggleChange) { // onToggleChange가 함수인지 확인
      onToggleChange(newToggleState ? 'STUDY' : 'PROJECT'); // 상태에 따라 feedType 변경
    } else {
      console.error("onToggleChange is not a function");
    }
  };


  // const toggleFilterVisibility = () => {
  //   setIsModalOpen(true)
  //   };


 //키보드 받기 
  const handleChange = (e) => {
    setSearchValue(e.target.value);
    // 엔터 키를 눌렀을 때 검색 수행
    if (e.key === 'Enter') {
        handleAddButtonClick();
    }
    console.log('e.target.value', e.target.value);
  }

  // const handleAddButtonClick = () => {
  //   navigate(`/SearchPage?q=${searchValue}`); // 검색 입력값을 포함한 URL로 이동
  // };
  const handleAddButtonClick = () => {
    const tagsQuery = selectedTags.length > 0 ? `&tags=${selectedTags.join(',')}` : '';
    const feedType = toggleActive ? 'PROJECT' : 'STUDY'; // 현재의 토글 값에 따라 feedType 설정
    navigate(`/SearchPage?q=${searchValue}${tagsQuery}&feedType=${feedType}`); // 검색어, 선택된 태그, feedType을 URL로 전달
  };


  const handleTagSelect = (option) => {
    setSelectedTags((prevTags) => {
        if (!prevTags.includes(option.label)) {
            return [...prevTags, option.label]; // 선택된 태그 추가
        }
        return prevTags;
    });
};

  const handleTagRemove = (tag) => {
      setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleResetTags = () => {
      setSelectedTags([]);
  };


  const closeModal = () => {
    setIsModalOpen(false);
  };
 

  // 로그아웃 버튼 클릭 핸들러
  const handleLogout = () => {
    logout(navigate); // logout 호출 시 navigate 전달
  };



  return (
    <NavWrapper showSearch={showSearch} >
      <Logo>
      <img
          alt="Logo"
          src="/images/logo1.png"
        onClick={() => (window.location.href = "/")}/>
      </Logo>

      <ToggleContainer>
        <ToggleLabel active={toggleActive}>STUDY</ToggleLabel>
        <ToggleSwitch type="checkbox" checked={!toggleActive} onChange={handleToggleChange} />
        <ToggleLabel active={!toggleActive}>PROJECT</ToggleLabel>
      </ToggleContainer>
      
     
      {showSearch && ( // showSearch가 true일 때만 검색 부분 표시
        <SearchContainer>
          <SearchInput
            value={searchValue}
            onChange={handleChange}
            onKeyDown={handleChange}
            placeholder="Search projects"
          />
          <SearchIcon onClick={handleAddButtonClick}>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIcon>
          <FilterIcon onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faSlidersH} />
          </FilterIcon>

          <Modal isOpen={isModalOpen} onClose={closeModal} modalType="nav">
            <TagSelector
              options={option3}
              placeholder={"태그를 선택하시오"}
              onTagSelect={handleTagSelect}
              selectedTags={selectedTags}
            />
          </Modal>
        </SearchContainer>
      )}


        <UserActions>
        {authIsLoggedIn ? (
          <>
            <UserIcon className="bell">
              <FontAwesomeIcon icon={regularBell} size="15px" />
            </UserIcon>
            <UserIcon className="comment">
              <FontAwesomeIcon icon={regularComment} size="15px" />
            </UserIcon>
            <UserIcon onClick={() => navigate('/MyPage')} className="user">
              <FontAwesomeIcon  icon={regularUser} size="15px" />
            </UserIcon>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </>
        ) : (
          <>
            <SignUp onClick={() => navigate('/SignupPage')}>SignUp</SignUp>
            <Login onClick={() => navigate('/LoginPage')}>Login</Login>
          </>
        )}
      </UserActions>
    

            {/* 태그 컨테이너: 선택된 태그가 있을 때만 표시 */}
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
            )}

      </NavWrapper>

         
   
  );
}

export default Nav;


const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ showSearch }) => (showSearch ? '30%' : '20%')}; 
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
  padding: 10px;
`;


const Logo = styled.div`
 margin-top: -50px;
  img {
    width: 100%; 
    max-width: 300px;
    // height: auto; 
    cursor: pointer;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: -50px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 24px;
`;

const ToggleLabel = styled.label`
  margin: 0 10px;
  font-size: 16px;
  font-weight: bold;
  color: ${props => (props.active ? '#0080ff' : '#aaa')}; // 활성화 여부에 따라 색상 변경
`;

const ToggleSwitch = styled.input`
  appearance: none;
  width: 50px;
  height: 30px;
  background: #0080ff; 
  border-radius: 30px; 
  position: relative;
  cursor: pointer;
  outline: none;

  &:checked {
    background: #62B9EC; 
  }

  &:checked::before {
    transform: translateX(24px); 
  }

  &::before {
    content: '';
    position: absolute;
    width: 26px; 
    height: 26px; 
    top: 7%;
    border-radius: 50%; 
    background: white; 
    transition: transform 0.2s; 
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;  
  align-items: center;
  margin-top: 10px;
  width: 400px; 

`;

const SearchInput = styled.input`
  width: 100%; 
  padding: 15px 40px;
  border: 2px solid #0080ff;
  border-radius: 15px;
  outline: none;
  font-size: 16px;
  background-color: #F3F0F0;

  &::placeholder {
    color: #aaa;
  }
`;

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


const FilterIcon = styled.div`
  position: absolute;
  top: 20%;
  left: 100%;
  border: 1px none #0080ff;
  background-color: #F3F0F0;  
  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 22px;
  color:#ccc;
  cursor: pointer;

  &:hover {
    color: grey;

   
`;


const TagContainer = styled.div`
  position: absolute;
  top: 76%;
  margin-top:10px;
  border: 2px solid #62B9EC;
  border-radius: 30px 5px 30px 30px;
  display: flex;
  flex-wrap: wrap; 
  background-color: white;
  padding: 10px;
`;



const Tag = styled.div`
  margin: 5px;
  padding: 10px 10px;
  border: 1px none #0080ff;
  background-color: ${props => (props.selected ? '#62B9EC' : '#F3F0F0')}; 
  border-radius: 15px;
  color: ${props => (props.selected ? 'white' : '#0080ff')}; 
  font-size: 14px;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    margin-left: 2px;
    margin-top:-3px;
    font-size: 10px;
`;

const ResetButton = styled.button`

    color: grey;
    border: none;
    background-color: transparent;
    cursor: pointer;
`;


// const TagAdd = styled.div`
//   margin: 20px;
//   padding: 10px 15px;
//   border-radius: 15px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   border-color: rgba(160, 218, 251);
//   background-color: white;
//   border: 1px solid #ddd;
//   color: grey;
//   font-size: 14px;
//   cursor: pointer;
//   z-index: 15;

//   @media (max-width: 768px) {
//     font-size: 12px;
//     padding: 4px 8px;
//   }

//   &:hover {
//     color: #62B9EC; // hover 상태에서 텍스트 색상 변경
//     background-color: #F3F0F0; // 필요에 따라 배경색도 변경할 수 있음
//   }
// `;


const UserActions = styled.div`
  position: absolute;
  top: 10%;
  right: 5%;
  display: flex;
  align-items: center;
  color: #0080ff;
`;

const SignUp = styled.div`
  border: 1px solid #3563E9;
  background-color: white;  
  margin: 0 10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  color: #3563E9;
  cursor: pointer;

  &:hover {
    color: #aaa;
  }
`;

const Login = styled.div`
  border: 1px none #0080ff;
  background-color: #3563E9;  
  margin: 0 10px;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  cursor: pointer;

  &:hover {
    color: #0080ff;
  }
`;


const LogoutButton = styled.div`
  border: 1px none;
  background-color: #62b9ec;
  margin: 0 10px;
  padding: 8px 16px;
  border-radius: 15px 15px 1px 15px; //반시계 ㅔ방향
  font-size: 16px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  // &:hover {
  //   color: #0080ff; // 글씨가 파란
  // }

  &:hover {
    background-color: #a0dafb;
  }
`;

const UserIcon = styled.div`
  margin: 0 8px;
  font-size: 25px;
  cursor: pointer;
  color: black;

  &:hover {
    color: #D9D9D9;
  }

`;

