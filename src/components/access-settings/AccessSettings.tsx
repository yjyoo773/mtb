import {useStudy} from '@components/studies/studyHooks'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import ParticipantService from '@services/participants.service'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import {ReactComponent as Delete} from '../../assets/trash.svg'
import {useUserSessionDataState} from '../../helpers/AuthContext'
import Utility from '../../helpers/utility'
import AccessService from '../../services/access.service'
import {latoFont, poppinsFont} from '../../style/theme'
import {MTBHeadingH1} from '../widgets/Headings'
import {Access, getRolesFromAccess, NO_ACCESS} from './AccessGrid'
import AccountListing from './AccountListing'
import MemberInvite, {NewOrgAccount} from './MemberInvite'

const useStyles = makeStyles(theme => ({
  root: {
    //border: '1px solid black',
    marginTop: theme.spacing(12),
    display: 'flex',
    padding: 0,
  },
  heading: {
    fontFamily: poppinsFont,
    fontSize: '18px',
    lineHeight: '27px',
    '& p': {
      color: '#fff',
    },
  },
  yellowButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#FFE500',
    borderRadius: '0px',
    fontFamily: latoFont,
    fontSize: '15px',
    padding: theme.spacing(1, 2),
  },
  newOrgAccount: {
    position: 'relative',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(6, 4, 8, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(6, 0, 8, 0),
    },
    '&$error': {
      border: `1px solid ${theme.palette.error.main}`,
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addNewDialogHeader: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
    textAlign: 'center',
    padding: theme.spacing(10, 6, 4, 6),
  },
  addNewDialogBody: {
    padding: theme.spacing(10, 21, 3, 21),
    backgroundColor: theme.palette.background.default,
  },
  iconButton: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(3),
    padding: 0,
    color: theme.palette.common.white,
  },
  buttons: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',

    '& > *': {
      '&:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
  },
  error: {},
}))

type AccessSettingsOwnProps = {
  title?: string
  paragraph?: string
}

type AccessSettingsProps = AccessSettingsOwnProps & RouteComponentProps

function CreateNewOrgAccountTemplate() {
  const newOrgAccount: NewOrgAccount = {
    id: new Date().getTime() + ' ' + Math.random,
    access: NO_ACCESS,
    isAdded: false,
  }
  return newOrgAccount
}

async function createNewAccount(
  email: string,
  access: Access,
  token: string,
  currentUserOrg: string
) {
  try {
    const {principalId, firstName, lastName} =
      await AccessService.getAliasFromSynapseByEmail(email)

    const demoExternalId =
      await ParticipantService.signUpForAssessmentDemoStudy(token!)

    await AccessService.createIndividualAccount(
      token!,
      email,
      principalId,
      firstName,
      lastName,
      currentUserOrg,
      {demoExternalId},
      getRolesFromAccess(access)
    )

    return [true]
  } catch (error) {
    return [false, error]
  }
}
function filterNewAccountsByAdded(
  accounts: NewOrgAccount[],
  isAdded: boolean = true
) {
  const result = accounts.filter(acct => acct.isAdded === isAdded)
  return result
}

const AccessSettings: FunctionComponent<
  AccessSettingsProps & RouteComponentProps
