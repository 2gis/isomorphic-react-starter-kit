
/* eslint no-process-env: 0 */
/* eslint no-console: 0 */

import getAssets from './server/getAssets';

import path from 'path';
import express from 'express';

import render from './server/render';
const app = express();

app.use(express.static(path.join(__dirname, '..', 'build/public')));

app.use(getAssets);

app.use((req, res) => {
    res.send(render(req.assetsData));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Server listening on: ' + PORT);
});
