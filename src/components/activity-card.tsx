import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, SxProps, Typography } from '@mui/material';
import { LayoutContext } from 'app/layout';
import { format } from 'date-fns';
import useLongPress from 'hooks/utils/use-long-press';
import React from 'react';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import { useGetApiUrl } from '../hooks/utils/use-get-api-url';
import { IActivity } from '../types/activities/activity.dto';
import { TIME_FORMAT } from '../utils/common-constants';
import { CustomizationContext } from './context/providers/customization-provider';
import OffliButton from './offli-button';
import { motion as m } from 'framer-motion';

interface IProps {
  activity?: IActivity;
  onPress?: (activity?: IActivity) => void;
  onLongPress?: (activity?: IActivity) => void;
  sx?: SxProps;
}

const ActivityCard: React.FC<IProps> = ({ activity, onPress, onLongPress, sx, ...rest }) => {
  //TODO maybe in later use also need some refactoring
  const { theme } = React.useContext(CustomizationContext);
  const baseUrl = useGetApiUrl();

  const { contentDivRef } = React.useContext(LayoutContext);

  const { handlers } = useLongPress({
    onLongPress: () => onLongPress?.(activity),
    elementRef: contentDivRef?.current
  });

  const startDate = activity?.datetime_from ? new Date(activity?.datetime_from) : null;

  return (
    <m.div initial={{ opacity: 0.5, y: 15 }} whileInView={{ opacity: 1, y: 0 }}>
      <OffliButton
        sx={{
          width: '96%',
          height: 240,
          borderRadius: '10px',
          backgroundImage: `url(${baseUrl}/files/${activity?.title_picture})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'flex-end',
          p: 0,
          ...sx
        }}
        data-testid="activity-card"
        {...handlers}
        onClick={() => onPress?.(activity)}
        color="inherit"
        {...rest}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '3%',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            // this was before useing background gradient -> maybe use it for that if decided
            // backgroundColor: "rgba(0,0,0,.5)",
            // backdropFilter: "blur(0.7px)", // position: 'absolute',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
            boxSizing: 'border-box'
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}>
            <Typography
              variant="h2"
              sx={{
                width: 280,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'start',
                ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {})
              }}>
              {activity?.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                width: 270,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'start',
                ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {})
              }}>
              {activity?.location?.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                mt: 0.4
              }}>
              <PeopleAltIcon
                sx={{
                  fontSize: 14,
                  ml: 0.5,
                  mr: 0.5,
                  ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {})
                }}
              />
              {activity?.limit ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      lineHeight: 1,
                      ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {})
                    }}>
                    {activity?.count_confirmed}/{activity?.limit}{' '}
                  </Typography>
                  {[...(activity?.participants_thumb ?? [])]?.length > 0 ? (
                    <Box sx={{ position: 'relative', display: 'flex' }}>
                      {[...(activity?.participants_thumb ?? [])].map((participant, index) => (
                        <img
                          key={participant?.profile_photo}
                          src={`${baseUrl}/files/${participant?.profile_photo}`}
                          alt="profile"
                          style={{
                            position: 'absolute',
                            left: 10 * (index + 1),
                            height: 15,
                            aspectRatio: 1,
                            borderRadius: '50%',
                            zIndex: index + 1
                          }}
                        />
                      ))}
                    </Box>
                  ) : null}
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: 16,
                    ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {}),
                    lineHeight: 1
                  }}>
                  {activity?.count_confirmed} 0
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <Box>
              <Typography
                sx={{
                  fontSize: 22,
                  lineHeight: 1,
                  fontWeight: 'bold',
                  ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {})
                }}>
                {startDate ? format(startDate, 'dd') : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  lineHeight: 1,
                  fontSize: 12,
                  letterSpacing: 0,
                  fontWeight: 'bold',
                  my: 0.5,
                  ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {})
                }}>
                {startDate ? format(startDate, 'MMMM') : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: 22,
                  lineHeight: 1,
                  fontWeight: 'semi-bold',
                  ...(theme === ThemeOptionsEnumDto.LIGHT ? { filter: 'invert(100%)' } : {})
                }}>
                {startDate ? format(startDate, TIME_FORMAT) : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </OffliButton>
    </m.div>
  );
};

export default ActivityCard;
