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
import { CircularProgress } from '@material-ui/core';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#35281E",
  },
  Logo: {
    marginRight: theme.spacing(6),
    fontfamily: "Shadows Into Light",
  },
  navItems: {
    textDecoration: "none",
    color: "white",
    margin: theme.spacing(1.5),
  },
  partNav: {
    display: "flex",
    alignItems: "center",
  },
  domainContent: {
    padding: theme.spacing(4),
  },
  buttonActions: {
    display: "flex",
    justifyContent: "space-evenly"
  },
  collabheading: {
    padding: theme.spacing(2),
    fontWeight:'bold',
    fontSize:'2.2rem'
  },
  domainContainer:{
    display: "flex",
      justifyContent: "space-between",
      color:'white',
      height:"max-content",
      padding:'50px',
      paddingTop:'100px',
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
  domainContentHeading: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: theme.spacing(2),
  },
  domainContentItem: {
    margin: theme.spacing(2),
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    backgroundColor:'#F9E4B7',
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(6),
    flex:'1'
  },
  joinButton:{
    backgroundColor:'#cc7722',
    color:"white",
    margin: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#b7410e",
    },
  },
  collabButton: {
    backgroundColor:'#cc7722',
    color:"white",
    "&:hover": {
      backgroundColor: "#b7410e",
    },
  },
  inputColor:{
    color:'white'
  },
  heading:{
    padding:theme.spacing(2),
    fontWeight:'bold',
    fontSize:'2.2rem'
  },
  inputStyles: {
    color:'white',
    "&:after":{
      borderColor:'white',
    },
    "&:before":{
      borderColor:'white',
    },
  }
}));

