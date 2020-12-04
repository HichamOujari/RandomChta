import React,{Component,Fragment} from "react"
import loading from "../Assets/loading.gif"
import io from "socket.io-client"

const socket = io.connect('http://localhost:4000')

function scroll(old){
    setTimeout(()=>{
        var sc=document.getElementById("msgcontent");
        sc.scrollTop+=1
        if(old===-1 || old!==sc.scrollTop){
            scroll(sc.scrollTop)
        }
    },5);
}
function perdue() {
    document.querySelector(".couser").removeAttribute("hidden");
    document.querySelector("#videoElement2").setAttribute("hidden","");
}

class Chat extends Component {
    state = {
        msg : [],
        user:{},
        couser:{id:" ",name:" "},
        online:0,
    }
    send = (e) => {
        e.preventDefault()
        var ele=document.getElementById("msg");
        if(ele.value.length!==0){
            var time = new Date();
            time=time.toTimeString().split(':');
            time=time[0]+":"+time[1]
            socket.emit('new_message',{to:this.state.couser.id,id:this.state.user.id,msg:ele.value,time:time})
            ele.value="";
            scroll(-1);
        }
    }
    skip(){
        perdue()
        socket.emit("skip",{id:this.state.user.id,coid:this.state.couser.id})
    }
    stream = (dst,nbr) => {
        var video = document.querySelector(dst)
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    if(video!=null){
                        document.querySelectorAll(".loading")[nbr].setAttribute("hidden","");
                        video.removeAttribute('hidden');
                        video.srcObject=stream
                    }
                })
        }
    }
    componentDidMount(){
        socket.on('message',data=>{
            this.setState({
                msg:[...this.state.msg,{id:data.id,msg:data.msg,time:data.time}]})
        })
        socket.on('count',data=>{
            this.setState({
                online: data,
            })
        })
        socket.on('id',data=>{
            this.stream("#videoElement",0)
            this.setState({
                user:{id:data,name:this.props.match.params.user},
            })    
        })
        socket.on('coId',data=>{
            this.stream("#videoElement2",1)
            this.setState({
                couser:{id:data.id,name:data.name},
            })
        })
        socket.on('exited',data=>{
            perdue()
            this.setState({
                couser:{id:" ",name:" "},
            })
        })
    }
    render(){
        var key=0;
        const list = this.state.msg.map((i)=>{
            const type=(i.id===this.state.user.id)?"this":"other"
            scroll(-1);
            return(<Fragment key={key++}>
                        <p className={"content "+type}>{i.msg}</p><p className="heure">{i.time}</p><br/>
                    </Fragment>
                )
        })
        document.title="RandomChat - "+this.state.user.name
        return (
            <div className="formchat">
                <span className="online">{this.state.online}.online</span>
                <div className="video">
                    <div className="p p1">
                        <div className="espVideo">
                            <img className="loading" src={loading} alt="loading"/>
                            <video hidden id="videoElement" autoPlay={true}></video>
                        </div>
                        <br/>
                        <hr/><p className="user">{this.state.user.name}</p>
                    </div>
                    <div className="p p2">
                        <div className="espVideo">
                            <img className="loading couser" src={loading} alt="loading"/>
                            <video hidden id="videoElement2" autoPlay={true}></video>
                        </div>
                        <br/>
                        <hr/><p className="user">{this.state.couser.name}</p>
                    </div>
                </div>
                <form  onSubmitCapture={this.send} className="mailing">
                    <div id="msgcontent" className="msgcontent">
                        {list}
                        
                    </div>
                    <input type="text" id="msg" autoComplete="off" placeholder="Enter your message ..." name="msg" className="msg" autoFocus={true} />
                    <button className="send" >Send</button>
                    <button className="skip" onClick={this.skip.bind(this)}>Skip</button>
                </form>
            </div>
        )
    }
}

export default Chat