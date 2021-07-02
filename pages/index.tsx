import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core'
import GpsFixedIcon from '@material-ui/icons/GpsFixed'
import CompassCalibrationIcon from '@material-ui/icons/CompassCalibration'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../utils/socket'

const useHomeStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
  },
  button: {
    marginTop: theme.spacing(3)
  }
}))

type Position = [number, number]
export interface MagnetometerRecord {
  x: number;
  y: number;
  z: number;
}

export default function Home() {
  const classes = useHomeStyles()
  const [gpsLocation, setGpsLocation] = useState<null | Position>(null)
  const [magnetometerValue, setMagnetometerValue] = useState<null | MagnetometerRecord>(null)
  const [mineValue, setMineValue] = useState<null | string>(null)

  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.on('position', (data: Position) => {
      setGpsLocation(data)
    })

    socket.on('magnetometerData', (data: MagnetometerRecord) => {
      setMagnetometerValue(data)
    })

    socket.on('mine', (data: string) => {
      setMineValue(data)
    })

    return () => {
      socket.off('position')
      socket.off('magnetometerData')
    }
  }, [])

  const handleSetMcuMode = (mode: string) => {
    socket.emit('mode', mode)
  }


  return (
      <Box className={classes.box}>
        <Typography variant={'h6'}>Mini-Tank</Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <GpsFixedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={mineValue ? mineValue : 'No data available'} secondary="Mine" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <GpsFixedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={gpsLocation ? `${gpsLocation[0]}, ${gpsLocation[1]}` : 'No data available'} secondary="GPS Coordinates" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CompassCalibrationIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={magnetometerValue !== null ? `x: ${magnetometerValue.x}, y: ${magnetometerValue.y}, z: ${magnetometerValue.z}` : 'No data available'} secondary='Magnetometer' />
          </ListItem>
        </List>
        <Button className={classes.button} variant={'outlined'} onClick={() => handleSetMcuMode('stop')} >STOP</Button>
        <Button className={classes.button} variant={'outlined'} onClick={() => handleSetMcuMode('forward')} >Fahren</Button>
        <Button className={classes.button} variant={'outlined'} onClick={() => handleSetMcuMode('search')} >Suchen</Button>
      </Box>
  )
}