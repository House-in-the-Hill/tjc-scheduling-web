import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';

import { ValidatedTextField, stringLengthCheck } from '../../shared/ValidatedTextField';
import { ValidatedSelect } from '../../shared/ValidatedSelect';
import { useValidatedField } from '../../shared/Hooks/useValidatedField';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface NewServiceFormProps {
  order?: number;
  onSubmit: (name: string, order: number, dayOfWeek: number) => void;
  onClose: (arg: any) => void;
  error: any;
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const NewServiceForm = ({
  order,
  onSubmit,
  onClose,
  error,
}: NewServiceFormProps) => {
  const [
    serviceName,
    setServiceName,
    setServiceNameError,
    resetServiceNameError,
  ] = useValidatedField('', 'Must have a title that is less than 32 characters');
  const [dayOfWeek, setDayOfWeek, setDayWeekError, resetDayWeekError] = useValidatedField(
    -1,
    'Must select a day of the week',
  );

  const classes = useStyles();
  const serviceOrder = order + 1;

  function onSubmitForm() {
    resetServiceNameError();
    resetDayWeekError();

    if (
      serviceName.value.length > 0 &&
      serviceName.value.length < 32 &&
      dayOfWeek.value >= 0
    )
      onSubmit(serviceName.value, serviceOrder, dayOfWeek.value);
    setServiceNameError(stringLengthCheck(serviceName.value));
    setDayWeekError(dayOfWeek.value < 0);
  }

  return (
    <div className={classes.root}>
      New Service Form
      {error && <div style={{ color: 'red' }}>Service name already taken</div>}
      <form>
        <ValidatedTextField
          className={classes.formInput}
          name="Service Name"
          label="Service Name"
          input={serviceName}
          handleChange={setServiceName}
          autoFocus
        />
        <ValidatedSelect
          className={classes.selectInput}
          input={dayOfWeek}
          onChange={setDayOfWeek}
          toolTip={{ id: 'Day of Week', text: 'Select day' }}
        >
          <MenuItem value={-1}>
            Select which day of the week this schedule is for
          </MenuItem>
          {daysOfWeek.map((day, index) => (
            <MenuItem key={index.toString()} value={index}>
              {day}
            </MenuItem>
          ))}
        </ValidatedSelect>
      </form>
      <button onClick={onSubmitForm}>Create new service</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 400,
      width: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    formInput: { width: 300 },
    selectInput: {
      width: 300,
    },
  }),
);
