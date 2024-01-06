import { Box, Typography, styled } from '@mui/material';
import OffliButton from 'components/offli-button';
import React, { useState } from 'react';

const MainBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  marginTop: 5
}));

const TextBox = styled(Box)(() => ({
  maxWidth: '95%',
  lineHeight: 1,
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'flex-start',
  margin: 5
}));

interface IProps {
  description?: string;
}

const AdditionalDescription: React.FC<IProps> = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [showTruncated, setShowTruncated] = useState(true);

  const truncatedDescription =
    description && description.length > 200 ? `${description.slice(0, 200)}...` : description;

  const toggleShowMore = () => {
    setShowFullText(!showFullText);
    setShowTruncated(!showTruncated);
  };

  return (
    <MainBox>
      <Typography variant="h4">Additional description</Typography>
      <TextBox>
        <Typography variant="subtitle1">
          {showFullText ? description : truncatedDescription}

          {description && description.length > 200 && (
            <OffliButton variant="text" sx={{ fontSize: 14 }} onClick={toggleShowMore}>
              {showTruncated ? 'See more' : 'Hide'}
            </OffliButton>
          )}
        </Typography>
      </TextBox>
    </MainBox>
  );
};

export default AdditionalDescription;
