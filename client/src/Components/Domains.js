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
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingTop:theme.spacing(10),
    backgroundColor: '#F9E4B7'
  },
  cardContent:{
    display: 'flex',
    justifyContent:'space-between',
    width: '95%',
    alignItems: 'center',
  },
  joinButton:{
    backgroundColor:'#35281E',
    color:"white"
  },
  cardHeading:{
    padding: theme.spacing(2),
    fontWeight:'600',
    color:'black'
    // fontSize: '1.4rem'
  },
  heading:{
    paddingTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontWeight:'bold',
    // textAlign: 'center'
  },
  cardDesc: {
    paddingTop: 0,
    padding: theme.spacing(2), 
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

export default function Domains() {
  const classes = useStyles();
  const history = useHistory()

  const [user, setUser] = useState()
  const [domains, setDomains] = useState()
  const [userDomains, setUserDomains] = useState()

  useEffect(() =>{
    setUser(JSON.parse(localStorage.getItem("user"))) 
    fetchUserDomains()  
    fetchDomains()
  },[])

  const fetchUserDomains = async() => {
    const res = await fetch('/userDomains',{
      method:'get',
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer "+ localStorage.getItem("jwt")
      }
    })
    const data = await res.json()
    setUserDomains(data.domains)
    console.log(data.domains)
  }

  const fetchDomains = async() => {
    const jwtToken = localStorage.getItem("jwt")
    const res = await fetch('/allDomains',{
      method: 'get',
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer "+ jwtToken
      }
    })
    const data = await res.json()
    setDomains(data.domains)
  }
  
  async function joinDomain(d) {
    setUserDomains([...userDomains,d._id])
    const jwtToken = localStorage.getItem("jwt")
    const res = await fetch('/api/join',{
      method: 'put',
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer "+ jwtToken
      },
      body:JSON.stringify({
        domainId:d._id
      })
    })
  }

  const logout = () => {
    localStorage.clear()
    history.push('/login')
  }

  return (
    <div >
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
    
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography className={classes.heading} variant="h4">
           Domains
        </Typography>
        <Grid container spacing={4}>
          {
            domains?.map(d=>(
              <Grid item lg={4} md={6} xs={12} key={d.id}>
                <Card style={{backgroundColor:"white"}}>
                  <CardMedia
                    className={classes.media}
                    image={d.domainPic}
                    title={d.domainName}
                  />
                  <div className={classes.cardContent}>
                    <Link to ={`/domain/${d._id.toString()}`} style={{ textDecoration: 'none', color: 'black'}}>
                      <Typography className={classes.cardHeading} variant="h5">
                        {d.domainName}
                      </Typography>
                    </Link>
                    {
                    userDomains?.includes(d._id)?
                    <>
                      {console.log(d._id)}
                    {/* <Link to ={`/domain/${d._id.toString()}`} style={{ textDecoration: 'none' }}>
                    
                    </Link> */}
                    <Button className={classes.joinButton} disabled style={{color: "white"}}>
                    <Typography variant="body1" noWrap style={{color: 'white'}}>Joined</Typography>
                  </Button>
                  </>
                    :
                    <Button onClick={()=>joinDomain(d)} className={classes.joinButton}>
                      <Typography variant="body1" noWrap>Join</Typography>
                    </Button>
                    }
                  </div>
                  <Typography className={classes.cardDesc} variant="subtitle2">
                    {d.description}
                  </Typography>
                </Card>
              </Grid>
            ))
          }
        </Grid>
      </main>
    </div>
  );
}
