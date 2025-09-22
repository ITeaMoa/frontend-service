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
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태
  

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
    const finalDataToSend = {
      ...selectedSavedProject, // seletsavedproject의 모든 속성을 먼저 포함
      ...dataToSend         // dataToSend의 속성으로 중복되는 키를 덮어씀
  };
  // console.log("finalDataToSend",finalDataToSend)
    formData.append('feed', JSON.stringify(dataToSend));
   
    try {
      if (Object.keys(selectedSavedProject).length > 0) {

          // 임시저장 PATCH
          await axios.patch(
            `/my/temp`,
            finalDataToSend,
            
            {
              params: {
                creatorId : user.id,
                feedType: selectedSavedProject.sk,
              
              },
              // headers: {
              //   'Content-Type': 'multipart/form-data'
              // }
            }
          );
        
      } else {
        // 새로 생성
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
          }
        );
      }
      navigate('/');
    } catch (error) {
      console.log('업로드 실패!');
    }
  };

// //업데이트
//   const handleSubmit = async (e, isTemporary) => {
//     e.preventDefault();

//     // user가 존재하는지 확인
//     if (!user || !user.id) {
//         setShowAlertPopup('로그인 상태가 아닙니다. 로그인 후 다시 시도해주세요.');
//         return;
//     }

//     const missingFields = [];

//     // 각 필드가 존재하는지 먼저 확인
//     if (!title || !title.trim()) {
//         missingFields.push('제목');
//     }
//     if (!description || !description.trim()) {
//         missingFields.push('본문');
//     }
//     if (!deadline) {
//         missingFields.push('마감일자');
//     }
//     if (!progress || !progress.trim()) {
//         missingFields.push('진행장소');
//     }
//     if (!selectedRoles || selectedRoles.length === 0) {
//         missingFields.push('모집 역할');
//     }
//     if (!selectedTags || selectedTags.length === 0) {
//         missingFields.push('태그');
//     }
//     if (!period) {
//         missingFields.push('진행기간');
//     }

//     if (missingFields.length > 0) {
//           setShowAlertPopup(`다음 필드를 올바르게 입력해주세요: ${missingFields.join(', ')}`);
//         return;
//     }

//     const deadlineISO = new Date(deadline).toISOString();
//     const periodValue = parseInt(period, 10);

//     const formData = new FormData();
//     if (image) {
//       formData.append('image', image);
//     }

//     const dataToSend = {
//         title,
//         content: description,
//         postStatus: !isTemporary,
//         savedFeed: isTemporary,
//         tags: selectedTags,
//         recruitmentNum: recruitmentNum > 0 ? recruitmentNum : 1,
//         deadline: deadlineISO,
//         place: progress,
//         period: periodValue,
//         roles: selectedRoles.length > 0 ? selectedRoles.reduce((acc, role) => {
//             acc[role.role.toLowerCase()] = role.count;
//             return acc;
//         }, {}) : {},
//         creatorId: user ? user.id : 'Unknown',
//         nickname
//     };

//     formData.append('feed', JSON.stringify(dataToSend));
//     // if  (Object.keys(selectedSavedProject).length > 0) {
//     //   formData.append('feedType', JSON.stringify(feedType));
//     //   formData.append('userId', JSON.stringify(user.id));}
   
//     try {
      
//       if (Object.keys(selectedSavedProject).length > 0) {
//         formData.append('feedType', JSON.stringify(feedType));
//         formData.append('userId', JSON.stringify(user.id));
//         // 수정(업데이트) API 호출
      
//         await axios.put(
//           `/feed/${selectedSavedProject.pk}`, // 또는 PATCH, 엔드포인트는 서버에 맞게
//           formData,
//           {
//             // params: {
//             //   feedType: feedType,
//             //   userId: user.id
//             // },
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
//         console.log('수정 성공!');
//       } else {
//         // 새로 생성
    
//         await axios.post(
//           '/feed/create',
//           formData,
//           {
//             params: {
//               feedType: feedType,
//               userId: user.id
//             },
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
//         console.log('업로드 성공!');
//       }
//       navigate('/');
//     } catch (error) {
//       console.log('업로드/수정 실패!');
//     }
//   };

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


// Modal 내부의 Dropdown을 별도의 컴포넌트로 분리
// 2. TagDropdown 컴포넌트는 이 handleTagSelect를 받아서
// Dropdown 컴포넌트에 전달하며, 선택된 옵션에 대한 로깅도 추가
// const TagDropdown = ({ onTagSelect }) => {
//     return (
//         <Dropdown 
//             options={option3} 
//             placeholder={"태그를 선택하시오"}
//             onTagSelect={(option) => {
//                 onTagSelect(option);
//                 console.log('Tag selected:', option.label); // 디버깅용
//             }}
//         />
//     );
// };

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



