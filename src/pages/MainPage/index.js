import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import Section1 from "./Section1";
import Section2 from "./Section2";
import {useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../components/Modal';



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
      name: userProfile.name,
      headline: userProfile.headline,
      tags: userProfile.tags.length > 0 ? userProfile.tags : [],
      experiences: userProfile.experiences.length > 0 ? userProfile.experiences : [],
      avatarUrl: userProfile.avatarUrl,
      headLine: userProfile.headLine,
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
            <Label>
              name
            </Label>
            <input type="text" name="name" placeholder="" onChange={handleInputChange} />
            
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
            <input type="text" name="tags" placeholder="" onChange={handleInputChange} required />
            
            <Label>
              수상 경력
            </Label>
            <input type="text" name="experiences" placeholder="" onChange={handleInputChange} />
            
            <Label>
              학교/전공
            </Label>
            <input type="text" name="educations" placeholder="" onChange={handleInputChange} />
            
            <Label>
              개인 링크
            </Label>
            <input type="text" name="personalUrl" placeholder="" onChange={handleInputChange} />
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
  margin-bottom: 5px; 
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


