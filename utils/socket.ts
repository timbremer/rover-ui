import socketio from 'socket.io-client'
import React from 'react'

export const socket = socketio('192.168.1.138:5000')
export const SocketContext = React.createContext(socket)
