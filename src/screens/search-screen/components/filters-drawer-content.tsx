import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import {
  ICarouselItem,
  MobileCarousel,
} from "../../../components/mobile-carousel";
import OffliButton from "../../../components/offli-button";
import { useTags } from "../../../hooks/use-tags";
import { generateDateSlots } from "../../create-activity-screen/components/date-time-form";
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
  >(filters?.filter ?? Object.keys(RadioGroupDataDefinitionsEnum)[0]);
  const [dateOptions, setDateOptions] = React.useState(
    generateDateSlots(false)
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    filters?.tags ?? []
  );

  React.useEffect(() => {
    if (filters?.date) {
      setDateOptions((dateOptions) =>
        dateOptions?.map((item) => {
          if (item?.id === filters?.date?.id) {
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
      date: selectedDate,
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
  }, []);

  React.useEffect(() => {
    if (filters?.tags) {
      setSelectedTags(filters?.tags);
    }
  }, [filters?.tags, setSelectedTags]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mx: 1.5 }}>
      <Box>
        <Typography variant="h4" sx={{ my: 1 }}>
          Set filters
        </Typography>
        <FormControl sx={{ mx: 1.5 }}>
          <RadioGroup
            aria-labelledby="filter-radio-buttons"
            name="filter-radio-buttons"
            value={selectedFilter}
            onChange={(event, value) => setSelectedFilter(value)}
          >
            {Object.entries(RadioGroupDataDefinitionsEnum).map(
              ([key, value]) => (
                <FormControlLabel
                  value={key}
                  control={<Radio />}
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
        <Box sx={{ mx: 1.5 }}>
          <MobileCarousel
            items={dateOptions}
            onItemSelect={handleDateSelect}
            onSlotAdd={handleDateAdd}
            sx={{ py: "8px !important" }}
          />
        </Box>
      </Box>

      <Box>
        <Typography variant="h4">Select tags</Typography>
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
                  label={tag?.title}
                  key={tag?.title}
                  sx={{ m: 1 }}
                  color="primary"
                  variant={
                    selectedTags.includes(tag?.title) ? "filled" : "outlined"
                  }
                  onClick={() => handleTagClick(tag?.title)}
                />
              ))}
            </Box>
          )
        )}
      </Box>
      <OffliButton
        sx={{ width: "80%", my: 2, alignSelf: "center" }}
        onClick={handleApplyFilters}
      >
        Apply
      </OffliButton>
    </Box>
  );
};

export default FiltersDrawerContent;
