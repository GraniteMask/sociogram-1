import React, {useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import M from 'materialize-css'

const Profile = ()=>{
    const [mypics, setPics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("") //for profile pic
    const [name, setName] = useState("") //for name edit
    const [email, setEmail] = useState("") //for email edit

    useEffect(()=>{
       fetch('/mypost',{
           headers: {
               "Authorization": "Bearer "+ localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           setPics(result.mypost)
       })
    },[])
    

    useEffect(()=>{
        if(image){
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
            
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+ localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic: data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                localStorage.setItem("user", JSON.stringify({...state, pic:data.pic}))
                dispatch({type:"UPDATEPIC", payload:result.pic})
            })
            //window.location.reload()
        })
        .catch(err=>{
            console.log(err)
        }) 
        }
    },[image])

    const updatePhoto = (file) =>{
        setImage(file)  
    }
   
    const updateName = (name,id) =>{
        if(name===null || name===undefined || name==""){
            M.toast({html: "Name must not be empty", classes:"#e53935 red darken-1"})
            return
        }
        
        fetch('/updatename',{
          
            method:"put",
            headers:{
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                name,
                id
            })
        }).then(res=>res.json)
        .then(result=>{
            
            localStorage.setItem("user", JSON.stringify({...state, name:result}))
            dispatch({type:"UPDATENAME", payload:name})
        })
    }

    const updateEmail = (email,id) =>{

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes:"#e53935 red darken-1"})
            return
        }
        fetch('/updateemail',{
          
            method:"put",
            headers:{
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                email,
                id
            })
        }).then(res=>res.json)
        .then(result=>{
            
            localStorage.setItem("user", JSON.stringify({...state, email:result}))
            dispatch({type:"UPDATEEMAIL", payload:email})
        })
    }


    return(
        <div style={{
            maxWidth: "550px",
            margin: "0px auto"
        }}>
            <div style={{
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                
            
            <div style={{
                display: "flex",
                justifyContent: "space-around",
            }}>
                <div>
                    <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                    src={state?state.pic:"loading..."}/>
                
                </div>
                
                <div>
                    <h4 className="font">{state?state.name:"loading..."}</h4>
                    <h5 className="font">{state?state.email:"loading..."}</h5>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "108%"
                    }}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:0} followers</h6> {/*state ? is used to check is it takes little time to fetch */}
                        <h6>{state?state.following.length:0} following</h6>

                    </div>
                </div>
            </div>

            {/* Edit profile modal */}

          <button style={{marginBottom:"20px", marginTop:"10px"}} data-target="modal2" className="btn modal-trigger #64b5f6 blue lighten-2">Edit your Profile</button>
        
        <div id="modal2" class="modal" style={{color:"black"}}>
       <div className="modal-content">
        
       <div className="file-field input-field" style={{margin:"10px"}}>
                 <div className="btn waves-effect waves-light #64b5f6 blue lighten-2">
                     <span>Update Profile Pic</span>
                     <input type="file" 
                     onChange={(e)=>updatePhoto(e.target.files[0])}
                     />
                 </div>
                 <div className="file-path-wrapper">
                     <input className="file-path validate" type="text" />
                 </div>
                 </div>
         
         
         <input style={{margin:"10px "}}
                 type="text"
                 placeholder="Edit your Name"
                 value={name}
                 onChange={(e)=>setName(e.target.value)}
                />
                <button style={{margin:"10px "}} className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=> updateName(name,state._id)}>Change your Name
                 </button>

         <input style={{margin:"10px "}}
                 type="text"
                 placeholder="Edit your Email"
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                />
                <button style={{margin:"10px "}} className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=> updateEmail(email,state._id)}>Change your Email
                 </button>
                 <h6 style={{textAlign: "center", marginTop:"10px", color:"red"}}>Sign out and then Sign in to apply your changes correctly</h6>
         </div>
                 <div className="modal-footer">
         <button className="modal-close waves-effect waves-green btn-flat">close</button>
       </div>
       </div>
     </div>

            <div className="gallery">
                {   mypics.length!==0?
                    mypics.map(item=>{
                        return(
                            
                                <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                
                        )
                    })
                    :
                    <div >
                        <h2>Create Your First Post....</h2>
                        <button className="waves-effect waves-light btn #64b5f6 blue lighten-2" style={{marginLeft: "40%"}}><Link to="/create" className="link">Create Post</Link></button>
                    </div>
                }
            </div>
        </div>
    )
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
  });

export default Profile