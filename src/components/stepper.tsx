import MobileStepper from '@mui/material/MobileStepper';
import { SxProps } from '@mui/material/styles';

interface IDotsMobileStepperProps {
  containerSx?: SxProps;
  activeStep: number;
}

export default function DotsMobileStepper({ containerSx, activeStep }: IDotsMobileStepperProps) {
  return (
    <MobileStepper
      variant="progress"
      steps={6}
      position="static"
      activeStep={activeStep}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 5,
        '& span': {
          width: '100%',
          height: '100%'
        },
        ...containerSx
      }}
      nextButton={<></>}
      backButton={<></>}
    />
  );
}
