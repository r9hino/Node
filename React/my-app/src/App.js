import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom'
import {Navbar, Nav} from 'react-bootstrap';
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
        <Navbar variant="dark" bg="dark">
          <Navbar.Brand style={{marginRight:'35px'}} href="/">BBB Fabrica</Navbar.Brand>
          
            
            <Nav>
              <Link style={linkStyle} to="/">Monitor</Link>
              <Link style={linkStyle} to="/inputoutput">IO</Link>
            </Nav>
          
        </Navbar>
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

