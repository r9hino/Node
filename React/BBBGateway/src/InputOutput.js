import React from 'react';

export default function InputOutput({analogValues}) {
    
    return (
      <React.Fragment>
        <div className="row mt-3">
            <div className="col-3 mb-4 px-2">
              <div className="card">
                  <h5 className="card-header px-2">Analog 1</h5>
                  <div className="card-body px-2 py-3">
                    <p className="card-text">{analogValues.analogA3}</p>
                  </div>
              </div>
            </div>
            <div className="col-3 mb-4 px-2">
              <div className="card">
                  <h5 className="card-header px-2">Analog 2</h5>
                  <div className="card-body px-2 py-3">
                    <p className="card-text">{analogValues.analogA4}</p>
                  </div>
              </div>
            </div>
            <div className="col-3 mb-4 px-2">
              <div className="card">
                  <h5 className="card-header px-2">Analog 3</h5>
                  <div className="card-body px-2 py-3">
                    <p className="card-text">{analogValues.analogA5}</p>
                  </div>
              </div>
            </div>
            <div className="col-3 mb-4 px-2">
              <div className="card">
                  <h5 className="card-header px-2">Analog 4</h5>
                  <div className="card-body px-2 py-3">
                    <p className="card-text">{analogValues.analogA6}</p>
                  </div>
              </div>
            </div>
        </div>
      </React.Fragment>
    );
}



