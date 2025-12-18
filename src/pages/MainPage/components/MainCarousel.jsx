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


const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 40px;
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
  left: 2%;
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
  right: 2%;
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