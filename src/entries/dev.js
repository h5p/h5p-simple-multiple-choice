import 'expose?H5P!exports?H5P!h5p-view';
import SimpleMultiChoice from '../scripts/simple-multiple-choice';

var paramsCheck = require('../content/devCheck.json');
var paramsRadio = require('../content/devRadio.json');

new SimpleMultiChoice(paramsCheck).attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
new SimpleMultiChoice(paramsRadio).attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
