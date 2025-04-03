import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterIcon src="/images/message_icon.svg" alt="Messages" />
      <FooterIcon src="/images/notification_icon.svg" alt="Notifications" />
      <FooterIcon src="/images/profile_icon.svg" alt="Profile" />
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: auto;
  padding: 16px 0;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const FooterIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export default Footer; 