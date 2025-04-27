const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const snapshot = await db.collection('posts').get();
    const posts = snapshot.docs.map(doc => doc.data());
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new post
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = { title, content, timestamp: new Date() };
    await db.collection('posts').add(newPost);
    res.status(201).send('Post added');
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Important: Use dynamic port for Azure
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
