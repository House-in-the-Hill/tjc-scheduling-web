import React, { useState, useRef, useEffect } from 'react';

// react query and data manipulation
import { getScheduleData } from '../../../query/schedules';
import { useQuery, useMutation, useQueryCache } from 'react-query';
import { addService, updateScheduleAssignments } from '../../../store/apis/schedules';
// components
import { NewServiceForm } from './NewServiceForm';
import { useAlertProps } from '../../../shared/types/models';
// material ui and styling
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Dialog } from '@material-ui/core/';
import { showLoadingSpinner } from '../../../shared/styles/loading-spinner';
import { buttonTheme } from '../../../shared/styles/theme.js';

//
// import { extractRoleIds } from '../../../shared/utilities';
import { Table } from './Table';
import { Prompt } from 'react-router-dom';

interface ScheduleContainerProps {
  scheduleId: number;
  isViewed: boolean;
  setAlert: (arg: useAlertProps) => void;
  churchId: number;
}

// makes api calls, distributes data to scheduler
export const ScheduleContainer = ({
  scheduleId,
  isViewed,
  setAlert,
}: ScheduleContainerProps) => {
  const classes = useStyles();
  const cache = useQueryCache();

  // queries
  const { isLoading, error, data } = useQuery(
    ['scheduleData', scheduleId],
    getScheduleData,
    {
      staleTime: 100000000000000,
    },
  );

  // mutations
  const [mutateAddService, { error: mutateAddServiceError }] = useMutation(addService, {
    onSuccess: (data) => {
      cache.invalidateQueries('scheduleData');
      closeDialogHandler(data);
    },
  });
  const [mutateUpdateSchedule, { error: mutateUpdateScheduleError }] = useMutation(
    updateScheduleAssignments,
    {
      onSuccess: (data: any) => {
        cache.invalidateQueries('scheduleData');
        setAlert({ message: data[0].data, status: 'success' });
      },
    },
  );

  // state
  const [isAddServiceVisible, setIsAddServiceVisible] = useState<boolean>(false);
  const [isScheduleModified, setIsScheduleModified] = useState<boolean>(false);
  const changedTasks = useRef<any>({});

  // unused for now
  // const accessLevel = extractRoleIds(localStorage.getItem('access_token')); // must log out/in
  // const role = { id: 1 };

  showLoadingSpinner(isLoading);

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => window.removeEventListener('beforeunload', beforeUnloadHandler);
  }, [beforeUnloadHandler]);

  function beforeUnloadHandler() {
    console.log('calling beforeunloadhandler');
  }

  return (
    <div
      className={classes.scheduleContainer}
      style={{ display: isViewed ? 'block' : 'none' }}
    >
      <button disabled={!isScheduleModified} onClick={() => onSaveScheduleChanges()}>
        Save Changes
      </button>
      <Prompt
        when={isScheduleModified}
        message="You have unsaved changes, are you sure you want to leave? Unsaved changes will be lost"
      />
      {data && (
        <Dialog open={isAddServiceVisible} onClose={closeDialogHandler}>
          <NewServiceForm
            error={mutateAddServiceError}
            order={data.services?.length || 0}
            onSubmit={onNewServiceSubmit}
            onClose={closeDialogHandler}
          />
        </Dialog>
      )}
      {data && (
        <div>
          <Table data={data} access="write" onTaskModified={onTaskModified} />
        </div>
      )}
      <div className={classes.bottomButtonContainer}>
        <button onClick={onAddServiceClick} className={classes.addNewServiceButton}>
          <AddIcon height={50} width={50} />
          <span>Add New Service</span>
        </button>
      </div>
    </div>
  );

  function closeDialogHandler(response: any) {
    setIsAddServiceVisible(false);
    if (response.data) setAlert({ message: response.data, status: 'success' });
  }

  function onAddServiceClick() {
    setIsAddServiceVisible(true);
  }

  function onTaskModified(taskId: number, newAssignee: number, isChanged: boolean) {
    if (isChanged) {
      const updatedChangedTasks = { ...changedTasks.current, [taskId]: newAssignee };
      changedTasks.current = updatedChangedTasks;
    } else if (changedTasks.current[taskId]) delete changedTasks.current[taskId];
    Object.keys(changedTasks.current).length > 0
      ? setIsScheduleModified(true)
      : setIsScheduleModified(false);
  }

  async function onNewServiceSubmit(name: string, order: number, dayOfWeek: number) {
    await mutateAddService({
      name,
      order: order,
      dayOfWeek,
      scheduleId: scheduleId,
    });
    // cleanup
    setIsScheduleModified(false);
  }

  async function onSaveScheduleChanges() {
    await mutateUpdateSchedule(changedTasks.current);
    setIsScheduleModified(false);
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleContainer: {
      position: 'absolute',
      paddingTop: 10,
    },
    bottomButtonContainer: {
      position: 'sticky',
      left: 0,
      display: 'flex',
      width: '100vw',
      justifyContent: 'center',
      paddingBottom: '2rem',
    },
    addNewServiceButton: {
      position: 'sticky',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': {
        ...buttonTheme.filled,
      },
      display: 'flex',
      '& *': {
        margin: 'auto',
      },
    },
  }),
);
