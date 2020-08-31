import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import moment from 'moment'

const Home = ()=>{
    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    
    useEffect(()=>{
        fetch('/getsubpost',{
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
            
            }).then(res=>res.json())
            .then(result=>{
                
                setData(result.posts)
        })
    },[])

    const likePost=(id)=>{
        fetch('/like',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){   //to update the likes instanteneously
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost=(id)=>{
        fetch('/unlike',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){   //to update the likes instanteneously
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text, postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){   //to update the comment
                    return result
                }
                else{
                    return item
                }
            }) 
            setData(newData)       
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost =(postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData =data.filter(item=>{
                return item._id !== result._id
            }) //filtering out deleted data so getting that item's id
            setData(newData)
        })
    }

    const deleteComment =(postId, commentId)=>{
        fetch(`/deletecomment/${postId}/${commentId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{       
                if(item._id==result._id) {             //Checks which post is updated and returns updated posts in new data.
                    return result
                }else {
                    return item
                }
            })
            setData(newData) 
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="home">
        
            {   data.length!==0?
                data.map(item=>{
                    return(
                        
                    
                        <div className="card home-card" key={item._id}>
                            <h5 className="font" style={{padding:"5px"}}><Link to={item.postedBy._id!==state._id?"/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id==state._id && <i className="material-icons" style={{float: "right", cursor:"pointer"}} 
                            onClick={()=>deletePost(item._id)}
                            >delete</i>}</h5> {/* this line is used to show the delete option to only creator tof the post*/}
                            <div className="card-image">
                            <img src={item.photo} />
                            </div>
                            <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {item.likes.includes(state._id)
                                ? <i className="material-icons"
                                onClick={()=>{unlikePost(item._id)}}
                                style={{cursor:"pointer"}}>thumb_down</i>
                                :
                                <i className="material-icons"
                                onClick={()=>{likePost(item._id)}}
                                style={{cursor:"pointer"}}>thumb_up</i>
                            }
                                <h6>{item.likes.length} likes</h6>
                                <h6 className="font">{item.title}</h6>
                                <p className="font">{item.body}</p>
                                
                                {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span className="font" style={{fontWeight:"1000"}}>{record.postedBy.name}</span>: {record.text} {record.postedBy._id==state._id && <i className="material-icons" style={{float: "right", cursor:"pointer"}} 
                                        onClick={()=>deleteComment(item._id,record._id)}
                                        >delete</i>} {item.postedBy._id==state._id && <i className="material-icons" style={{float: "right", cursor:"pointer"}} 
                                        onClick={()=>deleteComment(item._id,record._id)}
                                        >delete</i>}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                <input type="text" placeholder="add a comment"/>
                                </form>
                                <h6 style={{fontSize:"12px", fontWeight:"bold", color:"red"}}>{moment(item.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</h6>            
                            </div>       
                            </div>
                       
                    
                    )
                     
                    
                })
                :
                    <h2>Follow someone to see posts....</h2>

                
            }
            
        </div>
        
    )
}

export default Home
                    