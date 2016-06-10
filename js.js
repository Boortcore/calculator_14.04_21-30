class Calculator {
  constructor(calc) {
    this._calc = calc;
    this._previousOperator = null;
    this._operator = null;
    this._argument = null;
    this._result = 0;
    this._clearInput = false;
    this._argumentIsPressedBefore = false;
    this._equalSignIsPressedBefore = false;

    this._render();

    this._display = this._calc.querySelector('#display');

    this._calc.addEventListener('click', this._startCalculate.bind(this));

    this._calc.onmousedown = this._moveCalculator.bind(this._calc);
  }
 

  _render(){

    this._calc.innerHTML = `
      <tr>
        <td colspan="5" >
        <input type="text" id="display" value='0'>
        </td>
      </tr>
      <tr>
        <td>7</td>
        <td>8</td>
        <td>9</td>
        <td>/</td>
        <td>+/-</td>
      </tr>
      <tr>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>*</td>
        <td>C</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>-</td>
        <td rowspan="2">=</td>
      </tr>
      <tr>
        <td colspan="2">0</td>
        <td>.</td>
      <td>+</td>
      </tr>`;
  }

  _startCalculate(e) {
    let button = e.target.textContent;
    let validValuesNumbers = ['1','2','3','4','5','6','7','8','9','0','.'];
    let validValuesOperators = ['+','-','*','/','=', 'C','+/-'];
    if (e.target === this._calc ) return;

    if (~validValuesNumbers.indexOf(button)) {
      this._enterNumber(button);
    }

    if (~validValuesOperators.indexOf(button)) {
      this._enterOperator(button);
    }

  }

  _enterNumber(btn) {

    if (this._equalSignIsPressedBefore) {
      this._clearMemory()
    }

    if (this._clearInput) {
      this._display.value = 0;
      this._clearInput = false;
    }

    if (btn != '.' && this._display.value === '0') {
      this._display.value = '';
    }

    if (btn === '.' && ~this._display.value.indexOf('.')) {
      return;
    }

    this._display.value += btn;
    this._argument = +this._display.value;
    this._argumentIsPressedBefore = true;
  }

  _enterOperator(btn) {

    if (btn === 'C') {
      this._clearMemory();
      return;
    }

    if (btn === '+/-' && this._display.value != 0) {
      this._changeSign();
      return;
    }

    if (btn === '=') {
      this._processEqualSign();
      return;
    }

    this._processOperator(btn)
  }

  _processOperator(btn) {

    this._operator = btn;

    if (!this._argumentIsPressedBefore) {
      this._argument = +this._display.value;
    }

    if (this._argumentIsPressedBefore && this._previousOperator) {
      this._calculate(this._previousOperator);
    }

    this._result = +this._display.value;
    this._previousOperator = this._operator;

    this._argumentIsPressedBefore = false;
    this._clearInput = true;
    this._equalSignIsPressedBefore = false;

  }

  _processEqualSign() {

    this._argumentIsPressedBefore = false;
    this._clearInput = true;
    this._equalSignIsPressedBefore = true;

    if (this._previousOperator) {
      this._calculate(this._previousOperator);
    }
  }

  _calculate(operator) {
    let operators = {
      '+': function () { this._result +=  +this._argument;},
      '-': function () { this._result -=  +this._argument;},
      '/': function () { this._result /=  +this._argument;},
      '*': function () { this._result *=  +this._argument;}
    };
    operators[operator].call(this);
    this._display.value = this._result;
  }

  _clearMemory() {
    this._display.value = 0;
    this._result = 0;
    this._equalSignIsPressedBefore = false;
    this._previousOperator = null;
  }

  _changeSign() {
     this._result = this._display.value = - this._display.value;
  }

  _moveCalculator(e) {

    let self = this;
    let coords = getCoords(this);
    let shiftX = e.pageX - coords.left;
    let shiftY = e.pageY - coords.top;

    this.style.position = 'absolute';
    moveAt.call(this, e);

    function moveAt(e) {
      this.style.left = e.pageX - shiftX + 'px';
      this.style.top = e.pageY - shiftY + 'px';
    }

    document.onmousemove = function(e) {
      moveAt.call(self, e); // здесь используется self
    };

    this.onmouseup = function() {
      document.onmousemove = null;
      this.onmouseup = null;
    };

    this.ondragstart = function() {
      return false;
    };

    function getCoords(elem) {
      let box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };

    }
  }

}