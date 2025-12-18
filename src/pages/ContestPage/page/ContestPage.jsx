import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styled from 'styled-components';
import { ContentsWrap, MainContent } from '../../../assets/BusinessAnalysisStyle';
import NavigationBar from '../../../components/NavigationBar';
import { getContestList } from '../../../api'; 
import { TAG_OPTIONS, TAG_DETAILS, RECOMMEND_CONTEST } from '../../../data/contestPageData'; 

const ContestPage = () => {
  const { user } = useAuth();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTagDetails, setSelectedTagDetails] = useState([]);
  const [tagsRowZIndex, setTagsRowZIndex] = useState(2000);
  const [contests, setContests] = useState([]); 
  const [recommendContest, setRecommendContest] = useState([]); 
  const [loading, setLoading] = useState(true);
  const tagsRowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (tagsRowRef.current) {
        const tagsRowTop = tagsRowRef.current.getBoundingClientRect().top;
       
        if (tagsRowTop <= 250) {
          setTagsRowZIndex(0);
        } else {
          setTagsRowZIndex(2000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const contestData = await getContestList();
        
        setContests(contestData);
        
        setRecommendContest(RECOMMEND_CONTEST);
      } catch (error) {
        console.error('Failed to fetch contest data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTagSelect = (e, tag) => {
    e.stopPropagation();
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  useEffect(() => {
    const selectedDetails = selectedTags.map(tag => TAG_DETAILS[tag]).filter(Boolean);
    setSelectedTagDetails(selectedDetails);
  }, [selectedTags]);

  const handleResetTags = (e) => {
    e.stopPropagation();
    setSelectedTags([]);
    setSelectedTagDetails([]);
  };

  const filteredContests = selectedTags.length > 0
    ? contests.filter(contest => 
        contest.tags.some(tag => selectedTags.includes(tag))
      )
    : contests;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <ContentsWrap>
      <NavigationBar showSearch={true} showTag={false} />
      <MainContent Wide1030 style={{ paddingTop: '300px' }}>
      
        <TagTitle>공모분야</TagTitle>
        <TagsRow ref={tagsRowRef} style={{ zIndex: tagsRowZIndex }}>
          {TAG_OPTIONS.map(tag => (
            <Tag
              key={tag}
              selected={selectedTags.includes(tag)}
              onClick={(e) => handleTagSelect(e, tag)}
            >
              {tag}
            </Tag>
          ))}
          {selectedTags.length > 0 && (
            <ResetButton onClick={handleResetTags}>초기화</ResetButton>
          )}
        </TagsRow>
     
        {selectedTags.length > 0 ? (
          <RecommendSection>
            <div style={{ maxWidth: '1030px', margin: '0 auto', width: '100%' }}>
              <TagTitle style={{ marginTop: '50px', color: 'black', marginBottom: '30px' }}>
                고르신 직군은 이런 공모전 유형을 추천해요
              </TagTitle>
              <TagDetailContainer>
                {selectedTagDetails.map((detail, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', flex: '1 ', minWidth: '200px', maxWidth: '250px',hover: 'background-color: #08B1FF'}}>
                    <TagDetailHeader >
                      {detail.title}
                    </TagDetailHeader>
                    <TagDetailContent>
                      <div>
                        <TagDetailDescription>{detail.description}</TagDetailDescription>
                      </div>
                     
                    </TagDetailContent>
                  </div>
                ))}
              </TagDetailContainer>
            </div>
          </RecommendSection>
        ) : (
          <FullWidthBlueSection>
            <div style={{ maxWidth: '1030px', margin: '0 auto', width: '100%' }}>
              <TagTitle style={{marginTop: '50px', color: 'white'}}> {user?.nickname}님께 이런 공모전을 추천드려요</TagTitle>
              <ContestGrid>
                {recommendContest.map(contest => (
                  <ContestCard key={contest.id} onClick={() => navigate(`/ContestDetailPage/${contest.id}`)}>
                    <ContestImage src={contest.image} alt={contest.title} />
                    <ContestContent>
                      <ContestTitle>{contest.title}</ContestTitle>
                      <ContestDetail>{contest.detail}</ContestDetail>
                    </ContestContent>
                    <ContestTags>
                      {contest.tags.map((tag, index) => (
                        <ContestTag key={index}>{tag}</ContestTag>
                      ))}
                    </ContestTags>
                  </ContestCard>
                ))}
              </ContestGrid>
            </div>
          </FullWidthBlueSection>
        )}

        <TagTitle style={{marginTop: '80px', marginBottom: '10px'}}>
          {selectedTags.length > 0
            ? "지금 모집 중인 공모전이예요"
            : "지금 인기있는 공모전을 알려드려요"}
        </TagTitle>
        
        <ContestGrid>
  {filteredContests.map(contest => (
    <>
    <ContestCard key={contest.id} onClick={() => navigate(`/ContestDetailPage/${contest.id}`)}>
      <ContestImage src={contest.image} alt={contest.title} />
      <ContestContent>
        <ContestTitle>{contest.title}</ContestTitle>
        <ContestInfo>
          <ContestDetail>{contest.detail}</ContestDetail>
        </ContestInfo>
        <ContestButtons>
         
        </ContestButtons>
         </ContestContent>
        <ContestTags>
          {contest.tags.map((tag, index) => (
            <ContestTag key={index}>{tag}</ContestTag>
          ))}
        </ContestTags>
     
    </ContestCard>
    </>
  ))}
</ContestGrid>
      </MainContent>
    </ContentsWrap>
  </>
);
};

const TagTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  margin-bottom: 16px;
`;

const TagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1030px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
`;

const Tag = styled.div`
  border: ${({ selected }) => (selected ? '#00AEFF' : 'none')};
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 16px;
  color:  ${({ selected }) => (selected ? 'white' : '#222')};
  background: ${({ selected }) => (selected ? '#00AEFF' : '#EDEDED')};
  margin-right: 10px;
  margin-bottom: 8px;
  transition: background 0.15s, color 0.15s, border 0.15s;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f3f0f0;
    border-color: #62B9EC;
    color: #226FFF;
  }
`;

const ResetButton = styled.button`
  color: grey;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-bottom: 8px;
  font-size: 16px;
  padding: 8px 20px;
  border-radius: 999px;
  &:hover {
    background: #f3f0f0;
  }
`;

const TagDetailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  // justify-content: space-between;
`;

const TagDetailHeader = styled.div`
  background-color: ${props => props.color || '#535353'};
  color: white;
  padding: 16px 20px;
  text-align: center;
  border-radius: 16px;
  white-space: nowrap;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  height: 60px;
  &:hover {
    background-color: #00AEFF};
  }
  
`;

const TagDetailContent = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: -40px;
  position: relative;
  z-index: 1;
  min-height: 150px;
`;

const TagDetailDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #333;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;

const ContestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ContestCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  min-height:350px;
  background-color: white;
  max-width: 300px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ContestImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: top;
`;

const ContestContent = styled.div`
  padding: 16px;
  flex-grow: 1;
`;

const ContestTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
`;

const ContestInfo = styled.div`
  margin-bottom: 12px;
`;

const ContestDetail = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
`;

const ContestButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ContestTags = styled.div`
  display: flex;
  gap: 4px;
  padding: 16px;
  padding-top:0;
`;

const ContestTag = styled.span`
  background-color: #f0f0f0;
  color: #333;
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
`;

const FullWidthBlueSection = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw; 
  margin-right: -50vw; 
  background: linear-gradient(180deg, #00AEFF 20%, #FBFBFB 100%);
  padding-bottom: 40px;
`;

const RecommendSection = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw; 
  margin-right: -50vw; 
  background: #F9F9F9;
  padding-bottom: 40px;
`;

export default ContestPage;