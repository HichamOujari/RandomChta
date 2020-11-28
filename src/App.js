import React,{Component} from "react"
import {BrowserRouter as Router,Route} from "react-router-dom"
import Chat from "./Components/chat"
import Join from "./Components/join"
import Header from "./Components/header"
import style from "./css/style.css"

class App extends Component {
    render(){
        return (
            <Router>
                <Header />
                <Route path="/" exact>
                    <Join />
                </Route>
                <Route path="/chat" >
                    <Chat />
                </Route>
            </Router>
        )
    }
}

export default App