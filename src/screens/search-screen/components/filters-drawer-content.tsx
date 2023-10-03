import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import {
  ICarouselItem,
  MobileCarousel,
} from "../../../components/mobile-carousel";
import OffliButton from "../../../components/offli-button";
import { useTags } from "../../../hooks/use-tags";
import { generateDateSlots } from "../../create-activity-screen/utils/generate-date-slots.util";
import { IFiltersDto } from "../types/filters.dto";
import { RadioGroupDataDefinitionsEnum } from "../utils/radio-group-data-definitions";

export interface IFiltersDrawerContentProps {
  filters?: IFiltersDto;
  onApplyFilters?: (filters: IFiltersDto) => void;
}

const FiltersDrawerContent: React.FC<IFiltersDrawerContentProps> = ({
  filters,
  onApplyFilters,
}) => {
  const { data, isLoading } = useTags();
  const [selectedFilter, setSelectedFilter] = React.useState<
    string | undefined
  >(filters?.filter ?? undefined);
  const [dateOptions, setDateOptions] = React.useState(
    generateDateSlots(false)
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    filters?.tags ?? []
  );

  const [filtersTouched, setFiltersTouched] = React.useState(false);
  const theme = useTheme();

  console.log(filtersTouched);

  React.useEffect(() => {
    if (filters?.date) {
      setDateOptions((dateOptions) =>
        dateOptions?.map((item) => {
          const selectedDate = filters?.date?.getDate();
          // comparing date values since I removed ICarouselItem
          if (item?.dateValue?.getDate() === selectedDate) {
            return { ...item, selected: true };
          } else {
            return item;
          }
        })
      );
    }
  }, [filters?.date]);

  const handleDateSelect = React.useCallback(
    (item?: ICarouselItem) => {
      setDateOptions((options) =>
        options.map((option) => ({
          ...option,
          selected: option?.id === item?.id,
        }))
      );
      setFiltersTouched(true);
    },
    [dateOptions]
  );

  const handleDateAdd = React.useCallback(
    (item: any) => {
      const options = [
        ...dateOptions.map((item) => ({
          ...item,
          selected: false,
        })),
        item,
      ];
      setDateOptions(options);
    },
    [dateOptions]
  );

  const handleApplyFilters = React.useCallback(() => {
    const selectedDate = dateOptions?.find((dateSlot) => dateSlot?.selected);
    onApplyFilters?.({
      filter: selectedFilter,
      date: selectedDate?.dateValue,
      tags: selectedTags?.length > 0 ? selectedTags : undefined,
    });
  }, [dateOptions, selectedFilter, selectedTags]);

  const handleTagClick = React.useCallback((title?: string) => {
    title &&
      setSelectedTags((tags) => {
        if (tags?.includes(title)) {
          const filteredTags = tags?.filter((tag) => tag !== title);
          return filteredTags;
        } else {
          return [...tags, title];
        }
      });
    setFiltersTouched(true);
  }, []);

  React.useEffect(() => {
    if (filters?.tags) {
      setSelectedTags(filters?.tags);
      setFiltersTouched(true);
    }
  }, [filters?.tags, setSelectedTags]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mx: 1,
        maxHeight: "70vh",
      }}
    >
      <Box sx={{ flex: 6, overflow: "scroll" }}>
        <Box>
          <Typography variant="h4" sx={{ my: 1 }}>
            Set filters
          </Typography>
          <FormControl sx={{ mx: 1.5 }}>
            <RadioGroup
              aria-labelledby="filter-radio-buttons"
              name="filter-radio-buttons"
              value={selectedFilter}
              sx={{
                mt: 1,
                "& .MuiSvgIcon-root": {
                  color: "primary.main",
                },
              }}
            >
              {Object.entries(RadioGroupDataDefinitionsEnum).map(
                ([key, value]) => (
                  <FormControlLabel
                    value={value}
                    control={
                      <Radio
                        onClick={(event: any) => {
                          if (event?.target?.value === selectedFilter) {
                            setSelectedFilter(undefined);
                          } else {
                            // console.log(value);
                            setFiltersTouched(true);
                            setSelectedFilter(event?.target?.value);
                          }
                        }}
                      />
                    }
                    label={value}
                  />
                )
              )}
            </RadioGroup>
          </FormControl>
        </Box>
        <Box>
          <Typography variant="h4" sx={{ my: 1 }}>
            Select date
          </Typography>
          <Box sx={{ mx: 1.5, display: "flex" }}>
            <MobileCarousel
              items={dateOptions}
              onItemSelect={handleDateSelect}
              onSlotAdd={handleDateAdd}
              sx={{
                py: `${theme.spacing(0)} !important`,
                borderRadius: "12px !important",
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h4" sx={{ my: 1 }}>
            Select tags
          </Typography>
          {isLoading ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress color="primary" />
              </Box>
            </>
          ) : (
            data?.data?.tags &&
            data?.data?.tags?.length > 0 && (
              <Box sx={{ mx: 0.5 }}>
                {data?.data?.tags.map((tag) => (
                  <Chip
                    label={tag.title}
                    key={tag.id}
                    sx={{ m: 1 }}
                    color="primary"
                    variant={
                      selectedTags.includes(tag.title) ? "filled" : "outlined"
                    }
                    onClick={() => handleTagClick(tag.title)}
                  />
                ))}
              </Box>
            )
          )}
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <OffliButton
          sx={{
            width: "80%",
            my: 1,
            alignSelf: "center",
            // position: "absolute",
            // bottom: 0,
          }}
          onClick={handleApplyFilters}
          disabled={!filtersTouched}
        >
          Apply
        </OffliButton>
      </Box>
    </Box>
  );
};

export default FiltersDrawerContent;
