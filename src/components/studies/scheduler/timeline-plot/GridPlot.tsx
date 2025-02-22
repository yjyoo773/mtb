import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {ThemeType} from '../../../../style/theme'
import {TimelineZoomLevel} from './types'

interface StyleProps {
  leftPad: number
}

const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  gridUnit: props => ({
    position: 'absolute',
    top: '-24px',
    left: `-${props.leftPad}px`,
    zIndex: 1000,
  }),
  gridLine: {
    position: 'absolute',
    top: '0px',
    borderLeft: '1px solid #D6D6D6',
  },
  gridUnitSingleSessionGridLine: props => ({
    position: 'absolute',
    top: '-7px',
    fontSize: '10px',
    left: `-${props.leftPad}px`,
    zIndex: 1000,
  }),
  singleSessionGridLine: {
    position: 'absolute',
    top: '0px',
    //borderLeft: '1px solid #3a3a3a',
  },
  tickNumberDisplay: {
    marginTop: '-20px',
    fontSize: '10px',
    textAlign: 'center',
    position: 'absolute',
  },
}))

export interface GridPlotProps {
  numberSessions: number
  zoomLevel: TimelineZoomLevel
  index?: number
  graphSessionHeight?: number
  unitPixelWidth: number
  leftPad?: number
  containerTopPad?: number
  hideDays?: boolean
}

export const DailyGridPlot: React.FunctionComponent<GridPlotProps> = ({
  numberSessions,

  index = 0,
  hideDays = false,
  graphSessionHeight = 50,
  leftPad = 54,
  containerTopPad = 35,
  unitPixelWidth,
}) => {
  const classes = useStyles({leftPad: leftPad})
  const getHour = (hour: number): string => {
    if (hour === 0) {
      return '12am'
    }
    if (hour === 12) {
      return '12pm'
    }
    if (hour > 12) {
      return (hour % 12) + 'pm'
    }
    return hour + ''
  }

  const hours = [...Array(24)].map((_i, hourIndex) => (
    <>
      {hourIndex === 0 && !hideDays && (
        <div
          key={'hour_number'}
          style={{
            position: 'absolute',
            top: `${-containerTopPad}px`,
            left: `${
              index * unitPixelWidth + (unitPixelWidth / 24) * hourIndex
            }px`,
          }}>
          {index + 1}
        </div>
      )}
      <div
        key={`hour_${hourIndex}`}
        className={classes.gridLine}
        style={{
          height: `${numberSessions * graphSessionHeight}px`,
          left: `${
            index * unitPixelWidth + (unitPixelWidth / 24) * hourIndex
          }px`,

          width: `${unitPixelWidth / 24}px`,
        }}>
        <div
          className={classes.tickNumberDisplay}
          style={{
            left: `${unitPixelWidth / -48}px`,
            width: `${unitPixelWidth / 24}px`,
          }}>
          {getHour(hourIndex)}
        </div>
      </div>
    </>
  ))
  return <div>{hours}</div>
}

export const NonDailyGridPlot: React.FunctionComponent<GridPlotProps> = ({
  numberSessions,
  zoomLevel,
  index = 0,
  hideDays = false,
  graphSessionHeight = 50,
  unitPixelWidth,
  leftPad = 54,
}) => {
  const classes = useStyles({leftPad: leftPad})

  const unit = zoomLevel === 'Quarterly' ? 'Month' : 'Day'
  if (zoomLevel === 'Quarterly' && index % 30 > 0) {
    return <></>
  }
  const result = (
    <>
      {index === 0 && <div className={classes.gridUnit}>{unit}</div>}
      <div
        key="gridLine"
        className={classes.gridLine}
        style={{
          height: `${numberSessions * graphSessionHeight}px`,
          left: `${index * unitPixelWidth}px`,
          width: `${unitPixelWidth}px`,
          boxSizing: 'content-box',
        }}>
        {!hideDays && (
          <div
            key="gridLineUnit"
            className={classes.tickNumberDisplay}
            style={{
              left: `${unitPixelWidth / -2}px`,
              width: `${unitPixelWidth}px`,
            }}>
            {zoomLevel === 'Quarterly' ? Math.round(index / 30) + 1 : index + 1}
          </div>
        )}
      </div>
    </>
  )

  return result
}

const GridPlot: React.FunctionComponent<
  GridPlotProps & {scheduleLength: number}
> = ({
  numberSessions,
  zoomLevel,

  hideDays = false,
  graphSessionHeight = 50,
  leftPad = 54,
  unitPixelWidth,
  scheduleLength,
}) => {
  const items = [...Array(scheduleLength)].map((i, index) =>
    zoomLevel === 'Daily' ? (
      <DailyGridPlot
        key={`dailyPlot_${index}_${i}`}
        graphSessionHeight={graphSessionHeight}
        index={index}
        hideDays={hideDays}
        leftPad={leftPad}
        zoomLevel={zoomLevel}
        unitPixelWidth={unitPixelWidth}
        numberSessions={numberSessions}
      />
    ) : (
      <NonDailyGridPlot
        key={`nonDailyPlot_${index}_${i}`}
        graphSessionHeight={graphSessionHeight}
        index={index}
        hideDays={hideDays}
        leftPad={leftPad}
        zoomLevel={zoomLevel}
        unitPixelWidth={unitPixelWidth}
        numberSessions={numberSessions}
      />
    )
  )
  return <>{items}</>
}

export const SingleSessionGridPlot: React.FunctionComponent<
  GridPlotProps & {
    top?: number
    scheduleLength: number
    interval?: {start: number; end: number}
  }
> = ({
  numberSessions,
  zoomLevel,
  scheduleLength,
  graphSessionHeight = 50,
  leftPad = 54,
  unitPixelWidth,
  hideDays = false,
  top = 0,
  interval,
}) => {
  const classes = useStyles({leftPad: leftPad})
  const unit = zoomLevel === 'Quarterly' ? 'Month' : 'Day'
  const length = interval ? interval.end - interval.start : scheduleLength

  const result = [...Array(length)].map((i, index) => {
    if (zoomLevel === 'Quarterly' && index % 30 > 0) {
      return <></>
    }

    return (
      <>
        {index === 0 && !hideDays && (
          <div className={classes.gridUnitSingleSessionGridLine}>{unit}</div>
        )}
        <div
          key="gridLine"
          className={classes.singleSessionGridLine}
          style={{
            height: `${numberSessions * graphSessionHeight + 5}px`,
            left: `${index * unitPixelWidth}px`,
            width: `${unitPixelWidth}px`,
            boxSizing: 'content-box',
            top: hideDays ? `${top - 3}px` : `-7px`,
            borderLeft: `${hideDays ? '1px solid #3a3a3a' : 'none'}`,
          }}>
          {!hideDays && (
            <div
              key="gridLineUnit"
              className={classes.tickNumberDisplay}
              style={{
                left: `${unitPixelWidth / -2}px`,
                width: `${unitPixelWidth}px`,
                top: '0px',
                marginTop: '0',
              }}>
              {zoomLevel === 'Quarterly'
                ? Math.round((index + +(interval?.start || 0)) / 30) + 1
                : index + (interval?.start || 0) + 1}
            </div>
          )}
        </div>
      </>
    )
  })

  return <>{result}</>
}

export default GridPlot
