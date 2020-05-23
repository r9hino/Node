import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom'
import socketIOClient from 'socket.io-client';

import Monitor from './Monitor';
import InputOutput from './InputOutput';

import './App.css';

const ENDPOINT = "http://fabricabolos.mooo.com:5555";


function App() {
  const [staticSystemData, setStaticSystemData] = useState("");
  const [dynamicSystemData, setDynamicSystemData] = useState("");
  const [analogValues, setAnalogValues] = useState("");
  
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("socketStaticSystemData", data => {
      setStaticSystemData(data);
      //console.log(data);
    });
    
    socket.on("socketDynamicSystemData", data => {
      setDynamicSystemData(data);
      //console.log(data);
    });
    
    socket.on("socketAnalogValues", data => {
      setAnalogValues(data);
      //console.log(data);
    });
  }, []);
  
  return (
    <Router>
    <div className="App">
      <header>
        <nav className="navbar navbar-default navbar-dark bg-dark">
          <a className="navbar-brand" style={{marginRight:'35px'}} href="/">BBB Fabrica</a>
          <nav>
            <Link style={linkStyle} to="/">Monitor</Link>
            <Link style={linkStyle} to="/inputoutput">IO</Link>
          </nav>
        </nav>
      </header>
        <div className="container-fluid">
          <Switch>
            <Route path="/inputoutput">
              <InputOutput analogValues={analogValues}/>
            </Route>
            <Route path="/">
              <Monitor staticSystemData={staticSystemData} dynamicSystemData={dynamicSystemData} />
            </Route>
          </Switch>
        </div>
    </div>
    </Router>
  );
}
export default App;

const linkStyle = {
    color: '#afafaf',
    textDecoration: 'none',
    marginRight: '15px'
}

