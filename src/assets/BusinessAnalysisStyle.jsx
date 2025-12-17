import styled from "styled-components";

export const ContentsWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  gap: ${(props) => (props.isMobile ? "20px" : "40px")};
  padding: ${(props) => (props.isMobile ? "20px" : "0 4px 0 0")};
  min-height: 100vh;
`;

export const ContentSection = styled.div`
  display: flex;
  flex-direction: ${(props) => {
    if (props.row) return `row`;
    else return `column`;
  }};
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
  width: 100%;
  justify-content: flex-start;
  padding: 57px 0 40px;
  margin: 0 auto;
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

