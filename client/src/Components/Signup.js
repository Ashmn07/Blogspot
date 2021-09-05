import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

const bgUrl = {
  background: `url(https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80)`,
  height: "100vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  // opacity: 0.8,
};

const useStyles = makeStyles((theme)=>({
    cardContent:{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // width: '40%',
      height: '80%'
    },
    linkRouter: {
        textDecoration: 'none',
    },
    toolbar:{
      backgroundColor:"#35281E"
    },
    navButton:{
      backgroundColor:"#cc7722",
      color: 'white',
      "&:hover": {
        backgroundColor: "#b7410e",
      },
    },
    card:{
      width:'25%',
      borderRadius: '15px',
      background:'linear-gradient(145deg, #ffffff, #e6e6e6)',
      boxShadow:'2px 2px 4px #b48648'
    },
    cardContainer:{
      display:'flex',
      justifyContent: 'center',
      marginTop: '12%',
    },
    formElement: {
      margin:'10px',
      width:'75%'
    },
    formButton:{
      margin:'15px',
      backgroundColor:"#cc7722",
      "&:hover": {
        backgroundColor: "#b7410e",
      },
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    pos: {
      marginBottom: 12,
    },
    title: {
        flexGrow: 1,
    },
    buttons:{
        display: 'flex',
        justifyContent: 'space-between',
        minWidth:'12vw'
    },
    heading:{
      fontSize:'2rem',
      fontWeight:'bold',
    },
  }))

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#35281E',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#35281E',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#35281E',
    },
  },
})(TextField);

function Signup() {
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    // const [invalidEmail, setInvalidEmail] = useState(false)
    const [error, setError] = useState('')
    const [successShow, setSuccessShow] = useState('')

    // useEffect(()=>{
    //   console.log(name,email,password)
    // },[name,password,email])

    const submitData = (e) =>{
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        setShowAlert(true)
        setError("Enter a valid Email")
        return;
      }
      e.preventDefault()
      fetch("/signup",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            password,
            email,
        })
      })
      .then(res=>res.json())
        .then(data=>{
          if(data.errMess){
            setError(data.errMess)
            setShowAlert(true); 
            setTimeout(()=>setShowAlert(false),2000);
          }
          else{
            setSuccessShow(true)
            setTimeout(()=>setSuccessShow(false),2000);
          }
        })
    }

    const classes = useStyles()
    return (
        <div style={bgUrl}>
            <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Typography variant="h4" className={classes.title}>
                Blogspot
                </Typography>
                <div className={classes.buttons}>
                <Link to="/login" className={classes.linkRouter} textDecor>
                    <Button variant="contained" className={classes.navButton}>
                        Login
                    </Button>
                </Link>
                <Link to="/signup" className={classes.linkRouter}>
                    <Button variant="contained" className={classes.navButton}>
                        Signup
                    </Button>
                </Link>
                </div>
            </Toolbar>
            </AppBar>
            {
              showAlert?
              <Alert severity="error">
                {error}
              </Alert>
              :null
            }
            {
              successShow?
              <Alert severity="success">
                User registered successfully!
              </Alert>
              :null
            }
            <div className={classes.cardContainer}>
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                <Typography variant="caption" className={classes.heading}>
                    Sign Up
                </Typography>
                <FormControl className={classes.formElement}>
                    {/* <InputLabel htmlFor="name">Enter Name</InputLabel>
                    <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} aria-describedby="my-helper-text" /> */}
                    <CssTextField label="Enter Name" type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)} aria-describedby="my-helper-text" />
                </FormControl>
                <FormControl className={classes.formElement}>
                    {/* <InputLabel htmlFor="my-email">Enter Email address</InputLabel>
                    <Input id="my-email" value={email} onChange={(e)=>setEmail(e.target.value)} aria-describedby="my-helper-text" /> */}
                    <CssTextField label="Enter Email" type="email" id="my-email" value={email} onChange={(e)=>setEmail(e.target.value)} aria-describedby="my-helper-text"/>
                </FormControl>
                <FormControl className={classes.formElement}>
                    {/* <TextField id="pass" label="Enter Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} aria-describedby="my-helper-text" /> */}
                    <CssTextField label="Enter Password" type="password" id="pass" value={password} onChange={(e)=>setPassword(e.target.value)} aria-describedby="my-helper-text"/>
                </FormControl>
                <Button className={classes.formButton} variant="contained" color="primary" onClick={submitData}>
                    Sign Up   
                </Button>
                </CardContent>
            </Card>
            </div>
        </div>
    )
}

export default Signup
