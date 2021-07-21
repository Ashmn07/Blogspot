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
import Footer from './Footer'
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './Navbar';

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
    paddingBottom: theme.spacing(7),
    backgroundColor: '#F9E4B7',
    minHeight:'100vh'
  },
  cardContent:{
    display: 'flex',
    justifyContent:'space-between',
    width: '100%',
    alignItems: 'center',
  },
  joinButton:{
    backgroundColor:'#cc7722',
    color:"white",
    margin: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#b7410e",
    },
  },
  joinButtonInverse:{
    backgroundColor:'#b7410e',
    color:"white",
    margin: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#cc7722",
    },
  },
  cardHeading:{
    padding: theme.spacing(2),
    fontWeight:'600',
    color:'black'
    // fontSize: '1.4rem'
  },
  heading:{
    paddingTop: theme.spacing(2.75),
    padding: theme.spacing(1.5),
    fontSize:'2.2rem',
    fontWeight:'bold',
    // textAlign: 'center'
  },
  cardDesc: {
    paddingTop: 0,
    padding: theme.spacing(2), 
  },
  Logo:{
    marginRight:theme.spacing(6),
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
  const [domains, setDomains] = useState([])
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

  if(domains.length===0){
    return(
      <div
      style={{ display:'flex',justifyContent: 'center',alignItems: 'center',height:'100vh',backgroundColor:'#F9E4B7',color:'#35281E'}}
      >
        <CircularProgress size={80} style={{color:"#35281E"}}/>
      </div>
    )
  }

  return (
    <div>
      <Navbar/>    
      <main className={classes.content}>
        <Typography className={classes.heading} variant="h5">
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
                    <Button className={classes.joinButtonInverse} disabled style={{color: "white"}}>
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
      <Footer/>
    </div>
  );
}
