import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {useHistory,Link} from 'react-router-dom'
import Footer from './Footer'
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './Navbar'

const useStyles = makeStyles((theme) => ({
  toolbar:{
    display:'flex',
    justifyContent:'space-between',
    backgroundColor: "#35281E",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingTop:theme.spacing(10),
    backgroundColor: '#F9E4B7',
    minHeight:'100vh'
  },
  cardContent:{
    display: 'flex',
    justifyContent:'space-between',
    width: '95%',
    alignItems: 'center',
  },
  joinedButton:{
    backgroundColor:'#cc7722',
    color:'white',
    "&:hover": {
      backgroundColor: "#b7410e",
    },
  },
  cardHeading:{
    padding: theme.spacing(2),
    fontWeight:'600',
    // fontSize: '1.4rem'
  },
  heading:{
    // paddingTop: theme.spacing(3),
    padding: theme.spacing(3),
    fontSize: '2.2rem',
    fontWeight:'bold'
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
  cardFooter:{
    display:'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:theme.spacing(2)
  }
}));

function Documents() {

  const classes = useStyles()
  const history = useHistory()
  const [documents,setDocuments] = useState([])
  const [show,setShow] = useState(false)

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
        data.documents.length===0?setShow(true):setShow(false)
        setDocuments(data.documents)
        console.log(data)
    }

    if(documents.length===0 && !show){
      return(
        <div
        style={{ display:'flex',justifyContent: 'center',alignItems: 'center',height:'100vh',backgroundColor:'#F9E4B7',color:'#35281E'}}
        >
          {/* <h3>Loading...</h3> */}
          <CircularProgress size={80} style={{color:"#35281E"}}/>
        </div>
      )
    }

    return (
      <div className={classes.root}>
          <Navbar/>
        {
          !show?
        <main className={classes.content}>
        <Typography className={classes.heading} variant="h5">
           Documents
        </Typography>
        <Grid container spacing={3}>
          {
            documents?.map(d=>(
              <Grid item lg={4} md={6} xs={12} key={d.id}>
                  {/* <h1>{d.name || "temp"}</h1> */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5">
                        {d.name || "temp"}
                      </Typography>
                    </CardContent>
                    <CardActions className={classes.cardFooter}>
                      <Typography variant="body1">
                        {d.users.length || 0}{d.users.length!==1?" Collaborators":" Collaborator"} 
                      </Typography>
                      <Button size="small" className={classes.joinedButton} onClick={()=>history.push('/collab',{roomId: d._id})}>Edit </Button>
                    </CardActions>
                  </Card>
              </Grid>
            ))
          }
        </Grid>
      </main>:
      <div
      style={{ display:'flex',justifyContent: 'center',alignItems: 'center',height:'100vh',backgroundColor:'#F9E4B7',color:'#35281E'}}
      >
        <h1>No documents created</h1>
      </div>
}
<Footer/>
       </div>
    )
}

export default Documents
