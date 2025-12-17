import React, { useEffect } from 'react';
import styled from 'styled-components';
import Modal from './Modal'; 
import Dropdown from './DropDown'; 
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api';
import { TECH_STACK_OPTIONS } from '../constants/techStackOptions';

const ProfileModal = ({ isOpen, onClose, userProfile, setUserProfile, selectedFile, setSelectedFile, userId }) => {

  const { user } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setSelectedFile(file); 
    }
  };

  const handleLabelClick = (fileInputRef) => {
    fileInputRef.current.click();
  };

  const fileInputRef = React.useRef(null); 


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user && user.id) {
          const userData = await getUserProfile(user.id);
          if (userData) {
            setUserProfile(userData);
          } else {
            setUserProfile({
              avatarUrl: '',
              headLine: '',
              tags: [],
              experiences: [],
              educations: [],
              personalUrl: ''
            });
          }
        }
      } catch (error) {
        console.error('사용자 프로필 조회 중 오류 발생:', error);
      }
    };


    fetchUserProfile();
  }, [isOpen, setUserProfile, userId]);

  const updateUserProfileData = async () => {
    const data = new FormData();


    if (selectedFile) {
      data.append('file', selectedFile);
    }


    const profileData = {
      pk: `USER#${user.id}`, 
      sk: "PROFILE#",
      entityType: "USER",
      timestamp: new Date().toISOString(), 
      avatarUrl: userProfile.avatarUrl ? userProfile.avatarUrl : null,
      headLine: userProfile.headLine || '',
      tags: Array.isArray(userProfile.tags)
        ? userProfile.tags.map(tag => (tag.value ? tag.value : tag))
        : [],
      educations: Array.isArray(userProfile.educations)
        ? userProfile.educations
        : [],

      personalUrl: Array.isArray(userProfile.personalUrl)
        ? userProfile.personalUrl
        : [],
      experiences: Array.isArray(userProfile.experiences)
        ? userProfile.experiences
        : []
    };

    data.append('profile', JSON.stringify(profileData));

    try {
      await updateUserProfile(user.id, data);
    } catch (error) {
      console.error('프로필 업데이트 에러:', error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfileData();
    onClose();
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
          ref={fileInputRef}
        />
        {selectedFile && <ImagePreview src={URL.createObjectURL(selectedFile)} alt="미리보기" />}
        <CustomButton type="button" onClick={() => handleLabelClick(fileInputRef)}>업로드</CustomButton>

        <Label>자기소개 <span>*</span></Label>
        <StyledTextArea
          name="headLine"
          placeholder=""
          value={userProfile.headLine || ''}
          onChange={handleInputChange}
          required
        />

        <Label>기술 스택 <span>*</span></Label>
        <Dropdown 
        options={TECH_STACK_OPTIONS} 
        value={(userProfile.tags ?? []).map(tag => ({ value: tag, label: tag }))}
        placeholder={
          (userProfile.tags?.length ?? 0) > 0
            ? userProfile.tags.map(tag =>
                typeof tag === 'string'
                  ? tag
                  : (tag.value || '')
              ).join(', ')
            : "태그를 선택하시오"
        }
        dropdownType="profile"
        onTagSelect={(selectedTags) => {
          const tagsArray = Array.isArray(selectedTags) ? selectedTags : [selectedTags];
          const newTags = tagsArray.map(tag => ({ value: tag.value, label: tag.label }));

          setUserProfile(prevState => ({
            ...prevState,
            tags: [
              ...((prevState?.tags ?? [])),
              ...newTags.filter(newTag => 
                newTag && !prevState?.tags?.some(existingTag => existingTag && existingTag.value === newTag.value)
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
          value={
            Array.isArray(userProfile.educations)
              ? userProfile.educations.join(', ')
              : userProfile.educations || ''
          }
          onChange={handleInputChange}
        />

        <Label>개인 링크</Label>
        <input
          type="text"
          name="personalUrl"
          placeholder=""
          value={userProfile.personalUrl || ''}
          onChange={handleInputChange}
        />

        <Label>수상 경력</Label>
        <input
          type="text"
          name="experiences"
          placeholder=""
          value={
            Array.isArray(userProfile.experiences)
              ? userProfile.experiences.join(', ')
              : typeof userProfile.experiences === 'string'
              ? userProfile.experiences
              : ''
          }
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
  resize: none;
  min-height: 100px;
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
  display: none;
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
    background-color: #0056b3;
  }
`;

const ImagePreview = styled.img`
  margin-top: 5px;
  max-width: 50%;
  height: auto;
  border-radius: 10px;
`;