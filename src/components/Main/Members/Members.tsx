import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '../../../shared/types/useSelector';

// material UI
import { fade, makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import CSS from 'csstype';

// shared components
import { ConfirmationDialog } from '../../shared/ConfirmationDialog';
import { FormDialog } from '../../shared/FormDialog';

// member page components
import { MembersSidebar } from './MembersSidebar';
import { MembersHeader } from './MembersHeader';
import { MembersUsersTable } from './MembersUsersTable';

// actions
import { onLoadMembers, onLoadUser, onDeleteMembers, onAddMember } from '../../../store/actions';

// other stuffs
import { validateEmail } from '../../../store/actions/helper_functions';

// types
import {MemberStateData} from '../../../store/types';

const styleHead: CSS.Properties = {
  fontWeight: 'bold'
}

export const Members = () => {
  // hooks
  const dispatch = useDispatch();

  // reducer state
  const members = useSelector(({members}) => members.members);
  const selectedUser = useSelector(({members}) => members.selectedUser);
  const localChurch = useSelector(({members}) => members.localChurch);

  // component state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchfield, setSearchField] = useState<string>('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const isSelected = (id: number) => selectedRows.indexOf(id) !== -1;

  useEffect(() => {
    dispatch(onLoadMembers());
  }, [])

  const onOpenDeleteMemberDialog = () => {
    if (selectedRows.length > 0) setIsConfirmDialogOpen(true);
  };
  
  const onOpenAddMemberDialog = () => {
    setIsAddDialogOpen(true);
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedRows = members.map((member) => member.id);
      setSelectedRows(newSelectedRows);
      return;
    }
    setSelectedRows([]);
  }

  const onCloseDeleteMemberDialog = async (value: boolean) => {
    setIsConfirmDialogOpen(false);
    if (value) {
      dispatch(onDeleteMembers(selectedRows))
      setSelectedRows([]);
    }
  };

  const onCloseAddMemberDialog = (value: boolean, firstName: string, lastName: string, email: string, password: string) => {
    setIsAddDialogOpen(false);
    if (value && firstName && lastName && email && password && validateEmail(email)) {
      dispatch(onAddMember(firstName, lastName, email, password));
    }
  }

  const handleRowClick = (event: React.MouseEvent<unknown>, row: MemberStateData) => {
    event.stopPropagation();
    const selectedIndex = selectedRows.indexOf(row.id);
    console.log(selectedRows, selectedIndex, selectedRows.slice(1));
    let newSelectedRows: number[] = [];
    if (event.ctrlKey) {
      if (selectedIndex === -1) {
        newSelectedRows = newSelectedRows.concat(selectedRows, row.id);
      } else if (selectedIndex === 0) {
        newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
      } else if (selectedIndex === selectedRows.length -1) {
        newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelectedRows = newSelectedRows.concat(
          selectedRows.slice(0, selectedIndex), 
          selectedRows.slice(selectedIndex + 1),
        );
      }
    } else {
      if (selectedIndex === -1)
        newSelectedRows = [row.id]
      else
        newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
    }
    dispatch(onLoadUser(row));
    setSelectedRows(newSelectedRows);
  }

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(members)
    setSearchField(event.target.value);
  }

  const filteredUsers = members.filter(function(row: any) {
    for (var key in row) {
      if (key === 'roles' || key === 'id' || key === 'ChurchId' || key === 'church') continue;
      if (key === 'disabled') {
        if (row[key].toString().toLowerCase().includes(searchfield.toLowerCase())) return true;
      } else {
        if (row[key].toLowerCase().includes(searchfield.toLowerCase())) return true;
      }
    }
    return false;
  })

  return (
    <Grid container spacing={3}>
      <MembersSidebar selectedUser={selectedUser} />
      <Grid item xs={9}>
        <MembersHeader 
          localChurch={localChurch}
          onSearchChange={onSearchChange}
          handleAddOpen={onOpenAddMemberDialog}
          handleDeleteOpen={onOpenDeleteMemberDialog}
        />
        <MembersUsersTable 
          selectedRows={selectedRows}
          handleSelectAllClick={handleSelectAllClick}
          filteredUsers={filteredUsers}
          isSelected={isSelected}
          handleRowClick={handleRowClick}
        />
      </Grid>
      <ConfirmationDialog isOpen={isConfirmDialogOpen} handleClose={onCloseDeleteMemberDialog} title='Confirm Delete Action'/>
      <FormDialog isOpen={isAddDialogOpen} handleClose={onCloseAddMemberDialog} title='Add User'/>
    </Grid>
  );
};