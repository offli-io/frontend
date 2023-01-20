import * as React from "react";
import { Card, Typography, Box } from "@mui/material";

interface ICarouselItem {
  title?: string;
  description?: string;
  id?: string;
  selected?: boolean;
}

interface IMobileCarouselProps {
  items?: ICarouselItem[];
  title?: string;
  onItemSelect?: (id?: string) => void;
}

export const MobileCarousel: React.FC<IMobileCarouselProps> = ({
  items = [],
  title,
  onItemSelect,
}) => {
  return (
    <>
      {title && (
        <Typography variant="h4" sx={{ mb: 1.5 }}>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          scrollSnapType: "x mandatory",
          "& > *": {
            scrollSnapAlign: "center",
          },
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        {items?.map((item) => (
          <Card
            raised={item?.selected}
            key={item.title}
            sx={{
              minWidth: 100,
              height: 50,
              bgcolor: (theme) =>
                item?.selected ? theme.palette.primary.main : "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => onItemSelect?.(item?.id)}
          >
            <Typography sx={{ color: item?.selected ? "white" : "black" }}>
              {item.title}
            </Typography>
            {item?.description && (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: item?.selected ? "white" : "black",
                }}
              >
                {item.description}
              </Typography>
            )}
          </Card>
        ))}
      </Box>
    </>
  );
};
