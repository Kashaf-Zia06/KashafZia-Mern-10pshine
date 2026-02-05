import { expect } from "chai";
import sinon from "sinon";

import { User } from "../models/User.model.js";
import { Notes } from "../models/Notes.model.js";

import {
  addNotes,
  editNotes,
  deleteNotes,
  getUserNotes,
} from "../controllers/notes.controller.js";

describe("Notes Controller Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  const tick = () => new Promise((r) => setImmediate(r));

  // =========================
  // ADD NOTES
  // =========================
  it("should add a note successfully", async () => {
    sinon.stub(User, "findById").resolves({ _id: "u1" });

    // stub Notes constructor + instance save
    const saveStub = sinon.stub().resolves();
    const NotesCtorStub = sinon.stub(Notes.prototype, "save").callsFake(saveStub);

    const req = {
      body: { title: "t1", content: "c1" },
      user: { _id: "u1" },
      cookies: {},
      headers: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const next = sinon.stub();

    addNotes(req, res, next);
    await tick();

    expect(next.called).to.be.false;
    expect(User.findById.calledOnceWith("u1")).to.be.true;

    // prototype save was called once (meaning new Notes().save() happened)
    expect(NotesCtorStub.calledOnce).to.be.true;

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should fail addNotes if user not authenticated", async () => {
    const req = {
      body: { title: "t1", content: "c1" },
      user: null,
      cookies: {},
      headers: {},
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    addNotes(req, res, next);
    await tick();

    // asyncHandler should route errors to next(err)
    expect(next.calledOnce).to.be.true;
    const err = next.firstCall.args[0];
    expect(err).to.exist;
    expect(err.statusCode || err.status).to.equal(401); // ApiError typically has statusCode
  });

  it("should fail addNotes if title missing", async () => {
    const req = {
      body: { content: "c1" },
      user: { _id: "u1" },
      cookies: {},
      headers: {},
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    addNotes(req, res, next);
    await tick();

    expect(next.calledOnce).to.be.true;
    const err = next.firstCall.args[0];
    expect(err).to.exist;
    expect(err.statusCode || err.status).to.equal(401);
  });

  it("should fail addNotes if content missing", async () => {
    const req = {
      body: { title: "t1" },
      user: { _id: "u1" },
      cookies: {},
      headers: {},
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    addNotes(req, res, next);
    await tick();

    expect(next.calledOnce).to.be.true;
    const err = next.firstCall.args[0];
    expect(err).to.exist;
    expect(err.statusCode || err.status).to.equal(401);
  });

  // =========================
  // GET USER NOTES
  // =========================
  it("should get user notes successfully (returns array)", async () => {
    const notesArr = [{ _id: "n1" }, { _id: "n2" }];
    sinon.stub(Notes, "find").resolves(notesArr);

    const req = { user: { _id: "u1" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await getUserNotes(req, res);

    expect(Notes.find.calledOnceWith({ userId: "u1" })).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;

    const payload = res.json.firstCall.args[0];
    expect(payload.success).to.be.true;
    expect(payload.data).to.deep.equal(notesArr);
  });

  it("should return 500 on getUserNotes error", async () => {
    sinon.stub(Notes, "find").rejects(new Error("db fail"));

    const req = { user: { _id: "u1" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await getUserNotes(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    const payload = res.json.firstCall.args[0];
    expect(payload.success).to.be.false;
    expect(payload.data).to.deep.equal([]);
  });

  // =========================
  // EDIT NOTES
  // =========================
  it("should edit a note successfully", async () => {
    const updated = { _id: "n1", title: "new", content: "newc" };
    sinon.stub(Notes, "findOneAndUpdate").resolves(updated);

    const req = {
      params: { id: "n1" },
      body: { title: "new", content: "newc" },
      user: { _id: "u1" },
    };

    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    editNotes(req, res, next);
    await tick();

    expect(next.called).to.be.false;
    expect(Notes.findOneAndUpdate.calledOnce).to.be.true;

    // verify query includes BOTH note id and userId
    const [query, update, options] = Notes.findOneAndUpdate.firstCall.args;
    expect(query).to.deep.equal({ _id: "n1", userId: "u1" });
    expect(update).to.deep.equal({ title: "new", content: "newc" });
    expect(options).to.deep.equal({ new: true });

    expect(res.status.calledWith(200)).to.be.true;
    const payload = res.json.firstCall.args[0];
    expect(payload.success).to.be.true;
    expect(payload.data).to.deep.equal(updated);
  });

  // =========================
  // DELETE NOTES
  // =========================
  it("should delete a note successfully", async () => {
    sinon.stub(Notes, "findOneAndDelete").resolves({ _id: "n1" });

    const req = {
      params: { noteId: "n1" },
      user: { _id: "u1" },
    };

    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    deleteNotes(req, res, next);
    await tick();

    expect(next.called).to.be.false;
    expect(Notes.findOneAndDelete.calledOnceWith({ _id: "n1", userId: "u1" })).to
      .be.true;

    expect(res.status.calledWith(200)).to.be.true;
    const payload = res.json.firstCall.args[0];
    expect(payload.success).to.be.true;
  });

  it("should return 400 if noteId missing", async () => {
    const req = { params: {}, user: { _id: "u1" } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    deleteNotes(req, res, next);
    await tick();

    expect(res.status.calledWith(400)).to.be.true;
    const payload = res.json.firstCall.args[0];
    expect(payload.success).to.be.false;
  });
});
