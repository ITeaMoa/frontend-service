import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import Dropdown from '../../components/DropDown';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'




const WritePage = ({feedType}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  // const [participants, setParticipants] = useState(0);
  const [period, setPeriod] = useState('');
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState('');
  const [description, setDescription] = useState(''); 
  const showSearch = false;

  const [selectedRoles, setSelectedRoles] = useState([]); // 상태 초기화
  const [recruitmentNum, setRecruitmentNum] = useState(0); // recruitmentNum 상태 추가

  

  // const [isProject, setIsProject] = useState(true); // 프로젝트 여부 상태 추가

  const handleSave = (isTemporary) => {
    // 필수 필드 유효성 검사
    if (!title.trim() || !description.trim() || !deadline || !progress.trim() || selectedRoles.length === 0) {
        alert('모든 필드를 올바르게 입력해주세요.'); // 누락된 필드에 대한 경고
        return;
    }

    // dataToSend 객체 생성
    const deadlineISO = new Date(deadline).toISOString();
    const dataToSend = {
        title,
        content: description,
        postStatus: true,
        savedFeed: isTemporary,
        tags: selectedTags,
        recruitmentNum: recruitmentNum > 0 ? recruitmentNum : 1, // recruitmentNum이 0일 경우 기본값 설정
        deadline: deadlineISO,
        place: progress,
        period,
        roles: selectedRoles.length > 0 ? selectedRoles.reduce((acc, role) => {
            acc[role.role] = role.count;
            return acc;
        }, {}) : {}, // roles가 비어있을 경우 빈 객체로 설정
    };
  //   const dataToSend = {
  //     title,
  //     content: description,
  //     postStatus: true,
  //     savedFeed: isTemporary,
  //     tags: selectedTags,
  //     recruitmentNum: 3, // recruitmentNum을 하드코딩 (예: 3)
  //     deadline: deadlineISO,
  //     place: progress,
  //     period,
  //     roles: { // roles을 하드코딩 (예: 두 개의 역할)
  //         '프론트엔드': 1,
  //         '백엔드': 2,
  //     },
  // };

    console.log('전송할 데이터:', dataToSend);

    // API 요청
    axios.post(`/feed/create`, dataToSend, {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            feedType,
            userId: user.id,
        },
    })
    .then(response => {
        console.log('Success:', response.data);
        navigate('/');
    })
    .catch((error) => {
        console.error('Error:', error);
        if (error.response) {
            console.error('응답 데이터:', error.response.data);
            console.error('응답 상태:', error.response.status);
        }
    });
  };


   

  const option1 = [
    { value: '기간 미정', label: '기간 미정' },
    { value: '1개월', label: '1개월' },
    { value: '2개월', label: '2개월' },
    { value: '3개월', label: '3개월' },
    { value: '4개월', label: '4개월' },
    { value: '5개월', label: '5개월' },
    { value: '6개월이상', label: '6개월이상' },
    { value: '장기', label: '장기' },
];

const option2 = [
  { value: '백엔드', label: '백엔드' },
  { value: '프론트엔드', label: '프론트엔드' },
  { value: '디자이너', label: '디자이너' },
  { value: 'PM', label: 'PM' },
  { value: 'AI 엔지니어', label: 'AI 엔지니어' },
  { value: '아키텍트', label: '아키텍트' },
  { value: '시스템 엔지니어', label: '시스템 엔지니어' },
  { value: '정보보안', label: '정보보안' },
  { value: 'DBA', label: 'DBA' },
  { value: '블록체인 엔지니어', label: '블록체인 엔지니어' },
  { value: '데이터 엔지니어', label: '데이터 엔지니어' },
  { value: '빅데이터', label: '빅데이터' },
  { value: 'DevOps', label: 'DevOps' },
  { value: '모바일', label: '모바일' },
  { value: 'QA', label: 'QA' },
  { value: 'SRE', label: 'SRE' },
  { value: 'iOS', label: 'iOS' },
  { value: '안드로이드', label: '안드로이드' },
  { value: '기획자', label: '기획자' },
  { value: '마케팅', label: '마케팅' },
];

