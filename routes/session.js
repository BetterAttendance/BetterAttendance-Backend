const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const short = require('short-uuid');

router.post('/create-session', async (req, res) => {
  try {
    const uuid = short().new();
    const host = req.body.host ? req.body.host : 'Anonymous';
    const session = new Session({
      _id: uuid,
      host,
    });

    await session.save();

    res.status(201).send({ sessionId: uuid });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).send({error: 'Error creating session'});
  }
});

router.get("/post-session", async (req, res) => {
  try {
    const session = await Session.findOne();
    const sessionID = session._id;

    // Send the session ID to the client
    res.send({ sessionID: sessionID });
  } catch (error) {
    console.error("Error fetching session ID: ", error);
    res.status(500).send({error: "Server cannot find the session with matching ID"});
  }
});

router.get("/join/:sessionID", async (req, res) => {
  try {
    const sessionID = req.params.sessionID;
    const session = await Session.findById(sessionID);

    if (!session) {
      return res.status(404).send({ error: "Session not found" });
    }

    // Extract host from the session data
    const host = session.host || 'Anonymous';

    // Render the join page and pass the host as a variable
    res.send({ sessionID, host });
  } catch (error) {
    console.error("Error fetching session data: ", error);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
