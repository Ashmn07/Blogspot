import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button'
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {useHistory,Link} from 'react-router-dom'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 180,
  },
  toolbar:{
    display:'flex',
    justifyContent:'space-between',
    backgroundColor: "#35281E",
  },
  // toolbar: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   backgroundColor: "#cc7722",
  //   paddingTop:theme.spacing(3),
  //   paddingRight:theme.spacing(3),
  //   paddingLeft:theme.spacing(3)
  // },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(7),
    backgroundColor:'#F9E4B7'
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#35281E ",
    color: "white"
  },
  cardHeading: {
    padding: theme.spacing(2),
    fontWeight: "600",
    color:'black'
    // fontSize: '1.4rem'
  },
  heading: {
    paddingTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontWeight: "bold",
    // textAlign: 'center'
  },
  cardDesc: {
    paddingTop: 0,
    padding: theme.spacing(2),
  },
  Logo: {
    marginRight: theme.spacing(6),
  },
  navItems: {
    textDecoration: "none",
    color: 'white',
    margin: theme.spacing(1.5),
  },
  partNav: {
    display: "flex",
    alignItems: "center",
    // paddingTop:theme.spacing(0.5),
    // paddingLeft: theme.spacing(15),
    // paddingRight: theme.spacing(15)
  },
  bannerPic: {
    // https://images.unsplash.com/photo-1550592704-6c76defa9985?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80
    // backgroundColor: '#cc7722',
    height:"max-content",
    backgroundImage: `linear-gradient(0deg, rgba(20,20,20,1) 0%, rgba(20,20,20,0.8071603641456583) 100%),url("https://images.unsplash.com/photo-1550592704-6c76defa9985?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80")`,
    backgroundSize: "cover",
    objectFit:'contain',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  bannerContent: {
    paddingTop: theme.spacing(18),
    paddingLeft: theme.spacing(18),
    maxWidth: "50vw",
    color: "white",
    paddingBottom:theme.spacing(18)
  },
  bannerDesc: {
    padding: theme.spacing(1.5),
  },
  bannerButton: {
    backgroundColor:'#cc7722',
    color:"white",
    margin: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#b7410e",
    },
  },
  bannercontentpic:{
    background: `url(https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=349&q=80)`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }
}));


function Home() {
  const classes = useStyles();
  const history = useHistory()

  const [user, setUser] = useState()
  const [userDomains, setUserDomains] = useState([])
  const [show,setShow] = useState(false)

  useEffect(() =>{
    setUser(JSON.parse(localStorage.getItem("user")))   
    fetchUserDomains()
  },[])

  const fetchUserDomains = async() => {
    const jwtToken = localStorage.getItem("jwt")
    const res = await fetch('/userDomainsDetails',{
      method: 'get',
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer "+ jwtToken
      }
    })
    const data = await res.json()
    data.length===0?setShow(true):setShow(false)
    setUserDomains(data)
  }

  const logout = () => {
    localStorage.clear()
    history.push('/login')
  }

  if(userDomains.length===0 && !show){
    return(
      <div
      style={{ display:'flex',justifyContent: 'center',alignItems: 'center',height:'100vh',backgroundColor:'#F9E4B7',color:'#35281E'}}
      >
        <h3>Loading...</h3>
      </div>
    )
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
              <Button style={{color: "white",margin:'7px'}} onClick={logout}>
                <ExitToAppIcon/>
                <Typography variant="body1" noWrap>Logout</Typography>
              </Button>
            </div>
          </Toolbar>
        </AppBar>

      <div className={classes.bannerPic}>
        <div className={classes.bannerContent}>
          <Typography variant="h3" className={classes.heading}>
            Interested in writing Blogs ?
          </Typography>
          <Typography variant="h5" className={classes.bannerDesc}>
            Join communities and find other people with similar minded interests
            and collaborate with them by creating a room and sharing the code to
            the other interested people. All the joined collaborators can edit
            the text editor and also communicate with each other using the chat
            section
          </Typography>
          <Link to='/domain' style={{textDecoration: "none"}}>
          <Button variant="contained" className={classes.bannerButton}>
            View Communities
          </Button>
          </Link>
        </div>
        <div className={classes.bannercontentpic}></div>
      </div>
    {
      !show?
      <main className={classes.content}>
        {userDomains.length!==0?
          <Typography className={classes.heading} variant="h4">
            Joined Domains
          </Typography>
          :
          null
        }
        <Grid container spacing={4}>
          {userDomains?.map((d) => (
            <Grid item lg={4} md={6} xs={12} key={d.id}>
              <Card>
                <CardMedia
                  className={classes.media}
                  image={d.domainPic}
                  title={d.domainName}
                />
                <div className={classes.cardContent}>
                  <Link
                    to={`/domain/${d._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography className={classes.cardHeading} variant="h5">
                      {d.domainName}
                    </Typography>
                  </Link>
                </div>
                <Typography className={classes.cardDesc} variant="subtitle2">
                  {d.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
      :
      <div
      style={{ display:'flex',justifyContent: 'center',alignItems: 'center',height:'30vh',backgroundColor:'#F9E4B7',color:'#35281E'}}
      >
        <h1>No Joined Domains</h1>
      </div>
    }
    </div>
  );
}

export default Home
