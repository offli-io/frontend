import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, Grid } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import InstagramIcon from '@mui/icons-material/Instagram'

import { PageWrapper } from '../components/page-wrapper'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ProfileGallery from '../components/profile-gallery'
import { Link, useLocation } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'
import { AuthenticationContext } from '../assets/theme/authentication-provider'
import { getUsers } from '../api/activities/requests'
import ProfilePicture from '../assets/img/profilePicture.jpg'
import ProfileStatistics from '../components/profile-statistics'
import BackHeader from '../components/back-header'
import { ICustomizedLocationStateDto } from '../types/common/customized-location-state.dto'

interface IProfileScreenProps {
  type: 'profile' | 'request'
}

const ProfileScreen: React.FC<IProfileScreenProps> = ({ type }) => {
  const [editAboutMe, setEditAboutMe] = useState<boolean>(false)
  const [aboutMe, setAboutMe] = useState<string>('')
  const { userInfo, setUserInfo } = React.useContext(AuthenticationContext)
  const location = useLocation()
  const state = location?.state as ICustomizedLocationStateDto
  const { from } = state

  const { data, isLoading } = useQuery(
    ['user-info', userInfo?.username],
    () => getUsers({ username: userInfo?.username }),
    {
      enabled: !!userInfo?.username,
      onSuccess: data => {
        setUserInfo && setUserInfo(data?.data)
      },
    }
  )

  // const { data, status } = useQuery(['profile', 5], () => fetchProfile(7), {
  //   keepPreviousData: true,
  // })

  return (
    <>
      {type === 'request' && (
        <BackHeader title="Buddie request" sx={{ mb: 2 }} to={from} />
      )}
      <PageWrapper>
        <Box
          sx={{
            height: '20%',
            width: '90%',
            display: 'flex',
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
              I am student at FIIT STU. I like adventures and meditation. There
              is always time for a beer. Cheers.
            </Typography>
          </Box>
        </Box>
        {type === 'profile' && (
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
        )}
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
            createdNum={type === 'profile' ? 5 : undefined}
            metNum={type === 'profile' ? 12 : undefined}
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
    </>
  )
}

export default ProfileScreen
