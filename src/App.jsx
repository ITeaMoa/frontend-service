import MyPage from "./pages/MyPage/page/MyPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { Outlet, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage/SignupPage';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { ThemeProvider } from 'styled-components';
import theme from './components/Theme';
import MessagePage from './pages/Message/page/MessagePage';
import MainPage from './pages/MainPage/page/MainPage';
import SearchPage1 from './pages/SearchPage/page/SearchPage';
import WritePage from './pages/WritePage/WritePage';
import ApplyPage1 from './pages/ApplyPage/page/ApplyPage';
import ContestPage from './pages/ContestPage/page/ContestPage';
import ContestDetailPage from './pages/ContestDetailPage/page/ContestDetailPage';

  function RequireToken({ children }) {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) {
      return <Navigate to="/LoginPage" replace />;
    }
    return children;
  }


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
              <Route path="SearchPage1" element={<SearchPage1 />} />
              <Route path="MyPage" element={<MyPage/>} />
              <Route path="LoginPage" element={<LoginPage />} />
              <Route path="SignupPage" element={<SignupPage />} />
              <Route path="MessagePage" element={ <RequireToken><MessagePage /></RequireToken>} />
              <Route path="WritePage" element={  <RequireToken><WritePage /></RequireToken>} />
              <Route path="ApplyPage1/:projectId" element={  <ApplyPage1 />} />
              <Route path="ContestPage" element={  <RequireToken><ContestPage/></RequireToken>} />
              <Route path="ContestDetailPage/:contestId" element={ <RequireToken><ContestDetailPage/></RequireToken>} />

            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;