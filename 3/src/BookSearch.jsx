import React from "react";

class BookSearch extends React.Component {
  constructor(props) {
    super(props);
    const fields = [
      "author", "title", "country", "language", "year"
    ];
    this.state = {
      fields: fields.reduce((a, e) => {
        a[e] = "";
        return a;
      }, {})
    };
  }
  
  matchesBook(book) {
    const {fields} = this.state;
    return Object.entries(book).some(([k, v]) =>
      !fields[k] || v.toString()
                     .toLowerCase()
                     .includes(fields[k].trim().toLowerCase())
    );
  }
  
  handleChange(evt, name) {
    this.setState(state => ({
      ...state,
      fields: {
        ...state.fields,
        [name]: evt.target.value
      }
    }));
  }

  render() {
    return (
      <div className="book-search-container">
        <div className="search-box">
          {Object.keys(this.state.fields).map(e => 
            <label key={e}>
              {e}
              <input 
                autoComplete="off"
                value={this.state.fields[e]}
                className={e}
                onChange={evt => this.handleChange(evt, e)}
              />
            </label>
          )}
        </div>
        <div className="books">
          {this.props.books
            .filter(e => this.matchesBook(e))
            .map((e, i) => 
              <div key={e.title + i} className="book">
                {Object.entries(e).map(([k, v]) => 
                  <div key={k} className="book-detail-row">
                    <span className="book-detail-key">{k}</span>
                    <span className="book-detail-val">{v}</span>
                  </div>
                )}
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default BookSearch;
