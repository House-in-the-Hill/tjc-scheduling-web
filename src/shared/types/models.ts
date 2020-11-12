export interface HttpError {
  status: number;
  message: string;
}

export interface HttpErrorProps {
  status: number;
  message: string;
}

export interface PasswordState {
  value: string;
  visible: boolean;
  valid: boolean;
  message: string;
}

export interface EmailState {
  value: string;
  valid: boolean;
  message: string;
}

export interface JWTDataType {
  iss: string;
  sub: string;
  exp: string;
  type: string;
  access: string;
}

export interface ColumnFields {
  Header: string;
  accessor: string;
}

export type DayIndexOptions = {
  [key: string]: number;
};

export interface WeeklyAssignmentInterface {
  time?: string;
  duty: string;
  [key: string]: string;
}
export interface MappedScheduleInterface {
  day: string;
  name: string;
  columns: ColumnFields[];
  data: WeeklyAssignmentInterface[];
  role: any;
}

export interface WeeklyAssignment {
  [key: string]: string;
}

export interface TaskData {
  date: string;
  assignee: string;
}
export interface DutyData {
  title: string;
  tasks: TaskData[];
  team?: string;
}
export interface EventData {
  time: string;
  duties: DutyData[];
  tag?: string;
}
export interface WeeklyEventData {
  day: string;
  events: EventData[];
  dividers: Divider[];
  order: number;
}
export interface TimeRange {
  start: string;
  end: string;
}
export interface Divider {
  name: string;
  timerange: TimeRange;
}
export interface ScheduleData {
  title: string;
  id: string;
  view: string;
  daterange: string[];
  weeklyEvents: WeeklyEventData[];
  specificEvents?: any[];
}

export interface ScheduleInterface {
  columns: ColumnFields[];
  day: string;
}
interface CellIndexType {
  index: number;
}

interface CellColumnType {
  id: string;
}
export interface UpdatableCellProps {
  value: any;
  row: CellIndexType;
  column: CellColumnType;
  updateMyData: (rowIndex: number, columnId: string, value: string) => void;
}
export interface DataCellProps {
  value: any;
  row: CellIndexType;
  column: CellColumnType;
}

type AccessTypes = 'read' | 'write';

export interface TableProps {
  columns: ColumnFields[];
  data: WeeklyAssignmentInterface[];
  updateMyData: (rowIndex: number, columnId: string, value: string) => void;
  title: string;
  access: AccessTypes;
}

export interface SchedulerProps {
  schedule: MappedScheduleInterface;
  role: any;
}

export interface ScheduleTabsProps {
  titles: string[];
  tabIdx: number;
  handleChange: (e: React.ChangeEvent, value: number) => void;
}

export interface AddUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  churchId: number;
}
