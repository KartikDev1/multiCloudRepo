const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Init Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

// Get all posts
app.get('/posts', async (req, res) => {
  const snapshot = await db.collection('posts').get();
  const posts = snapshot.docs.map(doc => doc.data());
  res.json(posts);
});

// Add a new post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const newPost = { title, content, timestamp: new Date() };
  await db.collection('posts').add(newPost);
  res.status(201).send('Post added');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
