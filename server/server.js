require('dotenv').config();
const express = require('express');
const app = express();
const { cloudinary } = require('./utils/cloudinary');

app.use(express.json({ limit: '50mb' }));

app.get('api/images', async (req, res) => {
  const { resources } = await cloudinary.search
    .expression('folder: profile')
    .sort_by('public_id', 'desc')
    .max_results(30)
    .execute();
  const publicIds = resources.map((file) => file.public_id);
  res.json({ publicIds });
});

app.post('/api/upload', async (req, res) => {
  try {
    const fileStr = req.body.data;

    const uploadedResponse = await cloudinary.uploader.upload(
      fileStr,
      {
        upload_preset: 'profile',
      },
      (error, result) => {
        console.log(result, error);
      }
    );
    console.log(uploadedResponse);
    res.json({ message: 'Image uploaded' });
  } catch (err) {
    res.status(500).json({
      message: 'Error with server',
      error: err,
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[SERVER]: App is listening on ${PORT}`);
});
