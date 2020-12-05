import React, { useState, useRef, useEffect } from 'react';
import { useTable } from 'react-table';

// Components
import { UpdatableCell, DataCell } from './TableCell';
import { ContextMenu } from '../../shared/ContextMenu';
import { days } from '../../../shared/utilities/dateHelper';

// Material-UI Components
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// Types
import { TableProps } from '../../../shared/types';

// Styles
import {
  typographyTheme,
  buttonTheme,
  paletteTheme,
} from '../../../shared/styles/theme.js';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { fade, darken } from '@material-ui/core/styles';

export const Table = React.memo(
  ({ columns, data, title, access, day, selectedCell, onCellClick }: TableProps) => {
    const outerRef = useRef(null);
    const classes = useStyles();
    const [dataRows, setDataRows] = useState([...data]);

    columns.forEach((entry) => {
      //add Cell property to each entry, which is used to pass props to the component
      entry.Cell = (props: any) => {
        return <DataCell {...props} />;
      };
    });

    const tableConfig =
      access === 'write'
        ? React.useMemo(
            () => ({
              columns,
              data: dataRows,
              // defaultColumn: { Cell: DataCell },
            }),
            [columns, dataRows],
          )
        : React.useMemo(
            () => ({
              columns: columns,
              data: dataRows,
              // defaultColumn: { Cell: DataCell },
            }),
            [columns, dataRows],
          );

    const { getTableProps, headerGroups, rows, prepareRow } = useTable(tableConfig);

    return (
      <>
        {access}
        {title && (
          <h3 className={classes.titleContainer}>
            <span className={classes.titleText}>
              {days[day]} {title}
            </span>
          </h3>
        )}

        <ContextMenu
          outerRef={outerRef}
          addRowHandler={insertRow}
          deleteRowHandler={deleteRow}
        />
        <MaUTable {...getTableProps()} className={classes.table} ref={outerRef}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell
                    className={classes.headerCell}
                    {...column.getHeaderProps()}
                    key={index}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} id={i.toString()}>
                  {row.cells.map((cell, index) => {
                    const cellKey = `${title}_${cell.column.Header}_${cell.row.id}`;

                    return (
                      <TableCell
                        className={classes.cell}
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {cell.render('Cell', {
                          onCellClick: () => onCellClick(cellKey),
                          isSelected: cellKey === selectedCell,
                        })}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </>
    );

    // make these blank later
    function cleanRow(row: any) {
      Object.keys(row).forEach(function (key) {
        if (key !== 'duty' && key !== 'time')
          row[key] = {
            data: {
              firstName: 'Mike',
              lastName: 'Wazowski',
              userId: 5,
              role: { id: 2, name: 'Interpreter' },
            },
          };
        else row[key] = { data: { display: '' } };
      });
      return row;
    }

    function deleteRow(rowIndex: number) {
      const newData = [...dataRows];
      newData.splice(rowIndex, 1);
      setDataRows(newData);
    }

    function insertRow(rowIndex: number) {
      const newRow = cleanRow({ ...dataRows[rowIndex] });
      const tempData = [...dataRows];
      tempData.splice(rowIndex, 0, newRow);
      setDataRows(tempData);
    }
  },
);

const normalCellBorderColor = 'rgba(234, 234, 234, 1)';
const normalCellBorder = `1px solid ${normalCellBorderColor}`;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleContainer: {
      margin: '5px 0 2px',
      height: '2rem',
      width: '200vw',
      position: 'sticky',
      left: '8px',
    },
    titleText: {
      ...theme.typography.h3,
      marginTop: 5,
      marginBottom: 2,
      position: 'sticky',
      left: '8px',
    },
    headerCell: {
      textAlign: 'center',
      padding: '1px 2px',
      color: typographyTheme.common.color,
      border: normalCellBorder,
      fontWeight: 'bold',
    },
    cell: {
      padding: '0px 0px 1px',
      border: normalCellBorder,
      '&:not(:first-child)': {
        minWidth: '2ch',
      },
      '& input': {
        // width: '20ch',
        // padding: '10px 15px 3px',
        // ...horizontalScrollIndicatorShadow('transparent'),
      },
    },
    table: {
      borderCollapse: 'inherit',
      marginBottom: '1rem',

      // first two columns:
      '& td:first-child, td:nth-child(2), th:first-child, th:nth-child(2)': {
        background: 'white',
        position: 'sticky',
        zIndex: 1,
        border: normalCellBorder,
        boxSizing: 'border-box',
      },

      // first column:
      '& td:first-child, th:first-child': {
        left: '8px',
        width: '12ch', // need this when there's very few columns
        '& input': {
          width: '12ch',
          textAlign: 'center',
        },
        '&:before': {
          content: '""',
          background: 'white',
          position: 'absolute',
          width: '8px',
          top: '-1px',
          left: '-9px',
          height: '106%',
        },
      },

      // second column:
      '& td:nth-child(2), th:nth-child(2)': {
        left: '135px',
        width: '14ch', // need this when there's very few columns
        '& input': {
          width: '14ch',
        },
        borderRightWidth: 0,
        '&:after': {
          content: '""',
          background: fade(paletteTheme.common.lightBlue, 0.15),
          position: 'absolute',
          width: '5px',
          top: '-1px',
          left: 'calc(100% - 2.5px)',
          height: '106%',
        },
      },

      // third column:
      '& td:nth-child(3), th:nth-child(3)': {
        borderLeftWidth: 0,
      },

      // last row:
      '& tr:last-child td': {
        borderBottomWidth: '2px',
        borderBottomColor: darken(normalCellBorderColor, 0.25),
      },
    },
  }),
);
