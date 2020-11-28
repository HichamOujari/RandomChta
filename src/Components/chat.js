import React,{Component} from "react"

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
        user:"Admin",
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
    render(){
        var key=0;
        const list = this.state.msg.map((i)=>{
            const type=(i.me===1)?"this":"other"
            return(<div key={key++}>
                        <p><p className={"content "+type}>{i.title}</p><p className="heure">{i.time}</p></p><br/>
                    </div>
                )
        })
        
        return (
            <div className="formchat">
                <div className="video">
                    <div className="p p1">
                        <div className="espVideo">

                        </div>
                        <br/>
                        <hr/><p className="user">{this.state.user}</p>
                    </div>
                    <div className="p p2">
                        <div className="espVideo">

                        </div>
                        <br/>
                        <hr/><p className="user">{this.state.user}</p>
                    </div>
                    
                </div>
                <form  onSubmitCapture={this.send} className="mailing">
                    <div id="msgcontent" className="msgcontent">
                        {list}
                    </div>
                    <input type="text" id="msg" autoComplete="off" placeholder="Enter your message ..." name="msg" className="msg" autoFocus="true" />
                    <button className="send" >Send</button>
                    <button className="skip">Skip</button>
                </form>
            </div>
        )
    }
}

export default Chat