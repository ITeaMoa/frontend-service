import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Dropdown from '../../components/DropDown';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import axios from '../../api/axios';
import Modal from '../../components/Modal';
import { useAtom } from 'jotai';
import { USER_PROFILE } from '../../Atoms.jsx/AtomStates';
import { useAuth } from '../../context/AuthContext'; // AuthContext에서 useAuth 가져오기



const UserProfile = ({  setIsProfileVisible, setShowAlertPopup}) => {

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
    const [showImageEdit, setShowImageEdit] = useState(false);
    const fileInputRef = useRef();
    const [isEditingPassword, setIsEditingPassword] = useState(false);

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


    // useEffect(() => {
    //   const fetchUserProfile = async () => {
    //     try {
    //       if (user && user.id) {
    //         const response = await axios.get(`/my/profile/${user.id}`);
    //         console.log('사용자 프로필:', response.data);
    //         if (response.data) {
    //           setUserProfile(response.data);
              
    //         } else {
    //           setUserProfile({
    //             avatarUrl: '',
    //             headLine: '',
    //             tags: [],
    //             experiences: [],
    //             educations: [],
    //             personalUrl: '',
    //             nickname: ''  
    //           });
          
    //         }
    //       }
    //     } catch (error) {
    //       console.error('사용자 프로필 조회 중 오류 발생:', error);
    //     }
    //   }
  
    //   fetchUserProfile(); // 사용자 정보가 있을 때 프로필을 가져옴
    // }, [user]); // user가 변경될 때마다 실행

    // useEffect(() => {
//   const fetchUserProfile = async () => {
//       try {
//           if (user && user.id) {
//               // MainPage와 동일한 형식으로 API 호출
//               const response = await axios.get(`/my/profile/${user.id}`);
//               console.log('사용자 프로필:', response.data);
//               if (response.data) {
//                   setUserProfile(response.data);
//               } else {
//                   setUserProfile({
//                       avatarUrl: '',
//                       headLine: '',
//                       tags: [],
//                       experiences: [],
//                       educations: [],
//                       personalUrl: ''
//                   });
//               }
//           }
//       } catch (error) {
//           console.error('사용자 프로필 조회 중 오류 발생:', error);
//       }
//   };

//   fetchUserProfile();
// }, [user]);

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      console.log('사용자 프로필 조회 시작' , user.id);
      if (user && user.id) {
        const response = await axios.get(`/my/profile/${user.id}`);
        console.log('사용자 프로필:', response.data);
        if (response.data) {
          setUserProfile(response.data);
       
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

  fetchUserProfile(); // 사용자 정보가 있을 때 프로필을 가져옴
}, [user]); // user가 변경될 때마다 실행

    const handleEdit = (field) => {
        // Implement your editing logic here
        console.log(`Editing ${field}`);
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
            setIsEditingPassword(true);
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

    // const submitProfile = async () => {
    //     try {
    //         const response = await axios.put(`/my/profile/update/${user.id}`, userProfile);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('프로필 업데이트 오류:', error);
    //     }
    // };
    const updateUserProfile = async () => {
      const data = new FormData();
  
      // 파일이 선택된 경우에만 'file' 필드 추가 (파일이 없는 경우엔 추가하지 않음)
      if (selectedFile) {
        data.append('file', selectedFile);
      }
  
      // 백엔드가 요구하는 구조로 프로필 데이터를 구성합니다.
      const profileData = {
        // pk: `USER#${user.id}`, // 사용자 id를 이용하여 pk 구성
        sk: "PROFILE#",
        entityType: "USER",
        timestamp: new Date().toISOString(), // 현재 시간을 ISO 형식으로
        avatarUrl: userProfile.avatarUrl ? userProfile.avatarUrl : null,
        headLine: userProfile.headLine || '',
        tags: Array.isArray(userProfile.tags)
          ? userProfile.tags.map(tag => (tag.value ? tag.value : tag))
          : [],
        educations: Array.isArray(userProfile.educations)
          ? userProfile.educations
          : [],
        // personalUrl는 배열 형태로 처리 (기본값은 빈 배열)
        personalUrl: Array.isArray(userProfile.personalUrl)
          ? userProfile.personalUrl
          : [],
        experiences: Array.isArray(userProfile.experiences)
          ? userProfile.experiences
          : []
      };
  
      // JSON 문자열로 변환 후 FormData에 프로필 데이터를 추가합니다.
      data.append('profile', JSON.stringify(profileData));
  
      console.log('전송할 데이터:', {
        file: selectedFile,
        profile: profileData
      });
  
      try {
        const response = await axios.put(`my/profile/${user.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('사용자 프로필 업데이트 응답:', response.data);
        // setShowAlertPopup(true);
      } catch (error) {
        console.error('프로필 업데이트 에러:', error.response?.data || error.message);
      }
    };
    
    const handleDeleteUser = async () => {
        try {
            const response = await axios.put(`/my/profile/withdraw/${user}`);
            console.log(response.data);
            setIsProfileVisible(false);
        } catch (error) {
            console.error('회원탈퇴 오류:', error);
        }
    };

    const nickname = userProfile ? userProfile.nickname : '이름 없음';
    const avatarUrl = userProfile ? userProfile.avatarUrl : '기본 이미지 URL'; // 기본 이미지 URL로 변경
    const headLine = userProfile ? userProfile.headLine : '소개 없음';
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
        {/* <ProfileImage hasImage={!!userProfile.avatarUrl}>
          {userProfile.avatarUrl ? (
            <img src={encodeURI(userProfile.avatarUrl)} alt="Profile Avatar" />
          ) : (
            <FontAwesomeIcon icon={regularUser} size="50px" />
          )}
        </ProfileImage> */}
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
        {/* <EditImageButton onClick={() => handleEdit('nickname')}>사진 편집</EditImageButton> */}
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
        {/* <h3>{user.nickname || '닉네임이 없습니다.'}</h3> */}
        {/* <h2>{nickname || '닉네임이 없습니다.'} <FontAwesomeIcon color='#1489CE' icon={faEdit} onClick={() => handleEdit('nickname')} /></h2> */}
      </ProfileImageSection>
      <ProfileContent>
        <h2>프로필 설정</h2>
        <ProfileField>
          <ProfileTitle>
            <Label>Phone</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('phone')} />
          </ProfileTitle>
          <p>{userProfile.phone || '정보가 없습니다.'}</p>
        </ProfileField>
        <ProfileField>
          <ProfileTitle>
            <Label>E-mail</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('email')} />
          </ProfileTitle>
          {/* <p>{user.email || '정보가 없습니다.'}</p> */}
          <p>Email: {email}</p>
        </ProfileField>
        <ProfileField>
          <ProfileTitle>
            <Label>Password</Label> 
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit('password')} />
          </ProfileTitle>
          {isEditingPassword ? (
            <input 
              ref={passwordInputRef}
              type="password"
              value={userProfile.password || ''}
              onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value })}
              placeholder="********"
            />
          ) : (
            <p>********</p>
          )}
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

          options={option3} 
          value={(userProfile.tags ?? []).map(tag => ({ value: tag, label: tag }))}
          // placeholder={(userProfile.tags?.length ?? 0) > 0 ? userProfile.tags.join(', ') : "태그를 선택하시오"}
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
            console.log('선택된 태그:', selectedTags);
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
        <EditButton onClick={updateUserProfile}>변경사항 저장</EditButton>
        {/* <CloseButton onClick={() => setPopupMessage(true)}>회원탈퇴</CloseButton> */}
         
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
  min-height: 400px;   // 최소 높이만 지정 (원하는 값으로)
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
  // align-self: flex-start;  // 왼쪽 정렬
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

const EditButton = styled.button`
  background-color: #3563E9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;  
  // position: absolute;
  align-self: flex-end; 
  margin-top: 24px;  
  

  &:hover {
    background-color: #a0dafb;
  }
`;

const EditImageButton = styled.button`

  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: transparent;
`;




const NicknameInput = styled.input`
  font-size: 1.2em;
  padding: 8px 16px;
  border: none;
  border-bottom: 2px solid #62b9ec;
  outline: none;
  margin: 8px 0;
  background: #f8fafd;
  color: #222;
  transition: border-color 0.2s;
  width: 60%;
  font-size: 20px;
  margin-left: 30px;

  &:focus {
    border-color: #1976d2;
    background: #fff;
  }

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;


export default UserProfile; 