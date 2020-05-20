import React from 'react';
import {Table} from 'react-bootstrap';


export default function Monitor({staticSystemData, dynamicSystemData}) {
    
    return (
        <React.Fragment>
          <div style={{margin:'0 auto'}} className="row col-sm-6 my-4">
            <h5>Beaglebone Gateway Data</h5>
            <Table striped hover size="sm">
              <tbody>
                <tr>
                  <td>Distro</td>
                  <td>{staticSystemData !== "" ? staticSystemData.osInfo.distro : ""}</td>
                </tr>
                <tr>
                  <td>Kernel</td>
                  <td>{staticSystemData !== "" ? staticSystemData.osInfo.kernel : ""}</td>
                </tr>
                <tr>
                  <td>Architecture</td>
                  <td>{staticSystemData !== "" ? staticSystemData.osInfo.arch : ""}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.time.currentTime : ""}</td>
                </tr>
                <tr>
                  <td>Uptime</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.time.uptime : ""}</td>
                </tr>
                <tr>
                  <td>Timezone</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.time.timezone : ""}</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div style={{margin:'0 auto'}} className="row col-sm-6 my-4">
            <h5>Beaglebone OS Variables</h5>
            <Table striped hover size="sm">
              <tbody>
                <tr>
                  <td>CPU Total Load</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.cpu.currentLoad : ""}</td>
                </tr>
                <tr>
                  <td>CPU User Load</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.cpu.currentLoadUser : ""}</td>
                </tr>
                <tr>
                  <td>CPU System Load</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.cpu.currentLoadSystem : ""}</td>
                </tr>
                <tr>
                  <td>System RAM</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.memoryRAM.total + " MB": ""}</td>
                </tr>
                <tr>
                  <td>Used RAM</td>
                  <td>{dynamicSystemData !== "" ? `${dynamicSystemData.memoryRAM.used} MB (${dynamicSystemData.memoryRAM.usedPercent})` : ""}</td>
                </tr>
                <tr>
                  <td>System Memory</td>
                  <td>{dynamicSystemData !== "" ? dynamicSystemData.memoryDisk.total + " MB" : ""}</td>
                </tr>
                <tr>
                  <td>Used Memory</td>
                  <td>{dynamicSystemData !== "" ? `${dynamicSystemData.memoryDisk.used} MB (${dynamicSystemData.memoryDisk.usedPercent})` : ""}</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div style={{margin:'0 auto'}} className="row col-sm-6 my-4">
            <h5>Beaglebone Conectivity</h5>
            <Table striped hover size="sm">
              <tbody>
                <tr>
                  <td>Beaglebone IP</td>
                  <td>{staticSystemData !== "" ? staticSystemData.network.ip4 : ""}</td>
                </tr>
                <tr>
                  <td>Gateway IP</td>
                  <td>{staticSystemData !== "" ? staticSystemData.network.gateway : ""}</td>
                </tr>
                <tr>
                  <td>Connection Type</td>
                  <td>{staticSystemData !== "" ? staticSystemData.network.type : ""}</td>
                </tr>
                <tr>
                  <td>Interface</td>
                  <td>{staticSystemData !== "" ? staticSystemData.network.iface : ""}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </React.Fragment>
    );
}



