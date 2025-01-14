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




const WritePage = ({ feedType: initialFeedType }) => {
  const [feedType, setFeedType] = useState('PROJECT');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [period, setPeriod] = useState('');

  // feedType 변경 시 로그 출력
  useEffect(() => {
    console.log('현재 feedType:', feedType);
  }, [feedType]);

  // 선택된 역할 변경 시 로그 출력
  useEffect(() => {
    console.log('현재 선택된 역할:', selectedRoles);
  }, [selectedRoles]);

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  // const nickname = user ? user.nickname : 'Unknown'; //사용자 닉네임 설정
  // const [participants, setParticipants] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState('');
  const [description, setDescription] = useState(''); 
  const showSearch = false;

  const [recruitmentNum, setRecruitmentNum] = useState(0); // recruitmentNum 상태 추가

  

  // const [isProject, setIsProject] = useState(true); // 프로젝트 여부 상태 추가

  const handleSubmit = async (e, isTemporary) => {
    e.preventDefault();

    // user가 존재하는지 확인
    if (!user || !user.id) {
        alert('로그인 상태가 아닙니다. 로그인 후 다시 시도해주세요.');
        return; // 로그인 상태가 아닐 경우 함수 종료
    }

    const missingFields = [];

    if (!title.trim()) {
        missingFields.push('제목');
    }
    if (!description.trim()) {
        missingFields.push('본문');
    }
    if (!deadline) {
        missingFields.push('마감일자');
    }
    if (!progress.trim()) {
        missingFields.push('진행장소');
    }
    if (selectedRoles.length === 0) {
        missingFields.push('모집 역할');
    }

    if (missingFields.length > 0) {
        alert(`다음 필드를 올바르게 입력해주세요: ${missingFields.join(', ')}`);
        return;
    }

    const deadlineISO = new Date(deadline).toISOString();

    const periodValue = parseInt(period, 10);

    const dataToSend = {
        title,
        content: description,
        postStatus: true,
        savedFeed: isTemporary,
        tags: selectedTags,
        recruitmentNum: recruitmentNum > 0 ? recruitmentNum : 1,
        deadline: deadlineISO,
        place: progress,
        period: periodValue,
        roles: selectedRoles.length > 0 ? selectedRoles.reduce((acc, role) => {
            acc[role.role.toLowerCase()] = role.count;
            return acc;
        }, {}) : {},
        creatorId: user ? user.id : 'Unknown',
    };

    console.log('전송할 데이터:', JSON.stringify(dataToSend, null, 2));

    // API 요청 전에 params 출력
    console.log('전송할 params:', {
        feedType,
        userId: user ? user.id : null,
    });

    axios.post(`/feed/create`, dataToSend, {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            feedType,
            userId: user ? user.id : null,
        },
    })
    .then(response => {
        console.log('Success:', response.data);
        console.log('요청 URL:', response.config.url);
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

const handleAddTagClick = () => {
    setIsModalOpen(true); 
};

const closeModal = () => {
    setIsModalOpen(false); 
};

const handleRoleSelect = (option, count) => {
    const updatedRoles = selectedRoles.filter(r => r.role !== option.label);
    if (count > 0) {
        setSelectedRoles([...updatedRoles, { role: option.label, count }]);
    } else {
        setSelectedRoles(updatedRoles);
    }

    const newRecruitmentNum = [...updatedRoles, { role: option.label, count }].reduce((total, r) => total + r.count, 0);
    setRecruitmentNum(newRecruitmentNum);
};

// Modal 내부의 Dropdown을 별도의 컴포넌트로 분리
// 2. TagDropdown 컴포넌트는 이 handleTagSelect를 받아서
// Dropdown 컴포넌트에 전달하며, 선택된 옵션에 대한 로깅도 추가
const TagDropdown = ({ onTagSelect }) => {
    return (
        <Dropdown 
            options={option3} 
            placeholder={"태그를 선택하시오"}
            onTagSelect={(option) => {
                onTagSelect(option);
                console.log('Tag selected:', option.label); // 디버깅용
            }}
        />
    );
};

// // 1. TagDropdown이 받은 onTagSelect는 WritePage의 handleTagSelect 함수
const handleTagSelect = (option) => {
    if (!option || !option.label) {
        return;
    }
    
    const MAX_TAGS = 10;
    if (selectedTags.length >= MAX_TAGS) {
        alert('최대 10개의 태그만 선택할 수 있습니다.');
        return;
    }

    setSelectedTags(prevTags => {
        // 중복 체크를 더 엄격하게 수행
        if (prevTags.includes(option.label)) {
            console.log('Duplicate tag:', option.label);
            return prevTags;
        }
        return [...prevTags, option.label];
    });
    
    // 모달 닫기 코드 제거 - 사용자가 X를 누를 때까지 유지
};

// 태그 삭제 함수 추가
const handleTagDelete = (tagToDelete) => {
    setSelectedTags(prevTags => prevTags.filter(tag => tag !== tagToDelete));
};

const handlePeriodSelect = (selectedOption) => {
    setPeriod(selectedOption.value);
};

const handleToggleChange = (newFeedType) => {
    console.log("Feed type changed to:", newFeedType);
    setFeedType(newFeedType);
    // handleSubmit을 호출하여 전송을 시도할 수 있습니다.
    // handleSubmit(newFeedType)와 같이 인자를 전달합니다.
};

useEffect(() => {
    console.log('Current selectedTags:', selectedTags);
}, [selectedTags]);

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
  
          {/* <Dropdown 
            options={option2} 
            placeholder={"프론트엔드,백엔드..."} 
            showCountButtons={true}
            onTagSelect={(role, count) => handleRoleSelect(role, count)} // 매개변수 전달
          /> */}
          <Dropdown 
    options={option2} 
    placeholder={"프론트엔드,백엔드..."} 
    showCountButtons={true}
    onTagSelect={handleRoleSelect} // 역할과 카운트를 직접 전달
/>
          </InputWrapper>


          <InputWrapper>   
          <Label> 진행기간 </Label>
          <Dropdown options={option1} placeholder={"기간미정~6개월이상"} onTagSelect={handlePeriodSelect} />

          </InputWrapper>
          </InputBox>
       
        </Form>

        <TagsSection>
            {selectedTags.map((tag, index) => (
                <TagButton key={tag}>
                    {tag}
                    <span 
                        className="delete-icon" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTagDelete(tag);
                        }}
                    >
                        ×
                    </span>
                </TagButton>
            ))}
            <TagAdd onClick={handleAddTagClick}>+ 태그 추가하기</TagAdd>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <TagDropdown onTagSelect={handleTagSelect} />
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
        <SaveButton onClick={(e) => handleSubmit(e, true)}>임시저장</SaveButton>
        <SaveButton onClick={(e) => handleSubmit(e, false)}>저장하기</SaveButton>
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

  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 200%;
    margin: 400px auto 30px;
    transform: none;
    padding: 15px;
  }
  
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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 80%;
    left: 10%;
  }

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
  justify-content: space-between;
  width: calc(100% / 2 + 80px); 
  transform: translateX(16px);
  margin-top: 100px;
  padding: 20px;
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;

  // @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
  //   width: 100%;
  //   margin: 100px auto 0;
  //   transform: none;
  //   padding: 15px;
  // }
