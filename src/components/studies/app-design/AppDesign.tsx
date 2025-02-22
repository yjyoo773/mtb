import {ReactComponent as PhoneTopImgLeftHighlighted} from '@assets/appdesign/CustomizeAppTopbarLeft.svg'
import {ReactComponent as PhoneTopImgRightHighlighted} from '@assets/appdesign/CustomizeAppTopbarRight.svg'
import PhoneBg from '@assets/appdesign/phone_bg.svg'
import {ReactComponent as PhoneBottomImg} from '@assets/appdesign/phone_buttons.svg'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import {MTBHeadingH1, MTBHeadingH2} from '@components/widgets/Headings'
import SaveButton from '@components/widgets/SaveButton'
import {useUserSessionDataState} from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  Paper,
  Switch,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import StudyService from '@services/study.service'
import {latoFont, playfairDisplayFont, ThemeType} from '@style/theme'
import constants from '@typedefs/constants'
import {Contact, Study, SubType, WelcomeScreenData} from '@typedefs/types'
import clsx from 'clsx'
import _ from 'lodash'
import React, {ChangeEvent, useEffect, useState} from 'react'
import {HexColorPicker} from 'react-colorful'
import {useErrorHandler} from 'react-error-boundary'
import {useLocation} from 'react-router-dom'
import NavigationPrompt from 'react-router-navigation-prompt'
import {useStudy, useUpdateStudyDetail} from '../studyHooks'
import GeneralContactAndSupportSection from './GeneralContactAndSupportSection'
import IrbBoardContactSection from './IrbBoardContactSection'
import StudyPageBottomPhoneContent from './phone/StudyPageBottomPhoneContent'
import StudyPageTopPhoneContent from './phone/StudyPageTopPhoneContent'
import WelcomeScreenPhoneContent from './phone/WelcomeScreenPhoneContent'
import ReadOnlyAppDesign from './read-only-pages/ReadOnlyAppDesign'
import StudyLeadInformationSection from './StudyLeadInformationSection'
import StudySummarySection from './StudySummarySection'
import UploadStudyLogoSection from './UploadStudyLogoSection'
import FormGroupWrapper from './widgets/FormGroupWrapper'
import SectionIndicator from './widgets/SectionIndicator'
import Subsection from './widgets/Subsection'
import TextInputWrapper from './widgets/TextInputWrapper'

const imgHeight = 80
const DEFAULT_CONTACT_NAME = constants.constants.DEFAULT_PLACEHOLDER

export const useStyles = makeStyles((theme: ThemeType) => ({
  root: {counterReset: 'orderedlist'},
  section: {
    backgroundColor: '#fefefe',
    padding: theme.spacing(9, 9, 10, 17),
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(9),
      paddingRight: theme.spacing(2),
    },
  },
  steps: {
    listStyleType: 'none',
    margin: theme.spacing(5, 0, 0, 0),
    padding: 0,
    '& li': {
      display: 'flex',
      marginBottom: theme.spacing(6),
      textAlign: 'left',
    },
    '& li::before': {
      counterIncrement: 'orderedlist',
      content: 'counter(orderedlist)',
      flexShrink: 0,

      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#000',
      borderRadius: '50%',
      width: theme.spacing(5),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(-8),
      height: theme.spacing(5),
    },
  },
  phoneArea: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(3),
    width: theme.spacing(41),
  },
  phone: {
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'url(' + PhoneBg + ')',
    width: '100%',
    marginTop: theme.spacing(4),
    backgroundRepeat: 'no-repeat',
    justifyContent: 'space-between',
    wordWrap: 'break-word',
  },
  phoneBottom: {
    height: '70px',
    overflow: 'hidden',
    marginBottom: theme.spacing(-3),
    width: '320px',
    marginLeft: '5px',
    border: '4px solid black',
    borderTop: '0px none transparent',
    borderRadius: '0 0px 24px 24px',
  },
  phoneTopBar: {
    width: '320px',
    marginLeft: '5px',
    height: `${imgHeight + 16}px`,
    borderRadius: '25px 25px 0 0',
    borderStyle: 'solid',
    borderWidth: '4px 4px 0px 4px',
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  preview: {
    backgroundColor: '#EBEBEB',
    padding: '0 .8rem',
    fontSize: '1.6rem',
    //margin: '0 -50px 30px -50px',
    '& > div': {
      padding: '15px 13px',
    },
    '& img': {
      width: '100%',
    },
  },
  fields: {
    display: 'flex',
    textAlign: 'left',
    flexGrow: 1,
    flexDirection: 'column',
    maxWidth: theme.spacing(51),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  smallScreenText: {
    fontSize: '15px',
    marginTop: theme.spacing(3.75),
    whiteSpace: 'pre-wrap',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '16px',
    lineHeight: '19px',
    fontFamily: 'Lato',
    alignItems: 'center',
    fontWeight: 'bold',
    marginTop: theme.spacing(1.25),
    marginBottom: theme.spacing(2),
  },

  hideSectionVisibility: {
    visibility: 'hidden',
    ':before': {
      content: '',
    },
  },
  sectionOneIndicatorPosition: {
    position: 'absolute',
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(-1.5),
  },
  sectionTwoIndicatorPosition: {
    position: 'absolute',
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(-1.5),
  },
  optionalDisclaimerTextOnPhone: {
    fontSize: '12px',
    fontStyle: 'italic',
    paddingLeft: theme.spacing(4),
    textAlign: 'left',
  },
  studyPageTopBar: {
    backgroundColor: '#F6F6F6',
  },
  hexcodeInput: {
    marginLeft: theme.spacing(2),
    width: '85px',
    height: '30px',
    padding: theme.spacing(0.5, 0.5),
    fontSize: '15px',
    fontFamily: latoFont,
    '&:focus': {
      outline: 'none',
    },
  },
  hexcodeInputContainer: {
    marginLeft: theme.spacing(-1),
    marginTop: theme.spacing(-1.5),
    display: 'flex',
    fontSize: '15px',
    alignItems: 'center',
  },
  //wsm
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  headlineStyle: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '21px',
    lineHeight: '28px',
    whiteSpace: 'pre-line',
  },
  optionalDisclaimerRow: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1.25),
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  checkBox: {
    width: '20px',
    height: '20px',
  },
  optionalDisclaimerText: {
    marginLeft: theme.spacing(2),
    fontSize: '14px',
    lineHeight: '20px',
    fontFamily: 'Lato',
  },
}))

