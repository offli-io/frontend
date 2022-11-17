import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import React, { BaseSyntheticEvent } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import activityPhotoImg from '../../../assets/img/activity-photo.svg'
import Upload from 'rc-upload'
import { RcFile } from 'rc-upload/lib/interface'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { grey } from '@mui/material/colors'

interface IActivityPhotoFormProps {
  methods: UseFormReturn
}

export const ActivityPhotoForm: React.FC<IActivityPhotoFormProps> = ({
  methods,
}) => {
  const { control, formState } = methods

  const onImageSelect = (e: BaseSyntheticEvent) => {
    console.log(e.target.files)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '50%',
          }}
        >
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            Add
          </Typography>
          <Typography variant="h4">activity photo</Typography>
        </Box>
        <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <img src={activityPhotoImg} style={{ height: 80 }} />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItem: 'center',
          mb: 10,
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
                style={{ display: 'flex', justifyContent: 'center' }}
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
                    width: 100,
                    height: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    bgcolor: grey[200],
                    borderRadius: 3,
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
          justifyContent: 'center',
        }}
      >
        <OffliButton
          sx={{ width: '80%' }}
          disabled={!formState.isValid}
          type="submit"
        >
          Create
        </OffliButton>
      </Box>
    </>
  )
}