> = () => {
  let {id} = useParams<{
    id: string
  }>()

  const {data: study, error: studyError} = useStudy(id)

  const classes = useStyles()

  const [isOpenInvite, setIsOpenInvite] = React.useState(false)
  const [newOrgAccounts, setNewOrgAccounts] = React.useState<NewOrgAccount[]>([
    CreateNewOrgAccountTemplate(),
  ])

  const sessionData = useUserSessionDataState()
  const {token, orgMembership} = sessionData
  const [updateToggle, setUpdateToggle] = React.useState(false)

  const closeInviteDialog = () => {
    setNewOrgAccounts(_ => [CreateNewOrgAccountTemplate()])
    setIsOpenInvite(false)
  }

  const removeNewOrgAccount = (accountId: string) => {
    const remaining = newOrgAccounts.filter((acct, i) => acct.id !== accountId)
    setNewOrgAccounts(_ => remaining)
  }

  const updateNewOrgAccount = (updatedNewAccount: NewOrgAccount) => {
    setNewOrgAccounts(prev =>
      prev.map(acct => {
        return acct.id !== updatedNewAccount.id ? acct : updatedNewAccount
      })
    )
  }

  const inviteUsers = async (newAccounts: NewOrgAccount[]) => {
    for (const account of newAccounts.filter(a => !a.isAdded)) {
      if (!account.email) {
        updateNewOrgAccount({...account, error: 'No email provided'})
        return
      }
      const [success, error] = await createNewAccount(
        account.email,
        account.access,
        token!,
        orgMembership!
      )
      if (success) {
        updateNewOrgAccount({...account, isAdded: true})
      } else {
        const errorString = error.message || error.reason
        updateNewOrgAccount({...account, error: errorString})
      }
    }
    setUpdateToggle(prev => !prev)
  }

  if (!study) {
    return <></>
  }

  const userIsAdmin = Utility.isInAdminRole()
  return (
    <Box pb={8}>
      <Container maxWidth="md" className={classes.root}>
        <Paper elevation={2} style={{width: '100%'}}>
          <AccountListing
            sessionData={sessionData}
            updateToggle={updateToggle}
            study={study}>
            {userIsAdmin && (
              <Button
                onClick={() => setIsOpenInvite(true)}
                variant="contained"
                className={classes.yellowButton}>
                + Invite a Member
              </Button>
            )}
          </AccountListing>
        </Paper>
      </Container>
      <Dialog
        open={isOpenInvite}
        maxWidth="md"
        fullWidth
        aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.addNewDialogHeader} disableTypography>
          <MailOutlineIcon style={{width: '25px'}}></MailOutlineIcon>

          <div className={classes.heading}>
            Invite Team Members to:
            <MTBHeadingH1>{study.name || ''}</MTBHeadingH1>
          </div>
          <IconButton
            aria-label="close"
            className={classes.iconButton}
            onClick={() => {
              closeInviteDialog()
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.addNewDialogBody}>
          {/* <pre>
            Enter 'sErr' in email address to simulate synapse error. Enter
            'bErr' in email address to simulate bridge error.
         </pre>*/}
          {filterNewAccountsByAdded(newOrgAccounts).length > 0 && (
            <>
              <Paper
                elevation={2}
                key={'success'}
                className={clsx(classes.newOrgAccount)}>
                <strong style={{marginRight: '16px'}}>
                  Added Successfully:
                </strong>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center">
                  {filterNewAccountsByAdded(newOrgAccounts).map(acct => (
                    <Box>{acct.email}</Box>
                  ))}
                </Box>
              </Paper>
            </>
          )}

          {filterNewAccountsByAdded(newOrgAccounts, false).map(
            (newOrgAccount, index) => (
              <Paper
                elevation={2}
                className={clsx(
                  classes.newOrgAccount,
                  newOrgAccount.error && classes.error
                )}
                key={index + new Date().getTime()}>
                {newOrgAccounts.length > 1 && (
                  <IconButton
                    aria-label="delete"
                    className={classes.iconButton}
                    onClick={() => removeNewOrgAccount(newOrgAccount.id)}>
                    <Delete></Delete>
                  </IconButton>
                )}
                <MemberInvite
                  newOrgAccount={newOrgAccount}
                  index={index}
                  onUpdate={(newOrgAccount: NewOrgAccount) =>
                    updateNewOrgAccount(newOrgAccount)
                  }
                />
              </Paper>
            )
          )}
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              setNewOrgAccounts(prev => [
                ...prev,
                CreateNewOrgAccountTemplate(),
              ])
            }>
            + Add Another Member
          </Button>
          <Box className={classes.buttons}>
            <Button
              onClick={() => closeInviteDialog()}
              color="secondary"
              variant="outlined"
              style={{
                display:
                  filterNewAccountsByAdded(newOrgAccounts, false).length === 0
                    ? 'none'
                    : 'inherit',
              }}>
              Cancel
            </Button>
            <Button
              onClick={() => inviteUsers(newOrgAccounts)}
              color="primary"
              variant="contained"
              style={{
                display:
                  filterNewAccountsByAdded(newOrgAccounts, false).length === 0
                    ? 'none'
                    : 'inherit',
              }}>
              <MailOutlineIcon />
              &nbsp;Invite To Study
            </Button>
            <Button
              onClick={() => closeInviteDialog()}
              color="primary"
              variant="contained"
              style={{
                display:
                  filterNewAccountsByAdded(newOrgAccounts, false).length === 0
                    ? 'inherit'
                    : 'none',
              }}>
              Done
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default AccessSettings
