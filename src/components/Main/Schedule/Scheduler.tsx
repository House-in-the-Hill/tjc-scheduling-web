import React, { useState } from 'react';
import { Table } from './Table';
import {
  MappedScheduleInterface,
  SchedulerProps,
  WeeklyAssignmentInterface,
} from '../../../shared/types';

export const Scheduler = ({ schedule }: SchedulerProps) => {
  const { day, name, data, columns } = schedule;
  console.log('whats going on', data);
  const [scheduleData, setScheduleData] = useState(data);

  const updateMyData = (rowIndex: number, columnId: string, value: string) =>
    setScheduleData((old: WeeklyAssignmentInterface[]) =>
      old.map((row: any, index: any) =>
        index === rowIndex ? { ...old[rowIndex], [columnId]: value } : row,
      ),
    );

  return (
    <Table
      columns={columns}
      data={scheduleData}
      updateMyData={updateMyData}
      title={name}
    />
  );
};
