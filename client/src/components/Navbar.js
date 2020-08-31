import React, {useContext,useRef,useEffect,useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = ()=>{
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(()=>{
         M.Modal.init(searchModal.current)
     },[])
    const renderList = () =>{
        if(state){
            return [
                <li key="1"><a><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></a></li>,
                <li key="2"><a href="/profile">Profile</a></li>,
                <li key="3"><Link to="/mypost">My Posts</Link></li>,
                <li key="4"><Link to="/create">Create Post</Link></li>,
                <li key="5"><Link to="/myfollowingpost">My Following Feed</Link></li>,
                <li key="6">
                    <button className="btn waves-effect waves-light #ef5350 red lighten-1"
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type: "CLEAR"})
                        history.push('/signin')
                    }}
                    >Sign Out
                    </button>
                </li>,  
            ]
        }
        else{
            return [
               
                <li key="7"><Link to="/signin">SignIn</Link></li>,
                <li key="8"><Link to="/signup">Signup</Link></li>
               
                
            ]
        }
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({query})
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }
  

    return(
        <div>
        <nav>
            <div className="nav-wrapper #bbdefb blue lighten-4">
            <Link to={state?"/":"/signin"}  className="brand-logo left">Sociogram</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
            {/* <ul id="nav-mobile" className="right"> */}
            <ul className="right hide-on-med-and-down">
                {renderList()}
            {/* </ul> */}
            </ul>
            </div>
        </nav>
        <ul className="sidenav hide-on-large-only" id="mobile-demo">
            {renderList()}
        </ul>
        {/* Search */}
        <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search your friends and loved ones..."
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>

        </div>
    )
    
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {edge:'right'});
  });

export default Navbar