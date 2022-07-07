import React, { useState } from 'react'
import { Box, Typography, TextField } from '@mui/material'
import OffliHeader from '../components/offli-header'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import GppGoodIcon from '@mui/icons-material/GppGood'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import DoneIcon from '@mui/icons-material/Done'

const ProfileEmptyScreen: React.FC = () => {
  const [username] = useState<string>('emma.smith')
  const [feedbackNumber] = useState<number>(0)
  const [editAboutMe, setEditAboutMe] = useState<boolean>(false)
  const [aboutMe, setAboutMe] = useState<string>(
    'Introduce yourself, edit About you to let others know more about you...'
  )

  const handleEditAboutMe = () => {
    setEditAboutMe(true)
  }

  const handleEditAboutMeDone = () => {
    setEditAboutMe(false)
  }

  const handleEditTitlePhoto = () => {
    console.log('edit title image')
  }

  const handleEditProfilePhoto = () => {
    console.log('edit profile image')
  }

  return (
    <>
      <OffliHeader />
      <Box
        sx={{
          height: '100%',
          // width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            height: '15%',
            width: '100%',
            backgroundColor: '#C9C9C9',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'right',
          }}
        >
          <CreateOutlinedIcon
            color="primary"
            onClick={() => handleEditTitlePhoto()}
            sx={{
              position: 'relative',
              bottom: '0px',
              right: 0,
              p: 1,
              fontSize: '20px',
            }}
          />
        </Box>
        <Box
          sx={{
            height: '60px',
            width: '60px',
            backgroundColor: '#C9C9C9',
            borderRadius: '50%',
            mt: -4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
          }}
        >
          <CreateOutlinedIcon
            color="primary"
            sx={{ fontSize: '20px', p: 1 }}
            onClick={() => handleEditProfilePhoto()}
          />
        </Box>
        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mt: 1 }}>
          {username}
        </Typography>
        <Box
          sx={{
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
              About me
            </Typography>
            {editAboutMe ? (
              <DoneIcon
                color="primary"
                sx={{ fontSize: '24px', pl: 2 }}
                onClick={() => handleEditAboutMeDone()}
              />
            ) : (
              <CreateOutlinedIcon
                color="primary"
                sx={{ fontSize: '20px', pl: 2 }}
                onClick={() => handleEditAboutMe()}
              />
            )}
          </Box>
          {editAboutMe ? (
            <TextField
              autoFocus
              value={aboutMe}
              multiline
              onChange={event => setAboutMe(event.target.value)}
              sx={{ width: '90%' }}
            />
          ) : (
            <Typography sx={{ width: '90%', mt: 1, owerflow: 'auto' }}>
              {aboutMe}
            </Typography>
          )}
          <Typography
            align="left"
            sx={{ width: '100%', fontSize: '18px', fontWeight: 'bold', mt: 2 }}
          >
            My activity this month
          </Typography>
          <Typography sx={{ width: '90%', mt: 1 }}>None so far.</Typography>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
              My feedback
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <GppGoodIcon color="primary" />
              <Typography>{feedbackNumber}</Typography>
            </Box>
          </Box>
          <Box
            sx={{ width: '90%', mt: 1, display: 'flex', alignItems: 'center' }}
          >
            <ThumbUpIcon color="primary" />
            <Typography sx={{ ml: 1.5 }}>
              I am participating in scheduled activities
            </Typography>
          </Box>
          <Box
            sx={{ width: '90%', mt: 1, display: 'flex', alignItems: 'center' }}
          >
            <FavoriteRoundedIcon color="primary" />
            <Typography sx={{ ml: 1.5 }}>
              Enjoyed time together doing planned activities
            </Typography>
          </Box>
          {/* ssssssssssssssss */}
          <Box
            sx={{ width: '90%', mt: 1, display: 'flex', alignItems: 'center' }}
          >
            <FavoriteRoundedIcon color="primary" />
            <Typography sx={{ ml: 1.5 }}>
              Enjoyed time together doing planned activities
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ProfileEmptyScreen
