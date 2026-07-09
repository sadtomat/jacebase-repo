import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

let jpgimage = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/background1.jpeg`
console.log(jpgimage)
const mainBackground = {
  backgroundSize: 'cover',
  backgroundImage: `url(${jpgimage})`,
  objectFit: 'cover',
  boxSizing: 'border-box',
};
root.render(
  <body style={mainBackground}>
    <div className="container"> 
      <App />
    </div>
  </body>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
