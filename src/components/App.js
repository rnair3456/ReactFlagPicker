import React from 'react';
import SearchForm from './SearchForm';

class App extends React.Component{
    

    onFormSubmit = (formValues) => {
      console.log(formValues);
    }

    render(){
        return (
          <div className="ui container" style={{ marginTop: '10px' }}>
            <SearchForm onSubmit={this.onFormSubmit} />
          </div> 
        )
    }
}

export default App;