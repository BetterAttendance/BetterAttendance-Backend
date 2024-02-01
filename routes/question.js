const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const methods = require("../utils/questionUtils");
const short = require("short-uuid");

const DEBUG = true;

router.get("/get", async (req, res) => {
  const questions = [];

  /* If the parameter is given n number:
    http://<domain>.com/question/get?quantity=n 
    Else, the get function will generate 3 questions by default
  */
  const numQuestion = req.query.quantity ? parseInt(req.query.quantity) : 3; 

  console.log("=> question/getQuestions: GET request received");

  for (let i = 0; i < numQuestion; i++) {
    const contents = methods.generateQuestion();
    const answerIndex = methods.getRandomInteger(contents.length);
    const pickedAnswer = contents[answerIndex];
    const uuid = short().new();

    if (DEBUG) {
      console.log(`Generated contents for question ${i + 1}: `, contents);
      console.log(`Generated answerIndex for question ${i + 1}: `, answerIndex);
      console.log(`Generated answer for question ${i + 1}: `, pickedAnswer);
      console.log(`Generated UUID for question ${i + 1}: `, uuid);
    }

    const question = new Question({
      _id: uuid,
      type: "number",
      answer: pickedAnswer,
    });

    if (DEBUG) {
      console.log(`Question number ${i + 1} created... Showing:`);
      console.log(question);
    }

    await question.save();

    if (DEBUG) {
      console.log(`Question number ${i + 1} saved on MongoDB...`);
    }

    const responseObj = {
      _id: uuid,
      type: "number",
      contents: contents,
    };

    if (DEBUG) {
      console.log(`Response object ${i + 1} created... Showing:`);
      console.log(responseObj);
    }

    questions.push(responseObj);
  }

  res.send(questions);

  if (DEBUG) {
    console.log("Response sent...");
  } 
});

router.post("/validate", async (req, res) => {
  console.log("=> question/validate: POST request received");
  try {
    const question = await Question.findOne({ _id: req.body._id });

    if (DEBUG) {
      console.log("Showing request body:");
      console.log(req.body);
      console.log("Search by _id found... Showing:");
      console.log(question);
      console.log("Comparison result:");
      console.log(
        req.body.answer === question.answer
          ? "Answer is the same"
          : "Answer is NOT the same",
      );
    }

    if (req.body.answer === question.answer) {
      res.send({ correct: true });
      if (DEBUG) {
        console.log("True response sent...");
      }
    } else {
      res.send({ correct: false });
      if (DEBUG) {
        console.log("False response sent...");
      }
    }
  } catch {
    if (DEBUG) {
      console.log("Search by _id NOT found...");
      console.log("Sending 404 status and error response to requester...");
    }
    res.status(404);
    res.send({ error: "Question doesn't exist!" });

    if (DEBUG) {
      console.log("Response sent...");
    }
  }
});

module.exports = router;
