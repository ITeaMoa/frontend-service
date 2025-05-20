import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Nav from '../../components/Nav';
import MessagePeople from './MessagePeople';
import MessageList from './MessageList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'
import { useAtom } from 'jotai';
import { SELECTED_PERSON_ID, MESSAGE_LIST } from '../../Atoms.jsx/AtomStates';
import { useNavigate } from 'react-router-dom';


const MessagePage = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const [personList, setPersonList] = useState([]);
  // const [messageList, setMessageList] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useAtom(SELECTED_PERSON_ID);
  const [messageList, setMessageList] = useAtom(MESSAGE_LIST);



  // 메시지 목록 데이터
  // const messageList = [
  //   { id: 1, name: '전상연', messageCount: 12 },
  //   { id: 2, name: '박보현', messageCount: 7 },
  //   { id: 3, name: '김보명', messageCount: 25 },
  //   { id: 4, name: '원터', messageCount: 0 },
  // ];

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

  // const handlePersonClick = async (personId) => {
  //   setSelectedPerson(personId);
  //   setSelectedPersonId(personId);
  //   const response = await axios.get('/message/list', {
  //     params: { pk: personId }
  //   });
  //   setMessageList(response.data);
  // };

  const handlePersonClick = async (personId) => {
    try {
      setSelectedPerson(personId);
      setSelectedPersonId(personId);
      
      // const response = await axios.get('/message', {
      //   params: {
      //      recipientId: personId,      // f8d12c2e-954f-455e-a9ca-0d8235dfd8c5 같은 형식
      //     userId: user.id    // 현재 로그인한 사용자 ID
      //   }
      // });
      const messageList = [
        {
          "pk": "c13244ba-ab21-4e04-9767-1189503efd8f",
          "sk": "2025-05-19T19:07:19.358308",
          "entityType": "MESSAGE",
          "creatorId": "84b8ddac-3081-70eb-e79d-e8f5deef4892",
          "userStatus": true,
          "recipientId": "04e8ddec-70d1-702c-9257-1f0078fe9c83",
          "messageContent": "진짜 머리가 터져. 진짜 터진다?",
          "messageStatus": true,
          "timestamp": "2025-05-19T19:07:19.358308"
        },
        {
          "pk": "c13244ba-ab21-4e04-9767-1189503efd8f",
          "sk": "2025-05-19T19:07:19.358308",
          "entityType": "MESSAGE",
          "creatorId": "84b8ddac-3081-70eb-e79d-e8f5deef4892",
          "userStatus": true,
          "recipientId": "04e8ddec-70d1-702c-9257-1f0078fe9c83",
          "messageContent": "진짜 머리가 터져. 진짜 터진다?",
          "messageStatus": true,
          "timestamp": "2025-05-19T19:07:19.358308"
        },
        {
          "pk": "c13244ba-ab21-4e04-9767-1189503efd8f",
          "sk": "2025-05-19T19:07:19.358308",
          "entityType": "MESSAGE",
          "creatorId": "84b8ddac-3081-70eb-e79d-e8f5deef4892",
          "userStatus": true,
          "recipientId": "04e8ddec-70d1-702c-9257-1f0078fe9c83",
          "messageContent": "진짜 머리가 터져. 진짜 터진다?",
          "messageStatus": true,
          "timestamp": "2025-05-19T19:07:19.358308"
        },]
      // setMessageList(response.data);
      setMessageList(messageList);
    } catch (error) {
      console.error('메시지 목록 조회 오류:', error);
    }
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
        // const response = await axios.get('/message/list', {
        //   params: { pk: user.id }
        // });
        // const list = Object.entries(response.data).map(([userId, nickname]) => ({
        //   id: userId,
        //   name: nickname
        // }));
        // setPersonList(list);
     
        // 기본 선택값 설정 (예: 첫 번째 사람)
        // if (list.length > 0) setSelectedPerson(list[0].id);

        // const countResponse = await axios.get('/message/count', {
        //   params: { pk: user.id }
        // });

        // const countData = countResponse.data;

        // const mergedPersonList = PersonList.map(person => ({
        //   ...person,
        //   count: countData[person.id] !== undefined ? countData[person.id] : "0"
        // }));

        // setPersonList(mergedPersonList);

        const PersonList = [
          { id: "04e8ddec-70d1-702c-9257-1f0078fe9c83", name: "알파카", count: 1 },
          { id: "1488fdac-d041-7079-f537-151b2fa728f5", name: "쥐다람쥐", count: 2 },
          { id: "84b8ddac-3081-70eb-e79d-e8f5deef4892", name: "전상연", count: 3 },
          { id: "148dac-d041-7079-f537-151b2fa728f5", name: "박보현", count: 4 },
          { id: "148dac-d041-7079-f53-151b2fa728f5", name: "김보명", count: 5 },
          { id: "148dac-d041-779-f537-151b2fa728f5", name: "원터", count: 6 },
        ];
        setPersonList(PersonList);
      } catch (error) {
        console.error('메시지 가져오기 오류:', error);
        setPersonList([]);
      }
    };
    getMessage();
  }, []);


  const handleSendMessage = async () => {
    try {

      const data = {
        creatorId: user.id,  // 보내는 사람 ID (현재 로그인한 사용자)
        recipientId: selectedPersonId, // 받는 사람 ID
        messageContent: newMessage  // 메시지 내용
      }
      const response = await axios.post('/message', data);
  
      console.log('Message sent:', response.data);
      
      // 메시지 전송 후 입력창 초기화
      setNewMessage('');
      
      // 메시지 목록 업데이트 (선택사항)
      // setMessageList([...messageList, response.data]);
      
      // 팝업 닫기 (필요한 경우)
      setShowMessagePopup(false);
  
    } catch (error) {
      console.error('Error sending message:', error);
      // 에러 처리 (예: 알림 표시)
    }
  };
 

  return (
    <>
      <Nav showSearch={false} showToggle={false} simple={true}/>
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
              {/* <MessageList messages={messagesByPerson[selectedPerson] || []} /> */}
              {/* <MessageList id={selectedPerson} /> */}
              <MessageList />
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
            <SendMessageButton onClick={handleSendMessage}>
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
