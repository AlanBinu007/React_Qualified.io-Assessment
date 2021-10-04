import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import sinon from "sinon";
import { readFileSync } from "fs";
import BookSearch from "../src/BookSearch";

describe("BookSearch", () => {
  const books = JSON.parse(readFileSync("./sample_data/books.json"));
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(<BookSearch books={
      JSON.parse(JSON.stringify(books))
    } />);
  });
  afterEach(() => wrapper.unmount());
  
  describe("the correct elements were rendered", () => {
    it("should have 5 input elements for required search fields", () =>
      [
        ".author",
        ".title",
        ".language",
        ".country",
        ".year",
      ].forEach(e => expect(wrapper.exists(e)).toBe(true))
    );
    
    it("should initially show all books", () => {
      expect(wrapper.exists(".book")).toBe(true);
      expect(wrapper.find(".book")).toHaveLength(books.length);
    });
    
    it("should render data for each field in a book", () => {
      const html = wrapper.find(".book").at(0).html();
      [
        "Chinua Achebe",
        "Nigeria",
        "English",
        "209",
        "Things Fall Apart",
        "1958"
      ].forEach(e => expect(html.includes(e)).toBe(true));
    });
  });
  
  describe("searching by each field alone", () => {
    describe("modifying the author field", () => {
      let input;
      
      beforeEach(() => {
        input = wrapper.find(".author");
        input.simulate("change", { target: { value: "woolf" } });
      });
      
      it("should respond to change events", () => {
        expect(input.instance().value).toEqual("woolf");
      });
      
      it("should filter books on the author query", () => {
        expect(wrapper.find(".book")).toHaveLength(2);
        expect(wrapper.find(".book")
                      .at(0).html().includes("Dalloway")).toBe(true);
        expect(wrapper.find(".book")
                      .at(1).html().includes("Lighthouse")).toBe(true);
      });
    });
    
    describe("modifying the title field", () => {
      let input;
      
      beforeEach(() => {
        input = wrapper.find(".title");
        input.simulate("change", { target: { value: "dea" } });
      });
      
      it("should respond to change events", () => {
        expect(input.instance().value).toEqual("dea");
      });
      
      it("should filter books on the author query", () => {
        expect(wrapper.find(".book")).toHaveLength(3);
        expect(wrapper.find(".book")
                      .at(0).html().includes("Euripides")).toBe(true);
        expect(wrapper.find(".book")
                      .at(1).html().includes("Nikolai Gogol")).toBe(true);
        expect(wrapper.find(".book")
                      .at(2).html().includes("The Death of Ivan Ilyich")).toBe(true);
      });
    });
    
    describe("modifying the country field", () => {
      let input;
      
      beforeEach(() => {
        input = wrapper.find(".country");
        input.simulate("change", { target: { value: "ITALY" } });
      });
      
      it("should respond to change events", () => {
        expect(input.instance().value).toEqual("ITALY");
      });
      
      it("should filter books on the country query", () => {
        expect(wrapper.find(".book")).toHaveLength(5);
        [
          "Dante Alighieri",
          "Giovanni Boccaccio",
          "Giacomo Leopardi",
          "Elsa Morante",
          "Italo Svevo"
        ].forEach((e, i) => 
          expect(wrapper.find(".book")
                        .at(i).html().includes(e)).toBe(true)
        );
      });
    });
    
    describe("modifying the language field", () => {
      let input;
      
      beforeEach(() => {
        input = wrapper.find(".language");
        input.simulate("change", { target: { value: "SPanish" } });
      });
      
      it("should respond to change events", () => {
        expect(input.instance().value).toEqual("SPanish");
      });
      
      it("should filter books on the language query", () => {
        expect(wrapper.find(".book")).toHaveLength(6);
        [
          "Jorge Luis Borges",
          "Miguel de Cervantes",
          "Gypsy Ballads",
          "One Hundred Years of Solitude",
          "Love in the Time of Cholera",
          "Juan Rulfo"
        ].forEach((e, i) => 
          expect(wrapper.find(".book")
                        .at(i).html().includes(e)).toBe(true)
        );
      });
    });
    
    describe("modifying the year field", () => {
      let input;
      
      beforeEach(() => {
        input = wrapper.find(".year");
        input.simulate("change", { target: { value: "196" } });
      });
      
      it("should respond to change events", () => {
        expect(input.instance().value).toEqual("196");
      });
      
      it("should filter books on the language query", () => {
        expect(wrapper.find(".book")).toHaveLength(4);
        [
          "Ficciones",
          "One Hundred Years of Solitude",
          "The Golden Notebook",
          "Season of Migration to the North",
        ].forEach((e, i) => 
          expect(wrapper.find(".book")
                        .at(i).html().includes(e)).toBe(true)
        );
      });
    });
  });
  
  describe("filtering on multiple terms", () => {
    describe("filtering on 192_ and english", () => {
      beforeEach(() => {
        wrapper.find(".year").simulate(
          "change", { target: { value: "192" } }
        );
        wrapper.find(".language").simulate(
          "change", { target: { value: "english" } }
        );
      });
      
      it("should filter books on the language and year query", () => {
        expect(wrapper.find(".book")).toHaveLength(4);
        [
          "Sound and the Fury",
          "Ulysses",
          "Mrs Dalloway",
          "To the Lighthouse",
        ].forEach((e, i) => 
          expect(wrapper.find(".book")
                        .at(i).html().includes(e)).toBe(true)
        );
      });
    });
    
    describe("filtering on all fields with trim", () => {
      beforeEach(() => {
        wrapper.find(".author").simulate(
          "change", { target: { value: " all " } }
        );
        wrapper.find(".title").simulate(
          "change", { target: { value: " t  " } }
        );
        wrapper.find(".country").simulate(
          "change", { target: { value: "ni" } }
        );
        wrapper.find(".language").simulate(
          "change", { target: { value: "english" } }
        );
        wrapper.find(".year").simulate(
          "change", { target: { value: "195" } }
        );
      });
      
      it("should filter books on all fields", () => {
        expect(wrapper.find(".book")).toHaveLength(1);
        [
          "Edgar Allan Poe",
          "United States",
          "English",
          "842",
          "Tales",
          "1950"
        ].forEach(e =>
          expect(wrapper.find(".book")
                        .at(0).html().includes("")).toBe(true)
        );
      });
    });
    
    describe("filtering on terms that have no results", () => {
      beforeEach(() => {
        wrapper.find(".year").simulate(
          "change", { target: { value: "190" } }
        );
        wrapper.find(".language").simulate(
          "change", { target: { value: "spanish" } }
        );
      });
      
      it("should filter books on the language and year query", () => {
        expect(wrapper.find(".book").exists()).toBe(false);
        expect(wrapper.find(".book")).toHaveLength(0);
      });
    });
  });
});