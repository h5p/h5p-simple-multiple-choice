let instanceId = 0;

export default class SimpleMultiChoice extends H5P.EventDispatcher {

  /**
   * Constructor for survey
   * @param {Object} params
   * @param {string} params.question Question text
   * @param {string} params.inputType Checkbox or radio
   * @param {Array} params.alternatives Array of strings with answers alternatives
   * @param {number} contentId
   */
  constructor(params, contentId = null) {
    super();
    this.params = params;

    // Provide a unique identifier for each multi choice
    this.uniqueName = 'h5p-simple-multiple-choice-' + instanceId;
    instanceId += 1;

    // Keep track of the state
    this.state = this.params.alternatives.map((alt, i) => {
      return {
        id: i,
        text: alt,
        checked: false
      }
    });

    /**
     * Attach library to wrapper
     * @param {jQuery} $wrapper
     */
    this.attach = function($wrapper) {
      const element = document.createElement('div');
      element.className = 'h5p-simple-multiple-choice';
      const question = this.createQuestion();
      question.className = 'h5p-simple-multiple-choice-question';
      element.appendChild(question);

      const altList = this.createAlternativesList(this.params.alternatives);
      element.appendChild(altList);

      $wrapper.get(0).appendChild(element);
    };

    /**
     * Create html for multiple choice
     * @return {HTMLElement} html for multiple choice
     */
    this.createQuestion = function() {
      const question = document.createElement('div');
      question.textContent = this.params.question;
      return question;
    };

    /**
     * Handle input changed, trigger event for listeners
     * @param {number} inputIndex Index of input element that changed
     */
    this.handleInputChange = function(inputIndex) {
      this.state = this.state.map((alt, j) => {
        let checked = j === inputIndex;
        if (this.params.inputType !== 'radio') {
          checked = j === inputIndex ? !alt.checked : alt.checked;
        }

        // Immutable state
        return Object.assign({}, alt, {
          checked: checked
        });
      });

      this.trigger('changed', this.state);
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
        const label = document.createElement('label');
        const input = document.createElement('input');

        // Input attributes
        input.type = this.params.inputType || 'checkbox';
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
