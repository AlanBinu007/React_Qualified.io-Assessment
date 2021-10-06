import React from "react";

export default class Calculator extends React.Component {
  constructor() {
    super();
    this.state = {
      result: "",
    };
  }

  onClick = (button) => {
    if (button === "=") {
      this.calculate();
    } else if (button === "C") {
      this.reset();
    } else if(button === "+" || button === "-" || button === "*" || button === "/") {
      if(this.state.result === ""){
        this.setState({
          result: "",
        });
      }
      var length = this.state.result.length;
      var temp = this.state.result;
      if(this.state.result.charAt(length-1)!=="+" || this.state.result.charAt(length-1)!=="/" || this.state.result.charAt(length-1)!=="*" || this.state.result.charAt(length-1)!=="-"){
        this.setState({
          result: this.state.result + button,
        });
        }
      if(this.state.result.charAt(length-1)==="+" || this.state.result.charAt(length-1)==="/" || this.state.result.charAt(length-1)==="*" || this.state.result.charAt(length-1)==="-"){
      temp = temp.slice(0,-1);
        temp+=button;
        this.setState({
          result:temp,
        })
      }
    } else {
      this.setState({
        result: this.state.result + button,
      });
    }
  };

  calculate = () => {
    try {
        const newResult = eval(this.state.result);
        this.setState({result: newResult});
    } catch (e) {
        this.setState({data: 'error'})
    }
}

  reset = () => {
    this.setState({
      result: "",
    });
  };

  backspace = () => {
    this.setState({
      result: this.state.result.slice(0, -1),
    });
  };

  render() {
    return (
      <div className="calculator">
        <br/>
        <div class="output">
          {this.state.result}
        </div>
        <br/>
        <button name="1" onClick={(e) => this.onClick(e.target.name)} class="digit-1">
          1
        </button>
        <button name="2" onClick={(e) => this.onClick(e.target.name)} class="digit-2">
          2
        </button>
        <button name="3" onClick={(e) => this.onClick(e.target.name)} class="digit-3">
          3
        </button>
        <button name="+" onClick={(e) => this.onClick(e.target.name)} class="op-add">
          +
        </button>
        <br />

        <button name="4" onClick={(e) => this.onClick(e.target.name)} class="digit-4">
          4
        </button>
        <button name="5" onClick={(e) => this.onClick(e.target.name)} class="digit-5">
          5
        </button>
        <button name="6" onClick={(e) => this.onClick(e.target.name)} class="digit-6">
          6
        </button>
        <button name="-" onClick={(e) => this.onClick(e.target.name)} class="op-sub">
          -
        </button>
        <br />

        <button name="7" onClick={(e) => this.onClick(e.target.name)} class="digit-7">
          7
        </button>
        <button name="8" onClick={(e) => this.onClick(e.target.name)} class="digit-8">
          8
        </button>
        <button name="9" onClick={(e) => this.onClick(e.target.name)} class="digit-9">
          9
        </button>
        <button name="*" onClick={(e) => this.onClick(e.target.name)} class="op-mul">
          x
        </button>
        <br />

        <button name="C" onClick={(e) => this.onClick(e.target.name)} class="clear">
          C
        </button>
        <button name="0" onClick={(e) => this.onClick(e.target.name)} class="digit-0">
          0
        </button>
        <button name="=" onClick={(e) => this.onClick(e.target.name)} class="eq">
          =
        </button>
        <button name="/" onClick={(e) => this.onClick(e.target.name)}  class="op-div">
          ÷
        </button>
        <br />
      </div>
    );
  }
}
