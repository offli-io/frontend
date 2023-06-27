import * as React from "react";
import { Card, Typography, Box, IconButton, useTheme } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { format } from "date-fns";

export interface ICarouselItem {
  title?: string;
  description?: string;
  id?: string;
  selected?: boolean;
  disabled?: boolean;
  value?: unknown;
  dateValue?: Date | null;
}

interface IMobileCarouselProps {
  items?: ICarouselItem[];
  title?: string;
  onItemSelect?: (item: ICarouselItem) => void;
  onSlotAdd?: (addedDate: any) => void;
  onDuplicateEntry?: (addedDate: any) => void;
}

export const MobileCarousel: React.FC<IMobileCarouselProps> = ({
  items = [],
  title,
  onItemSelect,
  onSlotAdd,
  onDuplicateEntry,
}) => {
  const { palette } = useTheme();
  const handleDatePick = React.useCallback(
    (date: Date | null) => {
      if (!date) {
        return;
      }
      //check if there isn't any of items already added to only select it
      if (
        items?.some(
          (item) => item?.id === `date_slot_${format(date, "dd.MM.yyyy")}`
        )
      ) {
        onItemSelect?.({
          dateValue: date,
          title: format(date, "EEEE").slice(0, 3),
          description: format(date, "dd.MM.yyyy"),
          selected: true,
          id: `date_slot_${format(date, "dd.MM.yyyy")}`,
        });
      } else {
        onSlotAdd?.({
          dateValue: date,
          title: format(date, "EEEE").slice(0, 3),
          description: format(date, "dd.MM.yyyy"),
          disabled: false,
          selected: true,
          id: `date_slot_${format(date, "dd.MM.yyyy")}`,
        });
      }
    },
    [onSlotAdd, onDuplicateEntry, items]
  );
  return (
    <>
      {title && (
        <Typography
          variant="h4"
          sx={{ my: 1.5, color: palette?.text?.primary }}
        >
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
            key={item.id}
            sx={{
              minWidth: 100,
              height: 50,
              bgcolor: (theme) =>
                item?.selected ? theme.palette.primary.main : "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mr: 1,
            }}
            onClick={() => onItemSelect?.(item)}
            data-testid="mobile-carousel-item"
          >
            <Typography
              sx={{
                //TODO fix this,
                color: item?.selected ? palette?.text?.primary : "black",
                // color: item?.selected ? "white" : "black"
              }}
            >
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
          sx={{
            minWidth: 100,
            height: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
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
            data-testid="mobile-date-picker"
          />
        </Card>
      </Box>
    </>
  );
};
