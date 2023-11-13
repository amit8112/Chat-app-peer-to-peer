// App.js
import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState('');
  const [message, setMessage] = useState('');
  const [localPeerId, setLocalPeerId] = useState('');
  const [isConnected, setIsConnected] = useState(false); // New state
  const messageRef = useRef(null);

  useEffect(() => {
    // Create a Peer instance
    const peerInstance = new Peer();

    // Set up event handlers
    peerInstance.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setLocalPeerId(id);
    });

    peerInstance.on('connection', (newConnection) => {
      console.log('Connection established!');
      setConn(newConnection);
      setIsConnected(true); // Update connection status

      // Listen for data from the remote peer
      newConnection.on('data', (data) => {
        console.log('Received data:', data);
        setMessage(data);
      });
    });

    setPeer(peerInstance);

    // Clean up on component unmount
    return () => {
      peerInstance.destroy();
    };
  }, []);

  const handleConnect = () => {
    if (peer) {
      // Connect to the remote peer
      const newConnection = peer.connect(remotePeerId);

      // Set up event handlers for the new connection
      newConnection.on('open', () => {
        console.log('Connected to remote peer!');
        setConn(newConnection);
        setIsConnected(true); // Update connection status

        // Listen for data from the remote peer
        newConnection.on('data', (data) => {
          console.log('Received data:', data);
          setMessage(data);
        });
      });

      // Handle errors
      newConnection.on('error', (err) => {
        console.error('Connection error:', err);
        setIsConnected(false); // Update connection status on error
      });
    }
  };

  const handleSend = () => {
    if (conn && messageRef.current) {
      const newMessage = messageRef.current.value;
      conn.send(newMessage);
      setMessage(newMessage);
      messageRef.current.value = '';
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Hacker Communication</h1>
      <div className="mb-3">
        <p className="mb-2">Local Peer ID: {localPeerId}</p>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Remote Peer ID"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
          />
          <button
            className={`btn ${isConnected ? 'btn-success' : 'btn-primary'}`} // Conditional class
            type="button"
            onClick={handleConnect}
            disabled={isConnected} // Disable the button when already connected
          >
            {isConnected ? 'Connected' : 'Connect'}
          </button>
        </div>
      </div>
      {isConnected && !conn && <p className="alert alert-danger">Connection failed!</p>}
      <div className="mb-3">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            ref={messageRef}
            placeholder="Type a message..."
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
      <div>
        <h3>Received Message:</h3>
        <p className="alert alert-info">{message}</p>
      </div>
    </div>
  );
};

export default App;
