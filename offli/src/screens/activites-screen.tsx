import React from 'react'
import { Box, Typography } from '@mui/material'
import MyActivityCard from '../components/my-activity-card'
import { IActivityProps } from '../types/common/types'
import { PageWrapper } from '../components/page-wrapper'

const datetime = new Date()

const dummyData: IActivityProps[] = [
  {
    id: 1,
    name: 'Go to cinema on Dune',
    price: 'starts at 10$',
    location: 'Plaza Beach, Miami 314',
    datetime: datetime,
    members: ['Jano', 'Fero'],
    accepted: 5,
    capacity: 10,
  },
  {
    id: 2,
    name: 'Run with Amelie',
    price: 'free',
    location: 'Plaza Beach, Miami 314',
    datetime: datetime,
    members: ['Jano', 'Fero'],
    accepted: 2,
    capacity: 2,
  },
  {
    id: 3,
    name: 'Sushi session',
    price: 'individual',
    location: 'Plaza Beach, Miami 314',
    datetime: datetime,
    members: ['Jano', 'Fero'],
    accepted: 5,
    capacity: 5,
  },
]

const ActivitiesScreen = () => {
  return (
    <PageWrapper>
      <Typography
        variant="h6"
        sx={{
          width: '88%',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'gray',
          mt: 1,
        }}
      >
        Today
      </Typography>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {dummyData.map(
          ({
            id,
            name,
            price,
            location,
            datetime,
            members,
            accepted,
            capacity,
          }) => {
            return (
              <MyActivityCard
                // id={id}
                key={id}
                name={name}
                price={price}
                location={location}
                datetime={datetime}
                members={members}
                accepted={accepted}
                capacity={capacity}
              />
            )
          }
        )}
      </Box>
      <></>
      {/* TODO dat dopice, PageWrapper ocakava children[] ale dostava len 1 child*/}
    </PageWrapper>
  )
}

export default ActivitiesScreen
