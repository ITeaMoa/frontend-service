import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavigationBar from '../../../components/NavigationBar';
import MessagePeople from '../components/MessagePeople';
import MessageList from '../components/MessageList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../api/axios'
import { useAuth } from '../../../context/AuthContext'
import { useAtom } from 'jotai';
import { SELECTED_PERSON_ID, MESSAGE_LIST } from '../../../Atoms.jsx/AtomStates';
import { useLocation } from 'react-router-dom';


const MessagePage = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const [personList, setPersonList] = useState([]);
  // const [messageList, setMessageList] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useAtom(SELECTED_PERSON_ID);
  const [, setMessageList] = useAtom(MESSAGE_LIST);
  const location = useLocation();


// useEffect(() => {
//   if (location.state?.selectedPersonId) {
//     setSelectedPersonId(location.state?.selectedPersonId);
//     setShowMessagePopup(true);
//     // handlePersonClick(location.state?.selectedPersonId);
//   } 
// }, [location.state?.selectedPersonId,setSelectedPersonId]);

useEffect(() => {
  if (location.state?.selectedPersonId) {
    setSelectedPersonId(location.state?.selectedPersonId);
    setShowMessagePopup(true);

    // personList에 있는지 확인
    const exists = personList.some(person => person.id === location.state.selectedPersonId);
    if (exists) {
      handlePersonClick(location.state.selectedPersonId);
    }
    // 없는 경우: 팝업만 띄우고, 메시지 보내기 후 getMessage() 호출
  }
  // eslint-disable-next-line
}, [location.state?.selectedPersonId, setSelectedPersonId, personList]);


  const handlePersonClick = async (personId) => {
    try {
      setSelectedPerson(personId);
      setSelectedPersonId(personId);

      // 메시지 목록 불러오기
      const response = await axios.get('/message', {
        params: {
          recipientId: personId,
          userId: user.id
        }
      });
      setMessageList(response.data);

      // 선택한 사람의 메시지 count만 새로 불러오기
      const countResponse = await axios.get('/message/count', {
        params: { pk: user.id }
      });
      const countData = countResponse.data;

      // personList에서 해당 사람만 count 갱신
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

  const handleSendClick = () => {
    setShowMessagePopup(true);
  };

  const handleClosePopup = () => {
    setShowMessagePopup(false);
    setNewMessage('');
  };


const getMessage = async () => {
  try {
    const response = await axios.get('/message/list', {
      params: { pk: user.id }
    });
    console.log("response", response.data);
    const data = response.data || {};
    
    const list = Object.entries(data).map(([userId, nickname]) => ({
      id: userId,
      name: nickname
    }));
    setPersonList(list);

    // if (list.length > 0) setSelectedPerson(list[0].id);

    const countResponse = await axios.get('/message/count', {
      params: { pk: user.id }
    });

    const countData = countResponse.data;
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
}, [user?.id,]);

  const handleSendMessage = async (messageContent) => {

    if (!selectedPersonId) return;
    try {
      const data = {
        creatorId: user.id,
        recipientId: selectedPersonId,
        messageContent: messageContent
      };
      await axios.post('/message', data);
      setNewMessage('');
      setShowMessagePopup(false);

      // 기존 목록에 없는 사용자면 getMessage() 호출
      const exists = personList.some(person => person.id === selectedPersonId);
      if (!exists) {
        await getMessage();
      }

      // 메시지 목록도 새로고침
      try {
        const messageResponse = await axios.get('/message', {
          params: {
            recipientId: selectedPersonId,
            userId: user.id
          }
        });
        setMessageList(messageResponse.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
 
//새로운 사람 새로 getMessage() 호출안하는 거
  // const handleSendMessage = async () => {
  //   try {
  //     const data = {
  //       creatorId: user.id,  // 보내는 사람 ID (현재 로그인한 사용자)
  //       recipientId: selectedPersonId, // 받는 사람 ID
  //       messageContent: newMessage  // 메시지 내용
  //     }
  //     console.log("data", data);
  //     const response = await axios.post('/message', data);
  
  //     console.log('Message sent:', response.data);
      
  //     // 메시지 전송 후 입력창 초기화
  //     setNewMessage('');
      
  //     // 새로운 메시지 목록을 가져오기
  //     try {
  //       const messageResponse = await axios.get('/message', {
  //         params: {
  //           recipientId: selectedPersonId,
  //           userId: user.id
  //         }
  //       });
  //       setMessageList(messageResponse.data);
  //     } catch (error) {
  //       console.error('Error fetching messages:', error);
  //     }
      
  //     // 사용자 목록 업데이트
  //     // await getMessage();
      
  //     setShowMessagePopup(false);

  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     // 에러 처리 (예: 알림 표시)
  //   }
  // };


  return (
    <>
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
              {/* <MessageList messages={messagesByPerson[selectedPerson] || []} /> */}
              {/* <MessageList id={selectedPerson} /> */}
              <MessageList onSendMessage={handleSendMessage} />  
         
              {/* <SendButton onClick={handleSendClick}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </SendButton>
             */}
            </>
          ) : (
            <EmptyRightPanel> 
              <EmptyText>대화 상대를 선택해주세요</EmptyText>
            </EmptyRightPanel>
          )}
        </RightPanel>
      </Container> 

      {/* {showMessagePopup && (
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <SendMessageButton type="button" onClick={handleSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} /> 보내기
            </SendMessageButton>
          </PopupContainer>
        </PopupOverlay>
      )} */}
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
  border-right: none;
//   padding: 20px;
  // margin-right: 20px;
  // border-radius: 10px;
    border-top-left-radius: 10px;     // 왼쪽 위
  border-bottom-left-radius: 10px;  // 왼쪽 아래
  border-top-right-radius: 0;      // 오른쪽 위를 0으로
  border-bottom-right-radius: 0;   // 오른쪽 아래를 0으로
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
  // border-radius: 10px;
  border-top-left-radius: 0px;     // 왼쪽 위
  border-bottom-left-radius: 0px;  // 왼쪽 아래
  border-top-right-radius: 10px;      // 오른쪽 위를 0으로
  border-bottom-right-radius: 10px;   // 오른쪽 아래를 0으로
  // padding: 20px;
  padding-left:20px;
  // overflow-y: auto;
  // height: 100%;         /* 부모가 높이 지정 필요 */
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
  position: relative;  // 추가: 상대 위치 설정ㄴㄴ
`;

const SendButton = styled.button`
  // position: absolute;
  position: fixed;
  bottom: 90px;
  right: 140px;
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
