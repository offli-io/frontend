import * as React from "react";
import { Card, Typography, Box, IconButton } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { format } from "date-fns";

export interface ICarouselItem {
  title?: string;
  description?: string;
  id?: string;
  selected?: boolean;
  value?: unknown;
}

interface IMobileCarouselProps {
  items?: ICarouselItem[];
  title?: string;
  onItemSelect?: (item: ICarouselItem) => void;
  onSlotAdd?: (addedDate: any) => void;
}

export const MobileCarousel: React.FC<IMobileCarouselProps> = ({
  items = [],
  title,
  onItemSelect,
  onSlotAdd,
}) => {
  const handleDatePick = React.useCallback(
    (date: Date | null) => {
      !!date &&
        onSlotAdd?.({
          dateValue: date,
          title: format(date, "EEEE").slice(0, 3),
          description: format(date, "dd.MM.yyyy"),
          disabled: false,
          selected: true,
          id: `date_slot_${format(date, "dd.MM.yyyy")}`,
        });
    },
    [onSlotAdd]
  );
  return (
    <>
      {title && (
        <Typography variant="h4" sx={{ my: 1.5 }}>
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
          my: 2,
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
            onClick={() => onItemSelect?.(item)}
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
        <Card
          // raised={item?.selected}
          // key={item.title}
          sx={{
            minWidth: 100,
            height: 50,
            //   bgcolor: (theme) =>
            //     item?.selected ? theme.palette.primary.main : "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          //   onClick={() => onItemSelect?.(item?.id)}
        >
          <MobileDatePicker
            onChange={handleDatePick}
            closeOnSelect
            // componentProps={{
            //   actionBar: undefined,
            // }}
            value={new Date()}
            minDate={new Date()}
            label="Date"
            inputFormat="dd.MM.yyyy"
            renderInput={(params: any) => (
              <IconButton {...params}>
                <CalendarMonthIcon color="primary" />
              </IconButton>
            )}
          />
        </Card>
      </Box>
    </>
  );
};
