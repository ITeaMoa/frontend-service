import React, { useEffect, useState } from 'react';
import styled, { css }  from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faBell as regularBell, faCommentDots as regularComment, faUser as regularUser } from '@fortawesome/free-regular-svg-icons'; 
import Modal from './Modal';
import TagSelector from './TagSelector';
import { useAuth } from '../context/AuthContext'; // AuthContext에서 useAuth 가져오기
import { useAtom } from 'jotai';
import { feedTypeAtom, toggleActiveAtom } from '../Atoms.jsx/AtomStates';




const Nav = ({showSearch, onToggleChange, showToggle=true, simple=false}) => {

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
  const location = useLocation(); // 현재 경로 확인을 위해 추가
  const { logout } = useAuth(); // logout 함수 가져오기
  // const { isLoggedIn: authIsLoggedIn } = useAuth(); // AuthContext에서 isLoggedIn 가져오기 //나중에 넣기
  const [authIsLoggedIn, setAuthIsLoggedIn] = useState(true); //나중에 삭제
  const [feedType, setFeedType] = useAtom(feedTypeAtom);
  const [toggleActive, setToggleActive] = useAtom(toggleActiveAtom);

  // const [toggleActive, setToggleActive] = useState(false);
  //로컬 스토리지에서 초기값 가져오기
  //원래 토글
  // const [toggleActive, setToggleActive] = useState(() => {
  //   // 로컬 스토리지에서 초기값 가져오기
  //   const storedToggleState = localStorage.getItem('toggleActive');
  //   return storedToggleState !== null ? JSON.parse(storedToggleState) : false;
  // });

  const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const [showAlert, setShowAlert] = useState(false); // 알림 토글 상태
  const [isClosing, setIsClosing] = useState(false); // 알림 닫기 애니메이션 상태
  const [alarms, setAlarms] = useState([]);
  const [showRedDot, setShowRedDot] = useState(false); // 빨간점 토글 상태


//원래 토글
  // useEffect(() => {
  //   // 로컬 스토리지에서 토글 상태 가져오기
  //   const storedToggleState = localStorage.getItem('toggleActive');
  //   if (storedToggleState !== null) {
  //     setToggleActive(JSON.parse(storedToggleState));
  //   } else {
  //     // 로컬 스토리지에 값이 없을 경우 기본값 설정
  //     localStorage.setItem('toggleActive', JSON.stringify(false));
  //   }
  // }, []);

  // useEffect(() => {
  //   // 토글 상태가 변경될 때마다 로컬 스토리지에 저장
  //   localStorage.setItem('toggleActive', JSON.stringify(toggleActive));
  // }, [toggleActive]);


//원래 토글
  // const handleToggleChange = () => {
  //   const newToggleState = !toggleActive;
  //   setToggleActive(newToggleState);
    
  //   // 페이지 새로고침
  //   window.location.reload();

  //   if (onToggleChange) { // onToggleChange가 함수인지 확인
  //     onToggleChange(newToggleState ? 'STUDY' : 'PROJECT'); // 상태에 따라 feedType 변경
  //   } else {
  //     console.error("onToggleChange is not a function");
  //   }
  // };


// 상태 변경 추적을 위한 useEffect 추가
useEffect(() => {
  console.log('toggleActive 상태 변경됨:', toggleActive);
  console.log('현재 feedType:', feedType);
}, [toggleActive, feedType]);

const handleToggleChange = () => {
  const newToggleState = !toggleActive;
  setToggleActive(newToggleState);
  setFeedType(newToggleState ? 'STUDY' : 'PROJECT');

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
    // const feedType = toggleActive ? 'PROJECT' : 'STUDY'; // 현재의 토글 값에 따라 feedType 설정
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

  // import { useAtom } from 'jotai';
  // const [, setIsLoggedIn] = useAtom(IS_LOGGED_IN); // 로그인 상태를 위한 아톰
  // const [user, setUser] = useAtom(USER); // 사용자 정보를 위한 아톰
  //   // 로그아웃 버튼 클릭 핸들러
  //   const handleLogout = () => {
      
  //       setUser({
  //   id: '',
  //   email: '',
  //   nickname: ''
  // });
  //     // removeToken(); // 로컬 스토리지에서 JWT 제거
  //     sessionStorage.clear(); // 세션 스토리지 모두 삭제
  //     localStorage.clear(); // 로컬 스토리지 모두 삭제
  //     sessionStorage.removeItem('user'); // 사용자 정보 제거
  //     setIsLoggedIn(false); // 로그인 상태 업데이트
  //     navigate("/"); // 홈으로 리디렉션
  //   };



  // 알림 데이터를 가져오는 함수 (예시)
  const fetchAlarms = async () => {
    try {
      // API 호출 또는 데이터 가져오기 로직
      // const response = await axios.get('/api/alarms');
      // setAlarms(response.data);
      
      // 테스트용 더미 데이터
      const dummyAlarms = [
        {
          id: 1,
          title: "새로운 메시지가 도착했습니다.",
          createTime: new Date(),
          linkText: "확인하기"
        },
        {
          id: 2,
          title: "프로젝트가 업데이트되었습니다.",
          createTime: new Date(),
          linkText: "보러가기"
        }
      ];
      setAlarms(dummyAlarms);
    } catch (error) {
      console.error('알림 데이터 가져오기 실패:', error);
    }
  };

  // 알림창이 열릴 때 데이터 가져오기
  useEffect(() => {
    if (showAlert && authIsLoggedIn) {
      fetchAlarms();
    }
  }, [showAlert, authIsLoggedIn]);

  const handleAlertToggle = () => {
    if (showAlert) {
      setIsClosing(true);
      setTimeout(() => {
        setShowAlert(false);
        setIsClosing(false);
      }, 300); // 애니메이션 시간
    } else {
      setShowAlert(true);
    }
  };


  return (
    <>
    <NavWrapper showSearch={showSearch} simple={simple}>
      <Logo simple={simple}>
      <img
          alt="Logo"
          src="/images/logo1.png"
        onClick={() => (window.location.href = "/")}/>
      </Logo>

      {showToggle && (
      <ToggleContainer >
        <ToggleLabel active={toggleActive}>STUDY</ToggleLabel>
        <ToggleSwitch type="checkbox" checked={!toggleActive} onChange={handleToggleChange} />
        <ToggleLabel active={!toggleActive}>PROJECT</ToggleLabel>
      </ToggleContainer>
      )}
      
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
            <FontAwesomeIcon icon={regularBell} size="15px"   Alarm={showRedDot}  onClick={handleAlertToggle}/>
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.50204 1.16807C6.93521 0.244191 8.52375 -0.0297142 9.62368 0.00249359C10.7236 -0.0297142 12.3122 0.244191 13.7453 1.16807C15.2697 2.15075 16.5861 3.85025 16.9534 6.59214L16.9588 6.63281V6.67387V13.8406L18.4944 16.4351L18.5031 16.4499C18.7382 16.8472 18.4519 17.3494 17.9903 17.3494H13.1028C12.8148 18.8744 11.4531 20 9.85936 20C8.26562 20 6.90393 18.8744 6.61592 17.3494H1.2571C0.795483 17.3494 0.509134 16.8472 0.744245 16.4499L0.753011 16.4351L2.28853 13.8406V6.67387V6.63281L2.29397 6.59214C2.66122 3.85025 3.97766 2.15075 5.50204 1.16807ZM7.83231 17.3494C8.09623 18.1746 8.8883 18.7952 9.85936 18.7952C10.8304 18.7952 11.6225 18.1746 11.8864 17.3494H9.74152H9.50584H7.83231ZM7.14906 16.1446H2.65306C2.49814 16.1446 2.40204 15.976 2.48094 15.8427L3.38182 14.3205L3.46692 14.1767V14.0087V6.71558C3.79312 4.35733 4.90203 2.97917 6.13053 2.18723C7.25845 1.46012 8.51358 1.21208 9.40983 1.20493C9.45155 1.21193 9.49466 1.21442 9.53863 1.21192C9.56649 1.21033 9.59485 1.20899 9.62368 1.20793C9.65251 1.20899 9.68087 1.21033 9.70873 1.21192C9.7527 1.21442 9.79581 1.21193 9.83754 1.20493C10.7338 1.21208 11.9889 1.46012 13.1168 2.18723C14.3453 2.97917 15.4542 4.35733 15.7804 6.71558V14.0087V14.1767L15.8655 14.3205L16.7664 15.8427C16.8453 15.976 16.7492 16.1446 16.5943 16.1446H12.5697H9.74152H9.50584H7.14906Z" fill="#323232"/>
              </svg> */}
            </UserIcon>
            <UserIcon 
              className="comment" 
              onClick={() => navigate('/MessagePage')}
              isActive={location.pathname === '/MessagePage'}
            >
              <FontAwesomeIcon icon={regularComment} size="15px" />
            </UserIcon>
            <UserIcon 
              onClick={() => navigate('/MyPage')} 
              className="user"
              isActive={location.pathname === '/MyPage'}
            >
              <FontAwesomeIcon icon={regularUser} size="15px" />
            </UserIcon>
            <LogoutButton onClick={() => { handleLogout(); window.location.reload(); }}>Logout</LogoutButton>
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

      {showAlert && (
        <AlertToggle className={isClosing ? "closing" : ""}>
          <AlertHeader>알림</AlertHeader>
          <AlertContent>
            {!authIsLoggedIn ? (
              <MessageBox NoAlarm>
                <h2 color="gray500">알림은 로그인 후, 확인 가능합니다.</h2>
              </MessageBox>
            ) : alarms.length === 0 ? (
              <MessageBox NoAlarm>
                <>
                  {/* <img src={images.NoAlarm} alt="" /> */}
                  <p>알림이 없습니다.</p>
                </>
              </MessageBox>
            ) : (
              <React.Fragment>
                {alarms.map((item, index) => (
                  <MessageBox key={index}>
                    {/* <img src={images.CheckMark} alt="" /> */}
                    <Message>
                      <MessageContent>
                        <p>{item.title}</p>
                        <span>
                          {new Date(item.createTime).toLocaleString()}
                        </span>
                      </MessageContent>
                      {/* {item.linkText && (
                        <ButtonWrap>
                          <Button onClick={() => handleLinkNavigation(item)}>
                            {item.linkText}
                          </Button>
                        </ButtonWrap>
                      )} */}
                    </Message>
                  </MessageBox>
                ))}
              </React.Fragment>
            )}
          </AlertContent>
        </AlertToggle>
      )}

         </>
   
  );
}

