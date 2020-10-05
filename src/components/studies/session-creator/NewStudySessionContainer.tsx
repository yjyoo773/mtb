import React, { ChangeEvent, FunctionComponent } from 'react'

import clsx from 'clsx'
import {
  makeStyles,
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'

import {StudySession } from '../../../types/types'


const useStyles = makeStyles({
  root: {
    padding: '12px',
    border: '1px solid #C4C4C4',
    width: '265px',
    marginRight: '26px',
  },
})

type NewStudySessionContainerProps = {
  onAddSession: Function
  sessions: StudySession[]
}

const NewStudySessionContainer: FunctionComponent<NewStudySessionContainerProps> = ({
  onAddSession,
  sessions,
}: NewStudySessionContainerProps) => {
  const classes = useStyles()



  const copySession = (event: React.ChangeEvent<{ value: unknown }>) => {
    const sessionId = event.target.value as string
    debugger
    console.log('sessionId:', sessionId)
    const assessments =
      sessions.find(session => session.id === sessionId)?.assessments || []

    onAddSession(sessions, [...assessments])
  }

  return (
    <Box className={clsx(classes.root)}>
      <Button variant="text" onClick={() => onAddSession(sessions, [])}>
        + Create new session
      </Button>

      <InputLabel id="demo-simple-select-label">
        {' '}
        + Duplicate session
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={copySession}
      >
        <MenuItem value="" disabled>
          + Duplicate Session
        </MenuItem>
        {sessions.map(session => (
          <MenuItem value={session.id} key={session.id}>
            {session.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

export default NewStudySessionContainer
