import React from 'react';
import styled from 'styled-components';

const MainCarousel = ({ currentSlide, setCurrentSlide, slideCount }) => (
  <CarouselWrapper>
    <CarouselSection $currentSlide={currentSlide}>
      <CarouselItem>
        <CarouselContent purple style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
          <ArrowButtonLeft
            onClick={() => setCurrentSlide((prev) => prev > 0 ? prev - 1 : slideCount - 1)}
            aria-label="이전"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M13 16L8 10L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ArrowButtonLeft>
          
          <img
            src="/images/ad 1.svg"
            alt="광고 이미지"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '28px' }}
          />

          <ArrowButtonRight
            onClick={() => setCurrentSlide((prev) => prev < slideCount - 1 ? prev + 1 : 0)}
            aria-label="다음"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L12 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ArrowButtonRight>
          
          <SlideIndicator>
            {String(currentSlide + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
          </SlideIndicator>
        </CarouselContent>
      </CarouselItem>

      <CarouselItem>
        <CarouselContent primary style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
          <ArrowButtonLeft
            onClick={() => setCurrentSlide((prev) => prev > 0 ? prev - 1 : slideCount - 1)}
            aria-label="이전"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M13 16L8 10L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ArrowButtonLeft>
          <img
            src="/images/ad 2.svg"
            alt="광고 이미지2"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '28px' }}
          />
          <ArrowButtonRight
            onClick={() => setCurrentSlide((prev) => prev < slideCount - 1 ? prev + 1 : 0)}
            aria-label="다음"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L12 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ArrowButtonRight>
          <SlideIndicator>
            {String(currentSlide + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
          </SlideIndicator>
        </CarouselContent>
      </CarouselItem>

      <CarouselItem>
        <CarouselContent blue style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
          <ArrowButtonLeft
            onClick={() => setCurrentSlide((prev) => prev > 0 ? prev - 1 : slideCount - 1)}
            aria-label="이전"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M13 16L8 10L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ArrowButtonLeft>
          <img
            src="/images/ad 3.svg"
            alt="광고 이미지3"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '28px' }}
          />
          <ArrowButtonRight
            onClick={() => setCurrentSlide((prev) => prev < slideCount - 1 ? prev + 1 : 0)}
            aria-label="다음"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L12 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ArrowButtonRight>
          <SlideIndicator>
            {String(currentSlide + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
          </SlideIndicator>
        </CarouselContent>
      </CarouselItem>
    </CarouselSection>
  </CarouselWrapper>
);

export default MainCarousel;

// --- 스타일 컴포넌트 복사 ---
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  // max-width: 1200px;
  margin: 0 auto 32px auto;
`;

const CarouselSection = styled.section`
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-${props => props.$currentSlide * 100}%);
  width: 100%;
`;

const CarouselItem = styled.div`
  flex: 0 0 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`;

const CarouselContent = styled.div`
  position: relative;
  border-radius: 28px;
  padding: 40px;
  height: 100%;
  width: 100%;
  background-color: ${props => props.purple ? '#662CC2' : props.blue ? '#00AEFF' : '#1A1A1A'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CarouselTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1;
`;

const CarouselSubtitle = styled.h3`
  font-size: 30px;
  font-weight: 300;
  color: white;
  margin: 0;
`;

const CarouselTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const CarouselImage = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
`;

const CtaButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 20px;
  border-radius: 100px;
  padding: 16px 36px;
  font-size: 20px;
  font-weight: 600;
  background-color: ${props => props.blue ? '#00AEFF' : props.white ? '#FFFFFF' : '#FFFFFF'};
  color: ${props => props.white ? '#00AEFF' : props.blue ? '#FFFFFF' : '#662CC2'};
  border: none;
  cursor: pointer;
  z-index: 1;
`;

const SlideIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(109, 109, 109, 0.5);
  border-radius: 50px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const ArrowButtonLeft = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.15s;
  &:hover {
    background: #eaf6ff;
    color: #00aeff;
  }
`;

const ArrowButtonRight = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.15s;
  &:hover {
    background: #eaf6ff;
    color: #00aeff;
  }
`; 