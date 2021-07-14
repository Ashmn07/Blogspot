import React, { useEffect, useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// import Button from '@material-ui/core/Button'
// import {useHistory,Link} from 'react-router-dom'
// import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import TextEditor from './TextEditor'
import Chat from './Chat'

// const useStyles = makeStyles((theme) => ({
//   toolbar:{
//     display:'flex',
//     justifyContent:'space-between',
//     backgroundColor: "#ff1616",
//   },
//   leftNav:{
//     display:'flex',
//     width:'max-content'
//   },
// }));

function Collab({location}) {

  // const classes = useStyles()
  // const history = useHistory()

  // const logout = () => {
  //   localStorage.clear()
  //   history.push('/login')
  // }

  // const user = localStorage.getItem("user")

    useEffect(() =>{
       check()
    }, [])
    async function check() {
        const jwtToken = localStorage.getItem("jwt")
        const res = await fetch('/documents',{
          method: 'get',
          headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+ jwtToken
          }
        })
        const data = await res.json()
        if(!data?.documents.includes(location.state.roomId)){
            join()
        }
    }
    async function join(){
        const joinRoom = await fetch('/api/joinDoc',{
            method: 'put',
            headers: {
              "Content-Type":"application/json",
              "Authorization":"Bearer "+ localStorage.getItem('jwt')
            },
            body:JSON.stringify({
              docId:location.state.roomId
            })
        })
    }

    return (
      // <div style={{display: 'flex',flexDirection: 'column'}}>
        // <div id="appbar" style={{width:'100vw'}}>
          // <AppBar position="relative">
          // <Toolbar className={classes.toolbar}>
          //   <Link to="/" style={{textDecoration: 'none',color:'white'}}>
          //     <Typography variant="h6" noWrap>
          //       Blogsite
          //     </Typography>
          //   </Link>
          //   <div className={classes.leftNav}>
          //   <Link to="/domain" style={{textDecoration: 'none',color:'white'}}>
          //     <Typography variant="h6" noWrap>
          //       Domains
          //     </Typography>
           //   </Link>
             // <Typography variant="h6" noWrap>
               // Hi {user?.name}
        //       </Typography>
        //       <Button style={{color: "white",paddingLeft:'3vw'}} onClick={logout}>
        //         <ExitToAppIcon/>
        //         <Typography variant="body1" noWrap>Logout</Typography>
        //       </Button>
        //     </div>
        //   </Toolbar>
        // </AppBar>
        // </div> 
        <div style={{display:'flex',height:'100vh',width: '100vw'}}>
            <TextEditor id={location.state.roomId}/>
            <Chat id={location.state.roomId}/>
        </div>
      // </div>
    )
}

export default Collab
