import axios from "axios";

// Import contest data
import { CONTESTS } from '../data/contestPageData';
import { CONTESTS_DETAIL, RELATED_PROJECTS } from '../data/contestDetailPageData';

// ---------------------------------------------
// 1. 공통 유틸리티 함수 
// ---------------------------------------------

// API 에러 로깅 유틸리티
const handleApiError = (error, actionName) => {
  console.error(`${actionName} 중 에러 발생:`, error);
  if (error.code === 'ERR_NETWORK') {
    console.warn('네트워크 연결을 확인해주세요.');
  }
};

// ---------------------------------------------
// 2. Axios 인스턴스 및 Interceptor 설정
// ---------------------------------------------

const BASE_URL = 'https://api-iteamoa.brynnpark.xyz';

const apiClient = axios.create({
  baseURL: 'https://api-iteamoa.brynnpark.xyz',
  headers: { 'Content-Type': 'application/json' }
});

// [Request Interceptor] 요청 헤더에 Access Token 자동 포함
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// [Response Interceptor] 401 에러(토큰 만료) 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러가 발생했고, 재시도 플래그가 없을 때 (무한 루프 방지)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const email = localStorage.getItem('email');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken || !email) {
          // 리프레시 토큰이 없으면 로그아웃 처리
          throw new Error('리프레시 토큰이 없습니다.');
        }

      const response = await axios.post(`${BASE_URL}/login/verify/refresh`, {
          email,
          refresh_token: refreshToken
        });
        const newAccessToken = response.data.access_token || response.data.accessToken;

        if (newAccessToken) {
    
          localStorage.setItem('accessToken', newAccessToken);

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
  
        localStorage.clear();
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ---------------------------------------------
// 3. User API (사용자 프로필)
// ---------------------------------------------

// 사용자 프로필 조회
export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/my/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('사용자 프로필 조회 실패:', error);
    throw error;
  }
};

