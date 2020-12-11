import React,{Component} from "react"
import {BrowserRouter as Router,Route,Switch} from "react-router-dom"
import Chat from "./Components/chat"
import Join from "./Components/join"
import Header from "./Components/header"
import "./css/style.css"


class App extends Component {
    render(){
        return (
            <Router>
                <Header />
                <Switch>
                    <Route path="/chat/:user" exact component={Chat}/>
                    <Route path="/" component={Join}/>
                </Switch>
            </Router>
        )
    }
}

export default App;
