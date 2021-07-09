import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import domain from '../DomainData';
import Button from '@material-ui/core/Button'
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {useHistory,Link} from 'react-router-dom'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  media: {
    height: 180,
  },
  toolbar:{
    display:'flex',
    justifyContent:'space-between',
    backgroundColor: "#ff1616",
  },
  leftNav:{
    display:'flex',
    width:'max-content'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
  },
  cardContent:{
    display: 'flex',
    justifyContent:'space-between',
    width: '95%',
    alignItems: 'center',
  },
  joinButton:{
    backgroundColor:'#ff1616',
  },
  cardHeading:{
    padding: theme.spacing(2),
    fontWeight:'600',
    // fontSize: '1.4rem'
  },
  heading:{
    paddingTop: theme.spacing(8),
    padding: theme.spacing(1.5),
    fontWeight:'bold',
    // textAlign: 'center'
  },
  cardDesc: {
    paddingTop: 0,
    padding: theme.spacing(2), 
  }
}));

export default function Domains() {
  const classes = useStyles();
  const history = useHistory()

  const [user, setUser] = useState()
  const [domains, setDomains] = useState()

  useEffect(() =>{
    setUser(JSON.parse(localStorage.getItem("user")))   
    fetchDomains()
  },[])

  const fetchDomains = async() => {
    const jwtToken = localStorage.getItem("jwt")
    const res = await fetch('/domains',{
      method: 'get',
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer "+ jwtToken
      }
    })
    const data = await res.json()
    setDomains(data.domains)
  }
  
  async function joinDomain(id) {
    setDomains([...domains,id])
    const jwtToken = localStorage.getItem("jwt")
    const res = await fetch('/api/join',{
      method: 'put',
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer "+ jwtToken
      },
      body:JSON.stringify({
        domainId:id
      })
    })
  }

  const logout = () => {
    localStorage.clear()
    history.push('/login')
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" noWrap>
            Blogsite
          </Typography>
          <div className={classes.leftNav}>
            <Typography variant="h6" noWrap>
              Hi {user?.name}
            </Typography>
            <Button style={{color: "white",paddingLeft:'3vw'}} onClick={logout}>
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
            domain.map(d=>(
              <Grid item lg={4} md={6} xs={12} key={d.id}>
                <Card>
                  <CardMedia
                    className={classes.media}
                    image={d.image}
                    title={d.name}
                  />
                  <div className={classes.cardContent}>
                    <Typography className={classes.cardHeading} variant="h5">
                      {d.name}
                    </Typography>
                    {
                    domains?.includes(d.id)?
                    <div>
                    <Link to ={`/domain/${d.id}`} style={{ textDecoration: 'none' }}>
                      <InfoOutlinedIcon/>
                    </Link>
                    <Button className={classes.joinButton} disabled style={{color: "white"}}>
                    <Typography variant="body1" noWrap>Joined</Typography>
                  </Button>
                  </div>
                    :
                    <Button onClick={()=>joinDomain(d.id)} className={classes.joinButton}>
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
