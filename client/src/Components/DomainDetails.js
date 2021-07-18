import React,{useState,useEffect} from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {Link,useHistory} from 'react-router-dom'
import { v4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ContactMailIcon from '@material-ui/icons/ContactMail';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 180,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#66bfbf",
  },
  Logo: {
    marginRight: theme.spacing(6),
    fontfamily: "Shadows Into Light",
  },
  navItems: {
    textDecoration: "none",
    color: "black",
    margin: theme.spacing(1.5),
  },
  partNav: {
    display: "flex",
    alignItems: "center",
    color: "black",
  },
  domainContent: {
    padding: theme.spacing(4),
  },
  buttonActions: {
    display: "flex",
    margin: theme.spacing(2),
  },
  collabheading: {
    margin: theme.spacing(2),
  },
  collabButtons: {
    display: "flex",
    margin: theme.spacing(2),
  },
  collabContainer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  domainContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    color:'white',
    height: "70vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  domainContentItem: {
    margin: theme.spacing(2),
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(3),
    padding: theme.spacing(3),
  },
  bgUrl:{
    background: `url(https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80)`,
    height: "70vh",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }
}));

function DomainDetails({match}) {

    const classes = useStyles();
    const user = localStorage.getItem('user');
    const [enterCode,setEnterCode] = useState(false)
    const [enterName,setEnterName] = useState(false)
    const [joinCode,setJoinCode] = useState('')
    const [roomName,setRoomName] = useState('')
    const [domainDetails,setDomainDetails] = useState()
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
        console.log(data.domain)
        setDomainDetails(data.domain)
    }

    useEffect(() =>{
        fetchDomainDetails()
    },[])

    const logout = () => {
      localStorage.clear();
      history.push("/login");
    };
    
    const mailClickHandler = (e,email) => {
      e.preventDefault()
      window.open(`mailto:${email}`)
    }
    
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
              <Button style={{color: "black",margin:'7px'}} onClick={logout}>
                <ExitToAppIcon/>
                <Typography variant="body1" noWrap>Logout</Typography>
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <div className={classes.domainContainer} style={{background:`url(${domainDetails?.domainPic})`, backgroundPosition: "center",backgroundRepeat: "no-repeat",backgroundSize: "cover",}}>
          <div className={classes.domainContent}>
            <Typography variant="h3" className={classes.domainContentItem}>
              {domainDetails?.domainName}
            </Typography>
            <Typography variant="h5" className={classes.domainContentItem}>
              {"Members : "}{domainDetails?.users.length}
            </Typography>
            <Typography variant="h6" className={classes.domainContentItem}>
              {domainDetails?.description}
            </Typography>
            </div>
          <div className={classes.collabContainer}>
            <Typography variant="h4" className={classes.collabheading}>
              Collaborate
            </Typography>
            <div className={classes.collabButtons}>
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
            <div className={classes.buttonActions}>
            {enterCode ? (
              <>
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
              </>
            ) : null}
            {enterName?
            (
              <>
                <FormControl>
                  <InputLabel htmlFor="Document Name">Enter Document Name</InputLabel>
                  <Input
                    id="doc-name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    aria-describedby="my-helper-text"
                  />
                </FormControl>
                <Button color="secondary" variant="primary" disabled={roomName===""?true:false} onClick={createRoom}>
                    <Typography variant="h6">Create</Typography>
                  </Button>
              </>
            ) : null
            }
          </div>
          </div>
        </div>
        <div className={classes.userDetails}>
          <Typography variant="h4">
            Members List      
          </Typography>
            {
              domainDetails?.users.map(user => (
                <Card style={{width:'max-content',margin:'10px',minWidth:'20vw'}}>
                  <CardContent style={{display:'flex',justifyContent:'space-between'}}>
                      <Typography variant="h5">
                        {user.name}
                      </Typography>
                      <ContactMailIcon fontSize="large" onClick={(e) => mailClickHandler(e,user.email)} style={{cursor:'pointer',color:'#ff1616'}}/>
                    </CardContent>
                </Card>
              ))
            }
          </div>
      </div>
    );
}

export default DomainDetails