const option3 = [
  { value: '웹', label: '웹' },
  { value: '모바일', label: '모바일' },
  { value: '정보보안', label: '정보보안' },
  { value: 'AWS', label: 'AWS' },
  { value: 'Git', label: 'Git' },
  { value: 'Github', label: 'Github' },
  { value: '클라우드', label: '클라우드' },
  { value: '블록체인', label: '블록체인' },
  { value: '인공지능', label: '인공지능' },
  { value: '빅데이터', label: '빅데이터' },
  { value: 'Spring Boot', label: 'Spring Boot' },
  { value: 'React', label: 'React' },
  { value: 'Vue', label: 'Vue' },
  { value: 'Python', label: 'Python' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: '게임', label: '게임' },
  { value: 'UI/UX', label: 'UI/UX' },
  { value: '알고리즘', label: '알고리즘' },
  { value: '자료구조', label: '자료구조' },
  { value: 'C/C++', label: 'C/C++' },
  { value: 'C#', label: 'C#' },
  { value: 'SQL', label: 'SQL' },
  { value: 'NoSQL', label: 'NoSQL' },
  { value: 'Django', label: 'Django' },
  { value: 'Figma', label: 'Figma' },
  { value: 'Swift', label: 'Swift' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'React Native', label: 'React Native' },
  { value: 'Android', label: 'Android' },
  { value: 'iOS', label: 'iOS' },
  { value: 'GCP', label: 'GCP' },
  { value: 'Kubernetes', label: 'Kubernetes' },
  { value: 'Docker', label: 'Docker' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'R', label: 'R' },
  { value: 'Go', label: 'Go' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'Express', label: 'Express' },
  { value: 'Firebase', label: 'Firebase' },
  { value: 'Linux/Unix', label: 'Linux/Unix' },
  { value: '데이터마이닝', label: '데이터마이닝' },
  { value: 'Solidity', label: 'Solidity' },
];



const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그 상태

const handleAddTagClick = () => {
    setIsModalOpen(true); 
};

const closeModal = () => {
    setIsModalOpen(false); 
};

const handleRoleSelect = (role, count) => {
    const updatedRoles = selectedRoles.filter(r => r.role !== role); // 기존 역할 제거
    if (count > 0) {
        setSelectedRoles([...updatedRoles, { role, count }]); // 새로운 역할 추가
    } else {
        setSelectedRoles(updatedRoles); // 역할이 0이면 제거
    }

    // selectedRoles의 내용을 콘솔에 출력
    console.log('현재 선택된 역할:', [...updatedRoles, { role, count }]);

    // recruitmentNum 업데이트
    const newRecruitmentNum = [...updatedRoles, { role, count }].reduce((total, r) => total + r.count, 0);
    setRecruitmentNum(newRecruitmentNum);
};

// 추가된 useEffect
useEffect(() => {
    console.log('현재 선택된 역할:', selectedRoles);
}, [selectedRoles]); // selectedRoles가 변경될 때마다 로그 출력

const handleTagSelect = (option) => {
  // 태그가 선택되지 않은 경우 추가
  setSelectedTags([...selectedTags, option.label]); // 선택된 태그 추가
};

const handlePeriodSelect = (selectedOption) => {
  setPeriod(selectedOption.value); // 선택된 값을 period 상태에 저장
};

const handleToggleChange = (newFeedType) => {
  console.log("Feed type changed to:", newFeedType);
  // feedType을 업데이트하는 로직 추가
};

  return (
    <>
      <Nav showSearch={showSearch} onToggleChange={handleToggleChange} />
      <WriteWrapper>
      <BackButton onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center' }}>
      <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
      이전
    </BackButton>
  

        <Form>
     
          
          <TitleInput>
          <InputField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 적어주세요"
          />
          
          </TitleInput>
          </Form>
        

        <Container>
        <Form> 
        <Title>
          <Label>모집 구분 | 프로젝트</Label>
          </Title> 
    
        <InputBox>
      


          <InputWrapper>

          <Label>마감일자</Label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          </InputWrapper>

          <InputWrapper>

          <Label>진행장소</Label>
          <Input
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="진행장소"
          />
          </InputWrapper>


          <InputWrapper>   
          <Label>모집 역할</Label>
  
          <Dropdown 
            options={option2} 
            placeholder={"프론트엔드,백엔드..."} 
            showCountButtons={true}
            onTagSelect={(role, count) => handleRoleSelect(role, count)} // 매개변수 전달
          />
          </InputWrapper>


          <InputWrapper>   
          <Label> 진행기간 </Label>
          <Dropdown options={option1} placeholder={"기간미정~6개월이상"} onTagSelect={handlePeriodSelect} />

          </InputWrapper>
          </InputBox>
       
        </Form>

        <TagsSection>
           {/* 선택된 태그 버튼 표시 */}
           {selectedTags.map((tag, index) => (
                <TagButton key={`${tag}-${index}`}>{tag}</TagButton>
            ))}
            <TagAdd onClick={handleAddTagClick}> + 태그 추가하기</TagAdd>
           
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <Dropdown 
                    options={option3} 
                    placeholder={"태그를 선택하시오"}
                    onTagSelect={handleTagSelect} // 태그 선택을 처리하기 위해 이 prop을 전달
                />
            </Modal>
          </TagsSection>

        </Container>

        <Body>
        <Form>
    
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="본문을 작성해주세요"
          />

        </Form>
        </Body>

        <Submit>
        <SaveButton onClick={() => handleSave(true)}>임시저장</SaveButton>
        <SaveButton onClick={() => handleSave(false)}>저장하기</SaveButton>
        </Submit>
      </WriteWrapper>
    </>
  );
};

