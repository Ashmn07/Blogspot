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
  root: {
    display: "flex",
  },
  media: {
    height: 180,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#ff1616",
  },
  leftNav: {
    display: "flex",
    width: "max-content",
  },
}));

function DomainDetails({match}) {

    const classes = useStyles();
    console.log(match)
    const user = localStorage.getItem('user');
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
        const docCheck = async() => {
            return await fetch('/domainDetails',{
                method: 'put',
                headers: {
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+ localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    docId:joinCode
                })
            })
        }
        if(docCheck()===true){
        history.push('/collab',{roomId: joinCode})
        }
        else{
            
        }
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
        console.log(data)
    }

    useEffect(() =>{
        fetchDomainDetails()
    },[])

    const logout = () => {
      localStorage.clear();
      history.push("/login");
    };
    
    
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar}>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <Typography variant="h6" noWrap>
                Blogsite
              </Typography>
            </Link>
            <div className={classes.leftNav}>
              <Link
                to="/domain"
                style={{ textDecoration: "none", color: "white" }}
              >
                <Typography variant="h6" noWrap>
                  Domains
                </Typography>
              </Link>
              <Typography variant="h6" noWrap>
                Hi {user?.name}
              </Typography>
              <Button
                style={{ color: "white", paddingLeft: "3vw" }}
                onClick={logout}
              >
                <ExitToAppIcon />
                <Typography variant="body1" noWrap>
                  Logout
                </Typography>
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div
          style={{
            display: "flex",
            // flexDirection: "column",
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
              onClick={() => setEnterCode(true)}
            >
              <Typography variant="h6">Join Room</Typography>
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={createRoom}
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
          </div>
        </div>
      </div>
    );
}

export default DomainDetails