// 사용자 프로필 수정
export const updateUserProfile = async (userId, data) => {
  try {
    const response = await apiClient.put(`my/profile/${userId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('프로필 업데이트 실패:', error.response?.data || error.message);
    throw error;
  }
};

// 사용자 계정 삭제
export const deleteUserAccount = async (userId) => {
  try {
    const response = await apiClient.put(`/my/profile/withdraw/${userId}`);
    return response.data;
  } catch (error) {
    console.error('계정 삭제 실패:', error.response?.data || error.message);
    throw error;
  }
};

// ---------------------------------------------
// 4. Project API (메인 피드 및 프로젝트)
// ---------------------------------------------

// 인기 프로젝트 목록 조회
export const getPopularProjects = async (feedType) => {
  try {
    const response = await apiClient.get(`/main/liked?feedType=${feedType}`);
    if (!response.data || response.data.length === 0) return [];
    return response.data;
  } catch (error) {
    handleApiError(error, '인기 프로젝트 조회');
    throw error;
  }
};

// 전체 프로젝트 목록 조회
export const getAllProjects = async (feedType) => {
  try {
    const response = await apiClient.get(`/main?feedType=${feedType}`);
    if (!response.data || response.data.length === 0) return [];
    return response.data;
  } catch (error) {
    handleApiError(error, '전체 프로젝트 조회');
    throw error;
  }
};

// 사용자의 지원 내역 확인
export const getUserApplications = async (userId) => {
  try {
    const response = await apiClient.get('/feed/applications', { params: { userId } });
    return response.data.map(app => app.feedId);
  } catch (error) {
    console.error("지원 내역 확인 실패:", error);
    throw error;
  }
};

// 프로젝트 지원하기
export const submitApplication = async (applicationData) => {
  try {
    const response = await apiClient.post('/main/application', applicationData);
    return response.data;
  } catch (error) {
    console.error("프로젝트 지원 실패:", error);
    throw error;
  }
};

// ---------------------------------------------
// 5. Like API (좋아요)
// ---------------------------------------------

// 특정 게시글의 좋아요 개수 조회
export const getFeedLikes = async (feedId, feedType) => {
  try {
    const response = await apiClient.get(`/feed/${feedId}?feedType=${feedType}`);
    return response.data;
  } catch (error) {
    console.error('좋아요 정보 조회 실패:', error);
    throw error;
  }
};

// 사용자의 좋아요 여부 확인
export const getUserLikeStatus = async (userId, feedId) => {
  try {
    const response = await apiClient.get(`/main/like?userId=${userId}&feedId=${feedId}`);
    return response.data;
  } catch (error) {
    console.error('좋아요 상태 확인 실패:', error);
    throw error;
  }
};

// 좋아요 추가
export const addLike = async (likeData) => {
  try {
    const response = await apiClient.post(`/main/like`, likeData);
    return response.data;
  } catch (error) {
    console.error('좋아요 추가 실패:', error);
    throw error;
  }
};

// 좋아요 취소
export const removeLike = async (likeData) => {
  try {
    const response = await apiClient.delete(`/main/like`, { data: likeData });
    return response.data;
  } catch (error) {
    console.error('좋아요 취소 실패:', error);
    throw error;
  }
};

// ---------------------------------------------
// 6. Comment API (댓글 및 대댓글)
// ---------------------------------------------

// 프로젝트 상세 정보 조회 (댓글 포함)
export const getProjectDetails = async (feedType) => {
  try {
    const response = await apiClient.get(`/main?feedType=${feedType}`);
    return response.data;
  } catch (error) {
    console.error("프로젝트 상세 조회 실패:", error);
    throw error;
  }
};

// 댓글 작성
export const submitComment = async (projectId, commentData, feedType) => {
  try {
    const response = await apiClient.post(`/feed/${projectId}/comments`, commentData, {
      params: { feedType }
    });
    return response.data;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    throw error;
  }
};

// 대댓글 작성
export const submitReply = async (projectId, commentId, userId, replyData) => {
  try {
    const response = await apiClient.post(
      `/feed/${projectId}/comments/${commentId}/replies?userId=${userId}`,
      replyData
    );
    return response.data;
  } catch (error) {
    console.error("대댓글 작성 실패:", error);
    throw error;
  }
};

// 대댓글 목록 조회
export const getReplies = async (projectId, commentId) => {
  try {
    const response = await apiClient.get(`/feed/${projectId}/comments/${commentId}/replies`);
    return response.data;
  } catch (error) {
    console.error("대댓글 조회 실패:", error);
    throw error;
  }
};

// 대댓글 삭제
export const deleteReply = async (projectId, commentId, replyId, userId) => {
  try {
    const response = await apiClient.delete(
      `/feed/${projectId}/comments/${commentId}/replies/${replyId}`,
      { params: { userId } }
    );
    return response.data;
  } catch (error) {
    console.error('대댓글 삭제 실패:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (projectId, commentId, feedType, userId) => {
  try {
    const response = await apiClient.delete(`/feed/${projectId}/comments/${commentId}`, {
      params: { feedType, userId }
    });
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    throw error;
  }
};

// 댓글 수정
export const editComment = async (projectId, commentId, feedType, userId, commentData) => {
  try {
    const response = await apiClient.put(
      `/feed/${projectId}/comments/${commentId}?feedType=${feedType}&userId=${userId}`, 
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    throw error;
  }
};

// ---------------------------------------------
// 7. Feed API (게시글 관리)
// ---------------------------------------------

// 새 게시글 작성
export const createFeed = async (formData, feedType, userId) => {
  try {
    const response = await apiClient.post('/feed/create', formData, {
      params: { feedType, userId },
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    throw error;
  }
};

// 임시 저장 게시글 수정
export const updateTempFeed = async (data, creatorId, feedType) => {
  try {
    const response = await apiClient.patch('/my/temp', data, {
      params: { creatorId, feedType }
    });
    return response.data;
  } catch (error) {
    console.error('임시 저장글 수정 실패:', error);
    throw error;
  }
};

// 게시글 삭제
export const deleteFeed = async (feedId, feedType, userId) => {
  try {
    const response = await apiClient.delete(`/feed/${feedId}`, {
      params: { feedType, userId }
    });
    return response.data;
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

// ---------------------------------------------
// 8. MyPage API (마이페이지 및 신청 관리)
// ---------------------------------------------

// 작성 글 목록 조회
export const getUserWriting = async (creatorId, feedType) => {
  try {
    const response = await apiClient.get('/my/writing', {
      params: { creatorId, sk: feedType }
    });
    return response.data;
  } catch (error) {
    console.error('작성한 글 조회 실패:', error);
    throw error;
  }
};

// 임시 저장 글 목록 조회
export const getUserTempFeeds = async (creatorId, feedType) => {
  try {
    const response = await apiClient.get('/my/temp', {
      params: { creatorId, feedType }
    });
    return response.data;
  } catch (error) {
    console.error('임시 저장 글 조회 실패:', error);
    throw error;
  }
};

// 관심(좋아요) 목록 조회
export const getUserLikedFeeds = async (userId, feedType) => {
  try {
    const response = await apiClient.get('/my/like', {
      params: { userId, feedType }
    });
    return response.data;
  } catch (error) {
    console.error('관심 목록 조회 실패:', error);
    throw error;
  }
};

// 신청자 전체 목록 조회
export const getFeedApplications = async (feedId) => {
  try {
    const response = await apiClient.get('/my/writing/application', {
      params: { feedId }
    });
    return response.data;
  } catch (error) {
    console.error('신청자 목록 조회 실패:', error);
    throw error;
  }
};

// 모집 마감 처리
export const closeFeed = async (feedData) => {
  try {
    const response = await apiClient.patch('/my/writing/close', feedData);
    return response.data;
  } catch (error) {
    console.error('모집 마감 처리 실패:', error);
    throw error;
  }
};

// 신청 취소
export const cancelApplication = async (userId, feedId) => {
  try {
    const response = await apiClient.delete(`/feed/apply-cancel`, {
      params: { userId, feedId },
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('신청 취소 실패:', error);
    throw error;
  }
};

// 특정 직군(Part)별 신청자 조회
export const getFeedApplicationsByPart = async (feedId, part) => {
  try {
    const response = await apiClient.get(`my/writing/part`, {
      params: { feedId, part }
    });
    return response.data;
  } catch (error) {
    console.error("직군별 신청자 조회 실패:", error);
    throw error;
  }
};

// 신청 승인
export const acceptApplication = async (requestData) => {
  try {
    const response = await apiClient.patch('my/writing/accept', requestData);
    return response.data;
  } catch (error) {
    console.error('신청 승인 처리 실패:', error);
    throw error;
  }
};

// 신청 반려
export const rejectApplication = async (requestData) => {
  try {
    const response = await apiClient.patch('my/writing/reject', requestData);
    return response.data;
  } catch (error) {
    console.error('신청 반려 처리 실패:', error);
    throw error;
  }
};

// ---------------------------------------------
// 9. Message API (쪽지/메시지)
// ---------------------------------------------

// 메시지 목록 조회
export const getMessages = async (recipientId, userId) => {
  try {
    const response = await apiClient.get('/message', {
      params: { recipientId, userId }
    });
    return response.data;
  } catch (error) {
    console.error('메시지 목록 조회 실패:', error);
    throw error;
  }
};

// 읽지 않은 메시지 개수 조회
export const getMessageCount = async (userId) => {
  try {
    const response = await apiClient.get('/message/count', {
      params: { pk: userId }
    });
    return response.data;
  } catch (error) {
    console.error('메시지 카운트 조회 실패:', error);
    throw error;
  }
};

// 메시지 대화 상대 목록 조회
export const getMessageUsers = async (userId) => {
  try {
    const response = await apiClient.get('/message/list', {
      params: { pk: userId }
    });
    return response.data || {};
  } catch (error) {
    console.error('대화 상대 목록 조회 실패:', error);
    throw error;
  }
};

// 메시지 전송
export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post('/message', messageData);
    return response.data;
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    throw error;
  }
};

// ---------------------------------------------
// 10. Search API (검색)
// ---------------------------------------------

// 키워드 검색
export const searchProjectsByKeyword = async (feedType, keyword) => {
  try {
    const response = await apiClient.get(`/main/search-keyword`, {
      params: { feedType, keyword }
    });
    return response.data;
  } catch (error) {
    console.error('키워드 검색 실패:', error);
    throw error;
  }
};

// 태그 검색
export const searchProjectsByTags = async (feedType, tags) => {
  try {
    const response = await apiClient.get(`/main/search-tags`, {
      params: { feedType, tags }
    });
    return response.data;
  } catch (error) {
    console.error('태그 검색 실패:', error);
    throw error;
  }
};

// ---------------------------------------------
// 11. Authentication API (로그인/회원가입)
// ---------------------------------------------

// 이메일 로그인
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/login/confirm/signin', { email, password });
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error.response ? error.response.data : error);
    throw error;
  }
};

// 소셜 로그인
export const socialLogin = async (provider, code, state) => {
  try {
    const response = await apiClient.post(`/home/login/${provider}`, { code, state });
    return response.data;
  } catch (error) {
    console.error('소셜 로그인 실패:', error);
    throw error;
  }
};

// 토큰 갱신 (수동 호출용)
export const refreshAccessToken = async (email, refreshToken) => {
  try {
    const response = await apiClient.post('login/verify/refresh', {
      email, refresh_token: refreshToken 
    });
    return response.data;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw error;
  }
};

// 이메일 인증번호 발송
export const sendVerificationEmail = async (email) => {
  try {
    const response = await apiClient.post('/login/verify/email', 
      { email }, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('인증 번호 발송 실패:', error);
    throw error;
  }
};

// 이메일 인증번호 재발송
export const resendVerificationCode = async (email) => {
  try {
    const response = await apiClient.post('login/verify/resend', 
      { email }, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('인증 번호 재발송 실패:', error);
    throw error;
  }
};

// 이메일 인증 확인
export const confirmEmail = async (email, verificationCode) => {
  try {
    const response = await apiClient.post('login/confirm/email', 
      { email, verification_code: verificationCode }, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('이메일 인증 확인 실패:', error);
    throw error;
  }
};

// 회원가입
export const signupUser = async (email, nickname, password) => {
  try {
    const response = await apiClient.post('login/confirm/signup', {
      email, nickname, password,
    });
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

// 닉네임 중복 확인
export const checkNicknameAvailability = async (nickname) => {
  try {
    const response = await apiClient.post('login/verify/nickname', { nickname });
    return response.data;
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error);
    throw error;
  }
};

// ---------------------------------------------
// 12. Contest API (공모전)
//* 백엔드 API 미구현으로 인한 Mock Data 처리 (추후 연동 예정)
// ---------------------------------------------

//콘텐츠 리스트 api
export const getContestList = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return CONTESTS;
  } catch (error) {
    console.error('공모전 목록 조회 실패:', error);
    throw error;
  }
};

//콘텐츠 상세 api
export const getContestDetail = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const contest = CONTESTS_DETAIL.find(item => item.id === parseInt(id, 10));
    if (!contest) {
      throw new Error('Contest not found');
    }
    
    return {
      contest,
      relatedProjects: RELATED_PROJECTS
    };
  } catch (error) {
    console.error('공모전 상세 조회 실패:', error);
    throw error;
  }
};
