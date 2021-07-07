import React from 'react'
import TextEditor from './TextEditor'
import Chat from './Chat'

function Collab() {
    return (
        <div style={{display:'flex',height: '100vh',width: '100vw'}}>
            <TextEditor/>
            <Chat/>
        </div>
    )
}

export default Collab
