import MainPage from "./pages/MainPage";
import WritePage from "./pages/WritePage";
import ApplyPage from "./pages/ApplyPage";
import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import { Outlet, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
// import { AuthProvider } from './context/AuthContext'; // 경로를 맞춰주세요


const Layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

function App() {
  return (
    // <AuthProvider>
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="WritePage" element={<WritePage />} />
          <Route path="ApplyPage/:projectId" element={<ApplyPage />} />
          /* :기호 : 뒤에 오는 부분이 동적 매개변수 임을 나타냄 . 즉 고정된 값이 아니라 사용자가 제공하는 값*/
          <Route path="SearchPage" element={<SearchPage />} />
          <Route path="MyPage" element={<MyPage/>} />
          <Route path="LoginPage" element={<LoginPage />} />
          <Route path="SignupPage" element={<SignupPage />} />
        </Route>
      </Routes>
    </div>
  // </AuthProvider>
  );
}

export default App;