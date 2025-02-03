import React, { useEffect } from 'react';
import styled from 'styled-components';
import Modal from './Modal'; // Assuming you have a Modal component
import Dropdown from './DropDown'; // Assuming you have a Dropdown component
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const ProfileModal = ({ isOpen, onClose, userProfile, setUserProfile, selectedFile, setSelectedFile, userId }) => {
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

  const { user } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // 첫 번째 파일만 선택
    if (file) {
      setSelectedFile(file); // 상태에 파일 저장
    }
  };

  const handleLabelClick = (fileInputRef) => {
    // 파일 입력 클릭
    fileInputRef.current.click();
  };

  const fileInputRef = React.useRef(null); // 파일 입력을 위한 ref

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/my/profile/${userId}`);
        console.log('사용자 프로필:', response.data); // 응답받은 데이터 콘솔에 출력
        if (response.data) { // 데이터가 있는 경우
          setUserProfile(response.data); // 응답받은 데이터로 상태 업데이트
          localStorage.setItem('userProfile', JSON.stringify(response.data)); // localStorage에 저장
        } else {
          // 데이터가 없을 경우, 기본값 설정 (필요에 따라 수정 가능)
          setUserProfile({
            avatarUrl: '',
            headLine: '',
            tags: [],
            experiences: [],
            educations: [],
            personalUrl: ''
          });
        }
      } catch (error) {
        console.error('사용자 프로필 조회 중 오류 발생:', error);
      }
    };

    fetchUserProfile(); // API 호출
  }, [isOpen, setUserProfile, userId]); // isOpen, setUserProfile, userId가 변경될 때마다 호출

  const updateUserProfile = async () => {
    const data = new FormData(); // 파일과 JSON 데이터를 함께 전송하기 위해서

    // 파일 추가
    if (selectedFile) {
      data.append('file', selectedFile); // 선택된 파일 추가
    }

    // 프로필 정보 추가
    console.log('현재 userProfile:', userProfile); // 현재 userProfile 상태를 콘솔에 출력
    const profileData = {
      avatarUrl: userProfile.avatarUrl || null, // avatarUrl 추가
      // tags: userProfile.tags.filter(tag => tag), // null 체크 추가
      tags: userProfile.tags && userProfile.tags.length > 0 ? userProfile.tags.filter(tag => tag && tag.value).map(tag => tag.value) : [],
      experiences: userProfile.experiences.length > 0 ? userProfile.experiences : [],
      headLine: userProfile.headLine,
      educations: userProfile.educations.length > 0 ? userProfile.educations : [],
      personalUrl: userProfile.personalUrl.length > 0 ? userProfile.personalUrl : []
    };

    data.append('profile', JSON.stringify(profileData)); // JSON 문자열로 추가

    // 전송할 데이터 콘솔에 출력
    console.log('전송할 데이터:', {
      file: selectedFile,
      profile: profileData
    });

    try {
      const response = await axios.put(`my/profile/${user.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Content-Type 설정
        }
      });
      console.log(response.data);

      // avatarUrl을 응답에서 가져와서 userProfile에 추가
      const avatarUrl = response.data.avatarUrl; // 응답에서 avatarUrl 가져오기
      setUserProfile(prevState => ({
        ...prevState,
        avatarUrl: avatarUrl // avatarUrl 업데이트
      }));

      // 프로필 정보를 localStorage에 저장
      localStorage.setItem('userProfile', JSON.stringify({
        ...profileData,
        avatarUrl: avatarUrl // avatarUrl 포함
      })); // 프로필 정보 저장

      // 성공적으로 프로필이 업데이트되었음을 알림
      alert("프로필이 성공적으로 업데이트되었습니다."); // 알림 추가
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(); // 프로필 업데이트 호출
    onClose(); // 모달 닫기
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalType="mypage">
      <StyledModalTitle>프로필 설정</StyledModalTitle>
      <StyledForm onSubmit={handleSubmit}>
        <Label>프로필 사진</Label>
        <FileInput 
          type="file" 
          name="avatar" 
          accept="image/*" 
          onChange={handleImageUpload}
          ref={fileInputRef} // 참조 연결
        />
        {selectedFile && <ImagePreview src={URL.createObjectURL(selectedFile)} alt="미리보기" />}
        <CustomButton type="button" onClick={() => handleLabelClick(fileInputRef)}>업로드</CustomButton>

        <Label>자기소개 <span>*</span></Label>
        <StyledTextArea name="headLine" placeholder="" value={userProfile.headLine || ''} onChange={handleInputChange} required />

        <Label>기술 스택 <span>*</span></Label>
        <Dropdown 
          options={option3} 
          value={userProfile.tags?.map(tag => ({ value: tag, label: tag })) || []}
          placeholder={userProfile.tags?.length > 0 ? userProfile.tags.join(', ') : "태그를 선택하시오"}
          dropdownType="main"
          onTagSelect={(selectedTags) => {
            console.log('선택된 태그:', selectedTags); // 선택된 태그를 콘솔에 출력
            const tagsArray = Array.isArray(selectedTags) ? selectedTags : [selectedTags];
            const newTags = tagsArray.map(tag => ({ value: tag.value, label: tag.label }));

            setUserProfile(prevState => ({
              ...prevState,
              tags: [
                ...prevState.tags,
                ...newTags.filter(newTag => 
                  newTag && !prevState.tags.some(existingTag => existingTag && existingTag.value === newTag.value)
                )
              ]
            }));
          }}
        />

        <Label>학교/전공</Label>
        <input 
          type="text" 
          name="educations" 
          placeholder="" 
          value={userProfile.educations?.join(', ') || ''}
          onChange={handleInputChange} 
        />

        <Label>개인 링크</Label>
        <input 
          type="text" 
          name="personalUrl" 
          placeholder="" 
          value={userProfile.personalUrl?.join(', ') || ''}
          onChange={handleInputChange} 
        />

        <Label>수상 경력</Label>
        <input 
          type="text" 
          name="experiences" 
          placeholder="" 
          value={userProfile.experiences?.join(', ') || ''}
          onChange={handleInputChange} 
        />

        <StyledButton type="submit">제출</StyledButton>
      </StyledForm>
    </Modal>
  );
};

export default ProfileModal;

// Styled components
const StyledModalTitle = styled.h2`
  font-size: 24px;
  color: #1489CE;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; 
  padding: 10px;
  border: none;
  text-align: left;

  input {
    border: none;
    outline: none; 
    border-bottom: 2px solid #A2D8F5; 
  }
`;

const Label = styled.label`
  display: inline-block;
  font-weight: bold; 
  margin-top: -10px;
  color: #1489CE;
`;

const StyledTextArea = styled.textarea`
  border: none;
  outline: none; 
  border-bottom: 2px solid #A2D8F5; 
  resize: none; // 크기 조절 비활성화
  min-height: 100px; // 최소 높이 설정
`;

const StyledButton = styled.button`
  background-color: #62B9EC;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #A0DAFB;
  }
`;

const FileInput = styled.input`
  display: none; // 기본 파일 입력 숨기기
`;

const CustomButton = styled.label`
  text-align: center;
  background-color: #62B9EC; 
  color: white; 
  font-weight: bold;
  padding: 10px;
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  font-size: 12px; 
  transition: background-color 0.3s; 
  width: 20%;

  &:hover {
    background-color: #0056b3; // 호버 시 배경색 변화
  }
`;

const ImagePreview = styled.img`
  margin-top: 5px;
  max-width: 50%; // 최대 너비 100%로 설정
  height: auto; // 비율 유지
  border-radius: 10px; // 모서리 둥글게
`;
