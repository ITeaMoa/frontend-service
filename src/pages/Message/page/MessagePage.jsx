import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavigationBar from '../../../components/NavigationBar';
import MessagePeople from '../components/MessagePeople';
import MessageList from '../components/MessageList';
import { useAuth } from '../../../context/AuthContext'
import { useAtom } from 'jotai';
import { SELECTED_PERSON_ID, MESSAGE_LIST } from '../../../atoms/AtomStates';
import { useLocation } from 'react-router-dom';
import { ContentsWrap , MainContent} from '../../../assets/BusinessAnalysisStyle';
import { getMessages, getMessageCount, getMessageUsers, sendMessage } from '../../../api';

const MessagePage = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const { user } = useAuth();
  const [personList, setPersonList] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useAtom(SELECTED_PERSON_ID);
  const [, setMessageList] = useAtom(MESSAGE_LIST);
  const location = useLocation();

useEffect(() => {
  if (location.state?.selectedPersonId) {
    setSelectedPersonId(location.state?.selectedPersonId);
    const exists = personList.some(person => person.id === location.state.selectedPersonId);
    if (exists) {
      handlePersonClick(location.state.selectedPersonId);
    }
  }
  // eslint-disable-next-line
}, [location.state?.selectedPersonId, setSelectedPersonId, personList]);


  const handlePersonClick = async (personId) => {
    try {
      setSelectedPerson(personId);
      setSelectedPersonId(personId);

      // 메시지 목록 불러오기
      const messages = await getMessages(personId, user.id);
      setMessageList(messages);

      const countData = await getMessageCount(user.id);

      setPersonList(prevList =>
        prevList.map(person =>
          person.id === personId
            ? { ...person, count: countData[personId] || "0" }
            : person
        )
      );
    } catch (error) {
      console.error('메시지 목록 조회 오류:', error);
    }
  };

const getMessage = async () => {
  try {
    const data = await getMessageUsers(user.id);
    
    const list = Object.entries(data).map(([userId, nickname]) => ({
      id: userId,
      name: nickname
    }));
    setPersonList(list);

    const countData = await getMessageCount(user.id);

    const mergedPersonList = list.map(person => ({
      ...person,
      count: countData[person.id] !== undefined ? countData[person.id] : "0"
    }));

    setPersonList(mergedPersonList);
  } catch (error) {
    console.error('메시지 가져오기 오류:', error);
    setPersonList([]);
  }
};


useEffect(() => {
  getMessage();
  // eslint-disable-next-line
}, [user?.id,]);

  const handleSendMessage = async (messageContent) => {

    if (!selectedPersonId) return;
    try {
      const data = {
        creatorId: user.id,
        recipientId: selectedPersonId,
        messageContent: messageContent
      };
      await sendMessage(data);

      const exists = personList.some(person => person.id === selectedPersonId);
      if (!exists) {
        await getMessage();
      }
      try {
        const messages = await getMessages(selectedPersonId, user.id);
        setMessageList(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
    <ContentsWrap>
    <MainContent Wide1030>
      <NavigationBar showSearch={false} showToggle={false} simple={true}/>
      <Container>
        <LeftPanel>
          <Title>메시지</Title>
          {personList.length === 0 ? (
            <EmptyMessageBox>
              <MessageIcon>✉️</MessageIcon>
              <EmptyText>메시지가 없습니다</EmptyText>
            </EmptyMessageBox>
          ) : (
            personList.map((person) => (
              <MessagePeople
                key={person.id}
                name={person.name}
                messageCount={person.count}
                isSelected={selectedPerson === person.id}
                onClick={() => handlePersonClick(person.id)}
              />
            ))
          )}
        </LeftPanel>
        <RightPanel>
          {selectedPerson ? (
            <>
       
              <MessageList onSendMessage={handleSendMessage} />  
         
            </>
          ) : (
            <EmptyRightPanel> 
              <EmptyText>대화 상대를 선택해주세요</EmptyText>
            </EmptyRightPanel>
          )}
        </RightPanel>
      </Container> 
      </MainContent>
    </ContentsWrap>


    </>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  margin-top: 50px;
`;

const LeftPanel = styled.div`
  width: 300px;
  border: 1px solid #BDBDBD;
  border-right: none;
  border-top-left-radius: 10px;     
  border-bottom-left-radius: 10px;  
  border-top-right-radius: 0;     
  border-bottom-right-radius: 0; 
  background : rgba(237, 237, 237, 0.5);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 20%;
    padding: 0 20px;
    margin-right: 10px;
  }
`;


const RightPanel = styled.div`
  flex: 1;
  border: 1px solid #BDBDBD;
  border-top-left-radius: 0px;  
  border-bottom-left-radius: 0px; 
  border-top-right-radius: 10px;      
  border-bottom-right-radius: 10px;   
  padding-left:20px;
  overflow: hidden;    
  position: relative;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left:20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 5px;
    font-size: 18px;
  }
`;

const EmptyMessageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const MessageIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
  color: #666;
`;

const EmptyText = styled.p`
  color: #666;
  font-size: 14px;
`;

const EmptyRightPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  position: relative;  
`;


export default MessagePage;
