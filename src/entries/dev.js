import 'expose?H5P!exports?H5P!h5p-view';
import SimpleMultiChoice from '../scripts/simple-multiple-choice';

var paramsCheck = require('../content/devCheck.json');
var paramsRadio = require('../content/devRadio.json');
var paramsEmpty = require('../content/devEmpty.json');

const smc1 = new SimpleMultiChoice(paramsCheck, 1);
smc1.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
const smc2 = new SimpleMultiChoice(paramsRadio, 2);
smc2.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
const smcEmpty = new SimpleMultiChoice(paramsEmpty, 3);
smcEmpty.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
