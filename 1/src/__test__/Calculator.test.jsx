import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import Calculator from "../../src/Calculator"

const buttonNames = [
  "op-add", "op-mul", "op-div", "op-sub",  "clear", "eq",
  ...Array(10).fill().map((e, i) => `digit-${i}`),
];
const getButtons = calc => 
  buttonNames.reduce((accumulator, btn) => {
    accumulator[btn] = calc.find("." + btn);
    return accumulator;
  }, {})
;
let calc;
let buttons;
let output;

describe('Calculator', () => {
  beforeEach(() => {
    calc = mount(<Calculator />);
    buttons = getButtons(calc);
    output = calc.find(".output");
  });
  afterEach(() => {
    calc.unmount();
  });
  
  describe('Output element', () => {
    it('should render an element with class name "output"', () => {
      expect(calc.find('.output').exists()).toBe(true);
    });
    
    it('should have an empty output display initially', () => {
      expect(calc.find(".output").text()).toBe("");
    });
  });
  
  describe('Buttons should be rendered and be clickable', () => {
    describe('Operator buttons', () => {
      for (const op of ["add", "sub", "mul", "div"]) {
        test(`should render operator button "op-${op}"`, () => {
          expect(calc.find(`.op-${op}`).exists()).toBe(true);
        });
      }
      
      it('should render equals button with class "eq"', () => {
        expect(calc.find(".eq").exists()).toBe(true);
      });
      
      it('should render clear button with class "clear"', () => {
        expect(calc.find(".clear").exists()).toBe(true);
      });
    });
    
    describe('Digit buttons', () => {
      for (let i = 0; i < 10; i++) {
        test(`button for digit ${i} should exist with class "digit-${i}"`, () => {
          expect(calc.find(`.digit-${i}`).exists()).toBe(true);
        });
        
        test(`should update output when "digit-${i}" button is clicked`, () => {
          calc.find(`.digit-${i}`).simulate("click");
          expect(calc.find(".output").text()).toBe("" + i);
        });
      }
    });
  });
  
  describe('Clearing the display', () => {
    it('should clear the display when the "clear" button is clicked', () => {
      const actions = [
        ["digit-9", "9"],
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
  });
    
  describe('Simple operations', () => {
    it("should work on addition", () => {
      const actions = [
        ["digit-3", "3"], 
        ["op-add", "3+"], 
        ["digit-5", "3+5"], 
        ["eq", "8"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it("should work on subtraction", () => {
      const actions = [
        ["digit-3", "3"], 
        ["op-sub", "3-"], 
        ["digit-5", "3-5"], 
        ["eq", "-2"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it("should work on multiplication", () => {
      const actions = [
        ["digit-3", "3"], 
        ["op-mul", "3*"], 
        ["digit-5", "3*5"], 
        ["eq", "15"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it("should work on integer division", () => {
      const actions = [
        ["digit-3", "3"], 
        ["op-div", "3/"], 
        ["digit-5", "3/5"], 
        ["eq", "0"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it("should work on an expression containing multi-digit numbers", () => {
      const actions = [
        ["digit-6", "6"],
        ["digit-3", "63"], 
        ["op-div", "63/"], 
        ["digit-1", "63/1"], 
        ["digit-5", "63/15"], 
        ["eq", "4"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it("should work on an expression with multiple operators", () => {
      const actions = [
        ["digit-2", "2"],
        ["digit-1", "21"],
        ["digit-3", "213"], 
        ["op-sub", "213-"], 
        ["digit-2", "213-2"],
        ["digit-0", "213-20"],
        ["digit-0", "213-200"], 
        ["op-add", "213-200+"], 
        ["digit-1", "213-200+1"], 
        ["digit-0", "213-200+10"], 
        ["eq", "23"], 
        ["clear", ""],
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
  });
    
  describe('Negative numbers', () => {
    it("should permit a leading negative sign", () => {
      const actions = [
        ["op-sub", "-"],
        ["digit-1", "-1"], 
        ["digit-2", "-12"], 
        ["op-div", "-12/"], 
        ["digit-5", "-12/5"], 
        ["eq", "-3"], 
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it("should permit a negative sign on a digit in the middle of an expression", () => {
      const actions = [
        ["op-sub", "-"],
        ["digit-1", "-1"], 
        ["digit-2", "-12"], 
        ["op-div", "-12/"], 
        ["op-sub", "-12/-"], 
        ["digit-5", "-12/-5"], 
        ["eq", "2"], 
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
  });
    
  describe('Division by zero', () => {
    it("should clear the display on division by zero", () => {
      const actions = [
        ["digit-3", "3"], 
        ["op-div", "3/"], 
        ["digit-0", "3/0"], 
        ["eq", ""], 
        ["digit-3", "3"], 
        ["op-div", "3/"], 
        ["op-sub", "3/-"], 
        ["digit-0", "3/-0"], 
        ["eq", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it("should clear an expression on division by negative zero", () => {
      const actions = [
        ["digit-3", "3"], 
        ["op-div", "3/"], 
        ["op-sub", "3/-"], 
        ["digit-0", "3/-0"], 
        ["eq", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
  });
  
  describe('Handling input requirements', () => {
    it('No button other than "op-sub" and digits should have an effect from a clear state', () => {
      const actions = [
        ["op-div", ""], 
        ["op-add", ""], 
        ["op-mul", ""], 
        ["eq", ""], 
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('Only one leading minus sign is permitted', () => {
      const actions = [
        ["op-sub", "-"], 
        ["op-sub", "-"], 
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('should be possible to use the result of the last equation to build a new one by pushing an operator button', () => {
      const actions = [
        ["digit-9", "9"], 
        ["op-add", "9+"], 
        ["digit-8", "9+8"], 
        ["eq", "17"], 
        ["op-sub", "17-"], 
        ["digit-6", "17-6"], 
        ["eq", "11"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('should be possible to clear the result of the last equation and begin a new one by pushing a digit button', () => {
      const actions = [
        ["digit-9", "9"], 
        ["op-add", "9+"], 
        ["digit-6", "9+6"], 
        ["eq", "15"], 
        ["digit-3", "3"], 
        ["op-mul", "3*"], 
        ["digit-1", "3*1"], 
        ["eq", "3"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('should disallow leading zeroes', () => {
      const actions = [
        ["digit-0", "0"], 
        ["digit-7", "7"], 
        ["digit-0", "70"], 
        ["op-mul", "70*"], 
        ["digit-0", "70*0"],
        ["digit-6", "70*6"],
        ["eq", "420"], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('should allow leading negative signs on zeroes', () => {
      const actions = [
        ["digit-0", "0"], 
        ["digit-7", "7"], 
        ["digit-0", "70"], 
        ["op-mul", "70*"], 
        ["op-sub", "70*-"], 
        ["digit-0", "70*-0"],
        ["digit-6", "70*-6"],
        ["eq", "-420"], 
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('should switch and append operators correctly', () => {
      const actions = [
        ["digit-6", "6"], 
        ["op-div", "6/"], 
        ["op-add", "6+"], 
        ["op-mul", "6*"], 
        ["op-add", "6+"], 
        ["op-sub", "6-"], 
        ["op-div", "6/"], 
        ["op-sub", "6/-"], 
        ["op-sub", "6/-"], 
        ["op-add", "6/-"], 
        ["op-div", "6/-"], 
        ["op-div", "6/-"], 
        ["digit-4", "6/-4"], 
        ["op-mul", "6/-4*"], 
        ["op-sub", "6/-4*-"], 
        ["op-sub", "6/-4*-"], 
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('should handle situations where "eq" has no effect', () => {
      const actions = [
        ["eq", ""],
        ["op-sub", "-"],
        ["eq", "-"],
        ["digit-1", "-1"],
        ["eq", "-1"],
        ["op-mul", "-1*"],
        ["eq", "-1*"],
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
    
    it('should work on a complex sequence of inputs', () => {
      const actions = [
        ["op-sub", "-"],
        ["digit-8", "-8"],
        ["op-sub", "-8-"],
        ["digit-7", "-8-7"],
        ["digit-2", "-8-72"],
        ["digit-1", "-8-721"],
        ["digit-6", "-8-7216"],
        ["op-div", "-8-7216/"],
        ["op-sub", "-8-7216/-"],
        ["digit-3", "-8-7216/-3"],
        ["op-mul", "-8-7216/-3*"],
        ["op-sub", "-8-7216/-3*-"],
        ["digit-2", "-8-7216/-3*-2"],
        ["digit-4", "-8-7216/-3*-24"],
        ["op-mul", "-8-7216/-3*-24*"],
        ["digit-5", "-8-7216/-3*-24*5"],
        ["op-add", "-8-7216/-3*-24*5+"],
        ["digit-9", "-8-7216/-3*-24*5+9"],
        ["digit-9", "-8-7216/-3*-24*5+99"],
        ["digit-0", "-8-7216/-3*-24*5+990"],
        ["digit-0", "-8-7216/-3*-24*5+9900"],
        ["eq", "-278828"],
        ["clear", ""], 
      ];
      
      for (const [op, expected] of actions) {
        buttons[op].simulate("click");
        expect(output.text()).toBe(expected);
      }
    });
  });
  
  it('should work on a bunch of zeroes', () => {
    const actions = [
      ["op-sub", "-"],
      ["op-sub", "-"],
      ["digit-0", "-0"],
      ["digit-0", "-0"],
      ["op-sub", "-0-"],
      ["op-add", "-0+"],
      ["op-sub", "-0-"],
      ["op-sub", "-0-"],
      ["digit-0", "-0-0"],
      ["digit-0", "-0-0"],
      ["op-sub", "-0-0-"],
      ["digit-0", "-0-0-0"],
      ["digit-0", "-0-0-0"],
      ["eq", "0"],
      ["clear", ""], 
    ];
    
    for (const [op, expected] of actions) {
      buttons[op].simulate("click");
      expect(output.text()).toBe(expected);
    }
  });
});