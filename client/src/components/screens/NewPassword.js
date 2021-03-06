import React, {useState, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'

const NewPassword = ()=>{
    const history = useHistory()
    const [password,setPassword] = useState("")
    const {token} = useParams()
    const PostData = () =>{
        fetch("/newpassword", {
            method: "post",
            headers:{
                "Content-Type": "application/json"},
            body:JSON.stringify({
                password,
                token
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
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange ={(e)=>setPassword(e.target.value)}
                   />
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                    onClick={()=>PostData()}
                    >Update your password
                    </button>
            </div>
        </div>
    )
}

export default NewPassword