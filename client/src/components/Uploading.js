import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

export const Uploading = (props) => {
  const [fileInputState, setFileInputState] = useState('');
  const [previewSource, setPreviewSource] = useState(false);

  const handleInputChange = async (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { 'Content-type': 'application/json' },
      });
    } catch (err) {
      console.error('Upload error -->', err);
    }
  };

  return (
    <div>
      <Container>
        <Form style={{ width: 300 }} onSubmit={handleSubmitFile}>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label>Upload your image</Form.Label>
            <Form.Control
              type='file'
              onChange={handleInputChange}
              value={fileInputState}
            />
            <Button type='submit' className='mt-2'>
              Submit
            </Button>
          </Form.Group>
        </Form>

        {previewSource && (
          <img src={previewSource} alt='chosen' style={{ height: '300px' }} />
        )}
      </Container>
    </div>
  );
};
