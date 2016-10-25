import 'expose?H5P!exports?H5P!h5p-view';
import SimpleMultiChoice from '../scripts/simple-multiple-choice';

var paramsCheck = require('../content/devCheck.json');
var paramsRadio = require('../content/devRadio.json');
var paramsEmpty = require('../content/devEmpty.json');

const contentDataMultiple = {
  previousState: "1[,]2"
};
const contentDataSingle = {
  previousState: "0"
};

const smc1 = new SimpleMultiChoice(paramsCheck);
smc1.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
paramsRadio.alternatives[1] =
  'Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles ' +
  'Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles ' +
  'Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles ' +
  'Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles ' +
  'Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles Turtles ' +
  'Turtles Turtles Turtles Turtles Turtles Turtles ';
const smc2 = new SimpleMultiChoice(paramsRadio);
smc2.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
const smcEmpty = new SimpleMultiChoice(paramsEmpty);
smcEmpty.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));

const smcPrevState = new SimpleMultiChoice(paramsCheck, null, contentDataMultiple);
smcPrevState.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));

const smcPrevState2 = new SimpleMultiChoice(paramsCheck, null, contentDataSingle);
smcPrevState2.attach(H5P.jQuery('<div>').appendTo(H5P.jQuery('body')));
