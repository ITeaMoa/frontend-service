import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
});

// JWT 토큰을 Local Storage에 저장
const saveToken = (token) => {
  localStorage.setItem('jwtToken', token);
};

// Local Storage에서 JWT 토큰을 읽기
const getToken = () => {
  return localStorage.getItem('jwtToken');
};

// Local Storage에서 JWT 토큰 제거
const removeToken = () => {
  localStorage.removeItem('jwtToken');
};

// // JWT 토큰 유효성 검사
// const isTokenExpired = (token) => {
//   if (!token) return true;
//   const payload = JSON.parse(atob(token.split('.')[1]));
//   const exp = payload.exp * 1000; // exp는 초 단위로 되어 있으므로 밀리초로 변환
//   return Date.now() >= exp; // 현재 시간과 만료 시간을 비교
// };

// Context 생성
export const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  // 로컬 스토리지에서 사용자 정보와 JWT 토큰 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = getToken(); // JWT 토큰 가져오기
    if (storedUser && token) {
      setUser(JSON.parse(storedUser)); // 사용자 정보 설정
      setIsLoggedIn(true); // 로그인 상태 업데이트
    }
  }, []);

  // 로그인 함수
  const login = async (userId, password) => {
    try {
      const response = await axios.post('http://localhost:8000/signin', {
        email: userId,
        password,
      });

      if (response.status === 200) {
        const userData = response.data.user; // 사용자 정보
        const token = response.data.token; // JWT

        setUser(userData);
        saveToken(token); // 로컬 스토리지에 JWT 저장
        localStorage.setItem('user', JSON.stringify(userData)); // 사용자 정보 저장
        setIsLoggedIn(true); // 로그인 상태 업데이트

        return response;
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error; // 오류를 상위로 전파
    }
  };

//   // 소셜 로그인 함수
//   const socialLogin = async (provider, { code, state }) => {
//     try {
//       const response = await apiClient.post(`/home/login/${provider}`, {
//         code,
//         state,
//       });
//       const userData = response.data.user; // 사용자 정보
//       const token = response.data.token; // JWT

//       setUser(userData);
//       saveToken(token); // 로컬 스토리지에 JWT 저장
//       localStorage.setItem('user', JSON.stringify(userData)); // 사용자 정보 저장
//       setIsLoggedIn(true); // 로그인 상태 업데이트

//       return response.data; // 응답 데이터 반환 (refreshToken 포함)
//     } catch (error) {
//       console.error('소셜 로그인 요청 중 오류 발생:', error);
//       throw error; // 오류를 상위로 전파
//     }
//   };

  const socialLogin = async (provider, { code, state }) => {
    try {
      const response = await apiClient.post(`/home/login/${provider}`, {
        code,
        state,
      });
      return response.data; // 응답 데이터 반환 (refreshToken 포함)
    } catch (error) {
      console.error('소셜 로그인 요청 중 오류 발생:', error);
      throw error; // 오류를 상위로 전파
    }
  };



// // 소셜 로그인 함수
// export const socialLogin = async (provider, accessToken) => {
//     try {
//       const response = await apiClient.post(`/home/login/${provider}`, {
//         accessToken,
//       });
  
//       if (response.status === 200) {
//         saveToken(response.data.token); // JWT 저장
//         return response.data; // JWT 포함된 응답 데이터 반환
//       }
//     } catch (error) {
//       console.error('소셜 로그인 실패:', error);
//       throw error; // 오류를 상위로 전파
//     }
//   };

  // 로그아웃 함수
  const logout = (navigate) => {
    setUser(null);
    removeToken(); // 로컬 스토리지에서 JWT 제거
    localStorage.removeItem('user'); // 사용자 정보 제거
    setIsLoggedIn(false); // 로그인 상태 업데이트
    navigate("/"); // 홈으로 리디렉션
  };

  // Access Token 발급 요청 함수
  const getAccessToken = async (refreshToken) => {
    try {
      const response = await apiClient.post('http://localhost:8000/refresh', {
        email: "pbh7080@gmail.com", // 이메일을 하드코딩하거나 인자로 받을 수 있습니다.
        refresh_token: refreshToken // 전달받은 refreshToken 사용
      });

      return response.data; // API 응답 반환
    } catch (error) {
      console.error('Access Token 발급 요청 중 오류 발생:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, socialLogin, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
//이거 이용하므로 export const으로 함수 export 할 필요 없음

// Context 사용을 위한 커스텀 훅
export const useAuth = () => {
  return useContext(AuthContext);
}; 