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
const during = [

  { value: 1, label: '1개월' },
  { value: 2, label: '2개월' },
  { value: 3, label: '3개월' },
  { value: 4, label: '4개월' },
  { value: 0, label: '기간 미정' },
];

const WritePage = () => {
  // const location = useLocation();
  // const query = new URLSearchParams(location.search);
  // const feedTypeFromQuery = query.get('feedType'); // 쿼리 파라미터에서 feedType 가져오기
  

  // const [feedType, setFeedType] = useState(feedTypeFromQuery || initialFeedType || 'PROJECT'); // 쿼리 파라미터가 없으면 초기값 사용
  const [selectedSavedProject] = useAtom(selectedSavedProjectAtom); // 아톰에서 프로젝트 정보 가져오기
  // const [selectedRoles, setSelectedRoles] = useState(selectedSavedProject ? selectedSavedProject.roles : []);
  const [selectedRoles, setSelectedRoles] = useState([]); // 반드시 배열!
  const [selectedTags, setSelectedTags] = useState(['AWS', 'Blockchain']);
  // const [period, setPeriod] = useState('');
  console.log('selectedSavedProject', selectedSavedProject);

  const navigate = useNavigate();
  const [feedType, setFeedType] = useState(selectedSavedProject ? selectedSavedProject.sk : '');
  const [title, setTitle] = useState(selectedSavedProject ? selectedSavedProject.title : ''); // 프로젝트 제목 초기화
  const [description, setDescription] = useState(selectedSavedProject ? selectedSavedProject.content : ''); // 프로젝트 내용 초기화
  const [progress, setProgress] = useState(selectedSavedProject ? selectedSavedProject.place : ''); // 진행 장소 초기화
  const [deadline, setDeadline] = useState(selectedSavedProject ? selectedSavedProject.deadline : ''); // 마감일 초기화
  const [period, setPeriod] = useState(selectedSavedProject ? selectedSavedProject.period : 0); // 기본값을 0으로 설정
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const nickname = user ? user.nickname : 'Unknown'; //사용자 닉네임 설정
  // const [participants, setParticipants] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const [recruitmentNum, setRecruitmentNum] = useState(0); // recruitmentNum 상태 추가
  const [showAlertPopup, setShowAlertPopup] = useState(false); // 경고 모달 상태 추가
  const [people, setPeople] = useState(null);
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지 상태
  
console.log(period)
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

// // 선택된 역할 변경 시 로그 출력
// useEffect(() => {
//   console.log('현재 선택된 역할:', selectedRoles);
// }, [selectedRoles]);

const handleSubmit = async (e, isTemporary) => {
  e.preventDefault();

  // user가 존재하는지 확인
  if (!user || !user.id) {
      setShowAlertPopup('로그인 상태가 아닙니다. 로그인 후 다시 시도해주세요.');
      return;
  }
  // console.log("isTemporary", isTemporary);
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

useEffect(() => {
  window.scrollTo(0, 0);
}, []);


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
     <ContentsWrap>
      <MainContent>
        <NavigationBar showSearch={false} />
        {/* <WriteFormWrap> */}
          
         
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

          <TagRow>
            {selectedTags.map(tag => (
              <Tag key={tag}>
                {tag}
                <span className="delete-icon" onClick={() => handleTagDelete(tag)}>×</span>
              </Tag>
            ))}
            <TagAdd onClick={handleAddTagClick}>+ 추가하기</TagAdd>
          </TagRow>


          <GridRow>
            <GridCol>
              <Label>모집 구분</Label>
              <ButtonGroup>
                {recruitTypes.map(type => (
                  <ToggleButton
                    key={type}
                    active={feedType === (type === '프로젝트' ? 'PROJECT' : 'STUDY')}
                    onClick={() => setFeedType(type === '프로젝트' ? 'PROJECT' : 'STUDY')}
                  >
                    {type}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </GridCol>
            <GridCol>
              <Label>마감 일자</Label>
              <Input
            type="date"
            value={deadline}
            onChange={handleDeadlineChange}
          />
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
              <ButtonGroup>
                {during.map(opt => (
                  <ToggleButton
                    key={opt.value}
                    active={period === opt.value}
                    onClick={() => setPeriod(opt.value)} // opt.value를 사용하여 설정
                  >
                    {opt.label}
                  </ToggleButton>
                ))}
                </ButtonGroup>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol>
              <Label>모집 역할</Label>
              {/* <ButtonGroup>
                {roles.map(r => (
                  <ToggleButton
                    key={r}
                    active={selectedRoles === r}
                    onClick={() => setSelectedRoles(selectedRoles === r ? null : r)}
                  >
                    {r}
                  </ToggleButton>
                ))}
              </ButtonGroup> */}
            <Dropdown 
            options={option2} 
            placeholder={"프론트엔드,백엔드..."} 
            showCountButtons={true}
            value={selectedRoles}
            onTagSelect={handleRoleSelect} // 역할과 카운트를 직접 전달
            dropdownType="roles"
        />
            </GridCol>
            <GridCol>
              <Label>진행 장소</Label>
              <ButtonGroup>
                {places.map(p => (
                  <ToggleButton
                    key={p}
                    active={progress === p}
                    onClick={() => setProgress(progress === p ? null : p)}
                  >
                    {p}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </GridCol>

            {Object.keys(selectedSavedProject).length > 0 && (
                    <AuthorActions>
                    <ActionButton onClick={() => setPopupMessage(true)}>삭제</ActionButton>
                  </AuthorActions>
)}
          </GridRow>

          <TextArea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="본문을 작성해주세요"
          />


<div style={{ marginTop: '0px' }}>
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

          <ButtonRow>
            <SaveButton gray onClick={(e) => handleSubmit(e, true)}>임시 저장</SaveButton>
            <SaveButton onClick={(e) => handleSubmit(e, false)}>게시하기</SaveButton>
          </ButtonRow>
        {/* </WriteFormWrap> */}
      </MainContent>

     
    </ContentsWrap>

    <Modal isOpen={isModalOpen} onClose={closeModal}>
            <Dropdown 
              options={option3}
              placeholder="태그를 선택하시오"
              dropdownType="tags"
              onTagSelect={selectedTag => {
                handleTagSelect(selectedTag);
                console.log('Tag selected:', selectedTag.label);
              }}
            />
          </Modal>


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
  margin-bottom: 40px;
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
  margin-bottom: 20px;
  position: relative;
  border: 1.5px solid #ededed;
  width:100%;
`;

const InputField = styled.input`
  width:100%;
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
  background: ${({ active }) => (active ? '#00aeff' : 'none')};
  color: ${({ active }) => (active ? '#fff' : '#222')};
  border: ${({ active }) => (active ? 'none' : '1px solid #858585')};
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
  height: 500px;
  border: none;
  border-radius: 16px;
//   margin-top: 1000px;
  background: #f5f5f5;
  font-size: 17px;
  padding: 18px 14px;
  margin: 50px 0 32px 0;
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
  background: ${({ gray }) => (gray ? '#e0e0e0' : '#3D3D3F')};
  color: ${({ gray }) => (gray ? '#888' : '#fff')};
  border: none;
  border-radius: 10px;
  padding: 14px 100px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

const AuthorActions = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
 right: 0%;
 top: 47%;
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

const ImageButton = styled.button`
  padding: 5px 12px;
  border:1px solid #858585;
  border-radius: 5px;
  background-color: white;
  border-radius: 16px;
    color: black;
  cursor: pointer;

    padding: 8px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
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
  top: 5px; /* 위쪽 간격을 줄여서 사진과 가까이 위치 */
  right: 400px; /* 오른쪽 간격을 줄여서 사진과 가까이 위치 */
  background: rgba(0, 0, 0, 0.5);
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
