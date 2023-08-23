import React, { Component, ChangeEvent, MouseEvent} from "react";
import {Draft} from './Draft';

//Represents a generic state state of an app in terms of the screen it is on, 
//the rounds that are left, the id of the draft, the current name of the picker and the name which is the name of the 
//current drafter and all the names of the drafters and the current pick
interface AppState {
  rounds : number,
  id: number,
  currName: string,
  pickingName: string,
  createNames: string,
  currPick: string,
  createScreen: boolean,
  alertMessage: JSX.Element,
  drafts: Draft[],
}

//Represents the app in terms of the screen it is on, 
//the rounds that are left, the id of the draft, the current name of the picker and the name which is the name of the 
//current drafter and all the names of the drafters and the current pick by representing the 
export class App extends Component<{}, AppState> {

  //creates an App object in terms of the screen it is on, 
  //the rounds that are left, the id of the draft, the current name of the picker and the name which is the name of the 
  //current drafter and all the names of the drafters and the current pick
  constructor(props: any) {
    super(props);

    this.state = {
      rounds: 0,
      id:0,
      currName:"",
      pickingName:"",
      createNames: "",
      currPick: "",
      alertMessage: <p></p>,
      createScreen: true,
      drafts: [],
    };
  }
  
  //fetches the current list of drafts
  componentDidMount = () => {
    this.fetchDrafts();
  };


  //sets the state of the app and returns a JSX element representing 
  //the displayed values
  render = (): JSX.Element => {
    if(this.state.createScreen === true){
      return (
        <div>
          <div>
          <p>Drafter: </p>
            <input type="text" value={this.state.pickingName} onChange={this.setDrafterName}></input>
            <p>(required for other options)</p>
            <h2>Join Existing Draft</h2>
            <p>Draft ID: </p>
            <input type="number" onChange={this.setId}></input>
            <button onClick={this.handleJoin}>Join</button>
            <h2>Create New Draft</h2>
            <span>Rounds</span>
            <input 
              type="number"
              value = {this.state.rounds}
              onChange={this.setRounds}></input>
              <p></p>
          </div>
          <div>
            <div>
                <label>Options, one per line</label>
                <textarea onChange={this.handleContentInput}></textarea>
                <p></p>
            </div>
            <div>
                <label>Drafters, one per line in order</label>
                <textarea onChange={this.handleNameInput}></textarea>
                <p></p>
            </div>
          </div>
          <div>
            <button onClick = {this.create}>Create</button>
          </div>
          <p></p>
          <button onClick={this.fetchDrafts}>Refresh</button>
          {this.state.alertMessage}
      </div> );
      }else{      
      const remainingJSX: JSX.Element[] = [];

      //let j be be the index of the pick in the contents of the current draft. 0 <=j<=m-1 where m is the 
      //length of the contents of the current draft
      for(let remainingPick of this.state.drafts[this.state.id].contents){
        remainingJSX.push(
          <option value={remainingPick}>{remainingPick}</option>
        );
      }
      let pickScreen : JSX.Element= <div></div>;
      if(this.state.drafts[this.state.id].names[this.state.drafts[this.state.id].current] === this.state.pickingName){
      pickScreen =(<div>

      <select onChange={this.handleSelect}><option>Select an option</option>{remainingJSX}</select>
                  <button onClick={this.handleDraft}>Draft</button>
                  <p></p>
                  <button onClick={this.fetchDrafts}>Refresh</button>
      </div>);
      } else{
        pickScreen = (
        <div> 
          <p>Waiting for {this.state.drafts[this.state.id].names[this.state.drafts[this.state.id].current]} to pick</p>

          <button onClick={this.fetchDrafts}>Refresh</button>
        </div>);
      }

      if(this.state.drafts[this.state.id].soFar.length === 0){
        return (
          <div>
              <h3>
                Status of Draft "{this.state.id}"
                  <p>No picks made yet</p>
                  <p>It's your pick!</p>
                  {pickScreen}
                  {/* <button onClick={this.handleRefresh}>Refresh</button> */}
                </h3>
            </div>
        );
      }else{
        const namesJSX: JSX.Element[] = [];
        const num: JSX.Element[] = [];
        const picksJSX: JSX.Element[] = [];
        const displayTable : JSX.Element = (
      <div>
        <h3>
          Status of Draft "{this.state.id}"
          <div style={({display: 'table', width: '20%'})}>
            <div style={{ display: 'table-row', fontWeight: 'bold'}}>
              <div style={{ display: 'table-cell', padding: '3px', border: '0.5px solid black'}}>Num</div>
              <div style={{ display: 'table-cell', padding: '3px', border: '0.5px solid black'}}>Pick</div>
              <div style={{ display: 'table-cell', padding: '3px', border: '0.5px solid black'}}>Drafter</div>
            </div>
            <div style={{ display: 'table-row'}}>
              <ul style= {{ display: 'table-cell', padding: '3px', border:'0.5px solid black'}}>{num}</ul>
              <ul style= {{ display: 'table-cell', padding: '3px', border:'0.5px solid black'}}>{picksJSX}</ul>
              <ul style= {{ display: 'table-cell', padding: '3px', border:'0.5px solid black'}}>{namesJSX}</ul>
            </div>
          </div>
          </h3>
          </div>);

        let i = 0;

        //let j be be the index of file in this.state.files. 0 <=j<=m-1 where m is the 
        //length of the contents of the current draft
        for(let pair of this.state.drafts[this.state.id].soFar){
          const name : string = pair[0];
          const pick : string = pair[1];
          num.push(
            <ul key={i}>
              <li style={{ display: 'table-cell', padding: '3px'}}>{i}</li>
            </ul>
          );
          namesJSX.push(
            <ul key={i}>
              <li style={{ display: 'table-cell', padding: '3px'}}>{name}</li>
            </ul>
          );
          picksJSX.push(
            <ul key={i}>
              <li style={{ display: 'table-cell', padding: '3px'}}>{pick}</li>
            </ul>
          );
          i=i+1;
        } 
        if(this.state.drafts[this.state.id].rounds === 0){
          return(
            <div>
            <div>{displayTable}</div>
            <div>
              <h3>
              <p>You have completed your draft!</p>
              </h3>
            </div>
            </div>   
          )
        }
        return(
          <div>
            <div>{displayTable}</div>
            <div>
              <h3>
              {pickScreen}
              </h3>
            </div>
            </div>          
        );
      }
    }
  };

