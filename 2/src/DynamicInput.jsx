import React, { useState } from "react";

function DynamicInput() {
  const [inputList, setInputList] = useState([{ Data: "" }]);
  console.log("Lenght of the State is "+inputList.length);
  console.log(inputList);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, { Data: "" }]);
  };

  const up = (index) => {
    const list = [...inputList];
    if (index === 1) {
    } else {
      var temp = list[index - 1].Data;
      list[index - 1].Data = list[index].Data;
      list[index].Data = temp;
      setInputList(list);
    }
  };

  const down = (index) => {
    const list = [...inputList];
    if (index + 1 === list.length) {
    } else {
      var temp = list[index + 1].Data;
      list[index + 1].Data = list[index].Data;
      list[index].Data = temp;
      setInputList(list);
    }
  };

  return (
    <div className="App">
      <button class="add-row" onClick={handleAddClick}>
        +
      </button>
      {inputList.map((x, i) => {
        return (
          <>
            {i !== 0 && (
              <div className="box">
                <input
                  class="row-input"
                  name="Data"
                  placeholder=""
                  value={x.Data}
                  onChange={(e) => handleInputChange(e, i)}
                />
                <div className="btn-box">
                  <button class="row-delete" onClick={() => handleRemoveClick(i)}>
                    X
                  </button>
                  <button class="row-up" onClick={() => up(i)}>
                    ↑
                  </button>
                  <button class="row-down" onClick={() => down(i)}>
                    ↓
                  </button>
                </div>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}

export default DynamicInput;
