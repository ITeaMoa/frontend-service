import React, { useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import Section1 from "./Section1";
import Section2 from "./Section2";
import {useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Modal from '../../components/Modal';
import Dropdown from '../../components/DropDown'
import axios from '../../api/axios'
// import { useAuth } from '../../context/AuthContext'



const MainPage = () => {
  const navigate = useNavigate();
  const showSearch = true;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  //URL이 http://example.com/?showModal=true라면 location.search는 "?showModal=true"가 됨
  const showModal = query.get('showModal') === 'true'; // 쿼리 파라미터 확인
  // const { user } = useAuth(); // 로그인한 사용자 정보 가져오기
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // 모달 상태 추가
  const fileInputRef = useRef(null); // 파일 입력을 위한 ref
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태
  const { nickname } = location.state || {}; // 닉네임 받기
  const [userProfile, setUserProfile] = useState({

    tags: [],
    experiences: [],
    avatarUrl: null,
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


 

  const updateUserProfile = async () => {
    const data = new FormData();// 파일과 JSON 데이터를 함께 전송하기 위해서
    // if (!user) {
    //   console.error("User object is null or undefined");
    //   return; // 또는 적절한 오류 처리
    // }

    // 닉네임이 있는지 확인
    if (!nickname) {
      console.error("Nickname is required");
      alert("회원가입 및 로그인해주세요");
      return; // 닉네임이 없으면 종료
  }

        // 파일 추가
        if (selectedFile) {
          data.append('file', selectedFile); // 선택된 파일 추가
      }


    // 파일 추가 (여기서는 avatarUrl이 파일 경로라고 가정)
    const avatarFile = userProfile.avatarUrl; // 여기서 avatarUrl은 파일의 Blob 또는 File 객체여야 합니다.
    if (avatarFile) {
        data.append('file', avatarFile); // 파일 추가
    }

    // 프로필 정보 추가
    const profileData = {
        tags: userProfile.tags.length > 0 ? userProfile.tags : [],
        experiences: userProfile.experiences.length > 0 ? userProfile.experiences : [],
        headLine: userProfile.headline,
        educations: userProfile.educations.length > 0 ? userProfile.educations : [],
        personalUrl: userProfile.personalUrl.length > 0 ? userProfile.personalUrl : []
    };

    data.append('profile', JSON.stringify(profileData)); // JSON 문자열로 추가

    try {
        const response = await axios.put(`my/profile/${nickname}`, data, {
            headers: {
                ...data.getHeaders() // FormData의 헤더 추가
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

  


const handleInputChange = (event) => {
  const { name, value } = event.target;
  setUserProfile(prevState => ({
      ...prevState,
      [name]: value
  }));
};



const handleLabelClick = () => {
  // 파일 입력 클릭
  fileInputRef.current.click();
};

//다중파일
// const handleImageUpload = (e) => {
//   const files = Array.from(e.target.files);
//   setImages(prevImages => [...prevImages, ...files]);
// };

//단일 파일
const handleImageUpload = (e) => {
  const file = e.target.files[0]; // 첫 번째 파일만 선택
  if (file) {
      setSelectedFile(file); // 상태에 파일 저장
  }
};




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
                프로필 사진
            </Label>
            <FileInput 
                type="file" 
                name="avatar" 
                accept="image/*" 
                // onChange={handleFileChange} 
                onChange={handleImageUpload}
                ref={fileInputRef} // 참조 연결
            />
            {selectedFile && <ImagePreview src={URL.createObjectURL(selectedFile)} alt="미리보기" />}
            <CustomButton type="button"onClick={handleLabelClick}>업로드</CustomButton>

            
            
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
                dropdownType = "main"
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


const FileInput = styled.input`
    display: none; // 기본 파일 입력 숨기기
`;

const CustomButton = styled.label`
    text-align: center;
    background-color:  #62B9EC; 
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


