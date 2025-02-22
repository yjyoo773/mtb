import {
  Box,
  makeStyles,
  MenuItem,
  Select,
  SelectProps,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import clsx from 'clsx'
import React from 'react'
import {poppinsFont, ThemeType} from '../../style/theme'

interface StyleProps {
  width: string //px or %
  itemHeight: string
}
const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  root: props => ({
    width: props.width,
    '& .MuiSelect-icon': {
      marginRight: theme.spacing(1),
    },
  }),
  select: props => ({
    height: props.itemHeight,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    outline: 'none',
    transition: '0.25s ease',
    fontSize: '14px',
    //width: '100%',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    paddingLeft: theme.spacing(2),
  }),

  optionClass: props => ({
    width: props.width,
    backgroundColor: 'white',
    height: props.itemHeight,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    transition: '0.25s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    cursor: 'pointer',
  }),
  selectMenu: {
    backgroundColor: 'white',
    '&:focus': {
      backgroundColor: 'white',
    },
  },

  listPadding: {
    padding: theme.spacing(0),
    '& .MuiInputBase-input': {
      backgroundColor: 'inherit',
    },
  },
  listBorder: {
    borderRadius: '0px',
  },
  errorBorder: {
    border: `1px solid ${theme.palette.error.main}`,
  },
  regularBorder: {
    border: '1px solid black',
  },
}))

export interface BlackBorderDropdownStyleProps {
  width: string
  itemHeight?: string
  value: string
  onChange: Function
  dropdown: {value: string; label: string}[]
  emptyValueLabel: string
  hasError?: boolean
  searchableOnChange?: Function
  isSearchable?: boolean
  searchableDescription?: string
}

const BlackBorderDropdown: React.FunctionComponent<
  SelectProps & BlackBorderDropdownStyleProps
> = ({
  value,
  onChange,
  dropdown,
  id,
  emptyValueLabel,
  width,
  itemHeight = '30px',
  hasError,
  searchableOnChange,
  isSearchable,
  searchableDescription,
  ...other
}) => {
  const classes = useStyles({width, itemHeight})
  const selectMenu = (
    <Select
      labelId={id}
      className={classes.root}
      id={id}
      value={value}
      onChange={onChange}
      disableUnderline
      classes={{
        selectMenu: classes.selectMenu,
        root: clsx(
          hasError && classes.errorBorder,
          !hasError && classes.regularBorder,
          classes.select
        ),
      }}
      MenuProps={{
        classes: {
          list: classes.listPadding,
          paper: classes.listBorder,
        },
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      }}
      displayEmpty>
      <MenuItem value="" disabled style={{display: 'none'}}>
        {emptyValueLabel}
      </MenuItem>
      {dropdown.map((el, index) => (
        <MenuItem
          className={classes.optionClass}
          key={index}
          value={el.value}
          id={`investigator-${index}`}>
          {el.label}
        </MenuItem>
      ))}
    </Select>
  )

  const searchableDropdown = (
    <Box>
      <Box style={{fontSize: '14px', fontFamily: poppinsFont}}>
        {searchableDescription || ''}
      </Box>
      <Autocomplete
        value={{value: value, label: value}}
        id={id}
        options={dropdown}
        className={classes.root}
        placeholder="Time Zones"
        renderInput={params => (
          <TextField
            className={classes.listPadding}
            {...params}
            label=""
            variant="outlined"
          />
        )}
        getOptionLabel={option => option.label}
        classes={{paper: classes.listBorder, input: classes.input}}
        onChange={(event, newValue) => {
          if (!searchableOnChange) return
          searchableOnChange(newValue?.value || '')
        }}
      />
    </Box>
  )

  return <Box>{isSearchable ? searchableDropdown : selectMenu}</Box>
}

export default BlackBorderDropdown
