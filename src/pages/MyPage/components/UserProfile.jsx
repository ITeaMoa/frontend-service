import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Dropdown from '../../../components/DropDown';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import Modal from '../../../components/Modal';
import { useAtom } from 'jotai';
import { USER_PROFILE } from '../../../Atoms.jsx/AtomStates';
import { useAuth } from '../../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../../api';
import { TECH_STACK_OPTIONS } from '../../../constants/techStackOptions';

const UserProfile = ({  setIsProfileVisible}) => {

    const [popupMessage, setPopupMessage] = useState(false);
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); 
    const [userProfile, setUserProfile] = useAtom(USER_PROFILE);
    const { user } = useAuth();
    const experiencesInputRef = useRef(null);
    const personalUrlInputRef = useRef(null);
    const headLineInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const nicknameInputRef = useRef(null);
    const fileInputRef = useRef();
    const [newTags, setNewTags] = useState([]);

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
  }

  fetchUserProfile();
  // eslint-disable-next-line
}, [user]); 

    const handleEdit = (field) => {
  
        if (field === 'experiences') {
            experiencesInputRef.current.focus();
        }
        if (field === 'personalUrl') {
            personalUrlInputRef.current.focus();
        }
        if (field === 'headLine') {
            headLineInputRef.current.focus();
        }
        if (field === 'password') {
         
            if (passwordInputRef.current) {
                passwordInputRef.current.focus();
            }
        }
        if (field === 'nickname') {
            nicknameInputRef.current.focus();
        }
        if (field === 'image') {
            fileInputRef.current.click();
        }
    };


    const updateProfile = async () => {
      const data = new FormData();

  
      if (selectedFile) {
        data.append('file', selectedFile);
      }
  
      const profileData = {

        sk: "PROFILE#",
        entityType: "USER",
        timestamp: new Date().toISOString(), 
        avatarUrl: userProfile.avatarUrl ? userProfile.avatarUrl : null,
        headLine: userProfile.headLine || '',
        tags: newTags.tags ? newTags.tags.map(tag => {
          if (typeof tag === 'string') {
            return tag;
          }
          return tag.value || tag;
        }) : [],
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
    
    const handleDeleteUser = async () => {
        try {
             // Note: This would need a separate API function for user deletion
             // For now, keeping the direct axios call commented out
             // await axios.put(`/my/profile/withdraw/${user}`);
  
            setIsProfileVisible(false);
        } catch (error) {
            console.error('회원탈퇴 오류:', error);
        }
    };

    const nickname = userProfile ? userProfile.nickname : '이름 없음';
    const email = userProfile ? userProfile.email : '이메일 없음';


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const imagePreviewUrl = selectedFile
  ? URL.createObjectURL(selectedFile)
  : userProfile.avatarUrl
    ? encodeURI(userProfile.avatarUrl)
    : null;

  return (
    <ProfileContainer>
      <ProfileImageSection>
      <ProfileImage hasImage={!!imagePreviewUrl}>
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Profile Avatar" />
          ) : (
            <FontAwesomeIcon icon={regularUser} size="50px" />
          )}
        </ProfileImage>
  
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
        <EditImageButton onClick={() => fileInputRef.current && fileInputRef.current.click()}>
        사진 편집
      </EditImageButton>
    <h2>
        {isEditingNickname ? (
          <NicknameInput
          type="text"
          value={nickname}
          onChange={e => setUserProfile({ ...userProfile, nickname: e.target.value })}
          placeholder={userProfile.nickname || '닉네임이 없습니다.'}
        />
        ) : (
          <>
            {user.nickname || '닉네임이 없습니다.'}
            <FontAwesomeIcon
              color="#1489CE"
              icon={faEdit}
              style={{ marginLeft: 8, cursor: 'pointer' }}
              onClick={() => setIsEditingNickname(true)}
            />
          </>
        )}
      </h2>
      </ProfileImageSection>
      <ProfileContent>
        <h2>내 프로필</h2>
        <ProfileField>
          <ProfileTitle>
            <Label>이메일</Label>
          </ProfileTitle>
          <div>{email}</div>
        </ProfileField>
        <ProfileField>
          <ProfileTitle>
            <Label>닉네임</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('nickname')} />
          </ProfileTitle>
          <input 
            ref={nicknameInputRef}
            type="text" 
            value={userProfile.nickname || ''} 
            onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })} 
            placeholder="닉네임을 입력하세요" 
          />
        </ProfileField>
        <ProfileField>
          <ProfileTitle>
            <Label>자기소개</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('headLine')} />
          </ProfileTitle>
          <input 
            ref={headLineInputRef}
            type="text" 
            value={userProfile.headLine || ''} 
            onChange={(e) => setUserProfile({ ...userProfile, headLine: e.target.value })} 
            placeholder="자기소개를 입력하세요" 
          />
        </ProfileField>
        <ProfileField>
          <ProfileTitle>
            <Label>기술 스택</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('tags')} />
          </ProfileTitle>

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

            setNewTags(prevState => ({
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
        </ProfileField>
        <ProfileField>
          <ProfileTitle>
            <Label>학교/전공</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('experiences')} />
          </ProfileTitle>
          <input 
            ref={experiencesInputRef}
            type="text" 
            value={userProfile.experiences ? userProfile.experiences.join(', ') : ''} 
            onChange={(e) => setUserProfile({ ...userProfile, experiences: e.target.value.split(',').map(exp => exp.trim()) })} 
            placeholder="학교/전공을 입력하세요" 
          />
        </ProfileField>
        <ProfileField>
          <ProfileTitle>
            <Label>개인 링크</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('personalUrl')} />
          </ProfileTitle>
          <input 
            ref={personalUrlInputRef}
            type="text" 
            value={userProfile.personalUrl || ''} 
            onChange={(e) => setUserProfile({ ...userProfile, personalUrl: e.target.value })} 
            placeholder="개인 링크를 입력하세요" 
          />
        </ProfileField>
        <EditButton onClick={updateProfile}>변경사항 저장</EditButton>
         
        <CloseButton onClick={() => setPopupMessage(true)}>회원탈퇴</CloseButton>
      </ProfileContent>
  
     
      {popupMessage && (
    <Modal
      isOpen={!!popupMessage}
      onClose={() => setPopupMessage('')}
    >
     <h3 style={{ textAlign: 'center' }}>정말로 회원탈퇴 하시겠습니까?</h3>
        <ButtonContainer>
          <ModalButton onClick={handleDeleteUser}>확인</ModalButton>
          <ModalButton onClick={() => setPopupMessage('')}>취소</ModalButton>
        </ButtonContainer>
    </Modal>
  )}
    </ProfileContainer>
    
  );
  
};



