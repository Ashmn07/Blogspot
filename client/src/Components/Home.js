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
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#cc7722",
    paddingTop:theme.spacing(3),
    paddingRight:theme.spacing(3),
    paddingLeft:theme.spacing(3)
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    // backgroundColor:'white'
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    width: "95%",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#66bfbf ",
    color: "black"
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
    fontfamily: "Shadows Into Light",
  },
  navItems: {
    textDecoration: "none",
    color: '#141414',
    margin: theme.spacing(1.5),
  },
  partNav: {
    display: "flex",
    alignItems: "center",
    paddingTop:theme.spacing(0.5),
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15)
  },
  bannerPic: {
    //https://images.unsplash.com/photo-1510936111840-65e151ad71bb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1067&q=80
    //https://images.unsplash.com/photo-1516414447565-b14be0adf13e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDJ8fHdyaXRpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60
    //background: `url(https://images.unsplash.com/photo-1604993775742-c165463c4841?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80)`,
    // backgroundColor: '#000000',
    // backgroundImage: 'linear-gradient(147deg, #000000 0%, #434343 74%)',
    backgroundColor: '#cc7722',
    height:"max-content",
    // backgroundPosition: "center",
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",
  },
  bannerContent: {
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(18),
    maxWidth: "50vw",
    color: "black",
    paddingBottom:theme.spacing(10)
  },
  bannerDesc: {
    padding: theme.spacing(1.5),
  },
  bannerButton: {
    backgroundColor: "#117a8b",
    color: "white",
    margin: theme.spacing(2),
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
  const [domains, setDomains] = useState()

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
    console.log(data)
    setUserDomains(data)
  }

  const logout = () => {
    localStorage.clear()
    history.push('/login')
  }

  return (
    <div>
      <AppBar position="relative" style={{ boxShadow: "none" }}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.partNav}>
            <div className={classes.Logo}>
              <Link to="/" className={classes.navItems}>
                <Typography variant="h4" noWrap>
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
            <Button style={{ color: "", margin: "7px" }} onClick={logout}>
              <ExitToAppIcon />
              <Typography variant="body1" noWrap>
                Logout
              </Typography>
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
          <Button variant="contained" className={classes.bannerButton}>
            View Communities
          </Button>
        </div>
        <div className={classes.bannercontentpic}></div>
      </div>

      <main className={classes.content}>
        {userDomains?
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
                  <Button
                    className={classes.joinButton}
                    disabled
                    style={{ color: "black" }}
                  >
                    <Typography variant="body1" noWrap>
                      Joined
                    </Typography>
                  </Button>
                </div>
                <Typography className={classes.cardDesc} variant="subtitle2">
                  {d.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
}

export default Home
