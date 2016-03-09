require('../layouts/Html/Html.css');

import React from 'react';
import { render } from 'react-dom';

import MyDivComponent from '../components/MyDivComponent/MyDivComponent';

const initialState = window.__INITIAL_STATE__;

render(
    <MyDivComponent {...initialState} />,
    document.getElementById('react-view')
);
