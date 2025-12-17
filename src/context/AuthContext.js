import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, socialLogin, refreshAccessToken } from '../api';


// JWT 토큰을 Local Storage에 저장
const saveToken = (token) => {
  sessionStorage.setItem('jwtToken', token);
};

const getToken = () => {
  return sessionStorage.getItem('jwtToken');
};


const removeToken = () => {
  sessionStorage.removeItem('jwtToken');
};


// JWT 디코드 함수
const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
  return JSON.parse(jsonPayload);
};


// Context 생성
export const AuthContext = createContext();

// Project Context 추가
export const ProjectContext = createContext();

// AuthProvider를 수정하여 Project 상태도 함께 관리
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [completedProjects, setCompletedProjects] = useState(new Set());

  //로컬 스토리지에서 사용자 정보와 JWT 토큰 가져오기
  useEffect(() => {
    const loadUserData = () => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsLoggedIn(true);
        }
    };


    loadUserData();
  }, []); // 빈 배열을 사용하여 컴포넌트가 마운트될 때만 실행


  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
  
      if (response.status === 200) {
        const token = response.data.access_token;
        const idToken = response.data.id_token;
  
        saveToken(token); 
        setIsLoggedIn(true);
  
        // ID 토큰 디코드하여 사용자 정보 추출
        const decodedToken = parseJwt(idToken);
        const userId = decodedToken.sub; 
        const nickname = decodedToken.nickname; 
  
        // 사용자 정보를 상태에 저장 (닉네임 포함)
        const userInfo = { 
          id: userId, 
          email,
          nickname 
        };
        
        setUser(userInfo);
  
        // 사용자 정보를 로컬 스토리지에 저장
        sessionStorage.setItem('user', JSON.stringify(userInfo)); 
  
        return response;
      }
    } catch (error) {
      console.error('로그인 실패:', error.response ? error.response.data : error);
      throw error;
    }
  };


  const socialLogin = async (provider, code, state) => {
    try {
      const response = await socialLogin(provider, code, state);
      return response; // 응답 데이터 반환 (refreshToken 포함)
    } catch (error) {
      console.error('소셜 로그인 요청 중 오류 발생:', error);
      throw error; // 오류를 상위로 전파
    }
  };



  const logout = (navigate) => {
    if (user) {
      sessionStorage.removeItem(`profileModalDismissed_${user.id}`);
    }
    
    setUser(null);
    removeToken(); // 로컬 스토리지에서 JWT 제거
    sessionStorage.removeItem('user'); // 사용자 정보 제거
    setIsLoggedIn(false); // 로그인 상태 업데이트
    navigate("/"); // 홈으로 리디렉션

  };

  // Access Token 발급 요청 함수
  const getAccessToken = async (email, refreshToken) => {
    try {
      const response = await refreshAccessToken(email, refreshToken);

      if (response.status === 200) {
        return response.data; // API 응답 반환
      }
    } catch (error) {
      console.error('Access Token 발급 요청 중 오류 발생:', error);
      return null; // 오류 발생 시 null 반환
    }
  };

  // Project 관련 함수 추가
  const markProjectAsCompleted = (projectId) => {
    setCompletedProjects(prev => new Set([...prev, projectId]));
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, socialLogin, getAccessToken }}>
      <ProjectContext.Provider value={{ completedProjects, markProjectAsCompleted }}>
        {children}
      </ProjectContext.Provider>
    </AuthContext.Provider>
  );
};


// Project Context 사용을 위한 커스텀 훅
export const useProject = () => {
  return useContext(ProjectContext);
};

// 기존 Auth Context 사용을 위한 커스텀 훅
export const useAuth = () => {
  return useContext(AuthContext);
}; 