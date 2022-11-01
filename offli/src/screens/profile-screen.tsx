import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SportsBarIcon from '@mui/icons-material/SportsBar'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import InstagramIcon from '@mui/icons-material/Instagram'

import { PageWrapper } from '../components/page-wrapper'
import { useQuery } from 'react-query'
import axios from 'axios'
import ProfileGallery from '../components/profile-gallery'
import { Link } from 'react-router-dom'
import { ApplicationLocations } from '../types/common/applications-locations.dto'

const ProfileEmpty: React.FC = () => {
  const [editAboutMe, setEditAboutMe] = useState<boolean>(false)
  const [aboutMe, setAboutMe] = useState<string>('')

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
  const { data, status } = useQuery(['profile', 5], () => fetchProfile(7), {
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
    <PageWrapper>
      <Box
        sx={{
          height: '15%',
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
            src={data.image}
            alt="profile picture"
            style={{
              height: '70px',
              // width: '60px',
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
              120
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
            <Typography variant="h3">{data.name}</Typography>
            <Link
              to={ApplicationLocations.EDIT_PROFILE}
              style={{ textDecoration: 'none' }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                }}
              >
                Edit
              </Typography>
            </Link>
          </Box>
          <Box
            sx={{
              ml: -1.5,
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'flex-start',
            }}
          >
            <IconButton color="primary" sx={{ paddingRight: 0 }}>
              <LocationOnIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="subtitle2">Slovakia, Bratislava</Typography>
          </Box>

          <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
            I am student at FIIT STU. I like adventures and meditation. There is
            always time for a beer. Cheers.
          </Typography>
        </Box>
      </Box>
      <Box
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
      </Box>
      <Box
        sx={{
          width: '90%',
        }}
      >
        <Typography align="left" variant="h4" sx={{ mt: 3 }}>
          This month
        </Typography>
        <Box sx={{ ml: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <PeopleOutlinedIcon />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              You've met <b>12 new buddies!</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <SportsBarIcon />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              You participated in <b>10 activities!</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <AddOutlinedIcon sx={{ fontSize: 25 }} />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              You created <b>5 activities!</b>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <IconButton color="primary" sx={{ padding: 0 }}>
              <FavoriteBorderOutlinedIcon />
            </IconButton>
            <Typography align="left" variant="h6" sx={{ mt: 2, ml: 2 }}>
              <b>9 times </b>enjoyed good time together!
            </Typography>
          </Box>
        </Box>
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
