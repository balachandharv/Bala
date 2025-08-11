import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Firebase configuration - Replace with your Firebase project's configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

firebase.initializeApp(firebaseConfig);

const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState("");

  // Monitor user authentication status
  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  // Sign-in function (error: doesn't handle incorrect credentials properly)
  const signIn = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      // Missing proper error handling (like showing an alert or changing the UI)
      console.log("Error signing in:", error); 
    }
  };

  // Sign-up function (error: weak password validation)
  const signUp = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      // No detailed error handling (e.g., showing user-friendly message)
      console.error("Error signing up:", error);
    }
  };

  // Sign-out function (no error handling for possible failures)
  const signOut = () => {
    firebase.auth().signOut().catch(error => {
      console.error("Error signing out:", error); // Missing UI response
    });
  };

  // Handle file upload (error: file size limit not checked)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // File upload (error: no progress indicator for uploads)
  const uploadFile = async () => {
    if (file) {
      const storageRef = firebase.storage().ref(`files/${file.name}`);
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Missing progress indicator (e.g., loading bar)
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          setFileURL(downloadURL);
        }
      );
    }
  };

  return (
    <div>
      <h1>Cloud-Based Security App</h1>

      {/* Authentication Section */}
      {!user ? (
        <div>
          <h2>Sign In / Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signIn}>Sign In</button>
          <button onClick={signUp}>Sign Up</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={signOut}>Sign Out</button>

          {/* File Upload Section */}
          <h3>File Upload</h3>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadFile}>Upload</button>

          {fileURL && (
            <div>
              <h4>Uploaded File:</h4>
              <a href={fileURL} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
