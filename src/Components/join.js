import React,{Component} from "react"
import joinlogo from "../Assets/logojoin.png"

class Join extends Component {
    render(){
        return (
            <div>
                <form className="formjoin">
                    <img className="joinlogo" alt="logo" src={joinlogo} />
                    <input className="joininput" type="text" name="username" autoComplete="off" placeholder="Enter your username ..."/>
                    <input className="joininput" type="text" name="Age" autoComplete="off" placeholder="Enter your Age ..."/>
                    <input className="joinsubmit" value="Connect" type="submit" />
                </form>
            </div>
        )
    }
}

export default Join