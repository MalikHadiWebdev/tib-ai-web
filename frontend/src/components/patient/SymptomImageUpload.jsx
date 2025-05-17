import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaCamera, FaCheck, FaTimes } from 'react-icons/fa';

const UploadContainer = styled.div`
  margin-top: var(--space-4);
`;

const UploadLabel = styled.p`
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--neutral-700);
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const UploadArea = styled.div`
  border: 2px dashed var(--neutral-400);
  border-radius: var(--border-radius-md);
  padding: var(--space-5);
  text-align: center;
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
  
  &:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-light);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: var(--space-2);
`;

const UploadText = styled.p`
  color: var(--neutral-600);
  margin-bottom: 0;
`;

const ImagePreview = styled.div`
  margin-top: var(--space-4);
  position: relative;
  display: inline-block;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
`;

const ImageActions = styled.div`
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  display: flex;
  gap: var(--space-2);
`;

const ImageActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  color: ${props => props.remove ? 'var(--error-color)' : 'var(--success-color)'};
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast), transform var(--transition-fast);
  
  &:hover {
    background-color: white;
    transform: scale(1.1);
  }
`;

const SymptomImageUpload = ({ onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create a preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
      onImageUpload(file);
    };
    fileReader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImageFile(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <UploadContainer>
      <UploadLabel>
        <FaCamera /> Upload an image of your symptom (optional)
      </UploadLabel>
      
      {!previewUrl ? (
        <UploadArea onClick={handleUploadClick}>
          <UploadIcon>
            <FaCamera />
          </UploadIcon>
          <UploadText>Click to upload or drag and drop</UploadText>
          <UploadText>JPG, PNG or GIF (max. 5MB)</UploadText>
          <HiddenInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
          />
        </UploadArea>
      ) : (
        <ImagePreview>
          <PreviewImage src={previewUrl} alt="Symptom preview" />
          <ImageActions>
            <ImageActionButton onClick={handleRemoveImage} remove>
              <FaTimes />
            </ImageActionButton>
          </ImageActions>
        </ImagePreview>
      )}
    </UploadContainer>
  );
};

export default SymptomImageUpload;