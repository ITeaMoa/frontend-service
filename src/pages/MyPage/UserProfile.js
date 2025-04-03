import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEdit } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Dropdown from '../../components/DropDown';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';



const UserProfile = ({ userProfile, user, setIsProfileVisible }) => {

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

    const experiencesInputRef = useRef(null);
    const personalUrlInputRef = useRef(null);
    const headLineInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

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
    };

    const nickname = userProfile ? userProfile.nickname : '이름 없음';
    const avatarUrl = userProfile ? userProfile.avatarUrl : '기본 이미지 URL'; // 기본 이미지 URL로 변경
    const headLine = userProfile ? userProfile.headLine : '소개 없음';
    const email = userProfile ? userProfile.email : '이메일 없음';
  
  return (
    <ProfileContainer>
      <ProfileImageSection>
        <ProfileImage hasImage={!!userProfile.avatarUrl}>
          {userProfile.avatarUrl ? (
            <img src={encodeURI(userProfile.avatarUrl)} alt="Profile Avatar" />
          ) : (
            <FontAwesomeIcon icon={regularUser} size="50px" />
          )}
        </ProfileImage>
        {/* <h3>{user.nickname || '닉네임이 없습니다.'}</h3> */}
        <h2>{nickname}</h2>
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
              value={userProfile.password ? '********' : ''}
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
          placeholder={(userProfile.tags?.length ?? 0) > 0 ? userProfile.tags.join(', ') : "태그를 선택하시오"}
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
        <CloseButton onClick={() => setIsProfileVisible(false)}>회원탈퇴</CloseButton>
      </ProfileContent>
    </ProfileContainer>
  );
};



const ProfileContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 20px;
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

  h3{
    margin-top: 20px;
    font-weight: bold;
    color:black;
  }
`;

const ProfileContent = styled.div`  // background-color: #f9f9f9;
  padding: 20px;
  border-radius: 30px 30px 1px 30px;
  border: 3px solid #A0DAFB;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;

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

  &:hover {
    background-color: #a0dafb;
  }
`;

export default UserProfile; 