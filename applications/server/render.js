import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Html from '../../layouts/Html/Html';
import MyDivComponent from '../../components/MyDivComponent/MyDivComponent';


export default function render(assetsData) {
    const componentData = 'Hello world!';

    const props = {
        assets: assetsData,
        state: {
            data: componentData
        },
        markup: ReactDOMServer.renderToStaticMarkup(<MyDivComponent data={componentData} />)
    };

    const html = ReactDOMServer.renderToStaticMarkup(<Html {...props} />);

    return `<!DOCTYPE html>${html}`;
}