export default WritePage;

const WriteWrapper = styled.div`
  position:relative;
  padding: 20px;
  margin-top: 20vh;
  min-height: calc(100vh - 250px);
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-bottom: 100px;
  padding-bottom: 100px;
  
`;

const BackButton = styled.button`
  position: absolute;
  left: 10%;
  top:5%;
  transform: translateY(30%);
  background: transparent; 
  border: none; 
  color: #62b9ec; 
  font-size:20px;
  font-weight: bold;
  cursor: pointer; 
  
  &:hover {
    opacity: 0.5;
  }
`;


const Form = styled.div`
  gap: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  min-width: 60px;
  text-align: left;
`;



const TitleInput = styled.div`
  position: absolute;
  left: 20%;
  top: 5%;
  align-items: center;
  border-bottom: 3px solid #ccc;
  cursor: text;
  width: 60%;

  &:focus-within {
    border-bottom: 3px solid #62b9ec;
  }
`;

const InputField = styled.input`
  border: none;
  outline: none;
  padding: 5px 0;
  font-size: 25px;
  width: 100%;
  
  &::placeholder {
    color: #aaa;
  }
`;

const Container = styled.div`
  // display: flex;
  justify-content: space-between;
  width: calc(100% / 2 + 80px); 
  transform: translateX(16px);
  margin-top:100px;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 30px 30px 1px 30px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-color: #A0DAFB;
`;


const Title = styled.label`
  position: absolute;
  font-weight: bold;
  left: 8.2%;
  top: 10%;
`;



const InputBox = styled.div`
  display: flex;
  flex-wrap: wrap; /* 여러 행을 가능하게 설정 */
  justify-content: center;
  width: calc(100% - 40px); 
  margin-bottom: 10px;
  margin-top: 35px;
  margin-left: 40px;
`;

const InputWrapper = styled.div`
  flex: 1 1 300px; /* 2열로 배치하고 여백 고려 */
  min-width: 200px; //기본적으로는 300px가자면서 min이 300px가 됨
  max-width: 400px;
  display: flex;
  align-items: center;
   margin-bottom: 20px;
   margin-top:10px;
   margin-left: 20px;



`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid ;
  border-radius: 15px;
  border-color: #A0DAFB;
  width: 250px;
  margin-left: 20px;
  margin-top:10px;
  
  &::placeholder {
    color: grey;
}

&:focus {
    border-color: #007BFF;/
    outline: none; 
}


`;
const Body = styled.div`
    width: calc(100% / 2 + 90px); 

`;

const TagsSection = styled.div`

  margin-top: 20px;
  margin-left: 50px;
  display: flex;
`;

const TagButton = styled.button`

  border-radius: 5px;
  padding: 5px 20px;
  margin-right:20px;
  border: 1px solid ;
  border-radius: 15px 15px 1px 15px; //반시계 ㅔ방향
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-color: rgba(160, 218, 251);
  background-color: white;
  color: #0A8ED9 ;

`;

const TagAdd = styled.button`

  border-radius: 5px;
  padding: 5px 20px;
  margin-right:20px;
  border-radius: 15px 15px 1px 15px; //반시계 ㅔ방향
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-color: rgba(160, 218, 251);
  background-color: white;
  border: 1px solid #ddd;
  color : grey;
  cursor: pointer;

  &:hover{
    background-color:#D9D9D9 ;
  }

`;


const TextArea = styled.textarea`
  border: none;
  border-radius: 15px 15px 1px 15px; //반시계 ㅔ방향
  outline: none;
  margin-top: 30px;
  font-size: 20px;
  background-color: #ddd;
  resize: none; /* 크기 조정 비활성화 */
  padding: 20px; 
  height: 500px; 
  width: 100%; 
  
  &::placeholder {
    color: #aaa;
    opacity: 1; 
  }

  &:focus {
  }
`;




const Submit = styled.button`
  position: absolute;
  display: flex;
  gap:20px;
  border: none;
  outline: none;
  background: transparent;
  cursor: none;
  margin-left:780px;
  margin-top:100px;
  margin-bottom: 20px;
  bottom: 0px;

  }
`;

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 10px 30px;
  border-radius: 15px 15px 1px 15px; //반시계 ㅔ방향
  white-space: nowrap;

  &:hover {
    background-color: #a0dafb;
  }
`;


