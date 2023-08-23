import { Request, Response } from "express";

export type DraftType = {
  names: string[],
  contents: string[],
  current: number,
  soFar: string[][],
  rounds: number,
};

const drafted: DraftType[] = [];

/** saves the new draft to the list of drafts. Expects a draft object to be passed in and 
 * sends back a list of drafts and the id of the draft that was added*/
export function create(req: Request, res: Response) {
  const givenDraft = req.body.draft;
  const drafterNames = givenDraft.names;
  const rounds = givenDraft.rounds*drafterNames.length;
  const drafterContents = givenDraft.contents;
  const currIndex = givenDraft.names.indexOf(drafterNames[givenDraft.current]);

  if(typeof givenDraft !== 'object'){
    res.status(400).send('incorrect type');
    return;
  }
  if(!Array.isArray(drafterContents) || !Array.isArray(drafterNames)){
    res.status(400).send('names or contents are not an array');
    return;
  }
  if(rounds === undefined || drafterNames === undefined || drafterContents === undefined || currIndex === undefined){
    res.status(400).send('undefined parameters');
    return;
  }

  const draft : DraftType = {
    names: drafterNames,
    contents: drafterContents,
    current: currIndex,
    soFar : [],
    rounds: rounds,
  };

  drafted.push(draft);
  res.send({drafts: drafted, id: drafted.length-1});
  
}

/** saves the next drafter to the corresponding draft. Expects a draft 
 * representing the current type, a string representing the current pick, and 
 * the id representing the id of the current draft
 * sends back the current draft and the name of the current name that 
 * should be chossing*/
export function save(req: Request, res: Response) {
  const givenDraft = req.body.draft;
  const pick = req.body.pick;
  const id = req.body.id;

  if(givenDraft !== undefined){
    const currDraft = drafted[id];
    const pair = [givenDraft.names[givenDraft.current], pick]

    const currContents = [];
    if(currDraft !== undefined){
      
      let i : number = 0;
      let length : number = currDraft.contents.length;
      while(i < length){
        if(currDraft.contents[i] !== pick){
          currContents.push(currDraft.contents[i]);
        }
        i = i +1;
      }
      currDraft.contents = currContents;
    }else{
      res.status(400).send('Undefined contents or ID');
      return;
    }
    currDraft.soFar.push(pair);
    if(currDraft.current !== currDraft.names.length-1){
      currDraft.current = currDraft.current +1;
    }else{
      currDraft.current = 0;
    }
    
    currDraft.rounds = currDraft.rounds -1;
    //const draftedTemp = drafted;
    drafted[id] =currDraft;
    return res.send({draft: currDraft, name: currDraft.names[currDraft.current]});

  }else{
    res.status(400).send('Undefined contents or ID');
      return;
  }
} 

/**saves the contents of the given draft to the server and expects a draft type passed in, a string
 * representing the current name and the id that represents the id of the current draft
 * sends back the lists of drafts
 */
export function getDrafts(req: Request, res: Response) {
  req;
  if(drafted !== undefined){
    return res.send({drafts: drafted});
  }else{
    res.status(400).send('Undefined list of drafts');
    return;
  }
  
}


/**saves the contents of the given draft to the server and expects a draft type passed in, a string
 * representing the current name and the id that represents the id of the current draft
 * sends back a list of drafts, the name of the drafter who joined and the id of the current draft 
 * in the list of drafts
 */
export function join(req: Request, res: Response) {
  const draft = req.body.draft;
  const name =req.body.name;
  const id = req.body.id;
  drafted[id]= draft;
  if(draft !== undefined || name !== undefined || id !== undefined){
    return res.send({drafts: drafted, name: name, id: id});
  }else{
    res.status(400).send('Undefined contents, name, or ID');
    return;
  }  
}

/** clears the list of drafts */
export function reset(){
  let i = 0;
  const length : number = drafted.length;
   while(i < length){
    drafted.pop();
    i = i +1;
   }
}

/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
  } else {
    res.json(`Hi, ${name}`);
  }
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string|undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}