`;


const Title = styled.label`
  position: absolute;
  font-weight: bold;
  left: 8.2%;
  top: 10%;
`;



const InputBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: calc(100% - 40px);
  margin-bottom: 10px;
  margin-top: 35px;
  margin-left: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 10px;
    width: calc(100% - 20px);
  }
`;

const InputWrapper = styled.div`
  flex: 1 1 45%;
  min-width: 200px;
  max-width: 400px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex: 1 1 100%;
    margin-left: 0;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #A0DAFB;
  border-radius: 15px;
  width: 250px;
  margin-left: 20px;
  margin-top: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    // width: calc(100% - 30px);
    width: 250px;
    margin-left: 5px;
  }
`;
const Body = styled.div`
    width: calc(100% / 2 + 90px); 

`;

const TagsSection = styled.div`
  margin-top: 20px;
  margin-left: 50px;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 15px;
  }
`;

const TagButton = styled.button`
    position: relative;
    border-radius: 5px;
    padding: 5px 35px 5px 20px; // 오른쪽 패딩 증가
    margin-right: 20px;
    border: 1px solid;
    border-radius: 15px 15px 1px 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-color: rgba(160, 218, 251);
    background-color: white;
    color: #0A8ED9;

    // X 버튼 스타일
    .delete-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 14px;
        color: #666;
        
        &:hover {
            color: #ff4444;
        }
    }
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
  gap: 20px;
  border: none;
  outline: none;
  background: transparent;
  cursor: none;
  margin-left: 780px;
  margin-top: 100px;
  margin-bottom: 20px;
  bottom: 0px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: relative;
    margin: 20px auto;
    bottom: auto;
    left: auto;
    margin-left: 0;
    justify-content: center;
    width: 100%;
    padding: 0 20px;
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


