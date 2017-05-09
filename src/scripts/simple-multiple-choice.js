import './styles/simple-multiple-choice.css';
import xApiGenerator from './xapiGenerator';
let instanceId = 0;

export default class SimpleMultiChoice extends H5P.EventDispatcher {

  /**
   * Constructor for Simple Multiple Choice
   * @param {string} question Question text
   * @param {string} inputType Checkbox or radio
   * @param {Array} alternatives Array of strings with answers alternatives
   * @param {number|*} contentId
   * @param {Object} contentData
   */
  constructor({ question, alternatives = [], inputType }, contentId = null, contentData = {}) {
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
      const questionElement = document.createElement('div');
      questionElement.classList.add('h5p-simple-multiple-choice-question');
      questionElement.classList.add('h5p-subcontent-question');
      const questionText = this.createQuestion(this.uniqueName);
      questionElement.appendChild(questionText);

      element.appendChild(questionElement);

      const altList = this.createAlternativesList(this.uniqueName);
      element.appendChild(altList);

      $wrapper.get(0).appendChild(element);
    };

    /**
     * Create html for multiple choice
     * @return {HTMLElement} html for multiple choice
     */
    this.createQuestion = function(id) {
      const questionElement = document.createElement('div');
      questionElement.id = id;
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
     *
     * @param {string} questionId Unique id of question element
     * @return {HTMLElement} html for alternatives list items
     */
    this.createAlternativesList = function (questionId) {
      if (!this.state.length) {
        const err = document.createElement('div');
        err.className = 'h5p-simple-multiple-choice-alternatives-error';
        err.textContent = 'ERROR: No alternatives chosen';
        return err;
      }

      const altList = document.createElement('ul');
      altList.classList.add('h5p-simple-multiple-choice-alternatives');
      altList.classList.add('h5p-subcontent-body');
      altList.setAttribute('role', 'listbox');
      altList.setAttribute('aria-labelledby', questionId);

      this.state.forEach(({ id, text, checked }) => {

        // Elements
        const listItem = document.createElement('li');
        listItem.className = 'h5p-simple-multiple-choice-alternative-li';
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.className = 'h5p-simple-multiple-choice-alternative-input';

        // Input attributes
        input.type = inputType || 'checkbox';
        input.name = this.uniqueName;
        if (checked) {
          input.setAttribute('checked', 'checked');
        }

        // Label attributes
        label.addEventListener('change', this.handleInputChange.bind(this, id));
        label.appendChild(input);
        label.innerHTML += text;


        listItem.appendChild(label);
        altList.appendChild(listItem);
      });

      return altList;
    };

    /**
     * Get current state result pattern
     * @return {string}
     */
    this.getCurrentState = function () {
      return xApiGenerator.getResultPattern(this.state);
    };

    /**
     * Restore previous state
     */
    this.restorePreviousState = function () {
      if (!contentData.previousState) {
        return;
      }

      // Parse answer
      const answers = contentData.previousState.split('[,]');
      answers.forEach(value => {
        this.state[value].checked = true;
      })
    };

    this.restorePreviousState();
  }
}
