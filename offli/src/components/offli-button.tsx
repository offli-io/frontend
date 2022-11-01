import { Button, ButtonProps } from '@mui/material'

interface IOffliButtonProps extends ButtonProps {
  disabled?: boolean
  isLoading?: boolean
  onClick?: () => void
  children: React.ReactElement | string
  type?: 'submit' | 'button' | 'reset'
  to?: string
}

const OffliButton: React.FC<IOffliButtonProps> = ({
  children,
  disabled,
  onClick,
  type,
  to,
  ...rest
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="contained"
      type={type}
      href={to}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default OffliButton
