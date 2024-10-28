import React from 'react';
import MuiPagination from '@mui/material/Pagination'; 
import styled from 'styled-components';

const Pagination = ({ currentPage, totalProjects, projectsPerPage, onPageChange}) => {
  const pageCount = Math.ceil(totalProjects / projectsPerPage);

  return (
    <StyledPagination
      count={pageCount}
      page={currentPage}
      onChange={(event, value) => onPageChange(value)} 

    />
  );
};

export default Pagination;


const StyledPagination = styled(MuiPagination)`
  & .MuiPaginationItem-root {
    margin: 40px 5px;
    background-color: transparent; // 배경색을 투명으로 설정
    color: #495057; // 기본 숫자 색상

    &:hover {
      background-color: transparent; // 호버 시 배경색도 투명하게
      color: #3563E9; // 호버 시 숫자 색상
    }
  }

  & .Mui-selected {
    background-color: transparent; // 선택된 버튼의 배경색을 투명으로 설정
    color: #3563E9; // 선택된 숫자 색상
  }
`;
