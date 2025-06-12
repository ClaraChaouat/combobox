import React, { forwardRef } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';

const Wrapper = styled('div')(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}));

const StyledInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(1)} ${theme.spacing(4)} ${theme.spacing(1)} ${theme.spacing(2)}`,
  fontSize: '1rem',
  borderRadius: 24,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 0,
  },
}));

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, onClear, ...rest }, ref) => {
    return (
      <Wrapper>
        <StyledInput ref={ref} value={value} onChange={onChange} {...rest} />
      </Wrapper>
    );
  },
);
SearchInput.displayName = 'SearchInput';

export default SearchInput;
