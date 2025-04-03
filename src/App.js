import MainPage from "./pages/MainPage";
import WritePage from "./pages/WritePage";
import ApplyPage from "./pages/ApplyPage";
import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import { Outlet, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext'; // 경로를 맞춰주세요
import { ThemeProvider } from 'styled-components';
import theme from './components/Theme';
import MessagePage from './pages/Messeage/MessagePage';

// import { useAtom } from 'jotai';
// const [, setIsLoggedIn] = useAtom(IS_LOGGED_IN); // 로그인 상태를 위한 아톰
// const [user, setUser] = useAtom(USER); // 사용자 정보를 위한 아톰
  
//   //로컬 스토리지에서 사용자 정보와 JWT 토큰 가져오기
//   useEffect(() => {
//     const loadUserData = () => {
//         const userData = sessionStorage.getItem('user');
//         if (userData) {
//             const parsedUser = JSON.parse(userData);
//             setUser(parsedUser);
//             setIsLoggedIn(true);
//         }
//     };


//     loadUserData();
//   }, []); // 빈 배열을 사용하여 컴포넌트가 마운트될 때만 실행

//구조 :   const userInfo = { 
//           id: userId, 
//           email,
//           nickname // 닉네임 추가
//         };
        
//         그대로 저장해서됨


const Layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainPage />} />
              <Route path="WritePage" element={<WritePage />} />
              <Route path="ApplyPage/:projectId" element={<ApplyPage />} />
              <Route path="SearchPage" element={<SearchPage />} />
              <Route path="MyPage" element={<MyPage/>} />
              <Route path="LoginPage" element={<LoginPage />} />
              <Route path="SignupPage" element={<SignupPage />} />
              <Route path="MessagePage" element={<MessagePage />} />

            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;