const ProfileContainer = styled.div`
  display: flex;
  align-items: flex-start;
  // margin: 20px;

`;

const ProfileImage = styled.div`
  border: 1px solid gray;
  opacity: ${props => props.hasImage ? 1 : 0.3};
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;


  margin-right: 40px;

  h2{
    margin-top: 20px;
    font-weight: bold;
    color:black;
  }
`;

const ProfileContent = styled.div`  // background-color: #f9f9f9;
  position: relative;
    display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 30px 30px 1px 30px;
  border: 3px solid #A0DAFB;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
    overflow-y: visible;
  // overflow-y: hidden;
  // min-width: 400px;
  min-height: 400px;
  height: auto;  
  h2{
    text-align: center;
    color: #1489CE;
    font-weight: bold;
  }
`;

const ProfileField = styled.div`
  margin-bottom: 15px;
  min-height: 50px;
  border-bottom: 1px solid #A0DAFB;

  input {
    border: none;
    outline: none; 
   
  }
`;

const ProfileTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1489CE;
`;

const Label = styled.label`
  font-weight: bold;
  color: #1489CE;
`;

const CloseButton = styled.button`
  background-color: grey;
  opacity: 0.5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  // position: absolute;
  // right: 400px;  
  // top: 720px;
    align-self: flex-start;  


  &:hover {
    background-color: #a0dafb;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1565c0;
  }
`;

const NicknameInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
  width: 200px;
`;

const EditButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 20px;

  &:hover {
    background-color: #1565c0;
  }
`;

const EditImageButton = styled.button`
  margin-top: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #1565c0;
  }
`;

const InputField = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
  width: 100%;
`;

export default UserProfile;