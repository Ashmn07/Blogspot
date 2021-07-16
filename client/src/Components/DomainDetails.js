import React,{useState,useEffect} from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import {Link,useHistory} from 'react-router-dom'
import { v4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 180,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#ff1616",
  },
  Logo:{
    marginRight:theme.spacing(6),
    fontfamily: 'Shadows Into Light'
  },
  navItems:{
    textDecoration: 'none',
    color:'white',
    margin:theme.spacing(1.5)
  },
  partNav:{
    display:'flex',
    alignItems: 'center',
  },
}));

function DomainDetails({match}) {

    const classes = useStyles();
    const user = localStorage.getItem('user');
    const [enterCode,setEnterCode] = useState(false)
    const [enterName,setEnterName] = useState(false)
    const [joinCode,setJoinCode] = useState('')
    const [roomName,setRoomName] = useState('')
    const [joinedUsers,setjoinedUsers] = useState()
    const history = useHistory()
    const roomId = v4()
    const createRoom = (e) => {
        e.preventDefault()
        history.push('/collab',{roomId: roomId,name:roomName})
    }
    const joinRoom = (e) => {
        e.preventDefault()
        const docCheck = async() => {
          await fetch('/documentIds',{
                method: 'put',
                headers: {
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+ localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    docId:joinCode
                })
            })
            .then(res => res.json())
            .then(res => {
              if(res){
                history.push('/collab',{roomId: joinCode})
              }
            })
        }
        docCheck()
    }

    const fetchDomainDetails = async() => {
        const result = await fetch('/domainDetails',{
            method: 'put',
            headers: {
              "Content-Type":"application/json",
              "Authorization":"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                domainId:match.params.domainId
            })
        })
        const data = await result.json()
        setjoinedUsers(data.users)
    }

    useEffect(() =>{
        fetchDomainDetails()
    },[])

    useEffect(() =>{
        console.log(joinedUsers)
    },[joinedUsers])

    const logout = () => {
      localStorage.clear();
      history.push("/login");
    };
    
    
    return (
      <div>
       <AppBar position="relative">
          <Toolbar className={classes.toolbar}>
            <div className={classes.partNav}>
              <div className={classes.Logo}>
                <Link to="/" className={classes.navItems}>
                  <Typography variant="h5" noWrap>
                    Blogsite
                  </Typography>
                </Link>
              </div>
            <Link to="/" className={classes.navItems}>
              <Typography variant="h6" noWrap>
                Home
              </Typography>
             </Link>
            <Link to="/domain" className={classes.navItems}>
              <Typography variant="h6" noWrap>
                Domains
              </Typography>
             </Link>
            <Link to="/documents" className={classes.navItems}>
              <Typography variant="h6" noWrap>
                Documents
              </Typography>
             </Link>
             </div>
            <div className={classes.partNav}>
              <Button style={{color: "white",margin:'7px'}} onClick={logout}>
                <ExitToAppIcon/>
                <Typography variant="body1" noWrap>Logout</Typography>
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div
          style={{
            display: "flex",
            justifyContent: 'space-between',
            alignItems: "center",
            paddingTop: "80px",
            width: "100%",
          }}
        >
        <div>
            <h1>Domains</h1>
        </div>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                setEnterCode(true)
                setEnterName(false)
              }
              }
            >
              <Typography variant="h6">Join Room</Typography>
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                setEnterName(true) 
                setEnterCode(false)
              }}
              style={{ marginLeft: "20px", marginRight: "20px" }}
            >
              <Typography variant="h6">Create Room</Typography>
            </Button>
          </div>
          <div>
            {enterCode ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <InputLabel htmlFor="Room Code">Enter Room Code</InputLabel>
                  <Input
                    id="room-code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    aria-describedby="my-helper-text"
                  />
                </FormControl>
                <Button color="secondary" variant="primary" onClick={joinRoom}>
                  <Typography variant="h6">Join</Typography>
                </Button>
              </div>
            ) : null}
            {enterName?
            (
              <div style={{ display: "flex", alignItems: "center" }}>
                <FormControl>
                  <InputLabel htmlFor="Document Name">Enter Document Name</InputLabel>
                  <Input
                    id="doc-name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    aria-describedby="my-helper-text"
                  />
                  <Button color="secondary" variant="primary" disabled={roomName===""?true:false} onClick={createRoom}>
                    <Typography variant="h6">Create</Typography>
                  </Button>
                </FormControl>
              </div>
            ) : null
            }
          </div>
        </div>
      </div>
    );
}

export default DomainDetails
