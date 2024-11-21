import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Nav from "../../components/Nav";
import Section1 from "./Section1";
import Section2 from "./Section2";
import {useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';



const MainPage = () => {
  const navigate = useNavigate();
  const showSearch = true;

  const handleAddButtonClick = () => {
      navigate('/WritePage'); 
  };


  return (
    <>
    <Nav showSearch={showSearch} /> 
    <MainWrapper>
      <Section1/>
      <Section2/>

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


