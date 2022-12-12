import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, Grid } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import InstagramIcon from '@mui/icons-material/Instagram'

import { PageWrapper } from '../components/page-wrapper'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ProfileGallery from '../components/profile-gallery'
import { Link } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { getUsers } from '../api/activities/requests'
import ProfilePicture from '../assets/img/profilePicture.jpg'
import ProfileStatistics from '../components/profile-statistics'

const ProfileEmpty: React.FC = () => {
  const [editAboutMe, setEditAboutMe] = useState<boolean>(false)
  const [aboutMe, setAboutMe] = useState<string>('')
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext)

  const { data, isLoading } = useQuery(
    ['user-info', userInfo?.username],
    () => getUsers(userInfo?.username),
    {
      enabled: !!userInfo?.username,
      onSuccess: data => {
        setUserInfo && setUserInfo(data?.data)
      },
    }
  )

  // type Params = {
  //   queryKey: [string, { id: number }]
  // }

  // const fetchProfile = async ( params: Params ) => {
  //   const [, { id }] = params.queryKey
  const fetchProfile = async (id: number) => {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${id}`
    )
    // console.log(response.data, id)
    return response.data
  }
  // const { data, status } = useQuery(['profile', 5], () => fetchProfile(7), {
  //   keepPreviousData: true,
  // })

  // useEffect(() => {
  //   if (status === 'success') {
  //     setAboutMe(`${data.species} ${data.gender} - ${data.status}`)
  //     // console.log(data.species)
  //   }
  // }, [data, status])

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
    <PageWrapper>
      <Box
        sx={{
          height: '20%',
          width: '90%',
          display: 'flex',
          // flexDirection: 'column',
          // alignItems: 'center',
          // justifyContent: 'space-around',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            // todo add default picture in case of missing photo
            // src={data?.data?.profilePhotoUrl}
            src={ProfilePicture}
            alt="profile picture"
            style={{
              height: '70px',
              width: '7 0px',
              borderRadius: '50%',
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 0.5,
            }}
          >
            <IconButton color="primary" sx={{ paddingRight: 0 }}>
              <PeopleAltIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography
              variant="subtitle1"
              color="primary"
              sx={{ fontWeight: 'bold', mt: 0.5 }}
            >
              {data?.data?.buddies?.length}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            ml: 2,
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            justifyContent: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'left',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h3">{data?.data?.username}</Typography>
          </Box>
          <Box
            sx={{
              ml: -1.5,
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'flex-start',
            }}
          >
            <IconButton sx={{ paddingRight: 0, color: 'black' }}>
              <LocationOnIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography variant="subtitle2">Slovakia, Bratislava</Typography>
          </Box>

          <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
            I am student at FIIT STU. I like adventures and meditation. There is
            always time for a beer. Cheers.
          </Typography>
        </Box>
      </Box>
      <Box
        style={{
          width: '60%',
          borderRadius: '15px',
          backgroundColor: '#E4E3FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2%',
          marginTop: '5%',
        }}
      >
        <Link
          to={ApplicationLocations.EDIT_PROFILE}
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            Edit profile
          </Typography>
        </Link>
      </Box>
      {/* <Box
        sx={{
          width: '100%',
          mt: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 0.7,
            }}
          >
            <IconButton color="primary" sx={{ padding: 0 }}>
              <OfflineBoltIcon sx={{ transform: 'rotate(30deg)' }} />
            </IconButton>
            <Typography variant="h4">50</Typography>
          </Box>
          <Typography variant="subtitle1" align="center" lineHeight={1.2}>
            activities
            <br />
            attended
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 0.7,
            }}
          >
            <IconButton color="primary" sx={{ padding: 0 }}>
              <FavoriteIcon />
            </IconButton>
            <Typography variant="h4">50</Typography>
          </Box>
          <Typography variant="subtitle1" align="center" lineHeight={1.2}>
            times enjoyed time
            <br />
            with others
          </Typography>
        </Box>
      </Box> */}
      <Box
        sx={{
          width: '90%',
        }}
      >
        <Typography align="left" variant="h4" sx={{ mt: 3 }}>
          This month
        </Typography>
        <ProfileStatistics
          participatedNum={10}
          enjoyedNum={9}
          createdNum={5}
          metNum={12}
        />
      </Box>
      <Box
        sx={{
          width: '90%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Box sx={{ mt: 3 }}>
          <Typography align="left" variant="h4">
            Photos
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <IconButton color="primary" sx={{ padding: 0 }}>
            <InstagramIcon />
          </IconButton>
          <Typography
            align="left"
            variant="subtitle1"
            sx={{ ml: 0.5, mt: 3, color: 'primary.main', fontWeight: 'bold' }}
          >
            emma.smith
          </Typography>
        </Box>
      </Box>
      <ProfileGallery />
    </PageWrapper>
  )
}

export default ProfileEmpty
