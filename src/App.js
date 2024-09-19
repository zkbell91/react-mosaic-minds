import React from 'react';
import BuilderContent from '../components/BuilderContent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Builder.io with React</h1>
      </header>
      <main>
        <BuilderContent model="page" />
      </main>
    </div>
  );
}

export default App;
