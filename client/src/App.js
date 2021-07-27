import {Suspense,lazy} from 'react'
import './App.css';
import {BrowserRouter, Route, Switch, Redirect, useHistory} from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CircularProgress } from '@material-ui/core';
const Login = lazy(()=>import('./Components/Login'))
const Signup = lazy(()=>import('./Components/Signup'))
const Collab = lazy(()=>import('./Components/Collab'))
const Home = lazy(()=>import('./Components/Home'))
const DomainDetails = lazy(()=>import('./Components/DomainDetails'))
const Domains = lazy(()=>import('./Components/Domains'))
const Documents = lazy(()=>import('./Components/Documents'))


function Routes(){
  const history = useHistory()
  const user = JSON.parse(localStorage.getItem("user"))
  if(user){
    console.log(user)
    if(history.location.pathname.startsWith('/login') || history.location.pathname.startsWith('/signup')){
      history.push('/')
    }
  }
  else{
    history.push('/login')
  }
  return(
    <>
    <Suspense
    fallback={
      <div
      style={{ display:'flex',justifyContent: 'center',alignItems: 'center',height:'100vh',backgroundColor:'#F9E4B7',color:'#35281E'}}
      >
          <CircularProgress size={80} style={{color:"#35281E"}}/>
      </div>
    }
    >
    <Switch>
      <Route path="/login" component={Login} exact/>
      <Route path="/signup" component={Signup} exact/>
      <Route path="/domain/:domainId" component={DomainDetails} exact/>
      <Route path="/domain" component={Domains} exact/>
      <Route path="/documents" component={Documents} exact/>
      <Route path="/collab" component={Collab} exact/>
      <Route path="/" component={Home} exact/>
      <Redirect to="/"/>
    </Switch>
    </Suspense>
    </>
  )
}

function App() {
 
  const theme = createMuiTheme({
    typography: {
      // h2:{
      //   fontFamily:"Just Me Again Down Here"
      // },
      h2: {
        fontFamily: '"Montserrat", Open Sans',
      },
      h4: {
        fontFamily: 'Satisfy'
      },
      h5:{
        fontFamily: 'Montserrat',
      },
      caption:{
        fontFamily: 'Arima Madurai'
      }
      // h4:{
      //   fontFamily: '"Gill Sans", "Gill Sans MT", "Calibri", "Trebuchet MS", "sans-serif"'
      // }
    },
  });

  return (
    <div className="App">
      {/* <TextEditor/>
      <Chat/> */}
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes/>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
