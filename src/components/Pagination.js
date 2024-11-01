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
    background-color: transparent; 
    color: #495057; 

    &:hover {
      background-color: transparent; 
      color: #3563E9; 
    }
  }

  & .Mui-selected {
    background-color: transparent; 
    color: #3563E9;
  }
`;
