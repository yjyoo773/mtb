import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ThemeType } from '../../../style/theme'
import { Study } from '../../../types/types'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
}))

export interface IrbDetailsProps {
  study: Study
  isFinished: boolean
}

const IrbDetails: React.FunctionComponent<IrbDetailsProps> = ({
  study,
  isFinished
}: IrbDetailsProps) => {
  const classes = useStyles()

  return (
    <>
      {' '}
      <h3>IrbDetails </h3>

      {isFinished && <Button>Button</Button>}
    </>
  )
}

export default IrbDetails
