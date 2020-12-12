import React,{Component,Fragment} from "react"
import loading from "../Assets/loading.gif"
import io from "socket.io-client"
import Peer from 'peerjs'

//const socket = io.connect('https://randomchat-server.herokuapp.com')
const socket = io.connect('http://localhost:4000')

function scroll(old){
    setTimeout(()=>{
        var sc=document.getElementById("msgcontent");
        sc.scrollTop+=1
        if(old===-1 || old!==sc.scrollTop){
            scroll(sc.scrollTop)
        }
    },30);
}
function perdue() {
    document.querySelector(".couser").removeAttribute("hidden");
    document.querySelector("#videoElement2").setAttribute("hidden","");
    document.querySelector("#msg").disabled="true";
}

function affiche() {
    document.querySelector("#videoElement2").removeAttribute("hidden");
    document.querySelector(".couser").setAttribute("hidden","");
    document.querySelector("#msg").removeAttribute("disabled");
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
            time=time[0]+":"+time[1];
            socket.emit("new_msg",{to:this.state.couser.id,msg:ele.value,time:time});
            this.setState({
                msg:[...this.state.msg,{to:this.state.couser.id,msg:ele.value,time:time}],
            })
            ele.value="";
        }
    }
    skip(){
        perdue();
        this.setState({
            couser:{id:" ",name:" "}
        })
        socket.emit("skip",{name:this.state.user.name,peerid:this.state.user.peerid});
    }
    next(){
        socket.emit("skip",this.state.user.name);
        document.querySelector("#skiped").style.display="none";
    }
    stream = (dst,nbr) => {
        var video = document.querySelector(dst);
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    if(video!=null){
                        document.querySelectorAll(".loading")[nbr].setAttribute("hidden","");
                        video.removeAttribute('hidden');
                        video.srcObject=stream;
                    }
                })
        }
    }

    componentDidMount(){
        let peer = new Peer();
        let peerid=null
        peer.on('open',id=>{
            peerid=id;
            socket.emit("mydata",{name:this.props.match.params.user,peerid:id});
        })
        socket.on("mydata",data=>{
            this.setState({
                user:{id:data,name:this.props.match.params.user,peerid:peerid}
            })
            this.stream("#videoElement",0);
        })
        socket.on("new_msg",data=>{
            this.setState({
                msg:[...this.state.msg,data],
            })
        })
        socket.on('count',data=>{
            this.setState({
                online: data,
            })
        })
        socket.on("couser",data=>{
            this.setState({
                couser:{id:data.id,name:data.name,peerid:data.peerid}
            })
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
                .then(stream=>{
                    peer.call(data.peerid,stream)
                })
                .catch(err=>{console.log('Error in first one : '+err)})
            affiche();
        })
        peer.on('call',call=>{
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
                .then(stream=>{
                    call.answer(stream);
                    call.on('stream', function(remoteStream) {
                        document.querySelector("#videoElement2").srcObject=remoteStream;
                    });
                })
            }, function(err) {
            console.log('Failed to get local stream' ,err);
        })
        socket.on("camera",data=>{
            document.querySelector("#videoElement2").srcObject=window.URL.createObjectURL(data)
        })
        socket.on("exited",()=>{
            perdue();
            this.setState({
                couser:{id:" ",name:" "},
            })
            document.querySelector("#skiped").style.display="block";
        })
    }

    render(){
        var key=0;
        const list = this.state.msg.map((i)=>{
            const type=(i.to!==this.state.user.id)?"this":"other"
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
                        <div className="skiped" id="skiped">
                            <hr/>
                            <p>You have been skipped : </p>
                            <p className="btnnew" onClick={this.next.bind(this)}>New</p>
                        </div>
                    </div>
                    <input type="text" id="msg" autoComplete="off" disabled placeholder="Enter your message ..." name="msg" className="msg" autoFocus={true} />
                    <button className="send" >Send</button>
                    <button className="skip" onClick={this.skip.bind(this)}>Skip</button>
                </form>
            </div>
        )
    }
}

export default Chat