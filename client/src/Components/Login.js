import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Alert from '@material-ui/lab/Alert';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import {useHistory} from 'react-router-dom'
// import MenuIcon from '@material-ui/icons/Menu';

const bgUrl = {
  background: `url(https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZyUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80)`,
  height: "100vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  // opacity: 0.8,
};

const useStyles = makeStyles((theme) => ({
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // width: '40%',
    height: "80%",
  },
  toolbar: {
    backgroundColor: "#35281E",
  },
  linkRouter:{
    textDecoration: 'none',
  },
  navButton: {
    backgroundColor: "#cc7722",
    color: "white",
    "&:hover": {
      backgroundColor: "#b7410e",
    },
  },
  card: {
    width: "25%",
    borderRadius: "15px",
    background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
    boxShadow: "2px 2px 4px #b48648",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "12%",
  },
  formElement: {
    margin: "10px",
    width: "75%",
    // "&:focus": {
    //   color: "#b7410e",
    // },
  },
  formButton: {
    margin: "15px",
    backgroundColor: "#cc7722",
    "&:hover": {
      backgroundColor: "#b7410e",
    },
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  pos: {
    marginBottom: 12,
  },
  title: {
    flexGrow: 1,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    minWidth: "12vw",
  },
}));

function Login() {
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState('')

  const history = useHistory()

  const loginData = (e) => {
    e.preventDefault()
    fetch("/login",{
      method:"post",
      headers:{
          "Content-Type":"application/json"
      },
      body:JSON.stringify({
          password,
          email,
      })
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.errMess) {
          setError(data.errMess)
          setShowAlert(true); 
          setTimeout(()=>setShowAlert(false),2000);
      }
      else{
        localStorage.setItem("jwt",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        history.push('/')
      }
    })
  }
    const classes = useStyles()
    return (
      <div className={classes.root} style={bgUrl}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Typography variant="h5" className={classes.title}>
              Blogspot
            </Typography>
            <div className={classes.buttons}>
              <Link to="/login" className={classes.linkRouter}>
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
        <div className={classes.cardContainer}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h5" component="h2">
                Login
              </Typography>
              <FormControl className={classes.formElement}>
                <InputLabel htmlFor="my-email">Email address</InputLabel>
                <Input id="my-email" value={email} onChange={(e)=>setEmail(e.target.value)} aria-describedby="my-helper-text" />
              </FormControl>
              <FormControl className={classes.formElement}>
                {/*<InputLabel htmlFor="pass">Password</InputLabel>*/}
                <TextField id="pass" label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} aria-describedby="my-helper-text" />
              </FormControl>
              <Button className={classes.formButton} variant="contained" color="primary" onClick={loginData}>
                Login   
              </Button>
            </CardContent>
            {/* <CardActions>
              <Button size="small" variant="contained" color="primary">
                Log In
              </Button>
            </CardActions> */}
          </Card>
        </div>
      </div>
    );
}


export default Login
