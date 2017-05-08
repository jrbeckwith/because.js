import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './app';
import './index.css';

// Kludges
injectTapEventPlugin();

document.title = "BCS Demos";

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
