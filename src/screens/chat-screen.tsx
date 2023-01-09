import React from 'react'
import { Box } from '@mui/material'

import offliLogo from '../assets/img/logoPurple.png'
import ChatItem from '../components/chat-item'
import logo from '../assets/img/profilePicture.jpg'
import logoChlap from '../assets/img/jozo.png'
import { PageWrapper } from '../components/page-wrapper'

const ChatScreen = () => {
  return (
    <PageWrapper sxOverrides={{ alignItems: 'flex-start', px: 3 }}>
      <ChatItem message="Nazdar debile co ta aktivitka?" picture={logo} />
      <ChatItem
        message="Vole ja nejdu na zadnou aktivitu kundo blba"
        picture={logoChlap}
      />
      <ChatItem message="Dutosvarcova korporaceeee" picture={logo} />
    </PageWrapper>
  )
}

export default ChatScreen
