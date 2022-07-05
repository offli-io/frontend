import { Button, ButtonProps } from '@mui/material'

interface IOffliButtonProps extends ButtonProps {
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
  children: React.ReactElement | string
}

const OffliButton: React.FC<IOffliButtonProps> = ({
  children,
  disabled,
  onClick,
  ...rest
}) => {
  return (
    <Button disabled={disabled} onClick={onClick} variant="contained" {...rest}>
      {children}
    </Button>
  )
}

export default OffliButton
