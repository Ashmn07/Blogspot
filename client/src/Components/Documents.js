import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import {useHistory,Link} from 'react-router-dom'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import TextEditor from './TextEditor'
import Chat from './Chat'

const useStyles = makeStyles((theme) => ({
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
    paddingTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontWeight:'bold',
    // textAlign: 'center'
  },
  cardDesc: {
    paddingTop: 0,
    padding: theme.spacing(2), 
  }
}));

function Documents() {

  const classes = useStyles()
  const history = useHistory()
  const [documents,setDocuments] = useState()

  const logout = () => {
    localStorage.clear()
    history.push('/login')
  }

  const user = localStorage.getItem("user")

    useEffect(() =>{
        getDomains()
    }, [])
    async function getDomains() {
        const jwtToken = localStorage.getItem("jwt")
        const res = await fetch('/documents',{
          method: 'get',
          headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+ jwtToken
          }
        })
        const data = await res.json()
        setDocuments(data.documents)
        console.log(data)
    }

    return (
      <div className={classes.root}>
          <AppBar position="relative">
          <Toolbar className={classes.toolbar}>
            <Link to="/" style={{textDecoration: 'none',color:'white'}}>
              <Typography variant="h6" noWrap>
                Blogsite
              </Typography>
            </Link>
            <div className={classes.leftNav}>
            <Link to="/domain" style={{textDecoration: 'none',color:'white'}}>
              <Typography variant="h6" noWrap>
                Domains
              </Typography>
             </Link>
            <Link to="/documents" style={{textDecoration: 'none',color:'white'}}>
              <Typography variant="h6" noWrap>
                Documents
              </Typography>
             </Link>
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
           Documents
        </Typography>
        {  console.log(documents)}
        <Grid container spacing={4}>
          {
            documents?.map(d=>(
              <Grid item lg={4} md={6} xs={12} key={d.id}>
                  <h1>{d.name || "temp"}</h1>
              </Grid>
            ))
          }
        </Grid>
      </main>
       </div>
    )
}

export default Documents
