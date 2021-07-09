import React,{useState} from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import {Link,useHistory} from 'react-router-dom'
import { v4 } from 'uuid';


function DomainDetails({match}) {
    console.log(match)
    const [enterCode,setEnterCode] = useState(false)
    const [joinCode,setJoinCode] = useState('')
    const history = useHistory()
    const roomId = v4()
    const createRoom = (e) => {
        e.preventDefault()
        history.push('/collab',{roomId: roomId})
    }
    const joinRoom = (e) => {
        e.preventDefault()
        history.push('/collab',{roomId: joinCode})
    }
    return (
        <div style={{display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center',minHeight:'100vh'}}>
        <div style={{display:'flex',marginBottom:'20px'}}>
            <Button color="primary" variant="outlined" onClick={()=>setEnterCode(true)}>
                <Typography variant="h6">
                    Join Room
                </Typography>
            </Button>
            <Button color="secondary" variant="outlined" onClick={createRoom}>
                <Typography variant="h6">
                    Create Room
                </Typography>
            </Button>
            </div>
            <div>
                {
                enterCode ?
                <div style={{display: 'flex',alignItems: 'center'}}>
                <FormControl>
                    <InputLabel htmlFor="Room Code">Enter Room Code</InputLabel>
                    <Input id="room-code" value={joinCode} onChange={(e)=>setJoinCode(e.target.value)} aria-describedby="my-helper-text" />
                </FormControl>
                <Button color="secondary" variant="primary" onClick={joinRoom}>
                    <Typography variant="h6">
                        Join
                    </Typography>
                </Button>
             </div>
             : null
            }
            </div>
        </div>
    )
}

export default DomainDetails
