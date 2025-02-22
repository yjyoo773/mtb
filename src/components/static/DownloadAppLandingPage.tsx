import QrCode from '@assets/qr_code.png'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import MTBLogoLarge from '../../assets/mtb_logo_large.svg'
import appStoreBtn from '../../assets/preview/appStoreBtn.png'
import googlePlayBtn from '../../assets/preview/googlePlayBtn.png'
import {latoFont, playfairDisplayFont} from '../../style/theme'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingTop: theme.spacing(10),
    textAlign: 'left',
  },
  downloadText: {
    lineHeight: '28px',
    fontSize: '21px',
    fontStyle: 'italic',
    fontFamily: playfairDisplayFont,
    marginTop: theme.spacing(5),
    maxWidth: '250px',
    textAlign: 'center',
  },
  thankYouText: {
    maxWidth: '300px',
    fontFamily: latoFont,
    fontSize: '16px',
    lineHeight: '20px',
    marginTop: theme.spacing(3),
  },
}))

const DownloadAppLandingPage: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <img
        src={MTBLogoLarge}
        alt="large mtb logo"
        style={{width: '100px', height: '100px'}}
      />
      <Box className={classes.downloadText}>
        Download the <strong>Mobile Toolbox App</strong>
      </Box>

      <p className={classes.thankYouText}>
        Thank you for participating.
        <br></br>
        <br></br>
        Please scan the QR code with your phone camera and open the link, or
        select the store button that works best for your smartphone to download
        the Mobile Toolbox App.
      </p>

      <Box m={2} textAlign="center" bgcolor="white" style={{padding: '16px'}}>
        <img src={QrCode} width="130px" />
      </Box>
      <Box my={3}>
        <a
          style={{marginRight: '24px'}}
          href="https://apps.apple.com/us/app/mobile-toolbox-app/id1578358408"
          target="_blank">
          <img src={appStoreBtn} alt="ios app store button"></img>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=org.sagebionetworks.research.mobiletoolbox.app"
          target="_blank">
          <img src={googlePlayBtn} alt="google play store"></img>
        </a>
      </Box>
    </Box>
  )
}
export default DownloadAppLandingPage
