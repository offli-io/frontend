import { Box, SxProps } from "@mui/system";
import { HEADER_HEIGHT } from "../utils/common-constants";

interface IPageWrapperProps {
  children?: React.ReactNode[] | React.ReactNode;
  sxOverrides?: SxProps;
}

// use this component to avoid negative margins by providing same margin-top as is header height to every screen
export const PageWrapper: React.FC<IPageWrapperProps> = ({
  children,
  sxOverrides,
}) => {
  return (
    <Box
      sx={{
        // height: '100%',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 1,
        //mt: (HEADER_HEIGHT + 16) / 8,
        // aby borderNvigation neprekryval spodok screenu profile
        //pb: (HEADER_HEIGHT + 16) / 8,
        ...sxOverrides,
      }}
    >
      {children}
    </Box>
  );
};