  //fetches the list of drafts
  fetchDrafts=(): void=>{
    const url = "/api/getDrafts";
    fetch(url, {method: 'POST'})
    .then((val) => {
      if(val.status === 200){
        return val.json();
      }else{
        this.handleServerError(val, "fetchDraft");
        return;
      }
      }).then(this.handleFetchDraftResponse)
        .catch((res) => this.handleServerError(res, "fetchDraft"));
  }

  /**
   * sets the state of the list of drafts
   * @param val any expects a list of drafts
   * @requires val.drafts any to be of type array
   */
  handleFetchDraftResponse=(val: any):void=>{
    if(Array.isArray(val.drafts)) {
    this.setState({
        drafts: val.drafts,
      });
    }else{
      this.handleServerError(val, "fetchDraft")
    }
  }

  /**
   * sets the state of the picked value 
   * @param evt: ChangeEvent<HTMLSelectElement> is expected to be the picked 
   * value that will be set to the state
   */
  handleSelect=(evt: ChangeEvent<HTMLSelectElement>):void=>{
    this.setState({
      currPick: evt.target.value,
    });
  }

  /**
   * Saves the current pick to the name of the picker and updates who is picking next
   * @param _: MouseEvent<HTMLButtonElement> takes in a click action 
   */
  handleDraft=(_: MouseEvent<HTMLButtonElement>):void=>{
    const url = "/api/save";
    fetch(url, {method: 'POST', body: JSON.stringify({pick: this.state.currPick, draft: this.state.drafts[this.state.id], id:this.state.id}), headers: { "Content-Type": "application/json" }})
    .then((val) => {
      if(val.status === 200){
        return val.json();
      }else{
        this.handleServerError(val, "draft");
        return;
      }
      }).then(this.handleDraftResponse)
        .catch((res) => this.handleServerError(res, "draft"));
  }

  /**
   * Saves the current pick to the name of the picker and updates the 
   * name of who is picking next
   * @param _: MouseEvent<HTMLButtonElement> takes in a click action 
   */
  handleDraftResponse=(val: any):void=>{
    const tempDraft= val.draft;
    console.log("rounds: " + val.draft.rounds);
    const tempDrafts = this.state.drafts;
    tempDrafts[this.state.id] = tempDraft;
    console.log("tempDraft "  + tempDraft);

    this.setState({
        currName: val.name,
        drafts: tempDrafts,
    });
    
  }

  /**
   * gets the current list of drafts 
   */
  handleJoin=():void=>{
    if(this.state.id > this.state.drafts.length-1 || this.state.id < 0){
      this.setState({
        alertMessage: <p>Not a valid ID</p>,
      });
    }

    let found: boolean=false;

    //let j be be the index of the name in the current list of names. 0 <=j<=m-1 where m is the 
    //length of the list of names
    for(let name of this.state.drafts[this.state.id].names){
      if(this.state.pickingName === name){
        found = true;
      }
    }
    if(found === false){
      this.setState({
        alertMessage: <p>The drafter name is not contained in the given drafter names for this id</p>,
      });
      return;
    }

    const url = "/api/getDrafts";
    fetch(url, {method: 'POST'})
    .then((val) => {
      if(val.status === 200){
        return val.json();
      }else{
        this.handleServerError(val, "fetchDraft");
        return;
      }
      }).then(this.handleJoinResponse)
        .catch((res) => this.handleServerError(res, "fetchDraft"));
    }
  
