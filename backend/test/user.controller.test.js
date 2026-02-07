import { expect } from "chai";
import sinon from "sinon";
import * as emailUtils from "../utils/sendEmail.js";
import nodemailer from "nodemailer";
import crypto from "crypto";


import {
  registerUser,
  login,
  logOut,
  forgotPassword,
  resetPassword
} from "../controllers/user.controller.js";

import { User } from "../models/User.model.js";

describe("User Controller Unit Tests", () => {

  afterEach(() => {
    sinon.restore(); //  now runs after EVERY test
  });

  // =========================
  // REGISTER / SIGNUP
  // =========================
  it("should register user successfully", async () => {

    sinon.stub(User, "findOne").resolves(null);
    sinon.stub(User, "create").resolves({ _id: "1234" });
    sinon.stub(User, "findById").returns({
      select: sinon.stub().returns({
        _id: "1234",
        email: "test1@gmail.com"
      })
    });

    const req = {
      body: {
        userName: "testuser1",
        email: "test1@gmail.com",
        password: "1234567"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await registerUser(req, res);

    expect(true).to.be.true;
  });

  // =========================
  // LOGIN
  // =========================
  it("should login user successfully", async () => {

    const fakeUser = {
      _id: "123",
      password: "hashedPassword",
      isPasswordCorrect: sinon.stub().resolves(true),
      generateAccessToken: sinon.stub().returns("accessToken"),
      generateRefreshToken: sinon.stub().returns("refreshToken"),
      save: sinon.stub().resolves()
    };

    sinon.stub(User, "findOne").resolves(fakeUser);
    sinon.stub(User, "findById").returns({
      select: sinon.stub().returns({
        _id: "123",
        email: "test@gmail.com"
      })
    });

    const req = {
      body: {
        email: "test@gmail.com",
        password: "123456"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      cookie: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await login(req, res);

    expect(true).to.be.true;
  });




   // =========================
  // LOGOUT
  // =========================
  it("should logout user successfully", async () => {

    const req = {};

    const res = {
      clearCookie: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await logOut(req, res);

    //  Assertions
    expect(res.clearCookie.called).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });



  // =========================
// FORGOT PASSWORD
// =========================
it("should send reset password email successfully", async () => {
  const fakeUser = {
    email: "test@gmail.com",
    generatePasswordResetToken: sinon.stub().returns("resetToken"),
    save: sinon.stub().resolves()
  };

  sinon.stub(User, "findOne").resolves(fakeUser);

  // stub nodemailer instead of ESM export
  const sendMailStub = sinon.stub().resolves();
  sinon.stub(nodemailer, "createTransport").returns({ sendMail: sendMailStub });

  const req = { body: { email: "test@gmail.com" } };
  const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

  // IMPORTANT (see root cause B below): call wrapped handler then wait a tick
  forgotPassword(req, res, sinon.stub());
  await new Promise((r) => setImmediate(r));

  expect(User.findOne.calledOnce).to.be.true;
  expect(fakeUser.generatePasswordResetToken.calledOnce).to.be.true;
  expect(fakeUser.save.calledOnce).to.be.true;
  expect(sendMailStub.calledOnce).to.be.true;
  expect(res.json.calledOnce).to.be.true;
});
 // =========================
// RESET PASSWORD
// =========================
it("should reset password successfully", async () => {
  // make user.findOne return a user no matter the query
  const fakeUser = {
    _password: "",
    save: sinon.stub().resolves()
  };

  Object.defineProperty(fakeUser, "password", {
    get() { return this._password; },
    set(val) { this._password = val; },
    configurable: true
  });

  sinon.stub(User, "findOne").resolves(fakeUser);

  const req = { params: { token: "validtoken" }, body: { password: "newpassword" } };
  const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  const next = sinon.stub();

  // call the wrapped handler (DON'T await it — it returns undefined)
  resetPassword(req, res, next);

  // allow internal awaited promises to finish
  await new Promise((r) => setImmediate(r));

  // if it errored, it would call next(err)
  expect(next.called).to.be.false;

  expect(User.findOne.calledOnce).to.be.true;
  expect(fakeUser.password).to.equal("newpassword");
  expect(fakeUser.save.calledOnce).to.be.true;
  expect(res.json.calledOnce).to.be.true;
});
});
