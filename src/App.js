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
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;