const SimpleTextInputStyles = {
  fontSize: '15px',
  width: '100%',
  height: '44px',
  paddingTop: '8px',
  boxSizing: 'border-box',
} as React.CSSProperties

export type ContactType =
  | 'principal_investigator'
  | 'irb'
  | 'sponsor'
  | 'study_support'

export type PreviewFile = {
  file: File
  name: string
  size: number
  body?: string
  type: string
}

export interface AppDesignProps {
  id: string
  children: React.ReactNode
  onShowFeedback: Function
}

type ErrorStateType = {
  studyTitleHasError?: boolean
  studySummaryCopyHasError?: boolean
  leadPINameHasError?: boolean
  leadPIAffiliationHasError?: boolean
  contactLeadNameHasError?: boolean
  contactLeadPositonHasError?: boolean
  irbRecordNameHasError?: boolean
  irbProtocolIdHasError?: boolean
}

function getPreviewForImage(file: File): PreviewFile {
  const previewFileBody = URL.createObjectURL(file)
  return {
    file: file,
    body: previewFileBody,
    name: file.name,
    size: file.size,
    type: file.type,
  }
}

const PhoneTopBar: React.FunctionComponent<{
  color?: string
  studyLogoUrl?: string
}> = ({color = 'transparent', studyLogoUrl}) => {
  const classes = useStyles()
  return (
    <div
      className={classes.phoneTopBar}
      style={{backgroundColor: color || 'transparent'}}>
      {studyLogoUrl ? (
        <img
          src={studyLogoUrl}
          style={{height: `${imgHeight - 8}px`}}
          alt="study-logo"
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export const WelcomeScreenDisplay: React.FunctionComponent<{
  study: Study
  isReadOnly?: boolean
  studyLogoUrl?: string
}> = ({study, isReadOnly, studyLogoUrl}) => {
  const classes = useStyles()
  return (
    <>
      <Box className={classes.phone}>
        {!isReadOnly && [
          <SectionIndicator
            index={1}
            className={classes.sectionOneIndicatorPosition}
            key={1}
          />,
          <SectionIndicator
            index={2}
            className={classes.sectionTwoIndicatorPosition}
            key={2}
          />,
        ]}
        <PhoneTopBar
          color={study.colorScheme?.background || 'transparent'}
          studyLogoUrl={studyLogoUrl}
        />
        <WelcomeScreenPhoneContent
          welcomeScreenContent={
            study.clientData.welcomeScreenData || ({} as WelcomeScreenData)
          }
          studyTitle={study.name}
          isReadOnly={isReadOnly || false}
        />
        <Box
          className={clsx(
            classes.phoneBottom,
            classes.optionalDisclaimerTextOnPhone
          )}>
          {!study.clientData.welcomeScreenData?.isUsingDefaultMessage &&
          study.clientData.welcomeScreenData?.useOptionalDisclaimer
            ? 'This is a research study and does not provide medical advice, diagnosis, or treatment'
            : ''}
        </Box>
      </Box>
    </>
  )
}

export const StudyPageTopPhone: React.FunctionComponent<{
  study: Study
  getContactPersonObject: Function
  isReadOnly?: boolean
  studyLogoUrl?: string
}> = ({study, getContactPersonObject, isReadOnly, studyLogoUrl}) => {
  const classes = useStyles()
  return (
    <>
      <Box className={classes.phone}>
        <Box className={clsx(classes.phoneTopBar, classes.studyPageTopBar)}>
          <PhoneTopImgLeftHighlighted title="phone top image" width="312px" />
        </Box>
        <StudyPageTopPhoneContent
          studyLogoUrl={studyLogoUrl}
          imgHeight={imgHeight}
          appColor={study.colorScheme?.background || 'transparent'}
          leadInvestigator={getContactPersonObject('principal_investigator')}
          funder={getContactPersonObject('sponsor')}
          studyTitle={study.name}
          studySummaryBody={study.details || ''}
          getContactName={getContactName}
          isReadOnly={isReadOnly || false}
        />
        <Box className={classes.phoneBottom}>
          <PhoneBottomImg title="phone bottom image" />
        </Box>
      </Box>
    </>
  )
}

export const StudyPageBottomPhone: React.FunctionComponent<{
  study: Study
  generalContactPhoneNumber: string
  irbPhoneNumber: string
  getContactPersonObject: Function
  isReadOnly?: boolean
}> = ({
  study,
  generalContactPhoneNumber,
  irbPhoneNumber,
  getContactPersonObject,
  isReadOnly,
}) => {
  const classes = useStyles()
  return (
    <>
      <Box
        className={classes.phone}
        style={{marginTop: isReadOnly ? '30px' : '134px'}}>
        <Box className={clsx(classes.phoneTopBar, classes.studyPageTopBar)}>
          <PhoneTopImgRightHighlighted title="phone top image" width="312px" />
        </Box>
        <StudyPageBottomPhoneContent
          generalContactPhoneNumber={generalContactPhoneNumber}
          irbPhoneNumber={irbPhoneNumber}
          studyID={study.identifier}
          irbProtocolId={study.irbProtocolId || ''}
          ethicsBoardInfo={getContactPersonObject('irb')}
          contactLead={getContactPersonObject('study_support')}
          getContactName={getContactName}
          isReadOnly={isReadOnly || false}
        />
        <div className={classes.phoneBottom}>
          <PhoneBottomImg title="phone bottom image" />
        </div>
      </Box>
    </>
  )
}

export function getContact(
  study: Study | undefined,
  role: ContactType
): Contact | undefined {
  let contacts = study?.contacts
  if (!contacts) {
    return undefined
  }
  var person = contacts.find(el => el.role === role)
  return person ? {...person} : undefined
}

export const formatPhoneNumber = (phoneNumber: string | undefined) => {
  if (!phoneNumber) {
    return ''
  }
  const updatedPhoneNumber = phoneNumber.replace('+1', '')
  if (updatedPhoneNumber.length !== 10) {
    return updatedPhoneNumber
  }
  return (
    updatedPhoneNumber.slice(0, 3) +
    '-' +
    updatedPhoneNumber.slice(3, 6) +
    '-' +
    updatedPhoneNumber.slice(6)
  )
}

export const getContactName = (name: string | undefined) => {
  return name && name !== DEFAULT_CONTACT_NAME ? name : ''
}

export const isAppBackgroundColorValid = (currentColor: string | undefined) => {
  if (!currentColor) return true
  const s = new Option().style
  s.color = currentColor || ''
  return !!s.color
}

const AppDesign: React.FunctionComponent<AppDesignProps> = ({
  children,
  id,
  onShowFeedback,
}) => {
  const handleError = useErrorHandler()
  const params = new URLSearchParams(useLocation().search)

  const [study, setStudy] = React.useState<Study>()

  const {data: sourceStudy, error, isLoading} = useStudy(id)
  const [previewFile, setPreviewFile] = React.useState<
    PreviewFile | undefined
  >()

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateStudy,
    data,
  } = useUpdateStudyDetail()

  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)
  const showError = params.get('from') !== null
  const anchor = params.get('anchor') || ''
  const {token, orgMembership} = useUserSessionDataState()
  const classes = useStyles()

  const [isSettingStudyLogo, setIsSettingStudyLogo] = useState(false)
  const [irbNameSameAsInstitution, setIrbNameSameAsInstitution] =
    useState<boolean>(false)
  const [generalContactPhoneNumber, setGeneralContactPhoneNumber] =
    React.useState('')
  const [irbPhoneNumber, setIrbPhoneNumber] = React.useState('')

  const [phoneNumberErrorState, setPhoneNumberErrorState] = React.useState({
    isGeneralContactPhoneNumberValid: true,
    isIrbPhoneNumberValid: true,
  })

  const [emailErrorState, setEmailErrorState] = React.useState({
    isGeneralContactEmailValid: true,
    isIrbEmailValid: true,
  })

  const [errorState, setErrorState] = React.useState<ErrorStateType>({})

  const getStudyLogoUrl = (): string | undefined => {
    return previewFile?.body || study?.studyLogoUrl
  }

  const getFormattedPhoneNumber = (
    study: Study,
    role: 'study_support' | 'irb'
  ): string => {
    return formatPhoneNumber(getContact(study, role)?.phone?.number)
  }

  useEffect(() => {
    if (!sourceStudy) {
      return
    }

    setStudy({...sourceStudy})
    setIrbNameSameAsInstitution(
      getContact(sourceStudy, 'irb')?.name ===
        getContact(sourceStudy, 'principal_investigator')?.affiliation
    )

    setGeneralContactPhoneNumber(
      getFormattedPhoneNumber(sourceStudy, 'study_support')
    )
    setIrbPhoneNumber(getFormattedPhoneNumber(sourceStudy, 'irb'))

    /*  // Set the use default message property to true by default
      const {welcomeScreenData} = sourceStudy.clientData
      if (welcomeScreenData?.isUsingDefaultMessage === undefined) {
        console.log('no default')
        updateWelcomeScreenMessaging(
          welcomeScreenData?.welcomeScreenHeader || '',
          welcomeScreenData?.welcomeScreenBody || '',
          welcomeScreenData?.welcomeScreenSalutation || '',
          welcomeScreenData?.welcomeScreenFromText || '',
          true
        )
      }*/
  }, [sourceStudy])

  useEffect(() => {
    setTimeout(() => {
      const element = document.getElementById(anchor)
      if (!element) return
      window.scrollTo({
        behavior: 'smooth',
        top: element.offsetTop,
      })
    }, 100)
  }, [anchor])

  const handleUpdate = (updatedStudy: Study) => {
    const formattedStudy = formatStudy(updatedStudy)
    if (formattedStudy.contacts) {
      for (const contact of formattedStudy.contacts) {
        if (contact.name === '') {
          contact.name = DEFAULT_CONTACT_NAME
        }
      }
    }
    onUpdate(formattedStudy)
  }

  const checkPhoneError = (contactLead?: Contact, irbRecord?: Contact) => {
    const generalContactPhoneError =
      !contactLead?.phone?.number ||
      Utility.isInvalidPhone(generalContactPhoneNumber)
    const irbRecordHasError =
      !irbRecord?.phone?.number || Utility.isInvalidPhone(irbPhoneNumber)
    setPhoneNumberErrorState({
      isGeneralContactPhoneNumberValid: !generalContactPhoneError,
      isIrbPhoneNumberValid: !irbRecordHasError,
    })
  }

  const checkEmailError = (contactLead?: Contact, irbRecord?: Contact) => {
    const generalContactEmailHasError =
      !contactLead?.email || !Utility.isValidEmail(contactLead.email)
    const irbRecordEmailHasError =
      !irbRecord?.email || !Utility.isValidEmail(irbRecord.email)
    setEmailErrorState({
      isGeneralContactEmailValid: !generalContactEmailHasError,
      isIrbEmailValid: !irbRecordEmailHasError,
    })
  }

  const isContactValid = (
    contact: Contact | undefined,
    property: keyof Contact
  ) => {
    return (
      contact && contact[property] && contact[property] !== DEFAULT_CONTACT_NAME
    )
  }

  const onUpdate = (updatedStudy: Study) => {
    const areObjectsSame = _.isEqual(study, updatedStudy)
    if (!areObjectsSame) {
      setHasObjectChanged(true)
      setStudy({...updatedStudy})
    }
  }

  useEffect(() => {
    if (!showError || !study) return
    const updatedErrorState = {} as ErrorStateType
    const contactLead = getContact(study, 'study_support')
    const principalInvestigator = getContact(study, 'principal_investigator')
    const irbRecord = getContact(study, 'irb')
    updatedErrorState.leadPINameHasError = !isContactValid(
      principalInvestigator,
      'name'
    )
    updatedErrorState.leadPIAffiliationHasError = !isContactValid(
      principalInvestigator,
      'affiliation'
    )

    updatedErrorState.contactLeadNameHasError = !isContactValid(
      contactLead,
      'name'
    )
    updatedErrorState.contactLeadPositonHasError = !isContactValid(
      contactLead,
      'position'
    )
    updatedErrorState.irbRecordNameHasError = !isContactValid(irbRecord, 'name')
    updatedErrorState.irbProtocolIdHasError = !study.irbProtocolId
    updatedErrorState.studyTitleHasError = !study.name
    updatedErrorState.studySummaryCopyHasError = !study.details?.trim()
    checkPhoneError(contactLead, irbRecord)
    checkEmailError(contactLead, irbRecord)
    setErrorState(updatedErrorState)
  }, [study, showError])

  async function uploadLogoFile() {
    if (!previewFile?.body || !study) {
      return
    }
    setIsSettingStudyLogo(true)
    try {
      const uploadResponse = await StudyService.editStudyLogo(
        study.identifier,
        token!,
        previewFile.size,
        previewFile.name,
        previewFile.body || '',
        previewFile.type,
        previewFile.file
      )

      setPreviewFile(undefined)
      return {
        studyLogoUrl: uploadResponse.studyLogoUrl,
        version: uploadResponse.version,
      }
    } catch (error) {
    } finally {
      setIsSettingStudyLogo(false)
    }
  }

  async function handleFileChange(event?: ChangeEvent<HTMLInputElement>) {
    setHasObjectChanged(true)
    if (!event) {
      if (study?.studyLogoUrl) {
        handleUpdate({...study, studyLogoUrl: undefined})
      }

      setPreviewFile(undefined)
      return
    }
    event.persist()
    if (!event.target.files || !study) {
      return
    }

    setIsSettingStudyLogo(true)
    const file = event.target.files[0]
    const previewForImage = getPreviewForImage(file)
    setPreviewFile(previewForImage)
    setIsSettingStudyLogo(false)
  }

  const onSave = async (study: Study) => {
    if (previewFile) {
      const logoUpdateInfo = await uploadLogoFile()
      if (logoUpdateInfo) {
        study.version = logoUpdateInfo.version
        study.studyLogoUrl = logoUpdateInfo.studyLogoUrl
      }
    }

    setSaveLoader(true)
    return mutateStudy({
      study: study,
    })
      .then(s => {
        setStudy(s)
        setHasObjectChanged(false)
        onShowFeedback()
      })
      .catch(e => {
        onShowFeedback(e)
      })
      .finally(() => {
        setSaveLoader(false)
      })
  }

  const saveInfo = async () => {
    const phoneNumberHasError =
      !phoneNumberErrorState.isGeneralContactPhoneNumberValid ||
      !phoneNumberErrorState.isIrbPhoneNumberValid
    const emailHasError =
      !emailErrorState.isGeneralContactEmailValid ||
      !emailErrorState.isIrbEmailValid
    // This is a placeholder until Lynn finalizes what the error state will look like
    if (
      phoneNumberHasError ||
      emailHasError ||
      !isAppBackgroundColorValid(study?.colorScheme?.background)
    ) {
      alert(
        'Please make sure that all fields are entered in the correct format.'
      )
      return
    }
    if (study) {
      const updatedStudy = formatStudy(study)
      onSave(updatedStudy)
    }
  }

  const formatStudy = (newStudy: Study) => {
    const updatedStudy = {...newStudy}
    const roles = ['irb', 'study_support']
    roles.forEach(role => {
      //remove empty email and phone
      const contact = updatedStudy.contacts?.find(el => el.role === role)
      // If a contact's email or phone is an empty string, then delete the field
      // from the contact object.
      if (contact?.email === '') {
        delete contact.email
      }
      const phoneNumber = contact?.phone?.number
      if (phoneNumber === '' || phoneNumber === '+1') {
        delete contact!.phone
      }
    })
    //should always be true for newer studies - but just in case
    if (newStudy.clientData?.welcomeScreenData !== undefined) {
      //explicitly set boolean valkues
      if (!newStudy.clientData.welcomeScreenData.isUsingDefaultMessage) {
        newStudy.clientData.welcomeScreenData.isUsingDefaultMessage = false
      }
      if (newStudy.clientData.welcomeScreenData.isUsingDefaultMessage) {
        updatedStudy.clientData!.welcomeScreenData.useOptionalDisclaimer = true
      }
      if (!updatedStudy.clientData!.welcomeScreenData.useOptionalDisclaimer) {
        updatedStudy.clientData!.welcomeScreenData.useOptionalDisclaimer = false
      }
    }
    return updatedStudy
  }

  // This is the method without useCallback or debounce.
  const updateColor = (color: string) => {
    if (!study) {
      return
    }
    const updatedStudy = {...study}
    updatedStudy.colorScheme = {
      ...updatedStudy.colorScheme,
      background: color,
    }
    handleUpdate(updatedStudy)
  }

  const getColor = () => {
    const color = study?.colorScheme?.background
    if (!color) return 'transparent'
    return color === '#NaNNaNNaN' ? '' : color
  }

  const updateContacts = (
    leadPrincipalInvestigator: Contact,
    funder: Contact,
    ethicsBoardContact: Contact,
    contactLeadInfo: Contact
  ) => {
    const updatedContacts: Contact[] = []
    updatedContacts.push(ethicsBoardContact)
    updatedContacts.push(funder)
    updatedContacts.push(contactLeadInfo)
    updatedContacts.push(leadPrincipalInvestigator)
    return updatedContacts
  }

  const getContactPersonObject = (type: ContactType): Contact => {
    const defaultPerson: Contact = {role: type, name: DEFAULT_CONTACT_NAME}
    if (!study) {
      return defaultPerson
    }
    const contact = getContact(study, type)
    const result = contact || defaultPerson
    if (type === 'irb' && !result.position) {
      result.position = 'IRB/Ethics Board of Record'
    }
    return result
  }

  function updateContactProperty(
    role: 'study_support' | 'irb',
    propName: keyof SubType<Contact, string | boolean | undefined>,
    propValue: string
  ) {
    if (!study || !propName) {
      return
    }
    const newContactObject = getContactPersonObject(role)
    newContactObject[propName] = propValue
    const contacts = study.contacts ? [...study.contacts] : []

    const contactIndex = contacts.findIndex(c => c.role !== role)
    if (contactIndex === -1) {
      contacts.push(newContactObject)
    } else {
      contacts[contactIndex] = newContactObject
    }
    handleUpdate({...study, contacts})
  }

  function updateWelcomeScreenMessaging(
    propName: keyof SubType<WelcomeScreenData, string | boolean>,
    propValue: string | boolean
  ) {
    if (!study) {
      return
    }
    const wsd = Object.assign({}, study.clientData.welcomeScreenData, {
      [propName]: propValue,
    })
    const updatedStudy = Object.assign({}, study, {
      clientData: {
        ...study.clientData,
        welcomeScreenData: wsd,
      },
    })
    handleUpdate(updatedStudy)
  }

  const hasError = (errorProperty: keyof ErrorStateType) => {
    return showError && !!errorState[errorProperty]
  }

  if (!study) {
    return <></>
  }
  if (StudyService.isStudyClosedToEdits(study)) {
    return (
      <ReadOnlyAppDesign
        children={children}
        study={study}
        getContactPersonObject={getContactPersonObject}
      />
    )
  }

  const color = getColor()

  function updateDefaultMessageToggle(isCustomize: boolean) {
    if (!study) {
      return
    }

    const currentWelcomeScreenData = study.clientData.welcomeScreenData
      ? {
          ...study.clientData.welcomeScreenData,
          isUsingDefaultMessage: !isCustomize,
        }
      : {
          welcomeScreenBody: '',
          welcomeScreenFromText: '',
          welcomeScreenSalutation: '',
          welcomeScreenHeader: '',
          useOptionalDisclaimer: false,
          isUsingDefaultMessage: !isCustomize,
        }
    const updatedStudy = {
      ...study,
      clientData: {
        ...study.clientData,
        welcomeScreenData: currentWelcomeScreenData,
      },
    }
    handleUpdate(updatedStudy)
  }

  return study === undefined ? (
    <>none</>
  ) : (
    <>
      <Box className={classes.root}>
        <NavigationPrompt when={hasObjectChanged} key="prompt">
          {({onConfirm, onCancel}) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>
        <Paper className={classes.section} elevation={2} id="container">
          <Box className={classes.fields}>
            <MTBHeadingH2>WELCOME SCREEN</MTBHeadingH2>
            <p className={classes.smallScreenText}>
              When a participant downloads the app and signs into the study,
              they are greeted with a welcome screen.
              <br></br>
              <br></br>
              Customize what you would like to display to participants below:
            </p>

            <div>
              <ol className={classes.steps}>
                <UploadStudyLogoSection
                  handleFileChange={handleFileChange}
                  imgHeight={imgHeight}
                  saveLoader={saveLoader}
                  studyLogoUrl={getStudyLogoUrl()}
                  isSettingStudyLogo={isSettingStudyLogo}
                />
                <a id="hex-color-picker"></a>
                <Subsection heading="Select background color">
                  <p>
                    Select a background color that matches your institution or
                    study to be seen beneath your logo.
                  </p>
                  <Box width="250px" height="230px" ml={-1.25}>
                    <HexColorPicker color={color} onChange={updateColor} />
                  </Box>
                  <Box className={classes.hexcodeInputContainer}>
                    Hexcode:
                    <input
                      className={classes.hexcodeInput}
                      value={color === 'transparent' ? '' : color}
                      onChange={event =>
                        updateColor(event.target.value)
                      }></input>
                    {!isAppBackgroundColorValid(
                      study.colorScheme?.background
                    ) && (
                      <Box ml={1.5} color="red">
                        Please enter a valid hexcode
                      </Box>
                    )}
                  </Box>
                </Subsection>
                <Subsection heading="Welcome screen messaging">
                  <div className={classes.switchContainer}>
                    <Box mr={1.5}>Use default message</Box>
                    <Box mt={0.5}>
                      <Switch
                        color="primary"
                        checked={
                          !study.clientData.welcomeScreenData
                            ?.isUsingDefaultMessage || false
                        }
                        onChange={e =>
                          updateDefaultMessageToggle(e.target.checked)
                        }
                      />
                    </Box>
                    <Box ml={1.5}>Customize message</Box>
                  </div>
                  {!study.clientData.welcomeScreenData
                    ?.isUsingDefaultMessage && (
                    <>
                      <FormGroupWrapper>
                        <FormControl className={classes.firstFormElement}>
                          <TextInputWrapper
                            SimpleTextInputStyles={
                              {
                                fontSize: '24px',
                                width: '100%',
                              } as React.CSSProperties
                            }
                            id="headline-input"
                            placeholder="Main Header"
                            value={
                              study.clientData.welcomeScreenData
                                ?.welcomeScreenHeader || ''
                            }
                            onChange={e =>
                              updateWelcomeScreenMessaging(
                                'welcomeScreenHeader',
                                e.target.value
                              )
                            }
                            multiline
                            rows={2}
                            rowsMax={4}
                            titleText="Main Header"
                            alternativeTextInputClassName={
                              classes.headlineStyle
                            }
                          />
                        </FormControl>
                        <FormControl>
                          <TextInputWrapper
                            SimpleTextInputStyles={
                              {width: '100%'} as React.CSSProperties
                            }
                            id="outlined-textarea"
                            value={
                              study.clientData.welcomeScreenData
                                ?.welcomeScreenBody || ''
                            }
                            onChange={e =>
                              updateWelcomeScreenMessaging(
                                'welcomeScreenBody',
                                e.target.value
                              )
                            }
                            multiline
                            rows={4}
                            rowsMax={6}
                            placeholder="What are the first things you want participants to know about the study."
                            titleText="Body Copy (maximum 250 characters)"
                            alternativeTextInputClassName={'none'}
                            maxWordCount={250}
                          />
                        </FormControl>
                        <FormControl>
                          <TextInputWrapper
                            SimpleTextInputStyles={SimpleTextInputStyles}
                            id="salutations"
                            value={
                              study.clientData.welcomeScreenData
                                ?.welcomeScreenSalutation || ''
                            }
                            onChange={e =>
                              updateWelcomeScreenMessaging(
                                'welcomeScreenSalutation',
                                e.target.value
                              )
                            }
                            placeholder="Thank you for your contribution"
                            titleText="Salutations"
                          />
                        </FormControl>
                        <FormControl>
                          <TextInputWrapper
                            SimpleTextInputStyles={SimpleTextInputStyles}
                            id="signature-textarea"
                            value={
                              study.clientData.welcomeScreenData
                                ?.welcomeScreenFromText || ''
                            }
                            onChange={e =>
                              updateWelcomeScreenMessaging(
                                'welcomeScreenFromText',
                                e.target.value
                              )
                            }
                            placeholder="Study team name"
                            titleText="From"
                          />
                        </FormControl>
                        <Box mt={2.5}>Add optional disclaimer:</Box>
                        <div className={classes.optionalDisclaimerRow}>
                          <Checkbox
                            checked={
                              study.clientData.welcomeScreenData
                                ?.useOptionalDisclaimer || false
                            }
                            inputProps={{'aria-label': 'primary checkbox'}}
                            className={classes.checkBox}
                            id="disclaimer-check-box"
                            onChange={e =>
                              updateWelcomeScreenMessaging(
                                'useOptionalDisclaimer',
                                e.target.checked
                              )
                            }></Checkbox>
                          <div className={classes.optionalDisclaimerText}>
                            This is a research study and does not provide
                            medical advice, diagnosis, or treatment.
                          </div>
                        </div>
                      </FormGroupWrapper>
                    </>
                  )}{' '}
                </Subsection>
              </ol>
              <Box textAlign="left">
                {saveLoader ? (
                  <div className="text-center">
                    <CircularProgress
                      color="primary"
                      size={25}></CircularProgress>
                  </div>
                ) : (
                  <SaveButton
                    onClick={() => saveInfo()}
                    id="save-button-study-builder-1"
                  />
                )}
              </Box>
            </div>
          </Box>
          <Box className={classes.phoneArea}>
            <MTBHeadingH1>What participants will see: </MTBHeadingH1>
            <WelcomeScreenDisplay
              study={study}
              studyLogoUrl={getStudyLogoUrl()}
            />
          </Box>
        </Paper>
        <Paper className={classes.section} elevation={2}>
          <Box className={classes.fields}>
            <MTBHeadingH2>Study Page</MTBHeadingH2>
            <p className={classes.smallScreenText}>
              Within the app, there will be a dedicated page where you can
              describe your study further and list who to contact for
              participant support.
            </p>
            <a id="summary" />
            <ol className={classes.steps}>
              <StudySummarySection
                SimpleTextInputStyles={SimpleTextInputStyles}
                onUpdate={(studyTitle: string, studySummaryBody: string) => {
                  const updatedStudy = {...study}
                  updatedStudy.name = studyTitle
                  updatedStudy.details = studySummaryBody
                  handleUpdate(updatedStudy)
                }}
                studyTitle={study.name || ''}
                studySummaryBody={study.details || ''}
                studyTitleHasError={hasError('studyTitleHasError')}
                studySummaryCopyHasError={hasError('studySummaryCopyHasError')}
              />
              <a id="leadPI" />
              <StudyLeadInformationSection
                studyIdentifier={study.identifier}
                SimpleTextInputStyles={SimpleTextInputStyles}
                orgMembership={orgMembership}
                token={token}
                getContactPersonObject={getContactPersonObject}
                irbNameSameAsInstitution={irbNameSameAsInstitution}
                onUpdate={(
                  leadPrincipalInvestigator: Contact,
                  funder: Contact,
                  ethicsBoardContact: Contact
                ) => {
                  const updatedContacts = updateContacts(
                    leadPrincipalInvestigator,
                    funder,
                    ethicsBoardContact,
                    getContactPersonObject('study_support')
                  )
                  const updatedStudy = {...study}
                  updatedStudy.contacts = updatedContacts
                  handleUpdate(updatedStudy)
                }}
                leadPrincipalInvestigator={getContactPersonObject(
                  'principal_investigator'
                )}
                ethicsBoardContact={getContactPersonObject('irb')}
                funder={getContactPersonObject('sponsor')}
                getContactName={getContactName}
                principleInvestigatorNameHasError={hasError(
                  'leadPINameHasError'
                )}
                principleInvestigatorAffiliationHasError={hasError(
                  'leadPIAffiliationHasError'
                )}
              />
              <a id="contactLead" />

              <GeneralContactAndSupportSection
                SimpleTextInputStyles={SimpleTextInputStyles}
                phoneNumberErrorState={phoneNumberErrorState}
                setPhoneNumberErrorState={setPhoneNumberErrorState}
                emailErrorState={emailErrorState}
                setEmailErrorState={setEmailErrorState}
                getContactPersonObject={getContactPersonObject}
                generalContactPhoneNumber={generalContactPhoneNumber}
                setGeneralContactPhoneNumber={setGeneralContactPhoneNumber}
                contactLead={getContactPersonObject('study_support')}
                onUpdate={(contactLead: Contact) => {
                  const updatedContacts = updateContacts(
                    getContactPersonObject('principal_investigator'),
                    getContactPersonObject('sponsor'),
                    getContactPersonObject('irb'),
                    contactLead
                  )
                  const updatedStudy = {...study}
                  updatedStudy.contacts = updatedContacts
                  handleUpdate(updatedStudy)
                }}
                getContactName={getContactName}
                contactLeadNameHasError={hasError('contactLeadNameHasError')}
                contactLeadPositionHasError={hasError(
                  'contactLeadPositonHasError'
                )}
              />
              <a id="contactIrb" />
              <IrbBoardContactSection
                SimpleTextInputStyles={SimpleTextInputStyles}
                phoneNumberErrorState={phoneNumberErrorState}
                setPhoneNumberErrorState={setPhoneNumberErrorState}
                emailErrorState={emailErrorState}
                setEmailErrorState={setEmailErrorState}
                getContactPersonObject={getContactPersonObject}
                irbPhoneNumber={irbPhoneNumber}
                setIrbPhoneNumber={setIrbPhoneNumber}
                saveInfo={saveInfo}
                saveLoader={saveLoader}
                irbNameSameAsInstitution={irbNameSameAsInstitution}
                ///ALING TO DO
                setIrbNameSameAsInstitution={setIrbNameSameAsInstitution}
                onUpdate={(irbInfo: Contact, protocolId: string) => {
                  const updatedContacts = updateContacts(
                    getContactPersonObject('principal_investigator'),
                    getContactPersonObject('sponsor'),
                    irbInfo,
                    getContactPersonObject('study_support')
                  )
                  const updatedStudy = {...study}
                  updatedStudy.contacts = updatedContacts
                  updatedStudy.irbProtocolId = protocolId
                  handleUpdate(updatedStudy)
                }}
                irbInfo={getContactPersonObject('irb')}
                protocolId={study.irbProtocolId || ''}
                getContactName={getContactName}
                irbNameHasError={hasError('irbRecordNameHasError')}
                irbProtocolIdHasError={hasError('irbProtocolIdHasError')}
              />
            </ol>
          </Box>
          <Box className={classes.phoneArea}>
            <MTBHeadingH1>What participants will see: </MTBHeadingH1>
            <StudyPageTopPhone
              study={study}
              studyLogoUrl={getStudyLogoUrl()}
              getContactPersonObject={getContactPersonObject}
            />
            <StudyPageBottomPhone
              study={study}
              getContactPersonObject={getContactPersonObject}
              irbPhoneNumber={irbPhoneNumber}
              generalContactPhoneNumber={generalContactPhoneNumber}
            />
          </Box>
        </Paper>
      </Box>
      {children}
    </>
  )
}

export default AppDesign
