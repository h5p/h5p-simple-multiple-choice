/**
 * Generate xAPI statements
 */
export default class xApiGenerator {
  constructor({ question, alternatives }) {

    const choices = alternatives.map((alt, i) => {
      return {
        id: i,
        description: {
          'en-US': alt
        }
      }
    });

    // Set up default response object
    this.event = {
      description: {
        'en-US': question // We don't actually know the language of the question
      },
      type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
      interactionType: 'choice',
      choices: choices
    };
  }

  /**
   * Extend xAPI template
   * @param {Event} xApiTemplate xAPI event template
   * @param {Object} state State of multiple choice
   * @return {Event} Extended xAPI event
   */
  generateXApi(xApiTemplate, state) {
    const response = state.reduce((pattern, alt, i) => {
      if (alt.checked) {
        pattern += (pattern.length ? '[,]' : '') + i;
      }
      return pattern;
    }, '');

    const statement = xApiTemplate.data.statement;
    Object.assign(statement, {
      result: {
        response
      }
    });

    if (statement.object) {
      const definition = statement.object.definition;
      Object.assign(definition, this.event);
    }

    return xApiTemplate;
  }
}
