import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Collab from './Components/Collab';
import {BrowserRouter, Route, Switch, Redirect, useHistory} from 'react-router-dom'
import Home from './Components/Home';
import DomainDetails from './Components/DomainDetails';
import Domains from './Components/Domains';
import Documents from './Components/Documents';

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
  )
}

function App() {
 
  return (
    <div className="App">
      {/* <TextEditor/>
      <Chat/> */}
      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
    </div>
  );
}

export default App;
