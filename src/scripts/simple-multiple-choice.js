import './styles/simple-multiple-choice.css';
import xApiGenerator from './xapiGenerator';
let instanceId = 0;

export default class SimpleMultiChoice extends H5P.EventDispatcher {

  /**
   * Enum for continue/next logic. For now this is used for being able to
   * display the feedback for simple multiple choice. I.e: can't skip to next
   * question until this is displayed (if anything needs to be displayed)
   *
   * @readonly
   * @enum {number}
   */
  static get AllowFinish() {
    return {
      /**
       * Question type will never need to display the next button. Always ready
       * to skip to next question
       * @member {number}
       */
      ALWAYS: 0,
      /**
       * Question is not ready to let go yet
       * @member {Number}
       */
      DENY: 1,
      /**
       * Question has done whatever needed, ready to let go
       * @member {Number}
       */
      ALLOW: 2
    };
  }

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

    // The <li> alternatives, so we can easily append feedback to them
    this.listItems = [];

    // Keeps the <div> feedback elements, so we can easily remove them
    this.feedbackElements = [];

    // Keep track of the state
    this.state = alternatives.map((alt, i) => {
      return {
        id: i,
        text: alt.text,
        checked: false
      };
    });

    // Does this have feedback at all?
    this.hasFeedback = alternatives.some(alternative => {
      return alternative.feedback.chosenFeedback ||
             alternative.feedback.notChosenFeedback;
    });
    // Have we been given the possibility to display feedback?
    this.feedbackShown = false;

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

      this.$wrapper = $wrapper;
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
      // If feedback is shown, hide it:
      if (this.feedbackShown) {
        this.feedbackElements.forEach(element => {
          element.parentNode.removeChild(element);
        });
        this.feedbackElements = [];
        this.feedbackShown = false;

        this.trigger('allow-finish-changed');
      }

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

      this.trigger('changed');

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

        this.listItems.push(listItem);
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
     * Reset the task, resetting state and unchecking all checkboxes.
     */
    this.resetTask = function () {
      this.state = this.state.map(option => ({ ...option, checked: false }));
      this.$wrapper?.get(0)?.querySelectorAll('input[type=checkbox]').forEach(el => {
        el.removeAttribute('checked');
      });
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
      });
    };

    /**
     * If question alternatives have feedback, those have to be shown before
     * user should be allowed to finish question.
     *
     * @return {number}
     */
    this.allowFinish = function () {
      if (this.hasFeedback) {
        return (this.hasFeedback && this.feedbackShown) ? SimpleMultiChoice.AllowFinish.ALLOW : SimpleMultiChoice.AllowFinish.DENY;
      }

      return SimpleMultiChoice.AllowFinish.ALWAYS;
    };

    /**
     * Function invoked when user is finished. MC Need this to be able to
     * give feedback if it has any
     *
     * @return {boolean} true if it had any feedback to give, false otherwise
     */
    this.finish = function () {
      alternatives.forEach((alt, index) => {
        if (alt.feedback) {
          let feedback;
          const checked = this.state[index].checked;
          if (checked && alt.feedback.chosenFeedback) {
            feedback = alt.feedback.chosenFeedback;
          }
          else if (!checked && alt.feedback.notChosenFeedback) {
            feedback = alt.feedback.notChosenFeedback;
          }

          if (feedback) {
            const feedbackElement = document.createElement('div');
            feedbackElement.className = 'h5p-simple-multiple-choice-alternative-feedback ' + (checked ? 'chosen' : 'not-chosen');
            feedbackElement.innerHTML = feedback;
            this.feedbackElements.push(feedbackElement);
            this.listItems[index].appendChild(feedbackElement);
          }
        }
      });

      this.feedbackShown = true;
      return (this.feedbackElements.length === 0);
    };

    this.restorePreviousState();
  }
}