function DomainDetails({match}) {

    const classes = useStyles()
    const [enterCode,setEnterCode] = useState(false)
    const [enterName,setEnterName] = useState(false)
    const [joinCode,setJoinCode] = useState('')
    const [roomName,setRoomName] = useState('')
    const [domainDetails,setDomainDetails] = useState([])
    const [joinAlert,setJoinAlert] = useState(false)
    const [joinedButton, setJoinedButton] = useState(false)
    const [docInDom,setDocInDom] = useState(false)
    const history = useHistory()
    const roomId = v4()

    function truncate(str) {
      return str?.length > 19 ? str.substr(0, 18) + "..." : str;
  }

    const addDoctoDomain = async() => {
      const res = await fetch('/addDoctoDomain',{
          method: 'put',
          headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+ localStorage.getItem("jwt")
          },
          body:JSON.stringify({
              docId: roomId,
              domainId:match.params.domainId
          })
      })
      const data = await res.json()
    }

    const checkDocinDomain = async() => {
      const res = await fetch('/checkDocinDomain',{
        method: 'put',
        headers: {
          "Content-Type":"application/json",
          "Authorization":"Bearer "+ localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            docId: joinCode,
            domainId:match.params.domainId
        })
      })
      const ans = await res.json()
      return ans;
    }
    const createDoc = async() => {
      const res = await fetch('/createDoc',{
        method: 'post',
        headers: {
          "Content-Type":"application/json",
          "Authorization":"Bearer "+ localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          docId: roomId,
          name:roomName,
        })
      })
      const data = await res.json()
      console.log(data)
    }

    const createRoom = async(e) => {
        e.preventDefault()
        const check = await checkUserDomain()
        if(check===true){
          createDoc()
          addDoctoDomain()
          history.push('/collab',{roomId: roomId,name:roomName})
        }
        else{
          setJoinAlert(true)
          setTimeout(()=>setJoinAlert(false),3000);
        }
    }
    const joinRoom = (e) => {
        e.preventDefault()
        const docCheck = async() => {
          const check = await checkUserDomain()
          const check2 = await checkDocinDomain()
          if(check){
            if(check2){
                 history.push('/collab',{roomId: joinCode})
            }
            else{
              setDocInDom(true)
              setTimeout(()=>setDocInDom(false),3000);
            }
          }
          else{
            setJoinAlert(true)
            setTimeout(()=>setJoinAlert(false),3000);
          }
        }
        docCheck()
    }

    function joinDomain() {
      setJoinedButton(true)
      const temp = domainDetails
      temp.users.push(JSON.parse(localStorage.getItem("user")))
      setDomainDetails(temp)
      const jwtToken = localStorage.getItem("jwt");
      fetch("/api/join", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
        body: JSON.stringify({
          domainId: match.params.domainId,
        }),
      })
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
        return true
      }     
      else{
        return false
      }
    }

    useEffect(() =>{
        fetchDomainDetails()
        check()
    },[])

    async function check(){
      const check = await checkUserDomain()
      if(check === true){
        setJoinedButton(true)
      }
    }

    const logout = () => {
      localStorage.clear();
      history.push("/login");
    };
    
    const mailClickHandler = (e,email) => {
      e.preventDefault()
      window.open(`mailto:${email}`)
    }

    if(domainDetails.length===0){
      return(
        <div
        style={{ display:'flex',justifyContent: 'center',alignItems: 'center',height:'100vh',backgroundColor:'#F9E4B7',color:'#35281E'}}
        >
            <CircularProgress size={80} style={{color:"#35281E"}}/>
        </div>
      )
    }
    
    return (
      <div style={{display: 'flex',flexDirection:'column',minHeight:'100vh'}}>
        <AppBar>
          <Toolbar className={classes.toolbar}>
            <div className={classes.partNav}>
              <div className={classes.Logo}>
                <Link to="/" className={classes.navItems}>
                  <Typography variant="h4" >
                    Blogspot
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
                style={{ color: "white", margin: "7px" }}
                onClick={logout}
              >
                <ExitToAppIcon />
                <Typography variant="body1" noWrap>
                  Logout
                </Typography>
              </Button>
            </div>
          </Toolbar>
          {joinAlert ? (
          <Alert severity="error">Join the domain to continue!</Alert>
        ) : null}
        {docInDom ? (
          <Alert severity="error">
            This document does not exist in this domain!
          </Alert>
        ) : null}
        </AppBar>
        <div style={{
          background:`linear-gradient(0deg, rgba(20,20,20,1) 0%, rgba(20,20,20,0.8071603641456583) 100%),url('${domainDetails?.domainPic}')`,
          backgroundSize: "cover",
          height:'max-content',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
          <div className={classes.domainContainer}>
          <div className={classes.domainContent}>
            <Typography variant="h5" className={classes.domainContentHeading}>
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
            <Typography variant="h5" className={classes.collabheading}>
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
                className={classes.joinButton}
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
                className={classes.joinButton}
              >
                <Typography variant="h6">Create Room</Typography>
              </Button>
            </div>
            <div className={classes.buttonActions}>
              {enterCode ? (
                <>
                  <FormControl >
                    <InputLabel style={{color:'white'}} htmlFor="Room Code">Enter Room Code</InputLabel>
                    <Input
                       className={classes.inputStyles}
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
                    className={classes.collabButton}
                  >
                    <Typography variant="h6">Join</Typography>
                  </Button>
                </>
              ) : null}
              {enterName ? (
                <>
                  <FormControl >
                    <InputLabel style={{color:'white'}} htmlFor="Document Name">
                      Enter Document Name
                    </InputLabel>
                    <Input
                    className={classes.inputStyles}
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
                    className={classes.collabButton}
                  >
                    <Typography variant="h6">Create</Typography>
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
        </div>
        <div className={classes.userDetails}>
          <Typography variant="h5" className={classes.heading}>Members List</Typography>
          <Grid container spacing={2}>
            {domainDetails?.users.map((user) => (
              <Grid item lg={4} md={6} xs={12}>
                <Card
                  style={{
                    width: "max-content",
                    margin: "10px",
                    minWidth: "25vw",
                  }}
                >
                  <CardContent
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6" noWrap>{truncate(user.name)}</Typography>
                    <ContactMailIcon
                      fontSize="large"
                      onClick={(e) => mailClickHandler(e, user.email)}
                      style={{ cursor: "pointer", color: "#cc7722" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        <Footer />
      </div>
    );
}

export default DomainDetails