  /**
   * gets the current list of drafts 
   * @error is thrown in the console if the drafts and name passed in val 
   * are not of type object and string
   */
  handleJoinResponse=(val: any):void =>{
    const drafts = val.drafts;
    this.setState({
      createScreen: false,
      alertMessage: <p></p>,
      drafts: drafts,
    });
  }

  /**
   * Creates a draft to add to current list of drafts 
   * @param _: MouseEvent<HTMLButtonElement> takes in a button click
   */
  create = (_: MouseEvent<HTMLButtonElement>): void =>{
    
    let tempNames = this.state.createNames.split("\n");
    let tempContents = this.state.currPick.split("\n");

    if(this.state.rounds*tempNames.length > tempContents.length){
      this.setState({
        alertMessage: <p>The number of rounds does not match the number of names and the number of options</p>,
      });
      return;
    } 
    let i :number= 0;
    let found: boolean=false;
    let blank: boolean=false;

    //let j be be the index of the name in tempNames. 0 <=j<=m-1 where m is the 
    //length of tempNames
    for(let name of tempNames){
      if(this.state.pickingName === name){
        found = true;
      }
      if(name === "" || name === " "){
        blank = true;
      }

      //0 <=i<=m-1 where m is the 
      //length of tempNames
      while(i !== tempNames.length){
        if(name === tempNames[i] && tempNames.indexOf(name) !== i){
          this.setState({
            alertMessage: <p>Cannot have duplicate names</p>,
          });
          return;
        }
        i =i+1;
      }
    }
    if(found === false){
      this.setState({
        alertMessage: <p>The drafter name is not contained in the given drafter names</p>,
      });
      return;
    }
    if(blank === true){
      this.setState({
        alertMessage: <p>The drafter name cannot be an empty string</p>,
      });
      return;
    }

    const newDraft : Draft= {
      names :tempNames,
      contents :tempContents,
      current : tempNames.indexOf(this.state.pickingName),
      rounds:this.state.rounds,
      soFar: [],
    }

    const url = "/api/create";
    
    fetch(url, {method: 'POST', body: JSON.stringify({draft: newDraft}), headers: { "Content-Type": "application/json" }})
    .then((val) => {
      if(val.status === 200){
        return val.json();
      }else{
        this.handleServerError(val, "create");
        return;
      }
  }).then(this.handleCreateResponse)
    .catch((res) => this.handleServerError(res, "create"));
  }

  /**
   * Creates a draft to add to current list of drafts 
   * @param res any is expected to contain a list of drafts and an id 
   */
  handleCreateResponse = (res: any) => {
      let drafts: Draft[] = res.drafts;
      this.setState({
        drafts: drafts,
        id: res.id,
        createScreen:false,
        alertMessage: <p></p>,
        currName: this.state.pickingName,
      });    
  };
  
  /**sets the inputted name as the current name. takes an event of type 
   * ChangeEvent<HTMLInputElement> which is expected to be of type string*/
  setDrafterName = (evt: ChangeEvent<HTMLInputElement>): void =>{
    this.setState({pickingName: evt.target.value});
  }
  
  /**sets the inputted id as the current id. takes an event of type 
   * ChangeEvent<HTMLInputElement> which is expected to be of type string*/
  setId = (evt: ChangeEvent<HTMLInputElement>): void =>{
    this.setState({id: evt.target.valueAsNumber});
  }

    /**sets the inputted rounds as the current rounds. takes an event of type 
   * ChangeEvent<HTMLInputElement> which is expected to be of type string*/
  setRounds = (evt: ChangeEvent<HTMLInputElement>): void =>{
    this.setState({rounds: evt.target.valueAsNumber});
  }

  /**sets the inputted name as the current string of names. takes an event of type 
   * ChangeEvent<HTMLTextAreaElement> which is expected to be of type string*/
  handleNameInput = (evt: ChangeEvent<HTMLTextAreaElement>): void =>{
    this.setState({createNames: evt.target.value});
  }

  /**sets the inputted content as the current pick. takes an event of type 
   * ChangeEvent<HTMLTextAreaElement> which is expected to be of type string*/
  handleContentInput = (evt: ChangeEvent<HTMLTextAreaElement>): void =>{
    this.setState({currPick: evt.target.value});
  }

  //throws a console error with the message "unknown error talking to server"
  handleServerError = (_: Response, str : string) => {
    console.log(str);

    console.error('unknown error talking to server');
  };

}
