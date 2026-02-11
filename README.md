# 🤝 ITeaMoa (IT Team Building Platform)

> **⚠️ Project Status: Archived (2024.07 - 2024.12)**
> 본 프로젝트는 개발 학습 초기 단계에 진행된 팀 프로젝트입니다.
> 현재의 개발 역량 및 코드 스타일과는 차이가 있을 수 있으며, 이 경험을 발판 삼아 프론트엔드-백엔드 연동 및 인프라(CI/CD) 환경에 대한 깊은 이해를 갖추게 되었습니다.

<br/>

## 💡 Project Introduction
**ITeaMoa**는 IT 프로젝트 팀원 모집의 비효율성을 해결하기 위한 웹 팀 빌딩 플랫폼입니다.
사용자는 자신의 포트폴리오를 등록하고, 원하는 기술 스택을 가진 팀원을 손쉽게 찾거나 프로젝트에 지원할 수 있습니다.

### 📸 Service UI
<img width="349" height="320" alt="image" src="https://github.com/user-attachments/assets/c62c0088-0dc1-4052-a3b3-75355f606600" />


* **📺 시연 영상 (또는 배포 링크):** https://drive.google.com/file/d/1hUj06zRXG506V3t0keunDo4h140Gak7d/view
  > 💡 **Note:** 본 시연 영상은 핵심 기능 구현에 집중한 **초기 MVP 버전(v1.0)** 기준의 UI이며, 이후 사용자 피드백을 반영하여 코드 및 디자인이 지속적으로 개선되었습니다.


---

## 🛠 Tech Stack

### Frontend
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=black"/> <img src="https://img.shields.io/badge/Styled_Components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/> <img src="https://img.shields.io/badge/Jotai-000000?style=flat-square&logo=ghost&logoColor=white"/> <img src="https://img.shields.io/badge/Context_API-61DAFB?style=flat-square&logo=react&logoColor=black"/> 

### Backend & Database
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white"/> <img src="https://img.shields.io/badge/Django-092E20?style=flat-square&logo=Django&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon_DynamoDB-4053D6?style=flat-square&logo=amazondynamodb&logoColor=white"/>

### Infra & DevOps
<img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white"/>

---

## 🏗️ System Architecture
<img width="518" height="196" alt="image" src="https://github.com/user-attachments/assets/2a931054-3507-4dec-a934-66a4a8150db2" />

---

## ✨ Key Features & Performance

### 1. 배포 자동화 (CI/CD) 및 생산성 증대
- **Problem:** 수동 배포 시 약 15분이 소요되며, 반복적인 작업으로 인한 휴먼 에러 발생 가능성 상존.
- **Action:** **GitHub Actions**를 도입하여 코드 푸시 시 빌드 및 AWS S3 / CloudFront 배포까지 파이프라인 자동화.
- **Result:** 배포 시간을 **15분 → 2분으로 약 85% 단축**하여 프론트엔드 개발 생산성 극대화.

### 2. MSA 환경의 API 통신 규격 모듈화
- **Problem:** Spring Boot와 Django로 분리된 MSA 환경에서 백엔드 간 API 호출 규격이 통일되지 않음.
- **Action:** **Axios Interceptor**와 인스턴스(Instance)를 활용해 BaseURL, JWT 토큰 헤더 등 중복 설정을 중앙에서 모듈화.
- **Result:** 서로 다른 백엔드 서비스와의 데이터 연동 효율성을 높이고, 프론트엔드 코드 중복 완벽 제거.

### 3. 안전한 인증 시스템 (AWS Cognito)
- **AWS Cognito**를 연동하여 안전한 로그인/회원가입 프로세스 구축.
- **JWT (JSON Web Token)** 기반의 인가 처리를 Axios Interceptor와 연동하여 안전한 라우팅 보호 설계.
