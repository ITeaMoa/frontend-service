
# Iteamoa 프론트엔드 프로젝트
이 문서는 `iteamoa` 프론트엔드 프로젝트의 개요, 구조 및 작업 방법에 대해 설명합니다.
 
## 개요
 
이 프로젝트는 `create-react-app`으로 부트스트랩된 React 애플리케이션입니다. Iteamoa 플랫폼의 프론트엔드 역할을 합니다.
 
## 프로젝트 구조
 
이 프로젝트는 표준 React 애플리케이션 구조를 따릅니다:
 
 ```
 /
├── build/            # 프로덕션 빌드 결과물
├── public/           # 정적 자산 (index.html, 이미지 등)
│   ├── data.json
│   └── images/
├── src/              # 애플리케이션 소스 코드
│   ├── api/          # API 통신 (axios)
│   ├── assets/       # 이미지, 폰트, 스타일과 같은 정적 자산
│   ├── Atoms.jsx/    # 상태 관리를 위한 Jotai atoms
│   ├── components/   # 재사용 가능한 React 컴포넌트
│   ├── context/      # React Context 프로바이더
│   ├── pages/        # 최상위 페이지 컴포넌트
│   │   ├── ApplyPage/
│   │   ├── LoginPage/
│   │   ├── MainPage/
│   │   ├── Messeage/
│   │   ├── MyPage/
│   │   ├── SearchPage/
│   │   ├── SignupPage/
│   │   └── WritePage/
│   ├── App.js        # 메인 애플리케이션 컴포넌트
│   ├── index.js      # 애플리케이션 진입점
│   └── firebase.js   # Firebase 설정 및 초기화
├── .gitignore        # Git에서 무시할 파일 및 폴더
├── package.json      # 프로젝트 메타데이터 및 의존성
└── README.md         # 기본 Create React App README
 ```
 
### 주요 디렉토리
 
*   **`src`**: 대부분의 개발이 이루어지는 곳입니다. 모든 React 컴포넌트, 페이지, 스타일 및 비즈니스 로직을 포함합니다.
*   **`public`**: 메인 HTML 파일(`index.html`)과 Webpack에 의해 처리되지 않는 기타 정적 자산을 포함합니다.
*   **`src/pages`**: 각 하위 디렉토리는 애플리케이션의 주요 페이지 또는 기능에 해당합니다.
*   **`src/components`**: 여러 페이지에서 사용되는 작고 재사용 가능한 컴포넌트를 포함합니다.
*   **`src/api`**: `axios`를 사용하여 백엔드 API와의 연결을 관리합니다.
*   **`src/Atoms.jsx`**: `Jotai` 라이브러리를 사용하여 전역 상태를 정의합니다.
*   **`src/context`**: 사용자 인증 상태를 관리하는 `AuthContext.js`와 같은 React Context 파일을 보관합니다.
 
## 사용 가능한 스크립트
 
`package.json` 파일은 다음 스크립트를 정의합니다:
 
*   `npm start`: 개발 모드에서 앱을 실행합니다.
*   `npm run build`: 프로덕션용으로 앱을 빌드합니다.
*   `npm test`: 테스트 스위트를 실행합니다.
 
## 주요 의존성
 
*   **`react`**: UI 구축을 위한 핵심 라이브러리.
*   **`react-router-dom`**: 라우팅 및 내비게이션 처리.
*   **`axios`**: 백엔드에 HTTP 요청을 보내기 위함.
*   **`jotai`**: 전역 상태 관리.
*   **`styled-components`**: 컴포넌트 스타일링.
*   **`firebase`**: 인증을 포함한 백엔드 서비스에 사용.
*   **`@mui/material`**: Material-UI 컴포넌트 라이브러리.
 
이 문서는 `iteamoa` 프론트엔드 코드베이스를 시작하는 데 도움이 될 것입니다.
