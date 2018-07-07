import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { App } from './app';
import './index.css';

// Enable strict mode for MobX. This disallows state changes outside of an action
configure({ enforceActions: true });

ReactDOM.render(<App />, document.getElementById('root'));
