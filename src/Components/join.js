import React,{Component} from "react"
import joinlogo from "../Assets/logojoin.png"

class Join extends Component {
    render(){
        const auth = (e) => {
            e.preventDefault();
            window.location.href="/chat/"+document.getElementById("username").value;
        }
        document.title="RandomChat - Welcome"
        return (
            <div>
                <form onSubmit={auth} className="formjoin">
                    <img className="joinlogo" alt="logo" src={joinlogo} />
                    <input className="joininput" type="text" required id="username" name="username" autoComplete="off" placeholder="Enter your username ..."/>
                    <input className="joininput" type="number" required name="Age" autoComplete="off" placeholder="Enter your Age ..."/>
                    <input className="joinsubmit" value="Connect" type="submit" />
                </form>
            </div>
        )
    }
}

export default Join