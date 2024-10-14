import React from 'react';
import ItemList from './components/ItemList';
import WebSocketComponent  from './components/WebSocketComponent';

function App() {
  return (
    <div className="App">
      <div>
        <h1>University Marketplace UC</h1>
      </div>
      <WebSocketComponent />
    </div>
  );
}

export default App;
