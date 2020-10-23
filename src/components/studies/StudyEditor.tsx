import React, { FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { Study } from '../../types/types'
import { ThemeType } from '../../style/theme'
import { RouteComponentProps, useParams } from 'react-router-dom'

import { Box, Button, Grid, Link } from '@material-ui/core'
import Scheduler from './scheduler/Scheduler'
import SessionsCreator from './session-creator/SessionsCreator'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { ErrorFallback, ErrorHandler } from '../widgets/ErrorHandler'
import LoadingComponent from '../widgets/Loader'
import { SECTIONS as sectionLinks, StudySection } from './sections'
import LeftNav from './LeftNav'
import { useAsync } from '../../helpers/AsyncHook'
import StudyService from '../../services/study.service'


const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    width: '300px',
    border: '1px solid gray',
  },

  title: {
    fontSize: 14,
    color: theme.testColor,
  },
  pos: {
    marginBottom: 12,
  },
}))

type StudyEditorOwnProps = {}

type StudyEditorProps = StudyEditorOwnProps & RouteComponentProps

const StudyEditor: FunctionComponent<StudyEditorProps> = ({ ...props }) => {
  const classes = useStyles()
  const handleError = useErrorHandler()
  let { id, section } = useParams<{ id: string; section: StudySection }>()

  const { data: study, status, error, run } = useAsync<Study>({
    status: id ? 'PENDING' : 'IDLE',
    data: null,
  })

  React.useEffect(() => {
    if (!id) {
      return
    }
    return run(StudyService.getStudy(id))
  }, [id, run])

  if (status === 'IDLE') {
    return <>'no id'</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    if (!study) {
      throw new Error('This session does not exist')
    }
  }

  const ServePage = ({
    section,
    study,
    children
  }: {
    section: StudySection
    study: Study
    children: React.ReactNode
  }): JSX.Element => {
    {
      /*<>
          <SessionsCreatorOld studyGroups={study.groups || []} id={id}></SessionsCreatorOld>
          -------------------------------<br/>
          -------------------------------new--------------------<br/>
          <SessionsCreatorNew studyGroups={study.groups || []} id={id}></SessionsCreatorNew>
        </>*/
    }

    switch (section) {
      case 'scheduler':
        return <Scheduler {...props}></Scheduler>
      case 'session-creator':
        return (
          <SessionsCreator
            studyGroups={study.groups || [] /*undefined*/}
            id={/*study.id*/ undefined}
          ></SessionsCreator>
        )
      default:
        return <></>
    }
  }

  const NavLinks = ({
    sections,
    currentSection,
  }: {
    sections: { name: string; path: StudySection }[]
    currentSection: StudySection
  }) => {
    const currentIndex = sections.findIndex(i => i.path === currentSection)
    const prev = currentIndex > 0 ? sections[currentIndex - 1] : undefined
    const next =
      currentIndex + 1 < sections.length
        ? sections[currentIndex + 1]
        : undefined

    const NavLink = (props: any) => {
      const { id, section } = props
      if (!section) {
        return <></>
      }
      return (
        <Button
          variant="contained"
          color="primary"
          href={`/studies/${id}/${section.path}`}
        >
          {section.name}
        </Button>
      )
    }
    const result = (
      <Box position="fixed" bottom={24} right={24}>
        <NavLink id={id} section={prev}></NavLink>&nbsp;&nbsp;
        <NavLink id={id} section={next}></NavLink>
      </Box>
    )
    return result
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} sm={2}>
        <LeftNav currentSection={section} id={id}></LeftNav>
      </Grid>
      <Grid item xs={9} sm={10}>
        <div>
          <h2>
            Some Information that we want to see before everything is loaded{' '}
            {id} {section}{' '}
          </h2>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={ErrorHandler}
          >
            <LoadingComponent reqStatusLoading={status}>
              <ServePage study={study!} section={section}>
             
              </ServePage>
            </LoadingComponent>
          </ErrorBoundary>
          <NavLinks sections={sectionLinks} currentSection={section}></NavLinks>
        </div>
      </Grid>
    </Grid>
  )
}

export default StudyEditor
