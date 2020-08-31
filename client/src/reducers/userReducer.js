export const initialState = null

export const reducer = (state, action)=>{
    if(action.type == "USER"){
        return action.payload
    }
    if(action.type=="CLEAR"){
        return null
    }
    if(action.type=="UPDATEPIC"){
        return {
            ...state,
            pic:action.payload
        }
    }
    if(action.type=="UPDATENAME"){
        return {
            ...state,
            name:action.payload
        }
    }

    if(action.type=="UPDATEEMAIL"){
        return {
            ...state,
            email:action.payload
        }
    }
    
    if(action.type=="UPDATE"){
        return{
            ...state, //spread the previous state
            followers: action.payload.followers,
            following:action.payload.following
        }
    }
    return state
}