import 'expose?H5P!exports?H5P!h5p-view';
import SimpleMultipleChoice from '../src/scripts/simple-multiple-choice';

describe('Simple Multiple Choice', () => {
  const params = {
    question: 'What do you like the most ?',
    inputType: 'checkbox',
    alternatives: [
      'Fish',
      'Turtles',
      'Icecream'
    ]
  };

  const $body = H5P.jQuery('body');

  beforeEach(() => {
    spyOn(H5P, 'newRunnable');
  });

  describe('General', () => {
    const simpleMultiChoice = new SimpleMultipleChoice(params);
    simpleMultiChoice.attach($body);
    const surveyElement = $body.get(0).querySelectorAll('.h5p-simple-multiple-choice');


    // Check that attach is called
    it('should attach to the $wrapper', () => {
      expect(surveyElement[0].parentNode).toBe($body.get(0));
    });

    // Check that all survey elements are called with newRunnable
    it('should display question', () => {
      const question = document.querySelector('.h5p-simple-multiple-choice-question');
      expect(question.textContent).toBe(params.question);
    });

    it('should create 3 alternatives', () => {
      const alternatives = document.querySelector('.h5p-simple-multiple-choice-alternatives');
      expect(alternatives.children.length).toEqual(3);
    });

    it('should trigger immutable states', (done) => {
      const alternatives = document.querySelector('.h5p-simple-multiple-choice-alternatives');
      const inputs = alternatives.querySelectorAll('input');
      let changed = 0;
      let prevState = null;

      simpleMultiChoice.on('changed', (state) => {
        if (changed > 0) {
          simpleMultiChoice.off('changed');
        }
        else {
          prevState = state;
        }

        //Wait for DOM
        setTimeout(() => {
          if (changed > 0) {
            console.log("prevState", prevState.data);
            console.log("state", state.data);
            expect(state.data == prevState.data).toBeFalsy();
            setTimeout(() => {
              done();
            }, 100);
          }
          else {
            changed += 1;
            inputs[2].click();
          }
        }, 100);
      });
      inputs[1].click();
    });
  });

  describe('Checkboxes', () => {
    const simpleCheckboxMultiChoice = new SimpleMultipleChoice(params);
    simpleCheckboxMultiChoice.attach($body);
    const alternatives = document.querySelectorAll('.h5p-simple-multiple-choice-alternatives')[1];
    const inputs = alternatives.querySelectorAll('input');

    it ('input field should be a checkbox', () => {
      expect(inputs[0].type).toBe('checkbox');
    });

    it('should trigger state change when checked', (done) => {
      simpleCheckboxMultiChoice.on('changed', (state) => {
        simpleCheckboxMultiChoice.off('changed');

        //Wait for DOM
        setTimeout(() => {
          expect(state).toBeDefined();
          done();
        }, 100);
      });
      inputs[0].click();
    });

    it('should check when checked', (done) => {
      simpleCheckboxMultiChoice.on('changed', (state) => {
        simpleCheckboxMultiChoice.off('changed');

        //Wait for DOM
        setTimeout(() => {
          expect(state.data[0].checked).toBeTruthy();
          expect(state.data[1].checked).toBeTruthy();
          expect(state.data[2].checked).toBeFalsy();
          done();
        }, 100);
      });
      inputs[1].click();
    });

    it('should uncheck when unchecked', (done) => {
      simpleCheckboxMultiChoice.on('changed', (state) => {
        simpleCheckboxMultiChoice.off('changed');

        //Wait for DOM
        setTimeout(() => {
          expect(state.data[0].checked).toBeTruthy();
          expect(state.data[1].checked).toBeFalsy();
          expect(state.data[2].checked).toBeFalsy();
          done();
        }, 100);
      });
      inputs[1].click();
    });
  });

  describe('Radiobuttons', () => {

    const radioParams = Object.assign({}, params, {
      inputType: 'radio'
    });

    const simpleRadiobuttonMultiChoice = new SimpleMultipleChoice(radioParams);
    simpleRadiobuttonMultiChoice.attach($body);

    const alternatives = document.querySelectorAll('.h5p-simple-multiple-choice-alternatives');
    const inputs = alternatives[2].querySelectorAll('input');

    it('should check when checked', (done) => {
      simpleRadiobuttonMultiChoice.on('changed', (state) => {
        simpleRadiobuttonMultiChoice.off('changed');

        //Wait for DOM
        setTimeout(() => {
          expect(state.data[0].checked).toBeTruthy();
          done();
        }, 100);
      });
      inputs[0].click();
    });

    it('should not uncheck when checked again', () => {
      inputs[0].click();
      // Will not fire 'changed' event.
      expect(inputs[0].checked).toBeTruthy();
    });

    it('should uncheck old and check new when checking a new checkbox', (done) => {
      simpleRadiobuttonMultiChoice.on('changed', (state) => {
        simpleRadiobuttonMultiChoice.off('changed');

        //Wait for DOM
        setTimeout(() => {
          expect(state.data[0].checked).toBeFalsy();
          expect(state.data[1].checked).toBeTruthy();
          expect(state.data[2].checked).toBeFalsy();
          done();
        }, 100);
      });
      inputs[1].click();
    })
  });

  describe('Multiple instances', () => {
    const alternatives = document.querySelectorAll('.h5p-simple-multiple-choice-alternatives');
    const checkboxInputs = alternatives[1].querySelectorAll('input');
    const radioInputs = alternatives[2].querySelectorAll('input');

    it('should have different names', () => {
      expect(checkboxInputs[0].name).toBeDefined();
      expect(radioInputs[0].name).toBeDefined();
      expect(checkboxInputs[0].name).not.toBe(radioInputs[0].name);
    });

    it('same instance inputs should have same name', () => {
      expect(checkboxInputs[0].name).toBe(checkboxInputs[1].name);
      expect(radioInputs[0].name).toBe(radioInputs[1].name);
    })
  })
});
