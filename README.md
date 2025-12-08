# 🤝 ITeaMoa (IT Team Building Platform)

> **⚠️ Project Status: Archived (2024.08 - 2024.12)**
> 본 프로젝트는 개발 학습 초기 단계에 진행된 프로젝트입니다.
> 현재의 개발 역량 및 코드 스타일과는 차이가 있을 수 있으며, 이 경험을 발판 삼아 이후 실무 프로젝트에서 큰 성장을 이루었습니다.

<br/>

## 📝 Technical Retrospective (기술적 회고)
이 프로젝트는 기획부터 배포까지의 **Full-Lifecycle**을 처음으로 경험한 팀 프로젝트입니다. 당시 기능을 구현하는 데 집중하면서 겪었던 **유지보수의 어려움(Pain Points)**은 이후 프로젝트에서 기술적 성장을 이루는 핵심 동력이 되었습니다.

### 🚀 What I Learned & Improved (성장 포인트)
이 프로젝트에서의 아쉬움을 바탕으로, 이후 진행한 **[Enterprise AI Digital Signage Solution]** 및 **[AI Persona Interview SaaS]** 실무 프로젝트에서 다음과 같이 개선했습니다.

| 구분 | **AS-IS (ITeaMoa)** | **TO-BE (Current / Next Project)** |
| :--- | :--- | :--- |
| **Component** | 페이지 중심 개발로 인한 중복 코드 발생 | **Atomic Design Pattern** 도입으로 재사용성 극대화 |
| **Error Handling** | 단순 `console.log` 및 `alert` 처리 | **Global Error Boundary** 및 **재시도(Retry)** 로직 설계 |
| **State Mgmt** | Context API의 잦은 리렌더링 이슈 | **Jotai** 도입으로 Atom 단위 상태 분리 및 최적화 |

---

## 💡 Project Introduction
**ITeaMoa**는 IT 프로젝트 팀원 모집의 비효율성을 해결하기 위한 **웹 팀 빌딩 플랫폼**입니다.
사용자는 자신의 포트폴리오를 등록하고, 원하는 기술 스택을 가진 팀원을 손쉽게 찾거나 프로젝트에 지원할 수 있습니다.

### 📅 프로젝트 기간
- **2024.08 ~ 2024.12** (핵심 개발 및 배포 완료)

---

## 🛠 Tech Stack

### Frontend
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=black"/> <img src="https://img.shields.io/badge/Styled Components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/> <img src="https://img.shields.io/badge/Jotai-000000?style=flat-square&logo=ghost&logoColor=white"/>

### Backend & Database
<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=flat-square&logo=Spring Boot&logoColor=white"/> <img src="https://img.shields.io/badge/Django-092E20?style=flat-square&logo=Django&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/AWS DynamoDB-4053D6?style=flat-square&logo=Amazon DynamoDB&logoColor=white"/>

### Infra & DevOps
<img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=Amazon AWS&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=flat-square&logo=GitHub Actions&logoColor=white"/>

---

## ✨ Key Features & Performance

### 1. 배포 자동화 (CI/CD) 및 성능 개선
- **문제:** 수동 배포 시 약 15분이 소요되며, 반복적인 작업으로 개발 효율 저하.
- **해결:** **GitHub Actions**를 도입하여 빌드 및 S3/CloudFront 배포 파이프라인 자동화.
- **성과:** 배포 시간을 **15분 → 2분으로 약 85% 단축** 달성.

### 2. 안전한 인증 시스템 구축
- **AWS Cognito**를 연동하여 안전한 로그인/회원가입 프로세스 구축.
- **JWT (JSON Web Token)** 기반의 인증 방식을 적용하여 보안성 강화.

### 3. 비동기 데이터 통신
- **Axios**를 활용하여 Spring Boot/Django 기반의 MSA 백엔드와 RESTful API 통신.
- Interceptor를 활용한 요청/응답 처리 및 토큰 관리.

---

## 📂 Installation

```bash
# Clone the repository
git clone [https://github.com/ITeaMoa/frontend-service.git](https://github.com/ITeaMoa/frontend-service.git)

# Install dependencies
npm install

# Run the project
npm start
