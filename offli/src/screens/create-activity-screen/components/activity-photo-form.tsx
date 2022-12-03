import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import React, { BaseSyntheticEvent } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import OffliButton from '../../../components/offli-button'
import activityPhotoImg from '../../../assets/img/activity-photo.svg'
import Upload from 'rc-upload'
import { RcFile } from 'rc-upload/lib/interface'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { grey } from '@mui/material/colors'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import LabeledDivider from '../../../components/labeled-divider'
import { DrawerContext } from '../../../assets/theme/drawer-provider'

interface IActivityPhotoFormProps {
  methods: UseFormReturn
  onBackClicked: () => void
}

export const ActivityPhotoForm: React.FC<IActivityPhotoFormProps> = ({
  methods,
  onBackClicked,
}) => {
  const { control, formState } = methods
  const { toggleDrawer } = React.useContext(DrawerContext)
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
          my: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
          }}
        >
          <Typography variant="h4" sx={{ color: 'primary.main' }}>
            Add
          </Typography>
          <Typography variant="h4">activity photo</Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: theme => theme.palette.inactiveFont.main, mt: 0.5 }}
          >
            Later you can add two more photos
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItem: 'center',
          mb: 6,
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
                {/* TODO outsource this component */}
                <Box
                  sx={{
                    width: 200,
                    height: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    bgcolor: grey[200],
                    borderRadius: 5,
                    border: theme => `1px dashed ${theme.palette.primary.main}`,
                  }}
                >
                  {/* <Box></Box> */}
                  <IconButton
                    //component="label"
                    //variant="text"
                    // sx={{ textTransform: 'none', pb: 0.5 }}
                    size="large"
                  >
                    <AddAPhotoIcon color="primary" />
                  </IconButton>
                  <Typography sx={{ fontSize: 14 }}>
                    Upload from your phone
                  </Typography>
                </Box>
              </Upload>
            )
          }}
        />
        <LabeledDivider sx={{ my: 3, width: '100%' }}>
          <Typography variant="subtitle1">or</Typography>
        </LabeledDivider>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            onClick={() =>
              toggleDrawer({
                open: true,
                content: <div>Photo gallery</div>,
              })
            }
            sx={{
              width: 200,
              height: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              bgcolor: grey[200],
              borderRadius: 5,
              border: theme => `1px dashed ${theme.palette.primary.main}`,
            }}
          >
            <img
              src={activityPhotoImg}
              style={{ height: 50, marginBottom: 12 }}
            />
            <Typography sx={{ fontSize: 14 }}>Select from Offli</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <IconButton onClick={onBackClicked} color="primary">
          <ArrowBackIosNewIcon />
        </IconButton>
        {/* <OffliButton
          onClick={onBackClicked}
          sx={{ width: '40%' }}
          variant="text"
        >
          Back
        </OffliButton> */}
        <OffliButton
          sx={{ width: '60%' }}
          disabled={!formState.isValid}
          type="submit"
        >
          Create
        </OffliButton>
      </Box>
    </>
  )
}
