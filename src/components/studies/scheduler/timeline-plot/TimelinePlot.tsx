import {ReactComponent as Arrow} from '@assets/arrow.svg'
import SessionIcon from '@components/widgets/SessionIcon'
import {Button, Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {latoFont} from '@style/theme'
import {StudySession, TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'
import React from 'react'
import SessionPlot from './SingleSessionPlot'
import Utility from './utility'

const leftPad = 54
const containerTopPad = 35

const useStyles = makeStyles(theme => ({
  rootOld: {
    // overflowX: 'scroll',
    width: '100%',
    position: 'relative',
    '&::-webkit-scrollbar': {
      height: '8px',
      '-webkit-appearance': 'none',
    },

    /* Track */
    '&::-webkit-scrollbar-track': {
      //bgColor: '#000';
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '2px',
      //color: 'blue',
      background: '#C4C4C4',
      boxShadow: '0 0 1px rgba(255, 255, 255, .5)',
      '&:hover': {
        background: '#b4b4b4',
      },
    },
  },
  root: {width: '100%', position: 'relative'},
  plotContainer: {
    //  backgroundColor: '#ECECEC',
    padding: `${containerTopPad}px 0 20px ${leftPad}px`,
  },
  whiteBg: {
    //  height: `${containerTopPad}px`,
    marginTop: `-${containerTopPad}px`,
    marginLeft: `-${leftPad}px`,
    backgroundColor: '#FFF',
  },
  graph: {display: 'flex', marginBottom: '5px', height: '16px'},
  sessionName: {
    textAlign: 'center',
    width: '20px',
    '& svg': {
      width: '5px',
      height: '5px',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  week: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '13px',
  },
  dayNumbers: {
    fontFamily: latoFont,

    fontSize: '14px',

    width: '20px',

    textAlign: 'center',
    position: 'absolute',
  },

  lessIcon: {
    transform: 'rotate(180deg)',
  },
  showMore: {
    fontFamily: latoFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '12px',
    textAlign: 'right',
  },
}))

export interface TimelinePlotProps {
  schedulingItems: TimelineScheduleItem[]
  sortedSessions: StudySession[]
}

type PlotData = {
  sessionInfos: {startEventId?: string; coords: number[]}[]
  weekNumber: number
}

const TimelinePlot: React.FunctionComponent<TimelinePlotProps> = ({
  schedulingItems,
  sortedSessions,
}: TimelinePlotProps) => {
  const classes = useStyles()
  const ref = React.useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [plotWidth, setPlotWidth] = React.useState<number | null>(null)
  const [plotData, setPlotData] = React.useState<PlotData[]>()

  function handleResize() {
    if (ref && ref.current) {
      const {width} = ref?.current?.getBoundingClientRect()
      setPlotWidth(width)
    }
  }

  React.useLayoutEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  React.useEffect(() => {
    if (schedulingItems) {
      const result = createPlotData(schedulingItems)
      setPlotData(result)
    }
  }, [schedulingItems])

  const unitWidth = getUnitWidth()

  function getUnitWidth(): number {
    const unitWidth = Math.round(((plotWidth || 0) - 154) / 7)
    return unitWidth
  }

  function createPlotData(schedulingItems: TimelineScheduleItem[]): PlotData[] {
    const numOfWeeks = Math.ceil(_.last(schedulingItems!)!.endDay / 7)

    var result: Record<string, PlotData> = {}

    for (var weekNumber = 0; weekNumber < numOfWeeks; weekNumber++) {
      const sessionInfos = sortedSessions.map(session => {
        return Utility.getDaysFractionForSingleSession(
          session.guid!,
          schedulingItems,
          {start: weekNumber * 7, end: (weekNumber + 1) * 7}
        )
      })

      const hasItems = sessionInfos.find(
        sessionInfo => sessionInfo.coords.length > 0
      )

      if (hasItems)
        result[weekNumber] = {
          sessionInfos,
          weekNumber,
        }
    }

    var sortedResult = _.sortBy(result, [
      function (o) {
        return o.weekNumber
      },
    ])
    return sortedResult
  }
  if (!schedulingItems || !plotData) {
    return <></>
  }

  return (
    <>
      <div className={classes.root}>
        <div ref={ref} className={classes.plotContainer}>
          <div
            style={{
              position: 'relative',
            }}>
            <div className={classes.week}>
              <div style={{width: '60px'}}>Schedule</div>
              <div className={classes.graph}>
                <div className={classes.sessionName}></div>
                <div style={{position: 'relative'}}>
                  {[...new Array(7)].map((_i, index) => (
                    <div
                      key={`day_number_${index}`}
                      className={classes.dayNumbers}
                      style={{
                        left: unitWidth * index - 10 + 'px',
                      }}>
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {plotData &&
              plotData.map(
                (wk, index) =>
                  (isExpanded || index < 2) && (
                    <div className={classes.week} key={`week_${index}`}>
                      <div style={{width: '60px'}} key="week_index">
                        Week {wk.weekNumber + 1}
                      </div>
                      <div
                        style={{flexGrow: 1, flexShrink: 0}}
                        key="week_graph">
                        {sortedSessions.map((session, sIndex) => (
                          <div
                            className={classes.graph}
                            key={`session_${sIndex}`}>
                            <Tooltip
                              key="tooltip"
                              placement="top"
                              title={`Starts on: ${session.startEventIds[0]}`}>
                              <div className={classes.sessionName}>
                                <SessionIcon index={sIndex} />
                              </div>
                            </Tooltip>
                            <div
                              style={{position: 'relative', top: '0px'}}
                              key="session_plot">
                              <SessionPlot
                                xCoords={wk.sessionInfos[sIndex].coords}
                                sessionIndex={sortedSessions.findIndex(
                                  s => s.guid === session.guid
                                )}
                                displayIndex={0}
                                unitPixelWidth={unitWidth}
                                scheduleLength={7}
                                schedulingItems={schedulingItems}
                                sessionGuid={session.guid!}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            {plotData.length > 2 && (
              <div className={classes.showMore}>
                <Button
                  onClick={e => setIsExpanded(prev => !prev)}
                  variant="text">
                  {isExpanded ? (
                    <>
                      <span>less&nbsp;</span>
                      <Arrow className={classes.lessIcon} />
                    </>
                  ) : (
                    <>
                      <span>more&nbsp;</span>
                      <Arrow />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelinePlot
