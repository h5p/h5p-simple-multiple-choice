import './styles/simple-multiple-choice.css';
import xApiGenerator from './xapiGenerator';
let instanceId = 0;

export default class SimpleMultiChoice extends H5P.EventDispatcher {

  /**
   * Constructor for Simple Multiple Choice
   * @param {string} question Question text
   * @param {string} inputType Checkbox or radio
   * @param {Array} alternatives Array of strings with answers alternatives
   * @param {number} contentId
   */
  constructor({ question, alternatives, inputType }, contentId = null) {
    super();

    // Provide a unique identifier for each multi choice
    this.uniqueName = 'h5p-simple-multiple-choice-' + instanceId;
    instanceId += 1;

    // Keep track of the state
    this.state = alternatives.map((alt, i) => {
      return {
        id: i,
        text: alt,
        checked: false
      }
    });

    this.xapiGenerator = new xApiGenerator({ question, alternatives });

    /**
     * Attach library to wrapper
     * @param {jQuery} $wrapper
     */
    this.attach = function($wrapper) {
      const element = document.createElement('div');
      element.className = 'h5p-simple-multiple-choice';
      const questionElement = this.createQuestion();
      questionElement.className = 'h5p-simple-multiple-choice-question';
      element.appendChild(questionElement);

      const altList = this.createAlternativesList(alternatives);
      element.appendChild(altList);

      $wrapper.get(0).appendChild(element);
    };

    /**
     * Create html for multiple choice
     * @return {HTMLElement} html for multiple choice
     */
    this.createQuestion = function() {
      const questionElement = document.createElement('div');
      questionElement.innerHTML = question;
      return questionElement;
    };

    /**
     * Handle input changed, trigger event for listeners
     * @param {number} inputIndex Index of input element that changed
     */
    this.handleInputChange = function(inputIndex) {
      this.state = this.state.map((alt, j) => {
        let checked = j === inputIndex;
        if (inputType !== 'radio') {
          checked = j === inputIndex ? !alt.checked : alt.checked;
        }

        // Immutable state
        return Object.assign({}, alt, {
          checked: checked
        });
      });

      let xApiTemplate = this.createXAPIEventTemplate('interacted');
      const xApiEvent = this.xapiGenerator.generateXApi(xApiTemplate, this.state);
      this.trigger(xApiEvent);
    };

    /**
     * Create alternatives for multiple choice
     * @param {Array.<string>} alternatives Answer alternatives
     * @return {HTMLElement} html for alternatives list items
     */
    this.createAlternativesList = function (alternatives) {
      const altList = document.createElement('ul');
      altList.className = 'h5p-simple-multiple-choice-alternatives';
      alternatives.forEach((alt, i) => {

        // Elements
        const listItem = document.createElement('li');
        listItem.className = 'h5p-simple-multiple-choice-alternative-li';
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.className = 'h5p-simple-multiple-choice-alternative-input';

        // Input attributes
        input.type = inputType || 'checkbox';
        input.name = this.uniqueName;

        // Label attributes
        label.addEventListener('change', this.handleInputChange.bind(this, i));
        label.appendChild(input);
        label.innerHTML += alt;

        listItem.appendChild(label);
        altList.appendChild(listItem);
      });

      return altList;
    };
  }
}
