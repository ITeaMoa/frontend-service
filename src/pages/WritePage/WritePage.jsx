import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import Dropdown from '../../components/DropDown';
import Modal from '../../components/Modal';
import { useNavigate, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useAtom } from 'jotai';
import { selectedSavedProjectAtom,feedTypeAtom } from '../../Atoms.jsx/AtomStates'; // Atom import
import AlertModal from '../../components/AlertModal';
import { ContentsWrap , MainContent} from '../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../components/NavigationBar';

const recruitTypes = ['프로젝트', '스터디'];
const peopleOptions = ['1명', '2명', '3명', '4명', '5명 이상'];
const roles = ['프론트엔드', '백엔드', '디자이너'];
const places = ['서울', '경기', '인천', '비대면', '기타'];

const WritePage = () => {
  // const location = useLocation();
  // const query = new URLSearchParams(location.search);
  // const feedTypeFromQuery = query.get('feedType'); // 쿼리 파라미터에서 feedType 가져오기
  const [feedType, ] = useAtom(feedTypeAtom);

  // const [feedType, setFeedType] = useState(feedTypeFromQuery || initialFeedType || 'PROJECT'); // 쿼리 파라미터가 없으면 초기값 사용
  const [selectedSavedProject] = useAtom(selectedSavedProjectAtom); // 아톰에서 프로젝트 정보 가져오기
  // const [selectedRoles, setSelectedRoles] = useState(selectedSavedProject ? selectedSavedProject.roles : []);
  const [selectedRoles, setSelectedRoles] = useState([]); // 반드시 배열!
  const [selectedTags, setSelectedTags] = useState(selectedSavedProject.length > 0 ? selectedSavedProject.tags : []);
  // const [period, setPeriod] = useState('');
  console.log('selectedSavedProject', selectedSavedProject);

  const navigate = useNavigate();
  const [title, setTitle] = useState(selectedSavedProject ? selectedSavedProject.title : ''); // 프로젝트 제목 초기화
  const [description, setDescription] = useState(selectedSavedProject ? selectedSavedProject.content : ''); // 프로젝트 내용 초기화
  const [progress, setProgress] = useState(selectedSavedProject ? selectedSavedProject.place : ''); // 진행 장소 초기화
  const [deadline, setDeadline] = useState(selectedSavedProject ? selectedSavedProject.deadline : ''); // 마감일 초기화
  const [period, setPeriod] = useState(selectedSavedProject ? selectedSavedProject.period : ''); // 진행기간 초기화
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const nickname = user ? user.nickname : 'Unknown'; //사용자 닉네임 설정
  // const [participants, setParticipants] = useState(0);
  const showSearch = false;
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const [recruitmentNum, setRecruitmentNum] = useState(0); // recruitmentNum 상태 추가
  const [showAlertPopup, setShowAlertPopup] = useState(false); // 경고 모달 상태 추가
  // const [isProject, setIsProject] = useState(true); // 프로젝트 여부 상태 추가
  const [recruitType, setRecruitType] = useState(null);
  const [people, setPeople] = useState(null);
  const [role, setRole] = useState(null);
  const [place, setPlace] = useState(null);
  

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

// 선택된 역할 변경 시 로그 출력
useEffect(() => {
  console.log('현재 선택된 역할:', selectedRoles);
}, [selectedRoles]);

  const handleSubmit = async (e, isTemporary) => {
    e.preventDefault();

    // user가 존재하는지 확인
    if (!user || !user.id) {
        setShowAlertPopup('로그인 상태가 아닙니다. 로그인 후 다시 시도해주세요.');
        return;
    }
    console.log("isTemporary", isTemporary);
    //임시저장 ->게시물 : postStatus = true, savedFeed = false

    const missingFields = [];

    // 각 필드가 존재하는지 먼저 확인
    if (!title || !title.trim()) {
        missingFields.push('제목');
    }
    if (!description || !description.trim()) {
        missingFields.push('본문');
    }
    if (!deadline) {
        missingFields.push('마감일자');
    }
    if (!progress || !progress.trim()) {
        missingFields.push('진행장소');
    }
    if (!selectedRoles || selectedRoles.length === 0) {
        missingFields.push('모집 역할');
    }
    if (!selectedTags || selectedTags.length === 0) {
        missingFields.push('태그');
    }
    if (!period) {
        missingFields.push('진행기간');
    }

    if (missingFields.length > 0) {
          setShowAlertPopup(`다음 필드를 올바르게 입력해주세요: ${missingFields.join(', ')}`);
        return;
    }

    const deadlineISO = new Date(deadline).toISOString();
    const periodValue = parseInt(period, 10);

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    const dataToSend = {
        title,
        content: description,
        postStatus: !isTemporary,
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
        nickname
    };

    formData.append('feed', JSON.stringify(dataToSend));
   
    try {
      if(Object.keys(selectedSavedProject).length > 0){
        await axios.patch(
          `/feed/temp`,
          formData,
          {
            params: {
              feedType: feedType,
              userId: user.id
            },
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      }else{
      await axios.post(
        '/feed/create',
        formData,
        {
          params: {
            feedType: feedType,
            userId: user.id
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        //   headers: {
        //     'Content-Type': 'application/json'  // multipart/form-data 대신 application/json 사용
        // }
        }
      );
      console.log('업로드 성공!');
      }
      navigate('/');
    } catch (error) {
      console.log('업로드 실패!');
    }
  };

//업데이트
  // const handleSubmit = async (e, isTemporary) => {
  //   e.preventDefault();

  //   // user가 존재하는지 확인
  //   if (!user || !user.id) {
  //       setShowAlertPopup('로그인 상태가 아닙니다. 로그인 후 다시 시도해주세요.');
  //       return;
  //   }

  //   const missingFields = [];

  //   // 각 필드가 존재하는지 먼저 확인
  //   if (!title || !title.trim()) {
  //       missingFields.push('제목');
  //   }
  //   if (!description || !description.trim()) {
  //       missingFields.push('본문');
  //   }
  //   if (!deadline) {
  //       missingFields.push('마감일자');
  //   }
  //   if (!progress || !progress.trim()) {
  //       missingFields.push('진행장소');
  //   }
  //   if (!selectedRoles || selectedRoles.length === 0) {
  //       missingFields.push('모집 역할');
  //   }
  //   if (!selectedTags || selectedTags.length === 0) {
  //       missingFields.push('태그');
  //   }
  //   if (!period) {
  //       missingFields.push('진행기간');
  //   }

  //   if (missingFields.length > 0) {
  //         setShowAlertPopup(`다음 필드를 올바르게 입력해주세요: ${missingFields.join(', ')}`);
  //       return;
  //   }

  //   const deadlineISO = new Date(deadline).toISOString();
  //   const periodValue = parseInt(period, 10);

  //   const formData = new FormData();
  //   if (image) {
  //     formData.append('image', image);
  //   }

  //   const dataToSend = {
  //       title,
  //       content: description,
  //       postStatus: !isTemporary,
  //       savedFeed: isTemporary,
  //       tags: selectedTags,
  //       recruitmentNum: recruitmentNum > 0 ? recruitmentNum : 1,
  //       deadline: deadlineISO,
  //       place: progress,
  //       period: periodValue,
  //       roles: selectedRoles.length > 0 ? selectedRoles.reduce((acc, role) => {
  //           acc[role.role.toLowerCase()] = role.count;
  //           return acc;
  //       }, {}) : {},
  //       creatorId: user ? user.id : 'Unknown',
  //       nickname
  //   };

  //   formData.append('feed', JSON.stringify(dataToSend));
   
  //   try {
  //     if (selectedSavedProject) {
  //       // 수정(업데이트) API 호출
  //       await axios.put(
  //         `/feed/update/${selectedSavedProject.id}`, // 또는 PATCH, 엔드포인트는 서버에 맞게
  //         formData,
  //         {
  //           params: {
  //             feedType: feedType,
  //             userId: user.id
  //           },
  //           headers: {
  //             'Content-Type': 'multipart/form-data'
  //           }
  //         }
  //       );
  //       console.log('수정 성공!');
  //     } else {
  //       // 새로 생성
  //       await axios.post(
  //         '/feed/create',
  //         formData,
  //         {
  //           params: {
  //             feedType: feedType,
  //             userId: user.id
  //           },
  //           headers: {
  //             'Content-Type': 'multipart/form-data'
  //           }
  //         }
  //       );
  //       console.log('업로드 성공!');
  //     }
  //     navigate('/');
  //   } catch (error) {
  //     console.log('업로드/수정 실패!');
  //   }
  // };

useEffect(() => {
  if (selectedSavedProject && selectedSavedProject.roles) {
    // roles: { backend: 2, frontend: 1 } → [{ role: 'backend', count: 2 }, ...]
    const rolesArray = Object.entries(selectedSavedProject.roles)
      .map(([role, count]) => ({ role, count }));
    setSelectedRoles(rolesArray);
  }
  if (selectedSavedProject && selectedSavedProject.deadline) {
    // 날짜만 추출 (YYYY-MM-DD)
    const dateOnly = selectedSavedProject.deadline.split('T')[0];
    setDeadline(dateOnly);
  }

  if (selectedSavedProject && selectedSavedProject.tags) {
    setSelectedTags(selectedSavedProject.tags);
  }
  
}, [selectedSavedProject]);


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




// // 1. TagDropdown이 받은 onTagSelect는 WritePage의 handleTagSelect 함수
const handleTagSelect = (option) => {
    if (!option || !option.label) {
        return;
    }
  
    const MAX_TAGS = 10;
if ((selectedTags || []).length >= MAX_TAGS) {
  setShowAlertPopup('최대 10개의 태그만 선택할 수 있습니다.');
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



const handleDeadlineChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

    if (selectedDate < today) {
        setShowAlertPopup('마감일자는 오늘 이후의 날짜만 선택할 수 있습니다.');
        return;
    }
    setDeadline(e.target.value);
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    // setImagePreview(URL.createObjectURL(file));
    setImagePreview(file); // 파일 객체 자체를 저장
  }
};

const handleImageButtonClick = () => {
  fileInputRef.current.click();
};
const handleImageRemove = () => {
  setImage(null);
  setImagePreview(null);
};

  return (
    <>
     <ContentsWrap>
      <MainContent>
        <NavigationBar showSearch={false} />
        {/* <WriteFormWrap> */}
          <TagRow>
            {selectedTags.map(tag => (
              <Tag key={tag}>
                {tag}
                <span className="delete-icon" onClick={() => handleTagDelete(tag)}>×</span>
              </Tag>
            ))}
            <TagAdd onClick={handleAddTagClick}>+ 추가하기</TagAdd>
          </TagRow>

          <TitleInput>
            <InputField
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 적어주세요"
            />
            {title && (
              <ClearButton onClick={() => setTitle('')}>×</ClearButton>
            )}
          </TitleInput>

          <GridRow>
            <GridCol>
              <Label>모집 구분</Label>
              <ButtonGroup>
                {recruitTypes.map(type => (
                  <ToggleButton
                    key={type}
                    active={recruitType === type}
                    onClick={() => setRecruitType(recruitType === type ? null : type)}
                  >
                    {type}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </GridCol>
            <GridCol>
              <Label>모집 마감</Label>
              <Input type="text" placeholder="20XX.XX.XX" />
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol>
              <Label>모집 인원</Label>
              <ButtonGroup>
                {peopleOptions.map(opt => (
                  <ToggleButton
                    key={opt}
                    active={people === opt}
                    onClick={() => setPeople(people === opt ? null : opt)}
                  >
                    {opt}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </GridCol>
            <GridCol>
              <Label>진행 기간</Label>
              <Input type="text" placeholder="20XX.XX.XX ~ 20XX.XX.XX" />
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol>
              <Label>모집 역할</Label>
              <ButtonGroup>
                {roles.map(r => (
                  <ToggleButton
                    key={r}
                    active={role === r}
                    onClick={() => setRole(role === r ? null : r)}
                  >
                    {r}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </GridCol>
            <GridCol>
              <Label>진행 장소</Label>
              <ButtonGroup>
                {places.map(p => (
                  <ToggleButton
                    key={p}
                    active={place === p}
                    onClick={() => setPlace(place === p ? null : p)}
                  >
                    {p}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </GridCol>
          </GridRow>

          <TextArea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="본문을 작성해주세요"
          />

          <ButtonRow>
            <SaveButton gray>임시 저장</SaveButton>
            <SaveButton>게시하기</SaveButton>
          </ButtonRow>
        {/* </WriteFormWrap> */}
      </MainContent>
    </ContentsWrap>
    </>

    
  );
};

export default WritePage;

// const ContentsWrap = styled.div`
//   width: 100%;
//   min-height: 100vh;
//   background: #fafbfc;
// `;

// const MainContent = styled.div`
//   max-width: 900px;
//   margin: 0 auto;
//   padding: 40px 0 80px 0;
// `;

const WriteFormWrap = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  padding: 32px 32px 24px 32px;
  margin-top: 32px;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
`;

const Tag = styled.div`
  background: #eaf6ff;
  color: #00aeff;
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 15px;
  font-weight: 500;
  position: relative;
  .delete-icon {
    margin-left: 6px;
    cursor: pointer;
    color: #888;
    font-size: 14px;
  }
`;

const TagAdd = styled.button`
  background: #f5f5f5;
  color: #888;
  border: none;
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 15px;
  cursor: pointer;
`;

const TitleInput = styled.div`
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border-radius: 8px;
  padding: 18px 20px;
  margin-bottom: 24px;
  position: relative;
  border: 1.5px solid #ededed;
`;

const InputField = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 22px;
  color: #222;
  outline: none;
  &::placeholder {
    color: #bbb;
    font-weight: 400;
  }
`;

const ClearButton = styled.button`
  background: #ededed;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: #bbb;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  transition: background 0.15s;
  &:hover {
    background: #e0e0e0;
    color: #888;
  }
`;

const GridRow = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 18px;
`;

const GridCol = styled.div`
  flex: 1;
`;

const Label = styled.div`
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ToggleButton = styled.button`
  background: ${({ active }) => (active ? '#00aeff' : '#f5f5f5')};
  color: ${({ active }) => (active ? '#fff' : '#222')};
  border: none;
  border-radius: 16px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
`;

const Input = styled.input`
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 220px;
  border: none;
  border-radius: 16px;
  background: #f5f5f5;
  font-size: 17px;
  padding: 18px 14px;
  margin: 24px 0 32px 0;
  resize: none;
  &::placeholder { color: #bbb; }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 32px;
`;

const SaveButton = styled.button`
  background: ${({ gray }) => (gray ? '#e0e0e0' : '#222')};
  color: ${({ gray }) => (gray ? '#888' : '#fff')};
  border: none;
  border-radius: 10px;
  padding: 14px 38px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;