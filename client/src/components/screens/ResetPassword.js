import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const ResetPwd = ()=>{
    const history = useHistory()
    const [email,setEmail] = useState("")
    const PostData = () =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes:"#e53935 red darken-1"})
            return
        }
        fetch("/resetpassword", {
            method: "post",
            headers:{
                "Content-Type": "application/json"},
            body:JSON.stringify({
                email
            })         
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            }
            else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                   <h2>Sociogram</h2>
                   <input 
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange ={(e)=>setEmail(e.target.value)}
                   /> 
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                    onClick={()=>PostData()}
                    >Reset your Password
                    </button>
            </div>
        </div>
    )
}

export default ResetPwd