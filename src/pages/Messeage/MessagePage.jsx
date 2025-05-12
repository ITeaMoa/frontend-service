import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import MessagePeople from './MessagePeople';
import MessageList from './MessageList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'

const MessagePage = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const [personList, setPersonList] = useState([]);

  // 메시지 목록 데이터
  const messageList = [
    { id: 1, name: '전상연', messageCount: 12 },
    { id: 2, name: '박보현', messageCount: 7 },
    { id: 3, name: '김보명', messageCount: 25 },
    { id: 4, name: '원터', messageCount: 0 },
  ];

  // 각 사람별 메시지 데이터
  const messagesByPerson = {
    1: [
      {
        title: '받은 쪽지',
        content: '전상연님의 메시지...',
        date: '2024/08/08 12:48',
        type: 'received'
      },
      // ... 더 많은 메시지
    ],
    2: [
      {
        title: '보낸 쪽지',
        content: '박보현님과의 대화...',
        date: '2024/08/08 12:40',
        type: 'sent'
      },
      // ... 더 많은 메시지
    ],
    // ... 다른 사람들의 메시지
  };

  const handlePersonClick = (personId) => {
    setSelectedPerson(personId);
  };

  const handleSendClick = () => {
    setShowMessagePopup(true);
  };

  const handleClosePopup = () => {
    setShowMessagePopup(false);
    setNewMessage('');
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get('/message/list', {
          params: { pk: user.id }
        });
        // response.data: { name1: id1, name2: id2, ... }
        const list = Object.entries(response.data).map(([name, id]) => ({ name, id }));
        setPersonList(list);
        // 기본 선택값 설정 (예: 첫 번째 사람)
        if (list.length > 0) setSelectedPerson(list[0].id);
      } catch (error) {
        console.error('메시지 가져오기 오류:', error);
        setPersonList([]);
      }
    };
    getMessage();
  }, [user]);
 

  return (
    <>
      <Nav showSearch={false} showToggle={false} simple={true}/>
      <Container>
        <LeftPanel>
          <Title>메시지</Title>
          {messageList.length === 0 ? (
            <EmptyMessageBox>
              <MessageIcon>✉️</MessageIcon>
              <EmptyText>메시지가 없습니다</EmptyText>
            </EmptyMessageBox>
          ) : (
            messageList.map((person) => (
              <MessagePeople
                key={person.id}
                name={person.name}
                messageCount={person.messageCount}
                isSelected={selectedPerson === person.id}
                onClick={() => handlePersonClick(person.id)}
              />
            ))
          )}
        </LeftPanel>
        <RightPanel>
          {selectedPerson ? (
            <>
              <MessageList messages={messagesByPerson[selectedPerson] || []} />
              {/* <MessageList id={selectedPerson} /> */}
              <SendButton onClick={handleSendClick}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </SendButton>
            </>
          ) : (
            <EmptyRightPanel>
              <EmptyText>대화 상대를 선택해주세요</EmptyText>
            </EmptyRightPanel>
          )}
        </RightPanel>
      </Container>

      {showMessagePopup && (
        <PopupOverlay>
          <PopupContainer>
            <PopupHeader>
              <PopupTitle>쪽지 보내기</PopupTitle>
              <CloseButton onClick={handleClosePopup}>
                <FontAwesomeIcon icon={faTimes} />
              </CloseButton>
            </PopupHeader>
            <MessageTextArea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
            />
            <SendMessageButton>
              <FontAwesomeIcon icon={faPaperPlane} /> 보내기
            </SendMessageButton>
          </PopupContainer>
        </PopupOverlay>
      )}
    </>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  height: calc(100vh - 300px);
  margin-top: 200px;
  width:60%;
  background-color: white;
  padding-left: 150px;
  padding-right: 150px;
  margin-bottom: 200px;
  /* 중앙 정렬을 위한 스타일 추가 */
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    padding: 0 20px;
    margin-top:400px;
  }
`;

const LeftPanel = styled.div`
  width: 300px;
  border: 1px solid #BDBDBD;
//   padding: 20px;
  margin-right: 20px;
  border-radius: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 20%;
    padding: 0 20px;
    margin-right: 10px;
  }
`;


const RightPanel = styled.div`
  flex: 1;
  border: 1px solid #BDBDBD;
  border-radius: 10px;
  padding: 20px;
  overflow-y: auto;
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
`;

const SendButton = styled.button`
  position: absolute;
  bottom: 30px;
  right: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #CFECFD;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: black;
  font-size: 20px;
  z-index: 100;

  
  &:hover {
    background-color: #e5efff;
     color: #226FFF; // hover 시 아이콘 색상을 #226FFF로 변경
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #A0DAFB;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 80%;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PopupTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const MessageTextArea = styled.textarea`
  width: 90%;
  height: 200px;
  padding: 10px;
  border: 2px solid #A0DAFB;
  border-radius: 5px;
  resize: none;
  margin-bottom: 20px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #e5efff;
  }
`;

const SendMessageButton = styled.button`
  background-color: #CFECFD;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  
  &:hover {
    background-color: #e5efff;
     color: #226FFF; // hover 시 아이콘 색상을 #226FFF로 변경
  }
`;

export default MessagePage;
