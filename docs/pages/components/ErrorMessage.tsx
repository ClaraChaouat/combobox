import React from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';

const Root = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.875rem',
  marginTop: theme.spacing(0.5),
}));

export default function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <Root role="alert">{children}</Root>;
}
