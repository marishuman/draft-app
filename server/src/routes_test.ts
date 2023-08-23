import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';

import { Dummy, create, save, reset, DraftType, getDrafts} from './routes';


describe('routes', function() {

  it('create', function() {
    
    //tests whether the create function sends back the proper list of drafts and id
    const draft: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body:{draft: draft}});
    const res1 = httpMocks.createResponse();
    create(req1, res1);
    
    const newDraft: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 2,
      soFar: []
    }
    const newDraftArr : DraftType[] = [];
    newDraftArr.push(newDraft);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getData(), {drafts: newDraftArr, id: 0});

    //tests whether the create function sends back the proper list of drafts and id 
    //when there is a draft saved
    const draft2: DraftType = {
      names: ["mariana", "shuman"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body: {draft: draft2}});
    const res2 = httpMocks.createResponse();
    create(req2, res2);
    
    const newDraft2: DraftType = {
      names: ["mariana", "shuman"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 2,
      soFar: []
    }

    newDraftArr.push(newDraft2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepEqual(res2._getData(), {drafts: newDraftArr, id: 1});

    reset();
    
  });

  it('save', function() {

    //tests whether the save function sends back the correct draft and name
    const draft: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body: {draft: draft}});
    const res1 = httpMocks.createResponse();
    create(req1, res1);
    const newDraft: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 2,
      soFar: []
    }
    const newDraftArr : DraftType[] = [];
    newDraftArr.push(newDraft);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {drafts: newDraftArr, id: 0});


    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {draft: newDraft, pick:"broccoli", id: 0}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    const savedDraft: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles"],
      current: 1,
      rounds: 1,
      soFar: [["candy", "broccoli"]]
    }

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {draft: savedDraft, name: "food"});
    reset();


    //tests whether the save function returns the correct draft and name when 
    //there's multiple drafts created
    const draft2: DraftType = {
      names: ["team1", "team2"],
      contents: ["person1", "person2"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const draft3: DraftType = {
      names: ["mariana", "shuman"],
      contents: ["pink", "purple"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body: {draft: draft2}});
    const res3 = httpMocks.createResponse();
    create(req3, res3);
    //assert.strictEqual(res1._getStatusCode(), 200);

    const newDraftArr2 : DraftType[]= []
    newDraftArr2.push(draft2);

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body: {draft: draft3}});
    const res4 = httpMocks.createResponse();
    create(req4, res4);

    newDraftArr2.push(draft3);

        const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/save', body: {draft: draft2, pick:"person1", id: 0}});
    const res5 = httpMocks.createResponse();
    save(req5, res5);

    const savedDraft2: DraftType = {
      names: ["team1", "team2"],
      contents: ["person2"],
      current: 1,
      rounds: 1,
      soFar: [["team1", "person1"]]
    }

    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {draft: savedDraft2, name: "team2"});

    reset();
  });

  it('getDrafts', function() {

    //tests whether the getDrafts returns the correct list of drafts when the 
    //length of the list is 1
     const draft: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body:{draft: draft}});
    const res1 = httpMocks.createResponse();
    create(req1, res1);

    const req1b = httpMocks.createRequest(
        {method: 'POST', url: '/api/getDrafts'});
    const res1b = httpMocks.createResponse();
    getDrafts(req1b, res1b);
    const newDraftArr2 : DraftType[] = [];
   

    const draft1b: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 2,
      soFar: []
    }

     newDraftArr2.push(draft1b);
    assert.strictEqual(res1b._getStatusCode(), 200);
    assert.deepEqual(res1b._getData(), {drafts: newDraftArr2});
    
    //tests whether the getDrafts returns the correct list of drafts when the 
    //length of the list is more than 1
    const draft2: DraftType = {
      names: ["team1", "team2"],
      contents: ["person1", "person2"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body:{draft: draft2}});
    const res2 = httpMocks.createResponse();
    create(req2, res2);

    const req2b = httpMocks.createRequest(
        {method: 'POST', url: '/api/getDrafts'});
    const res2b = httpMocks.createResponse();
    getDrafts(req2b, res2b);
    const draft2b: DraftType = {
      names: ["team1", "team2"],
      contents: ["person1", "person2"],
      current: 0,
      rounds: 2,
      soFar: []
    }

    newDraftArr2.push(draft2b);

    assert.strictEqual(res2b._getStatusCode(), 200);
    assert.deepEqual(res2b._getData(), {drafts: newDraftArr2});
    
    reset();
  });

  it('Reset', function() {

    //tests whether the reset function correctly deletes all 
    //the values in the list of drafts
    const resetDraft: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body:{draft: resetDraft}});
    const res1 = httpMocks.createResponse();
    create(req1, res1);
    
    const resetDraft1b: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 2,
      soFar: []
    }
    const newDraftArr : DraftType[] = [];
    newDraftArr.push(resetDraft1b);

    reset();

    assert.deepEqual(res1._getData(), {drafts: [], id: 0});

    //tests whether the reset function correctly deletes all 
    //the values in the list of drafts
    const draft2: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 1,
      soFar: []
    }
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/create', body: {draft: draft2}});
    const res2 = httpMocks.createResponse();
    create(req2, res2);
    
    const newDraft2: DraftType = {
      names: ["candy", "food"],
      contents: ["skittles", "broccoli"],
      current: 0,
      rounds: 2,
      soFar: []
    }

    newDraftArr.push(newDraft2);

    reset();

    assert.deepEqual(res2._getData(), {drafts: [], id: 0});
  });


  it('Dummy', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}});
    const res1 = httpMocks.createResponse();
    Dummy(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
  });

});
