import React, { useEffect} from 'react';
import TextEditor from './TextEditor'
import Chat from './Chat'

function Collab({location}) {

    useEffect(() =>{
       check()
    }, [])
    async function check() {
        const jwtToken = localStorage.getItem("jwt")
        const res = await fetch('/api/documents',{
          method: 'get',
          headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+ jwtToken
          }
        })
        const data = await res.json()
        // if(!data?.documents.includes(location.state.roomId)){
        //     join()
        // }
        function roomExists(id) {
          return data.documents.some(function(d) {
            return d._id === id;
          }); 
        }
        if(!roomExists(location.state.roomId)){
          join()
        }
    }
    async function join(){
        const joinRoom = await fetch('/api/api/joinDoc',{
            method: 'put',
            headers: {
              "Content-Type":"application/json",
              "Authorization":"Bearer "+ localStorage.getItem('jwt')
            },
            body:JSON.stringify({
              docId:location.state.roomId,
            })
        })
    }

    return ( 
        <div style={{display:'flex',height:'100vh',width: '100vw'}}>
            <TextEditor id={location.state.roomId} name={location.state.name?location.state.name:''}/>
            <Chat id={location.state.roomId}/>
        </div>
    )
}

export default Collab
