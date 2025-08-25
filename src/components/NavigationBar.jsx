import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH, faCommentDots, faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import messageImg from '../assets/Image/message.png';
import bellImg from '../assets/Image/Bell.png';

const tagOptions = [
  "AWS", "Blockchain", "NodeJS", "React", "Java", "Dapp", "Git", "Backend"
  // 필요시 더 추가
];

const NavigationBar = ({showSearch}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn ,authIsLoggedIn} = useAuth();
  const { logout } = useAuth(); // logout 함수 가져오기
  const [showAlert, setShowAlert] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [alarms, setAlarms] = useState([]);

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
  const handleLogout = () => {
    logout(navigate); // logout 호출 시 navigate 전달
  };

  // useEffect(() => {
  //   if (showAlert && authIsLoggedIn) {
  //     fetchAlarms();
  //   }
  // }, [showAlert, authIsLoggedIn]);

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
      <NavigationBarWrapper>
        <IconBar>
          {isLoggedIn ? (
            <>
              {/* <FontAwesomeIcon icon={faCommentDots} onClick={() => navigate('/MessagePage')} size="xl" color="#e0dfdb" />
              <FontAwesomeIcon icon={faBell} size="xl" color="#e0dfdb" onClick={handleAlertToggle} /> */}
              <img
                src={messageImg}
                alt="Message"
                onClick={() => navigate('/MessagePage')}
                style={{ width: 30  , height: 30, cursor: 'pointer' }}
              />
              <img
                src={bellImg}
                alt="Bell"
                onClick={handleAlertToggle}
                style={{ width: 30, height: 30, cursor: 'pointer', }}
              />
              <IconWrap>
                <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faUserCircle} onClick={() => navigate('/MyPage')} size="xl" color="#e0dfdb" />
                {/* <RedDot /> */}
              </IconWrap>

              <LogoutButton onClick={() => { handleLogout(); window.location.reload(); }}>Logout</LogoutButton>
            </>
          ) : (
            <>
              <AuthButton onClick={() => navigate('/SignupPage')}>SignUp</AuthButton>
              <AuthButton onClick={() => navigate('/LoginPage')}>Login</AuthButton>
            </>
          )}
        </IconBar>
        <NavContent>
          <Logo>
            <img
              alt="Logo"
              src="/images/logo1.png"
              onClick={() => (window.location.href = "/")}
            />
          </Logo>
          {showSearch && (
          <SearchContainer>
            <SearchBar>
              <FontAwesomeIcon icon={faSearch} style={{marginRight: '10px'}}/>
              <SearchInput
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleChange}
                placeholder="Search projects"
              />
            </SearchBar>
            {/* <FilterButton>
              <FontAwesomeIcon icon={faSlidersH} style={{ color: '#C3C3C3' }} />
            </FilterButton> */}
            <SearchButton onClick={handleAddButtonClick}>
              <FontAwesomeIcon icon={faSearch} style={{ color: 'white' }} />
            </SearchButton>
          </SearchContainer>
          )}
          {showSearch && (
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
            <FilterButton>
              <FontAwesomeIcon icon={faSlidersH} style={{ color: '#C3C3C3' }} />
            </FilterButton>
          </TagsRow>
          )}
          
        </NavContent>
      </NavigationBarWrapper>
      <NavBarPlaceholder showSearch={showSearch} />

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
};

// styled-components 정의는 기존 코드에서 복사

export default NavigationBar;

const NavigationBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 200;
  background: #fff;
  // box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0;
`;

const NavContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 80px;
`;

  const NavBarPlaceholder = styled.div`
    height: ${({ showSearch }) => showSearch ? '260px' : '150px'}; /* Adjust this value to match the NavigationBar's total height */
  `;

const IconBar = styled.div`
  position: absolute;
  top: 24px;
  right:100px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 201;
`;

const Header = styled.header`
  display: none;
`;

// const Logo = styled.h1`
//   font-family: 'Protest Strike', cursive;
//   font-size: 56px;
//   color: #00AEFF;
//   margin: 0 0 12px 0;
//   text-align: center;
//   img {
//     width: 180px;
//     height: auto;
//     margin-bottom: 8px;
//     cursor: pointer;
//     display: block;
//     margin-left: auto;
//     margin-right: auto;
//   }
// `;


const Logo = styled.div`
  img {
    width: 100%; 
    max-width: 250px;
    cursor: pointer;
  }
    margin-top: ${({ simple }) => (simple ? '50px' : '-30px')}; 

   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
  //  margin-top: 10px;
  }
     z-index: 10; 

`;
const SearchContainer = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  max-width: 1030px;
  margin: 0 auto 8px auto;
  gap: 8px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #F3F0F0;
  border-radius: 8px;
  padding: 0 16px;
  flex-grow: 1;
  height: 60px;
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
  font-size: 15px;
  color: #858585;
  width: 100%;
  outline: none;
  padding: 8px 0; /* 위아래 패딩을 늘려서 높이 증가 */
  height: 460px; /* 원하는 높이로 설정 */
  
  &::placeholder {
    color: #858585;
    font-size: 15px;
  }
`;

const FilterButton = styled.button`
  background-color: #F3F0F0;
  border: none;
  border-radius: 8px;
  height: 20px;
  width:20px;
  min-width: 30px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  // margin-left: 8px;
  margin-bottom:8px;
`;

const SearchButton = styled.button`
  background-color: #00AEFF;
  border: none;
  border-radius: 8px;
  height: 44px;
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  // margin-left: 8px;
  margin-bottom: 10px;
`;

const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
  width: 100%;
  max-width: 1030px;
  margin-left: auto;
  margin-right: auto;
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

const IconWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const RedDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
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

const AuthButton = styled.button`
  background: #fff;
  color: #00AEFF;
  border: 1px solid #00AEFF;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 15px;
  font-weight: 500;
  margin-left: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #00AEFF;
    color: #fff;
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

const LogoutButton = styled.div`
 

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
