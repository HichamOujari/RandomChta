import React,{Component,Fragment} from "react"
import {connect} from "react-redux"

function scroll(old){
    setTimeout(()=>{
        var sc=document.getElementById("msgcontent");
        sc.scrollTop+=1
        if(old===-1 || old!==sc.scrollTop){
            scroll(sc.scrollTop)
        }
    },5);
}

class Chat extends Component {
    state = {
        msg : [],
        user:{},
    }
    send = (e) => {
        var ele=document.getElementById("msg");
        e.preventDefault()
        if(ele.value.length!==0){
            var time = new Date();
            time=time.toTimeString().split(':');
            time=time[0]+":"+time[1]
            this.setState({
                msg:[...this.state.msg,{me:1,title:ele.value,time:time}]
            })
            ele.value="";
            scroll(-1);
        }
    }
    stream = () => {
        var video = document.querySelector("#videoElement")
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    if(video!=null){
                        video.srcObject=stream
                        video = document.querySelector("#videoElement2")
                        video.srcObject=stream
                        console.log(stream)
                    }
                })
        }
    }
    componentDidMount(){
        this.stream()
        this.setState({
            user:{id:1,name:this.props.match.params.user},
        })
    }
    render(){
        var key=0;
        const list = this.state.msg.map((i)=>{
            const type=(i.me===1)?"this":"other"
            return(<Fragment key={key++}>
                        <p className={"content "+type}>{i.title}</p><p className="heure">{i.time}</p><br/>
                    </Fragment>
                )
        })
        document.title="RandomChat - "+this.state.user.name
        return (
            <div className="formchat">
                <div className="video">
                    <div className="p p1">
                        <div className="espVideo">
                            <video id="videoElement" autoPlay={true}></video>
                        </div>
                        <br/>
                        <hr/><p className="user">{this.state.user.name}</p>
                    </div>
                    <div className="p p2">
                        <div className="espVideo">
                            <video id="videoElement2" autoPlay={true}></video>
                        </div>
                        <br/>
                        <hr/><p className="user">Robot</p>
                    </div>
                </div>
                <form  onSubmitCapture={this.send} className="mailing">
                    <div id="msgcontent" className="msgcontent">
                        {list}
                    </div>
                    <input type="text" id="msg" autoComplete="off" placeholder="Enter your message ..." name="msg" className="msg" autoFocus={true} />
                    <button className="send" >Send</button>
                    <button className="skip">Skip</button>
                </form>
            </div>
        )
    }
}
function mapStatetoProps(state){
    return {
        id : state.count,
    }
}

function mapDispatchtoProps(dispatch) {
    return{
        increase : ()=> dispatch({type:"AAAA"}),
        decrease : ()=> dispatch({type:"BBBB"})
    }
}
export default connect(mapStatetoProps,mapDispatchtoProps)(Chat)