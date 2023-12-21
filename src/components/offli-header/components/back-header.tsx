import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, IconButton, SxProps, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderContext } from '../../../app/providers/header-provider';

interface IBackHeaderProps {
  title?: string;
  sx?: SxProps;
  to?: string;
  //   headerRightContent?: React.ReactElement;
}

const BackHeader: React.FC<IBackHeaderProps> = ({
  title
  //   headerRightContent,
}) => {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const { headerRightContent } = React.useContext(HeaderContext);

  //why was this done?
  //BIG TODO
  const handleBackNavigation = React.useCallback(() => {
    //TODO what about location state is it okay to reset it after back redirect?
    // if (
    //   [ApplicationLocations.MAP, ApplicationLocations.ACTIVITY_MEMBERS].some(
    //     (_location) => location.startsWith(_location)
    //   )
    // ) {
    //   const locationParams = location?.split("/");
    //   const activityId = locationParams?.[locationParams?.length - 1];
    //   return navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${activityId}`, {
    //     replace: true,
    //   });
    // }
    return navigate(-1);

    //TODO tried navigate to (-1) and it looks like it is working just fine don't need the code below

    // if (!to) {
    //   return;
    // }

    // // edge cases when there is double navigation via header (e.g. BUDDIES -> ADD_BUDDY screens)
    // if (
    //   to === ApplicationLocations.ACTIVITY_DETAIL &&
    //   location.startsWith(ApplicationLocations.MAP)
    // ) {
    //   return navigate(to, {
    //     state: {
    //       from: ApplicationLocations.EXPLORE,
    //     },
    //   });
    // }

    // if (
    //   to.startsWith(ApplicationLocations.ACTIVITY_MEMBERS) &&
    //   location.startsWith(ApplicationLocations.USER_PROFILE)
    // ) {
    //   return navigate(to, {
    //     state: {
    //       from: ApplicationLocations.EXPLORE,
    //     },
    //   });
    // }
    // if (location.startsWith(ApplicationLocations.ACTIVITY_DETAIL)) {
    //   return navigate(ApplicationLocations.EXPLORE);
    // }
    // if (location.startsWith(ApplicationLocations.BUDDIES)) {
    //   return navigate(ApplicationLocations.PROFILE);
    // }
    // //idk if this state passing is ok
    // // I dont want to always loop between 2 back routes
    // navigate(to, {
    //   state: {
    //     from: location,
    //   },
    // });
  }, [location, navigate]);

  return (
    <Box
      sx={{
        width: '100%',
        // borderBottom: '1px solid lightgrey',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        // pt: 1,
        boxSizing: 'border-box',
        height: '100%'
      }}>
      <IconButton
        onClick={handleBackNavigation}
        color="primary"
        sx={{
          flex: 1,
          position: 'absolute',
          left: 0,
          textTransform: 'none',
          p: 0,
          pl: 1
        }}>
        <ArrowBackIosNewIcon sx={{ color: 'primary.main' }} />
      </IconButton>
      <Box>
        <Typography variant="h4" sx={{ color: ({ palette }) => palette?.text.primary }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ position: 'absolute', right: 0 }}>{headerRightContent}</Box>
    </Box>
  );
};

export default BackHeader;
