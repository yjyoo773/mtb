import {
  DialogButtonPrimary,
  DialogButtonSecondary,
  SimpleTextInput,
  SimpleTextLabel,
} from '@components/widgets/StyledComponents'
import {
  Box,
  DialogActions,
  DialogContent,
  FormControl,
  FormGroup,
  makeStyles,
} from '@material-ui/core'
import {EditableParticipantData} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {latoFont} from '../../../../style/theme'

const useStyles = makeStyles(theme => ({
  withdrawalNotice: {
    fontSize: '16px',
    fontFamily: latoFont,

    '& p': {
      marginBottom: '16px',
      marginTop: '0',
    },
  },
}))

type WithdrawParticipantFormProps = {
  isEnrolledById: boolean
  participant: EditableParticipantData
  onOK: Function
  onCancel: Function
}

const WithdrawParticipantForm: FunctionComponent<WithdrawParticipantFormProps> =
  ({isEnrolledById, participant, onOK, onCancel}) => {
    const classes = useStyles()
    const [note, setNote] = React.useState('')
    return (
      <>
        <DialogContent>
          <Box className={classes.withdrawalNotice}>
            <p>
              Withdrawing means you will no longer collect data on this
              participant and will not be able to contact them through the app.
            </p>
            <p>
              Are you sure you would like to withdraw the following participant:
            </p>
            <p>
              {isEnrolledById
                ? participant.externalId
                : participant.phoneNumber}
            </p>
            <p>
              <strong>This action cannot be undone.</strong>
            </p>
          </Box>
          <FormGroup>
            <FormControl>
              <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
              <SimpleTextInput
                fullWidth
                rowsMax={5}
                inputProps={{maxLength: 256}}
                placeholder="note"
                onChange={e => setNote(e.target.value)}
                id="note"
                multiline={true}
                rows={5}
              />
            </FormControl>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <DialogButtonSecondary onClick={() => onCancel()} color="primary">
            Cancel
          </DialogButtonSecondary>
          <DialogButtonPrimary
            onClick={() => onOK(note)}
            color="primary"
            autoFocus>
            Yes, withdraw participant
          </DialogButtonPrimary>
        </DialogActions>
      </>
    )
  }

export default WithdrawParticipantForm
