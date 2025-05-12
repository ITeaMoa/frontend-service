import styled, { css, createGlobalStyle } from "styled-components";
// import { palette } from "./Palette";
// import { Body1, Body2, Body3 } from "./Typography";
// import images from "./Images";
// import { Caption2 } from "./Typography";

export const ContentsWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  gap: ${(props) => (props.isMobile ? "20px" : "40px")};
  padding: ${(props) => (props.isMobile ? "20px" : "0 4px 0 0")};
  min-height: 100vh;
  // overflow: ${({ noScroll }) => (noScroll ? "hidden" : "auto")};
`;

export const ContentSection = styled.div`
  display: flex;
  flex-direction: ${(props) => {
    if (props.row) return `row`;
    else return `column`;
  }};
  // gap: 32px;
  gap: ${(props) => {
    if (props.row) return `16px`;
    else return `32px`;
  }};
  width: 100%;
`;

export const MainContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${(props) =>
    props.Wide
      ? "1024px"
      : props.Wide1030
      ? "1030px"
      : props.Wide1240
      ? "1240px"
      : "820px"};
  // max-width: 1024px;
  // min-height: 100vh;
  width: 100%;
  justify-content: flex-start;
  padding: 57px 0 40px;
  margin: 0 auto;
  // padding: ${(props) => (props.isMobile ? "0" : "0 20px")};
`;

export const AnalysisWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  gap: 16px;
  margin-top: 44px;
  overflow: visible;
`;

export const MainSection = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

