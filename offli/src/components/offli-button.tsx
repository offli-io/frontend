import { Button, ButtonProps } from '@mui/material'

interface IOffliButtonProps extends ButtonProps {
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
  children: React.ReactElement | string
  type?: 'submit' | 'button' | 'reset'
}

const OffliButton: React.FC<IOffliButtonProps> = ({
  children,
  disabled,
  onClick,
  type = 'button',
  ...rest
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="contained"
      type={type}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default OffliButton
