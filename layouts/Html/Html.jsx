require('./Html.css');

import React from 'react';

let styles = []; // External styles

let scripts = []; // External scripts

class Html extends React.Component {
    getStyles(assets) {
        return assets.concat(styles).map((item, i) => {
            return <link rel="stylesheet" href={item} key={'stylesheet-' + i} />;
        });
    }

    getScripts(assets) {
        return assets.concat(scripts).map((item, i) => {
            return <script src={item} key={i}></script>;
        });
    }

    render() {
        const { assets, state, markup } = this.props;
        const initialState = `window.__INITIAL_STATE__ = ${ JSON.stringify(state) }`;

        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>React-stater-kit</title>
                {this.getStyles(assets.styles)}
            </head>
            <body>
            <div dangerouslySetInnerHTML={{__html: markup}} id="react-view"></div>
            <script type="text/javascript" dangerouslySetInnerHTML={{__html: initialState}}></script>
            { this.getScripts(assets.scripts) }
            </body>
            </html>
        );
    }
}

export default Html;
