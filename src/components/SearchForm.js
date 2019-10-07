import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { Checkbox } from 'semantic-ui-react';
import SearchBox from './SearchBox';
import {continents, countries } from '../countriesAndContinents.js';
import './SearchForm.css';



class SearchForm extends React.Component {

  //continentSuggestions and countrySuggestions are the dropdown contents for continent n country respectively

  state = { 
      continent: '',  // state of the continent input box as continent is a single select maintained as string
      country:[],     // state of the countries input box as array because multiselection has to happen
      continentSuggestions:[],//post typeahead event,this part of state will consists of matching continents
      countrySuggestions:[] //post typeahead event, this part ofstate will consists the matching countries
    };
    
  
  componentDidMount(){
    //data loading part i.e. json or via async call is handled here
    this.continentList = continents;
    this.countryList = countries;
    this.tempCountryArray=[]; 
  }

  onFormSubmit = event => {
    event.preventDefault();

    this.props.onSubmit(this.state);
  };
 
  // continent selection
  selectedContinentSuggestion = (continent) =>{
      console.log(continent);
      this.setState({country:[],continent,continentSuggestions:[]});
      //using an empty array to manage the state of the continent
      this.tempCountryArray = [];
  }

  // on change of checkbox in countries dropdown ,send that label on selection /deselection add /remove from the array
  onCheckboxChange = (event,data) => {
    
   
    data.checked === true?this.onCheckboxSelect(data.label):this.onCheckboxDeselect(data.label);
    this.countryList.forEach(c =>{
        if(c.name === data.label){
          c.defaultChecked = data.checked;
        }
    });
  }

  //next 2 functions is updating country state on select deselect
  onCheckboxSelect =(label) =>{
    this.tempCountryArray = [...this.tempCountryArray,label];
    this.setState({country:this.tempCountryArray,countrySuggestions:[]});
   
  }

  onCheckboxDeselect =(label) =>{
    this.tempCountryArray = [...this.tempCountryArray].filter(country => country !== label );
    this.setState({country:this.tempCountryArray,countrySuggestions:[]});
}




  setContinent =(event) =>{
    let suggestions = [];  
   
    // (typeahead functionality) regex will create an expression for the input event value and then
    // test it with each continent.If its true create an li for it and put in suggestions
    const regex = new RegExp(`^${event.target.value}`,'i');
     
    suggestions = this.continentList.map((continent,index) => {
           
        return (regex.test(continent)?(<li onClick={()=>this.selectedContinentSuggestion(continent)} key={index}>{continent}</li>):null);
        
    });
    //suggestions has been set. continent state has been set.setting country and countrySuggestions as null array to reset it
    this.setState({continentSuggestions:suggestions, [event.target.name]:event.target.value,country:[],countrySuggestions:[]});
  }

  setCountry =(event) =>{
  
        let suggestions = [];
        const regex = new RegExp(`^${event.target.value}`,'i');
        //take out countries as per the continent
        const countryListPerContinent = this.state.continent?this.countryList.filter((country) => {
            return country.value === this.state.continent
        }):[];
        //now out of these countries belonging to a continent, 
        // only show those in dropdown whose regex matches with input typing
        //loop through the countries and check for regex matching and insert those li's into array
        suggestions = countryListPerContinent.map((country,index) => {
           
            return (regex.test(country.name)?(<li key={index} ><Checkbox onChange={this.onCheckboxChange}  checked={country.defaultChecked} label={country.name} /></li>):null);
            
        });
        console.log(suggestions);
        this.setState({countrySuggestions:suggestions,[event.target.name]:event.target.value});

    
  }



  onContinentCountryChange = event => {
     //Now here,input event trigger in SearchBox is from continent entity i/p or country entity i/p
     //& checking if input event target value is not empty
     //once condition is fulfilled, send associated country/continent event to set states 
     event.target.name === 'continent'&& event.target.value.length>-1?this.setContinent(event):this.setCountry(event);
        
  }


  
  render() {
      
  //if the state of the country is existent/updated,render/rerender happens and card for countries is created
  //if  country typed is meaningful(example india- and not i),then only am settting state of 
  //meaningful country into array.example - this.state.country = ['India','Japan']
    const selectedCountries = (this.state.country.length>0 && Array.isArray(this.state.country))?
        this.state.country.map((c,index) => {
         
          console.log(c);
          return (<Card key={index} >
                      <Card.Content>
                          <Image size='large' src={require(`../images/${c}.png`)} />
                      </Card.Content>
                  </Card>
                 );
    }):[];
   
    
   
    return (
      <div className="ui segment">
        <form className="ui form">
          <div className="field suggestions">
            <label> Continent </label>
            <SearchBox  forChange={this.onContinentCountryChange} entity="continent" entityState={this.state.continent}>
               <ul>
                 {this.state.continentSuggestions}
               </ul>
            </SearchBox>
           
          </div>
          <div className="field suggestions">
            <label> Country </label>
            <SearchBox forChange={this.onContinentCountryChange} entity="country" entityState={this.state.country}>
               <ul>
                 {this.state.countrySuggestions}
               </ul>
            </SearchBox>
           
          </div>
          <Card.Group>
            { selectedCountries }
          </Card.Group>   
        </form>
        
      </div>
    );
  }
}

export default SearchForm;
