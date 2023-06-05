import { TextInput as MantineInput } from '@mantine/core';
import useStyles from './Input.styles';

interface InputProps {
  dataAutoFocus?: boolean;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  register?: any;
  pattern?: string;
  icon?: React.ReactNode;
  rightSection?: React.ReactNode;
  type?: 'text' | 'email' | 'number' | 'url' | 'search' | 'password';
}

export function Input({
  required,
  type = 'text',
  disabled,
  error,
  icon,
  placeholder,
  pattern,
  dataAutoFocus,
  rightSection,
  register,
}: InputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
      type={type}
      icon={icon}
      data-autofocus={dataAutoFocus}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      pattern={pattern}
      error={error}
      rightSection={rightSection}
      classNames={classes}
      {...register}
    />
  );
}