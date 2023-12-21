import { Box, SxProps } from '@mui/system';

interface IPageWrapperProps {
  children?: React.ReactNode[] | React.ReactNode;
  sxOverrides?: SxProps;
}

// use this component to avoid negative margins by providing same margin-top as is header height to every screen
export const PageWrapper: React.FC<IPageWrapperProps> = ({
  children,
  sxOverrides
}: IPageWrapperProps) => {
  return (
    <Box
      sx={{
        // height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 1,
        // overflow: "auto",
        //mt: (HEADER_HEIGHT + 16) / 8,
        // aby borderNvigation neprekryval spodok screenu profile
        //pb: (HEADER_HEIGHT + 16) / 8,
        ...sxOverrides
      }}
      onScroll={() => console.log('scroll')}
      id="pageWrapper">
      {children}
    </Box>
  );
};
