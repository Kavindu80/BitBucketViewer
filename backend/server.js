const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const BITBUCKET_API_URL = 'https://api.bitbucket.org/2.0';

app.use(cors());
app.use(express.json());

const validateCredentials = async (workspace, accessToken) => {
  try {
    const response = await axios.get(
      `${BITBUCKET_API_URL}/repositories/${workspace}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 5000 
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Validation error:', error.message);
    return false;
  }
};
app.post('/api/validate', async (req, res) => {
  const { workspace, accessToken } = req.body;

  if (!workspace || !accessToken) {
    return res.status(400).json({ error: "Workspace and access token are required." });
  }

  const alphanumericRegex = /^[a-zA-Z0-9-_]+$/;
  if (!alphanumericRegex.test(workspace)) {
    return res.status(400).json({ error: "Invalid workspace format." });
  }

  try {
    const isValid = await validateCredentials(workspace, accessToken);
    
    if (isValid) {
      res.json({ message: "Authentication successful" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.get('/api/projects', async (req, res) => {
  const { workspace } = req.query;
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!workspace || !accessToken) {
    return res.status(400).json({ error: "Workspace and access token are required." });
  }

  const alphanumericRegex = /^[a-zA-Z0-9-_]+$/;
  if (!alphanumericRegex.test(workspace)) {
    return res.status(400).json({ error: "Invalid workspace format." });
  }

  try {
    const response = await axios.get(
      `${BITBUCKET_API_URL}/repositories/${workspace}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const repositories = response.data.values.map(repo => ({
      name: repo.name,
      slug: repo.slug,
      description: repo.description,
      updated_on: repo.updated_on,
    }));

    res.json({ repositories });
  } catch (error) {
    console.error('Error fetching repositories:', error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch repositories. Check your workspace or token." });
  }
});

app.get('/api/commits', async (req, res) => {
  const { workspace, repoSlug } = req.query;
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!workspace || !repoSlug || !accessToken) {
    return res.status(400).json({ error: "Workspace, repoSlug, and access token are required." });
  }

  const alphanumericRegex = /^[a-zA-Z0-9-_]+$/;
  if (!alphanumericRegex.test(workspace) || !alphanumericRegex.test(repoSlug)) {
    return res.status(400).json({ error: "Invalid workspace or repoSlug format." });
  }

  try {
    const response = await axios.get(
      `${BITBUCKET_API_URL}/repositories/${workspace}/${repoSlug}/commits`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const commits = response.data.values.map(commit => ({
      hash: commit.hash,
      message: commit.message,
      author: commit.author.raw,
      date: commit.date,
    }));

    res.json({ commits });
  } catch (error) {
    console.error('Error fetching commits:', error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch commits. Check your workspace, repoSlug, or token." });
  }
});

app.get('/', (req, res) => {
  res.send('Bitbucket Dashboard Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});