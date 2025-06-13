import React, { forwardRef } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import SearchIcon from 'docs/src/modules/branding/icons/Search';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'isOpen'> {
  onClear?: () => void;
  isOpen: boolean;
}
const Wrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));
const IconWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  pointerEvents: 'none',
  color: theme.palette.text.disabled,
}));
const StyledInput = styled('input', {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{
  isOpen: boolean;
}>(({ theme, isOpen }) => ({
  width: '100%',
  padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
  paddingLeft: `calc(${theme.spacing(2)} + 30px)`,
  fontSize: '1rem',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  borderBottomLeftRadius: isOpen ? 0 : '20px',
  borderBottomRightRadius: isOpen ? 0 : '20px',

  color: theme.palette.text.primary,
  outline: 'none',
  boxShadow: 'none',

  '&:focus:not(:focus-visible)': {
    outline: 'none',
    boxShadow: 'none',
  },

  '&:focus-visible': {
    outline: `1px solid ${theme.palette.divider}`,
    outlineOffsetOffset: 1,
  },
}));

const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ value, placeholder, onChange, onClear, isOpen, ...rest }, ref) => {
    return (
      <Wrapper>
        <IconWrapper>
          <SearchIcon fontSize="small" />
        </IconWrapper>

        <StyledInput
          isOpen={isOpen}
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...rest}
        />
      </Wrapper>
    );
  },
);
SearchInput.displayName = 'SearchInput';

export default SearchInput;
