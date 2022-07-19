import React, { useState, useEffect } from 'react'
import { Box, Typography, TextField } from '@mui/material'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import GppGoodIcon from '@mui/icons-material/GppGood'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import DoneIcon from '@mui/icons-material/Done'
import { PageWrapper } from '../components/page-wrapper'
import { useQuery } from 'react-query'
import axios from 'axios'

const ProfileEmptyScreen: React.FC = () => {
  const [editAboutMe, setEditAboutMe] = useState<boolean>(false)
  const [aboutMe, setAboutMe] = useState<string>('')

  // type Params = {
  //   queryKey: [string, { id: number }]
  // }

  // const fetchProfile = async ( params: Params ) => {
  //   const [, { id }] = params.queryKey
  const fetchProfile = async () => {
    const response = await axios.get(
      'https://rickandmortyapi.com/api/character/2'
    )
    // console.log(response.data, id)
    return response.data
  }
  const { data, status } = useQuery(['profile', 5], fetchProfile, {
    keepPreviousData: true,
  })

  useEffect(() => {
    if (status === 'success') {
      setAboutMe(`${data.species} ${data.gender} - ${data.status}`)
      // console.log(data.species)
    }
  }, [data, status])

  if (status === 'loading') {
    return (
      <PageWrapper>
        <div>Loading...</div>
        <></>
      </PageWrapper>
    )
  }

  if (status === 'error') {
    return (
      <PageWrapper>
        <div>Error..</div>
        <></>
      </PageWrapper>
    )
  }

  const handleEditAboutMe = () => {
    setEditAboutMe(true)
  }

  const handleEditAboutMeDone = () => {
    setEditAboutMe(false)
  }

  const handleEditTitlePhoto = () => {
    console.log('edit title image')
  }

  // const handleEditProfilePhoto = () => {
  //   console.log('edit profile image')
  // }

  return (
    <>
      <PageWrapper>
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
        // sx={{
        //   height: '60px',
        //   width: '60px',
        //   backgroundColor: '#C9C9C9',
        //   borderRadius: '50%',
        //   mt: -4,
        //   display: 'flex',
        //   alignItems: 'center',
        //   justifyContent: 'center',
        //   border: '3px solid white',
        // }}
        >
          <img
            src={data.image}
            alt="profile picture"
            style={{
              height: '60px',
              width: '60px',
              backgroundColor: '#C9C9C9',
              borderRadius: '50%',
              marginTop: '-32px',
              border: '3px solid white',
            }}
          />

          {/* <CreateOutlinedIcon
            color="primary"
            sx={{ fontSize: '20px', p: 1 }}
            onClick={() => handleEditProfilePhoto()}
          /> */}
        </Box>
        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mt: 1 }}>
          {data.name}
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
              <Typography>5</Typography>
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
        </Box>
      </PageWrapper>
    </>
  )
}

export default ProfileEmptyScreen
