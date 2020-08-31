import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signin = ()=>{
    //for node connection
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image, setImage] = useState("") //for profile pic
    const [url, setUrl] = useState(undefined) //for profile pic

    useEffect(() => {
        if(url){
            uploadField()
        }
    }, [url])

    const uploadPic = () =>{
        const data = new FormData()   //to upload file, search in google by fetch file ad read in mozilla docs
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "rd1")

        fetch("https://api.cloudinary.com/v1_1/rd1/image/upload", {
            method: "post",
            body: data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        }) 
    }

    const uploadField = () =>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes:"#e53935 red darken-1"})
            return
        }
        fetch("/signup", {
            method: "post",
            headers:{
                "Content-Type": "application/json"},
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })         
        }).then(res=>res.json())
        .then(data=>{
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

    const PostData = () =>{
        if(image){
            uploadPic()
        }else{
            uploadField()
        }
        
    }
    //till here and make changes in code below as required

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                   <h2>Sociogram</h2>
                   <input 
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange ={(e)=>setName(e.target.value)}
                   /> 
                   <input 
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange ={(e)=>setEmail(e.target.value)}
                   /> 
                   <input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange ={(e)=>setPassword(e.target.value)}
                   />
                    <div className="file-field input-field">
                    <div className="btn #64b5f6 blue lighten-2">
                        <span>Upload Profile Pic</span>
                        <input type="file" 
                        onChange={(e)=>setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                    </div>
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=> PostData()}>SignUp
                    </button>
                    <h5>
                        <Link to="/signin">Already have an account?</Link>
                    </h5>
            </div>
        </div>
    )
}

export default Signin