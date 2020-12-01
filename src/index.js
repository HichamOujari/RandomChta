import React from "react"
import ReactDom from "react-dom"
import App from "./App"
import {createStore} from "redux"
import {Provider} from "react-redux"

const initState = {
    count:0
}

const reducer = (state = initState,action) =>{
    if(action.type==="AAAA"){
        return {count:state.count+1};
    }else if(action.type==="BBBB"){
        return {count:state.count-1};
    }
    return state;
}

const store = createStore(reducer);

ReactDom.render(<Provider store={store}><App /></Provider>,document.getElementById("root"));