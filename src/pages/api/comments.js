import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const commentsFilePath = path.join(process.cwd(), 'comments.json');

  if (req.method === 'GET') {
    const existingComments = JSON.parse(fs.readFileSync(commentsFilePath, 'utf8'));
    res.status(200).json(existingComments);
  } else if (req.method === 'POST') {
    const newComment = req.body;
    const existingComments = JSON.parse(fs.readFileSync(commentsFilePath, 'utf8'));
    const updatedComments = [...existingComments, newComment];
    fs.writeFileSync(commentsFilePath, JSON.stringify(updatedComments, null, 2));
    res.status(200).json(updatedComments);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}