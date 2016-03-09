import React from 'react';
import ReactDOMServer from 'react-dom/server';

import getAssets from './getAssets';

import Html from '../../layouts/Html/Html.jsx';
import MyDivComponent from '../../components/MyDivComponent/MyDivComponent';


export default function render() {
    const componentData = 'Hello world!';

    const props = {
        assets: getAssets(),
        state: {
            data: componentData
        },
        markup: ReactDOMServer.renderToStaticMarkup(<MyDivComponent data={componentData} />)
    };

    const html = ReactDOMServer.renderToStaticMarkup(<Html {...props} />);

    return `<!DOCTYPE html>${html}`;
}
