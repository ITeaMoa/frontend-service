import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios'
//import axios from 'axios';



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

// JWT 디코드 함수
const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
  return JSON.parse(jsonPayload);
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

// Project Context 추가
export const ProjectContext = createContext();

// AuthProvider를 수정하여 Project 상태도 함께 관리
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [completedProjects, setCompletedProjects] = useState(new Set());

  // 로컬 스토리지에서 사용자 정보와 JWT 토큰 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = getToken(); // JWT 토큰 가져오기
    if (storedUser && token) {
      setUser(JSON.parse(storedUser)); // 사용자 정보 설정
      setIsLoggedIn(true); // 로그인 상태 업데이트
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login/confirm/signin', {
        email,
        password,
      });
  
      console.log('응답 데이터:', response.data); // 응답 데이터 로그
  
      if (response.status === 200) {
        const token = response.data.access_token; // JWT 
        const idToken = response.data.id_token; // id_token 가져오기
  
        console.log('로그인 성공, JWT 토큰:', token); // JWT 로그
  
        saveToken(token); // 로컬 스토리지에 JWT 저장
        setIsLoggedIn(true); // 로그인 상태 업데이트
  
        // ID 토큰 디코드하여 사용자 정보 추출
        const decodedToken = parseJwt(idToken);
        const userId = decodedToken.sub; // 'sub' 필드에서 사용자 ID 추출
        const nickname = decodedToken.nickname; // ID 토큰에서 닉네임 추출
  
        // 사용자 정보를 상태에 저장 (닉네임 포함)
        const userInfo = { 
          id: userId, 
          email,
          nickname // 닉네임 추가
        };
        
        setUser(userInfo);
        console.log('로그인한 사용자 정보:', userInfo);
  
        // 사용자 정보를 로컬 스토리지에 저장
        localStorage.setItem('user', JSON.stringify(userInfo)); // 로컬 스토리지에 저장
  
        return response;
      }
    } catch (error) {
      console.error('로그인 실패:', error.response ? error.response.data : error);
      throw error; // 오류를 상위로 전파
    }
  };

  // // 로그인 함수
  // const login = async (email, password) => {
  //   try {
  //     const response = await axios.post('/confirm/signin', {
  //       email: email,
  //       password,
  //     });

  //     if (response.status === 200) {
  //       const userData = response.data.user; // 사용자 정보// 사용자 정보 (여기에 user.id가 포함되어 있어야 함)
  //       const token = response.data.access_token; // JWT 

  //       setUser(userData);
  //       saveToken(token); // 로컬 스토리지에 JWT 저장
  //       localStorage.setItem('user', JSON.stringify(userData)); // 사용자 정보 저장
  //       setIsLoggedIn(true); // 로그인 상태 업데이트

  //       return response;
  //     }
  //   } catch (error) {
  //     console.error('로그인 실패:', error);
  //     throw error; // 오류를 상위로 전파
  //   }
  // };

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
      const response = await axios.post(`/home/login/${provider}`, {
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
  const getAccessToken = async (email, refreshToken) => {
    try {
      const response = await axios.post('login/verify/refresh', {
        // const response = await axios.post('http://localhost:8000/refresh', {
        email, // 이메일을 하드코딩하거나 인자로 받을 수 있습니다.
        refresh_token: refreshToken // 전달받은 refreshToken 사용
      });

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
//이거 이용하므로 export const으로 함수 export 할 필요 없음



// Project Context 사용을 위한 커스텀 훅
export const useProject = () => {
  return useContext(ProjectContext);
};

// 기존 Auth Context 사용을 위한 커스텀 훅
export const useAuth = () => {
  return useContext(AuthContext);
}; 