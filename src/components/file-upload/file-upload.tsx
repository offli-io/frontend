import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Box, IconButton, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { toast } from 'sonner';
import { ALLOWED_PHOTO_EXTENSIONS } from 'utils/common-constants';
import FileUploadModal from './components/file-upload-modal';

interface IFileUploadProps {
  uploadFunction?: (data?: FormData) => void;
}

const FileUpload: React.FC<IFileUploadProps> = ({ uploadFunction }) => {
  const [localFile, setLocalFile] = React.useState<any>();
  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const { palette } = useTheme();

  const handleFileUpload = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) {
      return;
    }
    // we are not checking file size now
    // if (file.size > MAX_FILE_SIZE) {
    //   enqueueSnackbar("File is too large", { variant: "error" });
    //   return;
    // }

    // check file format
    const fileExtension = file.name.split('.').pop();
    if (fileExtension && !ALLOWED_PHOTO_EXTENSIONS.includes(fileExtension)) {
      toast.error('Unsupported file format');
      return;
    }
    setLocalFile(URL.createObjectURL(file));
  }, []);

  return (
    <>
      <FileUploadModal
        uploadFunction={uploadFunction}
        localFile={localFile}
        onClose={() => setLocalFile(null)}
        aspectRatio={390 / 300}
      />
      <Box
        sx={{
          width: '65%',
          height: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          bgcolor:
            palette?.mode === 'light' ? palette?.primary?.light : palette?.background?.default,
          borderRadius: 5,
          border: (theme) => `1px dashed ${theme.palette.primary.main}`
        }}
        onClick={() => hiddenFileInput?.current?.click()}>
        <input
          onChange={handleFileUpload}
          type="file"
          style={{ display: 'none' }}
          ref={hiddenFileInput}
          // setting empty string to always fire onChange event on input even when selecting same pictures 2 times in a row
          value={''}
          accept="image/*"
        />
        <IconButton size="large" data-testid="upload-img-btn">
          <AddAPhotoIcon sx={{ color: 'primary.main' }} />
        </IconButton>
        <Typography sx={{ fontSize: 16, color: palette?.primary?.main }}>
          Upload from your phone
        </Typography>
      </Box>
    </>
  );
};
export default FileUpload;
