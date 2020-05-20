import React, {useState, useEffect} from 'react';
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
    <div className="App">
      <header>
        <Navbar expand="sm" variant="dark" bg="dark">
          <Navbar.Brand href="#home">BBB Fabrica</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#monitor">Monitor</Nav.Link>
                  <Nav.Link href="#inputoutput">IO</Nav.Link>
              </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
      
      <div className="container-fluid">
        <Monitor staticSystemData={staticSystemData} dynamicSystemData={dynamicSystemData}/>
        <InputOutput analogValues={analogValues}/>
        
      </div>
    </div>
  );
}
export default App;