export default Nav;


const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ showSearch }) => (showSearch ? '30%' : '20%')}; 
  height: ${({ simple }) => (simple ? '10%' : '')}; 
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
  padding: 10px;


   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
   height: 20%;
  }
`;


const Logo = styled.div`
//  margin-top: -50px;
  img {
    width: 100%; 
    max-width: 300px;
    // height: auto; 
    cursor: pointer;
  }
    margin-top: ${({ simple }) => (simple ? '50px' : '-50px')}; 

   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
   margin-top: 20px;
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
  // border: 1px none;
  // background-color: #62b9ec;
  // margin: 0 10px;
  // padding: 8px 16px;
  // border-radius: 15px 15px 1px 15px; //반시계 ㅔ방향
  // font-size: 16px;
  // color: white;
  // font-weight: bold;
  // cursor: pointer;

  // // &:hover {
  // //   color: #0080ff; // 글씨가 파란
  // // }

  // &:hover {
  //   background-color: #a0dafb;
  // }

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

const UserIcon = styled.div`
  margin: 0 4px;
  font-size: 25px;
  cursor: pointer;
  color: ${props => props.isActive ? '#226FFF' : 'black'};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${props => props.isActive ? '#e5efff' : 'transparent'};

  &:hover {
    background-color: #f0f8ff;
    color: #226FFF;
  }

  .bell {
   position: relative;
  cursor: pointer;

  ${(props) =>
    props.Alarm &&
    css`
      &::after {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 6px;
        height: 6px;
        background: #FF0000;
        border-radius: 100px;
        content: "";
        animation: blink 1.5s infinite;
      }

      @keyframes blink {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `}
}

 
`;


// 스타일 컴포넌트 추가
const AlertToggle = styled.div`
  // position: absolute;
  position: fixed;
  top: 50px;
  right:300px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: opacity 0.3s ease;

  &.closing {
    opacity: 0;
  }
  
   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
   left: 180px;
   top: 80px;
  }
`;

const AlertHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
  font-size: 15px;
`;

const AlertContent = styled.div`
  max-height: 400px;
  overflow-y: auto;
  // max-height: 460px;
`;

const MessageBox = styled.div`
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  ${props => props.NoAlarm && `
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100px;
  `}

  h2 {
    font-size: 12px;
    color: #666;
  }
`;

const Message = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const MessageContent = styled.div`
  p {
    margin: 0 0 5px 0;
  }
  span {
    font-size: 12px;
    color: #666;
  }
`;

const ButtonWrap = styled.div`
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`;