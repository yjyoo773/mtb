import {CardMedia} from '@material-ui/core'
import {createStyles, makeStyles} from '@material-ui/core/styles'
import React, {FunctionComponent, ReactNode} from 'react'
import DefaultImg from '../../assets/sage.svg'
import {AssessmentResource} from '../../types/types'

const useStyles = makeStyles(theme =>
  createStyles({
    media: {
      height: 180,
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0 ${theme.spacing(
        2
      )}px`,
      backgroundPositionY: 'top',
      display: 'flex',
      flexShrink: 0,
      flexDirection: 'row',
    },
    detailImageContainer: {
      padding: theme.spacing(2),
      '& img': {
        width: '100%',
      },
    },
  })
)

type AssessmentImageProps = {
  resources: AssessmentResource[] | undefined
  name: string
  variant: 'small' | 'detail' | 'normal'
  children?: ReactNode
  smallVariantProperties?: React.CSSProperties
}

const AssessmentImage: FunctionComponent<AssessmentImageProps> = ({
  resources,
  name,
  variant = 'normal',
  children = <></>,
  smallVariantProperties,
}: AssessmentImageProps) => {
  const classes = useStyles()

  const screen = resources?.find(
    resource =>
      resource.category === 'icon' &&
      !resource.deleted &&
      resource.upToDate &&
      resource.title.includes('_square') &&
      resource.url
  )
  let image

  switch (variant) {
    case 'small': {
      image = (
        <img
          src={screen?.url || DefaultImg}
          alt={name}
          height="100%"
          style={smallVariantProperties}
        />
      )
      break
    }
    case 'detail': {
      image = (
        <div className={classes.detailImageContainer}>
          <img
            src={screen?.url || DefaultImg}
            alt={name}
            height="100%"
            style={smallVariantProperties}
          />
        </div>
      )
      break
    }
    default: {
      image = (
        <CardMedia
          className={classes.media}
          image={screen?.url || DefaultImg}
          title={name}>
          {children}
        </CardMedia>
      )
    }
  }
  return image
}

export default AssessmentImage
