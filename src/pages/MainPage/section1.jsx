// Section1을 프레젠테이셔널 컴포넌트로 변경
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUser } from '@fortawesome/free-regular-svg-icons';
import LikeButton from '../../components/LikeButton';
import { useAtom } from 'jotai';
import { USER_PROFILE } from '../../Atoms.jsx/AtomStates';




const Section1 = ({ feedType, projects, onLikeClick, onProjectClick }) => {
    const [userProfile, setUserProfile] = useAtom(USER_PROFILE);
    return (
        <SectionWrapper>
            <SectionTitle>인기 프로젝트</SectionTitle>
            <ProjectList>
                {projects.slice(0, 3).map((project, index) => (
                    <ProjectCard key={index} onClick={() => onProjectClick(project)}>
                        <AuthorID>
                            <FontAwesomeIcon 
                                icon={regularUser} 
                                style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }} 
                            />
                            {project.nickname}
                        </AuthorID>
                        {/* <AuthorID style={{ display: 'flex', alignItems: 'center' }}>
                          {userProfile.avatarUrl ? (
                            <img
                              src={encodeURI(userProfile.avatarUrl)}
                              alt="Profile Avatar"
                              style={{ width: '25px', height: '25px', borderRadius: '50%', marginRight: '6px' }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={regularUser}
                              style={{ fontSize: '20px', lineHeight: '1.2', marginRight: '6px' }}
                            />
                          )}
                          <span style={{ fontWeight: 600, color: '#888' }}>
                            {project.nickname || "닉네임 없음"}
                          </span>
                        </AuthorID> */}
                        <LikeButtonWrapper>
                            <LikeButton 
                                initialLiked={project.liked} 
                                initialLikesCount={project.likesCount} 
                                // onLikeChange={(newLiked, newLikesCount) => onLikeClick(index, newLiked, newLikesCount)}
                                buttonStyle="s1"
                                sk={project.pk}
                                userId={project.userId}
                                feedType={feedType}
                            />
                        </LikeButtonWrapper>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        <ProjectInfo>
                            <Tags>
                                {project.tags.map((tag, tagIndex) => (
                                    <Tag key={tagIndex}>{tag}</Tag>
                                ))}
                            </Tags>
                            <Details>
                                모집현황 | {project.recruitmentNum}명 
                            </Details>
                            <Details>
                                마감일자 | {new Date(project.deadline).toLocaleDateString()}
                            </Details>
                        </ProjectInfo>
                    </ProjectCard>
                ))}
            </ProjectList>
        </SectionWrapper>
    );
};


const SectionWrapper = styled.div`
  // width: calc(100% / 2 + 100px);
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: rgba(160, 218, 251, 0.5);
  width:70%;

   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 0 auto;
    // position: relative;
    // bottom: auto;
    // left: auto;
    margin-left: 70px;
    justify-content: center;
    width: 150%;
    //  width:70%;
    // padding: 0 20px;
  }

`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const ProjectList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  
`;

const ProjectCard = styled.div`
  position: relative;
  border: 2px solid #A0DAFB;
  border-radius: 30px 30px 1px 30px;
  padding: 15px;
  margin-bottom: 20px;
  width: calc(100% / 4);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #A0DAFB;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: calc(100% / 3); /* 3열로 조정 */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: calc(100% / 3); /* 3열로 조정 */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: calc(33.33% - 8px); /* 3열로 조정, 다음 줄로 넘어가지 않도록 */
  }

  //  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
  //   width: calc(33.33% - 15px);
  //   padding: 12px;
  // }

  @media (max-width: ${({ theme }) => theme.breakpoints.smobile}) {
    width: calc(33.33% - 8px);
    padding: 8px;
  }
`;

const AuthorID = styled.div`
  font-weight: bold;
  position: absolute;
  color: #858585;
`;



const ProjectTitle = styled.div`
  font-size: 20px;
  margin: 20px 0;
  margin-top:40px;
  font-weight: bold;
  min-height: 40px;
  text-align: left;
`;

const ProjectInfo = styled.div`
  font-size: 14px;
  color: #777;
`;


const Tags = styled.div`
  display: flex;
  margin-bottom: 5px;
  // align-items: space-between;
  flex-wrap: wrap; // 줄 바꿈을 허용
  align-items: flex-start; // 상단 정렬
  white-space: nowrap;
`;

const Tag = styled.div`
  margin-bottom: 5px;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 14px 14px 1px 14px; //반시계 ㅔ방향
  padding: 5px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-color: rgba(160, 218, 251);
  color: #0A8ED9;


  @media (max-width: 1800px) {
    font-size: 12px; 
    padding: 4px 8px;
  }

  @media (max-width: 480px) {
    font-size: 8px; 
    padding: 3px 6px; 
  }


`;

const Details = styled.div`
    display: flex;
    justify-content: space-between;

`;



const LikeButtonWrapper = styled.div`
  position: absolute;
  top: 13px;
  right: 25px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    transform: scale(0.9); // Adjust the scale as needed
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: scale(0.8); // Adjust the scale as needed
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    transform: scale(0.7); // Adjust the scale as needed
  }
`;

export default Section1;