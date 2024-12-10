import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import Section1 from "./Section1";
import Section2 from "./Section2";
import {useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../components/Modal';
import Dropdown from '../../components/DropDown'



const MainPage = () => {
  const navigate = useNavigate();
  const showSearch = true;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  //URL이 http://example.com/?showModal=true라면 location.search는 "?showModal=true"가 됨
  const showModal = query.get('showModal') === 'true'; // 쿼리 파라미터 확인
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // 모달 상태 추가
  const [userProfile, setUserProfile] = useState({
    name: "",
    headline: "",
    tags: [],
    experiences: [],
    avatarUrl: "",
    headLine: "",
    educations: [],
    personalUrl: []
  });

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
  

  const handleAddButtonClick = () => {
      navigate('/WritePage'); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const updateUserProfile = async () => {
    const data = {
      // name: userProfile.name,
      headline: userProfile.headline,
      tags: userProfile.tags.length > 0 ? userProfile.tags : [],
      experiences: userProfile.experiences.length > 0 ? userProfile.experiences : [],
      avatarUrl: userProfile.avatarUrl,
      educations: userProfile.educations.length > 0 ? userProfile.educations : [],
      personalUrl: userProfile.personalUrl.length > 0 ? userProfile.personalUrl : []
    };

    try {
      const response = await axios.put('http://localhost:8080/profile/1234', data, {
        headers: {
          'Authorization': 'API Key' // Replace with your actual API key
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsRoleModalOpen(false);
    updateUserProfile(); // Call the update function when modal closes
  };

  useEffect(() => {
    // URL 쿼리 파라미터를 확인하여 모달 상태 업데이트
    const query = new URLSearchParams(location.search);
    const showModal = query.get('showModal') === 'true';
    setIsRoleModalOpen(showModal);
  }, [location.search]); // location.search가 변경될 때마다 실행

  return (
    <>
    <Nav showSearch={showSearch} /> 
    <MainWrapper>
      <Section1/>
      <Section2/>
      {showModal && (
        <Modal isOpen={isRoleModalOpen} onClose={handleModalClose} modalType="mypage">
          <StyledModalTitle>프로필 설정</StyledModalTitle>
          <StyledForm onSubmit={(e) => { e.preventDefault(); updateUserProfile(); }}>
            {/* <Label>
              name
            </Label>
            <input type="text" name="name" placeholder="" onChange={handleInputChange} /> */}
            
            <Label>
              E-mail
            </Label>
            <input type="email" name="headline" placeholder="" onChange={handleInputChange} />
            
            <Label>
              자기소개 <span>*</span>
            </Label>
            <StyledTextArea name="headLine" placeholder="" onChange={handleInputChange} required />
            
            <Label>
              기술 스택 <span>*</span>
            </Label>
            <Dropdown 
                options={option3} 
                placeholder={"태그를 선택하시오"}
                dropdownType = 'main'
                onTagSelect={(selectedTags) => setUserProfile(prevState => ({
                  ...prevState,
                  tags: selectedTags 
                }))}
              
            />
            
        
            <Label>
              학교/전공
            </Label>
            <input type="text" name="educations" placeholder="" onChange={handleInputChange} />
            
            <Label>
              개인 링크
            </Label>
            <input type="text" name="personalUrl" placeholder="" onChange={handleInputChange} />

            <Label>
              수상 경력
            </Label>
            <input type="text" name="experiences" placeholder="" onChange={handleInputChange} />
            
            <StyledButton type="submit">제출</StyledButton>
          </StyledForm>
        </Modal>
      )}

    <AddButton onClick={handleAddButtonClick}> 피드 작성하기 </AddButton>
    </MainWrapper>
    </>
  );
}

export default MainPage;

const MainWrapper = styled.div`
 margin-top: 35vh;
 min-height: calc(100vh - 250px);
 display: flex;
 flex-direction: column;
 align-items: center;
 
`;


const AddButton = styled.div`
position: fixed;
right:5%;
top: calc(100% - 100px);
border: 1px solid #ddd;
border-radius: 30px 30px 1px 30px; //반시계 방향
padding: 10px 15px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
background-color:#62B9EC;
color: white;
font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #A0DAFB;
  }
  
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
  // flex-direction: column;
  font-weight: bold; 
  // margin-bottom: 5px; 
  margin-top:-10px;
  color: #1489CE;
  
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

const StyledModalTitle = styled.h2`
  font-size: 24px;
  color: #1489CE;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledTextArea = styled.textarea`
  border: none;
  outline: none; 
  border-bottom: 2px solid #A2D8F5; 
  resize: vertical;
  // min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
`;


