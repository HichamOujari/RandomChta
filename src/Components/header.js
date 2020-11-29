import React,{Component} from "react"
import {Link,BrowserRouter} from "react-router-dom"

class Header extends Component {
    render(){
        return (
            <div>
                <BrowserRouter>
                    <Link to="/" ><h1 className="supertitle">Random<span className="soustitle">Chat</span></h1></Link>
                </BrowserRouter>
            </div>
        )
    }
}

export default Header