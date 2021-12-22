import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>My app content</h2>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
