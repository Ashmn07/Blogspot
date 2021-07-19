import React,{useState,useEffect} from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {Link,useHistory} from 'react-router-dom'
import { v4 } from 'uuid';
import Alert from "@material-ui/lab/Alert";
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
    justifyContent: "space-evenly"
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
    // backgroundPosition: "center",
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",
    backgroundColor: "#303030"
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
  joinButton:{
    backgroundColor:'#66bfbf',
    color:"black",
    margin: theme.spacing(2),
  },
  inputColor:{
    color:'white'
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
    const [joinAlert,setJoinAlert] = useState(false)
    const [invalidCode, setInvalidCode] = useState(false)
    const [joinedButton, setJoinedButton] = useState(false)
    const history = useHistory()
    const roomId = v4()
    const createRoom = async(e) => {
        e.preventDefault()
        // console.log(checkUserDomain())
        const check = await checkUserDomain()
        if(check===true){
          history.push('/collab',{roomId: roomId,name:roomName})
        }
        else{
          setJoinAlert(true)
          setTimeout(()=>setJoinAlert(false),2000);
        }
    }
    const joinRoom = (e) => {
        e.preventDefault()
        const docCheck = async() => {
          const check = await checkUserDomain()
          if(check===true){
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
              else{
                setInvalidCode(true)
                setTimeout(()=>setInvalidCode(false),2000)
              }
            })
          }
          else{
            setJoinAlert(true)
            setTimeout(()=>setJoinAlert(false),2000);
          }
        }
        docCheck()
    }

    async function joinDomain() {
      setJoinedButton(true)
      const jwtToken = localStorage.getItem("jwt");
      const res = await fetch("/api/join", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
        body: JSON.stringify({
          domainId: match.params.domainId,
        }),
      });
    }

    const fetchDomainDetails = async () => {
      const result = await fetch("/domainDetails", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          domainId: match.params.domainId,
        }),
      });
      const data = await result.json();
      const check = await checkUserDomain()
      if(check === true){
        setJoinedButton(true)
      }
      setDomainDetails(data.domain);
    };

    const checkUserDomain = async() => {
      const res = await fetch('/userDomains',{
        method: 'GET',
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+ localStorage.getItem("jwt")
        }
      })
      const data = await res.json()
      console.log(data.domains)
      if(data.domains.includes(match.params.domainId)){
        console.log('Trueee')
        return true
      }     
      else{
        return false
      }
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
        <AppBar >
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
              <Button
                style={{ color: "black", margin: "7px" }}
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
        {joinAlert ? (
          <Alert severity="error">Join the domain to continue!</Alert>
        ) : null}
        {invalidCode ? (
          <Alert severity="error">
            The document code you entered is invalid!
          </Alert>
        ) : null}
        <div className={classes.domainContainer}>
          <div className={classes.domainContent}>
            <Typography variant="h3" className={classes.domainContentItem}>
              {domainDetails?.domainName}
            </Typography>
            <Typography variant="h5" className={classes.domainContentItem}>
              {"Members : "}
              {domainDetails?.users.length}
            </Typography>
            <Typography variant="h6" className={classes.domainContentItem}>
              {domainDetails?.description}
            </Typography>
            <Button onClick={joinDomain} className={classes.joinButton} disabled={joinedButton}>
                <Typography variant="body1" noWrap>
                  {joinedButton?"Joined":"Join Domain"}
                </Typography>
            </Button>
          </div>
          <div className={classes.collabContainer}>
            <Typography variant="h4" className={classes.collabheading}>
              Collaborate
            </Typography>
            <div className={classes.collabButtons}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  setEnterCode(true);
                  setEnterName(false);
                }}
              >
                <Typography variant="h6">Join Room</Typography>
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  setEnterName(true);
                  setEnterCode(false);
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
                      InputProps={{
                        className: classes.inputColor
                      }}
                      id="room-code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      aria-describedby="my-helper-text"

                    />
                  </FormControl>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={joinRoom}
                  >
                    <Typography variant="h6">Join</Typography>
                  </Button>
                </>
              ) : null}
              {enterName ? (
                <>
                  <FormControl>
                    <InputLabel htmlFor="Document Name">
                      Enter Document Name
                    </InputLabel>
                    <Input
                      id="doc-name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      aria-describedby="my-helper-text"
                    />
                  </FormControl>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={roomName === "" ? true : false}
                    onClick={createRoom}
                  >
                    <Typography variant="h6">Create</Typography>
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className={classes.userDetails}>
          <Typography variant="h4">Members List</Typography>
          <Grid container spacing={4}>
            {domainDetails?.users.map((user) => (
              <Grid item lg={4} md={6} xs={12}>
                <Card
                  style={{
                    width: "max-content",
                    margin: "10px",
                    minWidth: "20vw",
                  }}
                >
                  <CardContent
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h5">{user.name}</Typography>
                    <ContactMailIcon
                      fontSize="large"
                      onClick={(e) => mailClickHandler(e, user.email)}
                      style={{ cursor: "pointer", color: "#66bfbf" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    );
}

export default DomainDetails
