import * as React from 'react';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import {styled} from '@mui/material/styles';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {PickersDay} from '@mui/x-date-pickers/PickersDay';
import {Button, Paper, Popper} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {useSelector} from "react-redux";
import {getFirstDayOfAWeek} from "../store/datesSlice";
import 'dayjs/locale/en-gb';


dayjs.extend(isBetweenPlugin);
const today = dayjs();

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay' && prop !== 'visited' && prop !== 'isFuture',
})(({theme, dayIsBetween, isFirstDay, isLastDay, visited, isFuture}) => ({
  ...(visited && {
    borderRadius: 0,
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.text,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    }
  }),
  ...(isFuture && {
    color: theme.palette.tertiary.main
  }),
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
}));


function Day(props) {
  const {day, selectedDay, ...other} = props;

  const browsedDates = useSelector((state) => state.dates);
  const firstDay = getFirstDayOfAWeek(day);
  const visited = browsedDates.some(browsedDay => browsedDay === firstDay);

  const isFuture = day > today;


  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }

  const start = selectedDay.startOf('week');
  const end = selectedDay.endOf('week');

  const dayIsBetween = day.isBetween(start, end, null, '[]');
  const isFirstDay = day.isSame(start, 'day');
  const isLastDay = day.isSame(end, 'day');

  return (

    <CustomPickersDay
      {...other}
      day={day}
      sx={(dayIsBetween || visited) ? {px: 2.5, mx: 0} : {}}
      dayIsBetween={dayIsBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
      visited={visited}
      isFuture={isFuture}
    />
  );
}


export default function CustomDay({value, setValue}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const onDateChange = (newValue) => {
    if (newValue < today) {
      const friday = newValue.startOf('week').add(5, 'days')
      setValue(friday);
      setAnchorEl(null);
    }
  }

  return (
    <>
      <Button aria-describedby={id} onClick={handleClick} variant="outlined">
        <CalendarMonthIcon/> Select week
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} style={{zIndex: 9}}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <Paper>
            <DateCalendar
              value={value}
              onChange={onDateChange}
              slots={{day: Day}}
              slotProps={{
                day: {
                  selectedDay: value,
                },
              }}

            />
          </Paper>
        </LocalizationProvider>
      </Popper>
    </>

  );
}