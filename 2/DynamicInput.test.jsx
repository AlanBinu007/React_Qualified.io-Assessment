import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import sinon from "sinon";
import DynamicInput from "../src/DynamicInput";
import { getFocusedElemInputVal } from "../utilities/test-utilities";

let di;
let addRowBtn;

const makeTestTable = items => {
  for (let i = 0; i < items.length; i++) {
    addRowBtn.simulate("click");
  }
  
  items.forEach((e, i) => {
    const input = di.find(".row-input").at(i);
    input.simulate("change", { target: { value: e } });
  });
};

describe("DynamicInput", () => {
  beforeEach(() => {
    di = mount(<DynamicInput />);
    addRowBtn = di.find(".add-row");
  });
  afterEach(() => {
    di.unmount();
    di = null;
    addRowBtn = null;
  });
  
  test('should have an "add-row" button', () => {
    expect(addRowBtn.exists()).toBe(true);
    expect(addRowBtn).toHaveLength(1);
  });
  
  test('should have no rows before "add-row" is clicked', () => {
    [
      ".row-input", 
      ".row-delete", 
      ".row-up", 
      ".row-down"
    ].forEach(e => expect(di.find(e).exists()).toBe(false));
  });
  
  test('should add a row on pushing the "add-row" button', () => {
    addRowBtn.simulate("click");
    [
      ".row-input", 
      ".row-delete", 
      ".row-up", 
      ".row-down"
    ].forEach(e => expect(di.find(e)).toHaveLength(1));
  });
  
  test('should change focus to the new row on clicking the "add-row" button', () => {
    addRowBtn.simulate("click");
    di.setProps(); // forces a re-render
    expect(getFocusedElemInputVal()).toEqual(""); 
  });
  
  test('should be able to add multiple rows', () => {
    for (let i = 1; i < 5; i++) {
      addRowBtn.simulate("click");
      [
        ".row-input", 
        ".row-delete", 
        ".row-up", 
        ".row-down"
      ].forEach(e => expect(di.find(e)).toHaveLength(i));
    }
  });
  
  test('should be able to add text to the input fields', () => {
    const items = [
      "apples",
      "pears",
      "watermelon",
      "cantaloupe"
    ];
    makeTestTable(items);
    
    items.forEach((e, i) => {
      const input = di.find(".row-input").at(i);
      expect(input.instance().value).toEqual(e);
    });
  });
  
  test('should be able to change the text of an input field', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    const input = di.find(".row-input").at(3);
    input.simulate("change", { target: { value: "bananas" } });
    expect(input.instance().value).toEqual("bananas");
  });
  
  test('should be able to move a row up', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.find(".row-up").at(3).simulate("click");
    
    [
      "apples",
      "pears",
      "cantaloupe",
      "watermelon",
    ].forEach((e, i) => {
      expect(di.find(".row-input").at(i).instance().value).toEqual(e);
    });
  });
  
  test('should focus the correct input element after moving a row up', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.find(".row-up").at(3).simulate("click");
    di.setProps();
    expect(getFocusedElemInputVal()).toEqual("cantaloupe"); 
  });
  
  test('should be able to move a row down', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.find(".row-down").at(0).simulate("click");
    [
      "pears",
      "apples",
      "watermelon",
      "cantaloupe",
    ].forEach((e, i) => {
      expect(di.find(".row-input").at(i).instance().value).toEqual(e);
    });
  });
  
  test('should focus the correct input element after moving a row down', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.find(".row-down").at(0).simulate("click");
    di.setProps();
    expect(getFocusedElemInputVal()).toEqual("apples"); 
  });
  
  test('should work when an input field is moved down but is already at the bottom', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.find(".row-down").at(3).simulate("click");
    [
      "apples",
      "pears",
      "watermelon",
      "cantaloupe",
    ].forEach((e, i) => {
      expect(di.find(".row-input").at(i).instance().value).toEqual(e);
    });
  });
  
  test('should focus the last input element after moving a row down that is already at the bottom', () => {
    makeTestTable(["apples", "pears", "watermelon", "cantaloupe"]);
    di.find(".row-down").at(3).simulate("click");
    di.setProps();
    expect(getFocusedElemInputVal()).toEqual("cantaloupe"); 
  });
  
  test('should work when an input field is moved up but is already at the top', () => {
    makeTestTable(["apples", "pears"]);
    di.find(".row-up").at(0).simulate("click");
    [
      "apples",
      "pears",
    ].forEach((e, i) => {
      expect(di.find(".row-input").at(i).instance().value).toEqual(e);
    });
  });
  
  test('should focus the 0-th input element after moving a row up which is already at the top', () => {
    makeTestTable(["apples", "pears"]);
    di.find(".row-up").at(0).simulate("click");
    di.setProps();
    expect(getFocusedElemInputVal()).toEqual("apples"); 
  });
  
  test('should work when the bottom row is deleted', () => {
    makeTestTable(["apples", "pears"]);
    di.find(".row-delete").at(1).simulate("click");
    expect(di.find(".row-input")).toHaveLength(1);
    expect(di.find(".row-input").at(0).instance().value).toEqual("apples");
  });
  
  test('should focus the last input element after deleting the bottom row', () => {
    makeTestTable(["apples", "pears", "bananas", "grapefruit"]);
    di.find(".row-delete").at(3).simulate("click");
    di.setProps();
    expect(getFocusedElemInputVal()).toEqual("bananas"); 
  });
  
  test('should work when a middle row is deleted', () => {
    makeTestTable(["pears", "apples", "bananas"]);
    di.find(".row-delete").at(1).simulate("click");
    expect(di.find(".row-input").at(0).instance().value).toEqual("pears");
    expect(di.find(".row-input").at(1).instance().value).toEqual("bananas");
  });
  
  test('should focus the correct input element after deleting a middle row', () => {
    makeTestTable(["pears", "apples", "bananas"]);
    di.find(".row-delete").at(1).simulate("click");
    di.setProps();
    expect(getFocusedElemInputVal()).toEqual("bananas"); 
  });
  
  test('should work when the remaining rows are deleted', () => {
    makeTestTable(["pears", "apples"]);
    di.find(".row-delete").at(0).simulate("click");
    expect(di.find(".row-input").at(0).instance().value).toEqual("apples");
    di.find(".row-delete").at(0).simulate("click");
    expect(di.find(".row-input").length).toBe(0);
    expect(di.find(".row-delete").length).toBe(0);
    expect(di.find(".row-up").length).toBe(0);
    expect(di.find(".row-down").length).toBe(0);
  });
  
  test('should not focus anything after all rows are deleted', () => {
    makeTestTable(["pears", "apples"]);
    di.find(".row-delete").at(0).simulate("click");
    expect(di.find(".row-input").at(0).instance().value).toEqual("apples");
    di.find(".row-delete").at(0).simulate("click");
    expect(di.find(".row-input").length).toBe(0);
    expect(di.find(".row-delete").length).toBe(0);
    expect(di.find(".row-up").length).toBe(0);
    expect(di.find(".row-down").length).toBe(0);
    di.setProps();
    expect(getFocusedElemInputVal()).toBe(undefined); 
  });
  
  test('should work when a row is re-added, modified and deleted after clearing the list', () => {
    expect(di.find(".row-input").length).toBe(0);
    addRowBtn.simulate("click");
    expect(di.find(".row-input").length).toBe(1);
    expect(di.find(".row-delete").length).toBe(1);
    expect(di.find(".row-up").length).toBe(1);
    expect(di.find(".row-down").length).toBe(1);
    const input = di.find(".row-input").at(0);
    input.simulate("change", { target: { value: "cucumber" } });
    expect(input.instance().value).toEqual("cucumber");
    di.find(".row-up").at(0).simulate("click");
    di.find(".row-down").at(0).simulate("click");
    expect(input.instance().value).toEqual("cucumber");
    di.setProps();
    expect(getFocusedElemInputVal()).toEqual("cucumber"); 
    di.find(".row-delete").at(0).simulate("click");
    expect(di.find(".row-input").length).toBe(0);
  });
});
