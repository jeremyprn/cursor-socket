// eslint-disable-next-line react/display-name

import styles from '../styles/Home.module.css';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'

let socket;

const Home = () => {

  const board = useRef();

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    return () => null;
  });

  useEffect(() => {
    socketInitializer()
    return () => null;
  }, [])

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
        console.log('connected')
        
        socket.on('players', (players) => {
      
          board.current.innerHTML = "";
      
          players.forEach(player => {
              let playerCursor = document.createElement('div');
              let playerCursorName = document.createElement('div');
      
              playerCursor.setAttribute('id', styles.cursor)
              playerCursorName.setAttribute('className',styles.name);
      
              playerCursor.style.left = player.cursor.x + 'px';
              playerCursor.style.top = player.cursor.y + 'px';
              playerCursor.style.setProperty('--color', player.color);
              playerCursorName.innerHTML = player.id.slice(0,5);
      
              playerCursor.appendChild(playerCursorName);
              board.current.appendChild(playerCursor);
          });
          
      });
    })
  };

  const onMouseMove = (e) =>{
    socket.emit('cursor', {x : e.pageX, y : e.pageY});
  }

  return (
    <div className={styles.container}>
      <div className={styles.board} ref={board}></div>
    </div>
  )
}

export default Home;