const handleDelete = async () => {
  try {
    await axios.delete(
      `/feed/${selectedSavedProject.pk}`,
      {
        params: {
          feedType: selectedSavedProject.sk,
          userId: user.id
        }
      }
    );
    // 삭제 성공 후 원하는 동작 (예: 메인 페이지로 이동)
    setShowAlertPopup('게시물이 삭제되었습니다.');
    setPopupMessage(false);
    navigate('/');
    // 예시: navigate('/') 또는 window.location.href = '/'
  } catch (error) {
    console.error('게시물 삭제 실패:', error);
    setShowAlertPopup('게시물 삭제에 실패했습니다.');
  }
};

  return (
    <>
      <Nav showSearch={showSearch}/>
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
            onChange={handleDeadlineChange}
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
          <Label >모집 역할</Label>
  
          <Dropdown 
            options={option2} 
            placeholder={"프론트엔드,백엔드..."} 
            showCountButtons={true}
            value={selectedRoles}
            onTagSelect={handleRoleSelect} // 역할과 카운트를 직접 전달
            dropdownType="roles"
        />
          </InputWrapper>


          <InputWrapper>   
          <Label> 진행기간 </Label>
          <Dropdown options={option1} placeholder={"기간미정~6개월이상"} onTagSelect={handlePeriodSelect}  value={period}/>

          </InputWrapper>
          </InputBox>
       
        </Form>

        <TagsSection>
            {selectedTags?.map((tag, index) => (
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
                {/* <TagDropdown onTagSelect={handleTagSelect} /> */}
                <Dropdown 
              options={option3} 
              placeholder={"태그를 선택하시오"}
              dropdownType="tags"
              onTagSelect={(selectedTags) => {
            handleTagSelect(selectedTags);
            console.log('Tag selected:', selectedTags.label); // 디버깅용
        }}
    />
            </Modal>

           {Object.keys(selectedSavedProject).length > 0 && (
                    <AuthorActions>
                    <ActionButton onClick={() => setPopupMessage(true)}>삭제</ActionButton>
                  </AuthorActions>
)}
       
            
          
          
        </TagsSection>

        </Container>

        <Body>
        <Form>
    
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="본문을 작성해주세요"
            spellCheck={false}
          />

<div style={{ marginTop: '16px' }}>
        <ImageButton type="button" onClick={handleImageButtonClick}>
          파일 첨부
        </ImageButton>
        <input
          ref={fileInputRef}
          type="file"
          // accept="image/*"
            accept="image/jpeg,image/png,image/gif,application/pdf"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>
{/* 
      {imagePreview && (
  <ImagePreviewWrapper>
    <PreviewImage src={imagePreview} alt="미리보기" />
    <RemoveButton type="button" onClick={handleImageRemove} aria-label="이미지 삭제">
      ×
    </RemoveButton>
  </ImagePreviewWrapper>
)} */}
    {imagePreview && (
  <ImagePreviewWrapper>
    {imagePreview.type?.includes('image/') ? (
      // 이미지 파일인 경우
      <PreviewImage src={URL.createObjectURL(imagePreview)} alt="미리보기" />
    ) : (
      // PDF 등 다른 파일인 경우
      <FilePreview>
        <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: '8px' }} />
        <FileName>{imagePreview.name}</FileName>
      </FilePreview>
    )}
    <RemoveButton type="button" onClick={handleImageRemove} aria-label="파일 삭제">
      ×
    </RemoveButton>
  </ImagePreviewWrapper>
)}
        </Form>
        </Body>

        <Submit>
        {/* {(!selectedSavedProject || selectedSavedProject.length === 0) && (
  <SaveButton onClick={(e) => handleSubmit(e, true)}>임시저장</SaveButton>
)} */}
   
  <SaveButton onClick={(e) => handleSubmit(e, true)}>임시저장</SaveButton>

        {/* <SaveButton onClick={(e) => handleSubmit(e, true)}>임시저장</SaveButton> */}
        <SaveButton onClick={(e) => handleSubmit(e, false)}>저장하기</SaveButton>
        </Submit>
      </WriteWrapper>

      <AlertModal
  isOpen={!!showAlertPopup}
  message={showAlertPopup}
  onClose={() => setShowAlertPopup(false)}
/>

{popupMessage && (
    <Modal
      isOpen={!!popupMessage}
      onClose={() => setPopupMessage('')}
    showFooter={true}
    onConfirm={handleDelete}
    >
     <h3 style={{ textAlign: 'center' }}>정말로 삭제 하시겠습니까?</h3>
      
    </Modal>
  )}
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
  white-space: nowrap;
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


const AuthorActions = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
 right: 5%;
 top: 82%;
`;

const ActionButton = styled.button`
  padding: 5px 12px;
  border: none;
  border-radius: 5px;
  background-color: #62b9ec;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #a0dafb;
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

const ImageButton = styled.button`
   border: none;
  border-radius: 5px;
  background-color: #62b9ec;
   border-radius: 15px 15px 1px 15px; //반시계 ㅔ방향
    color: white;
  cursor: pointer;
    padding: 10px;
`;


const ImagePreviewWrapper = styled.div`
  margin-top: 12px;
  position: relative;
  display: inline-block;
`;

const PreviewImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  line-height: 28px;
  text-align: center;
  padding: 0;
  z-index: 2;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  width: 100%;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #333;
  word-break: break-all;
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #a0dafb;
  }
`;