import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import React, { BaseSyntheticEvent } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import createActivityImg from '../../../assets/img/create-activity.svg'
import Upload from 'rc-upload'
import { RcFile } from 'rc-upload/lib/interface'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { grey } from '@mui/material/colors'

interface IActivityPhotoFormProps {
  onNextClicked: () => void
  methods: UseFormReturn
}

export const ActivityPhotoForm: React.FC<IActivityPhotoFormProps> = ({
  onNextClicked,
  methods,
}) => {
  const { control, formState } = methods

  const onImageSelect = (e: BaseSyntheticEvent) => {
    console.log(e.target.files)
  }

  return (
    <>
      <Box
        sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', mt: -8 }}
      >
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Typography variant="h4">Activity details</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItem: 'center',
        }}
      >
        <Controller
          name="title_picture"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => {
            return (
              <Upload
                name="file"
                value={field.value?.[0]}
                // beforeUpload={(file: RcFile) => {
                //   // check file size
                //   if (file?.size > fileLimit) {w
                //     showNotification(t('file-too-large'), 'error');
                //     return false;
                //   }

                //   // check file format
                //   const fileExtension = file?.name?.split('.').pop();
                //   if (
                //     !allowedExtensions.includes(
                //       `.${fileExtension?.toLowerCase()}`
                //     )
                //   ) {
                //     showNotification(t('unsupported-file-format'), 'error');
                //     return false;
                //   }
                //   return true;
                // }}
                // onSuccess={(result, file) => {
                //   onSuccessfullUpload();
                //   field.onChange(file);
                //   showNotification(t('file-successfully-uploaded'));
                // }}
                // action={() =>
                //   `${endpointMap[application]}/user-file/fields/${id}/import`
                // }
                // headers={{
                //   authorization: `Bearer ${token}`,
                // }}
                multiple
              >
                <Box
                  sx={{
                    width: '20%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    bgcolor: grey[200],
                    p: 2,
                  }}
                >
                  <IconButton
                    //component="label"
                    //variant="text"
                    // sx={{ textTransform: 'none', pb: 0.5 }}
                    size="large"
                  >
                    <FileUploadIcon />
                  </IconButton>
                </Box>
              </Upload>
            )
          }}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
        }}
      >
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '40%' }}
          disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  )
}
