import React from 'react';

class SearchBox extends React.Component {

   inputChange = (event) => {
       console.log(event.target.value);
       this.props.forChange(event);
   }
   
   render(){
      //in the root div of return statement, first part is the input which receives entity props (example:
      //continent or country) and entityState(continent or country state) and
      //second part({this.props.children}) is receiving of children of <SearchBox /> component as props
      //that is the dropdown of countinent/countries

      return (<div>
          <input
              type="text"
              name={this.props.entity}
              value={this.props.entityState}
              onChange={this.inputChange}
           />
           {this.props.children}
      </div>)
      //above in the input onchange, a function(passed as a prop to searchBox) is triggered in the
      //onChange event handler
   }

}    

export default SearchBox;
