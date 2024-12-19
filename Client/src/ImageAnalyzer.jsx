import React, { useState } from 'react';

const ImageCaptionGenerator = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch('/api/generate-caption', { // Use relative path for proxy
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to generate caption');
            }

            const data = await response.json();
            setCaption(data.caption);
        } catch (err) {
            setError('Failed to generate caption. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Image Caption Generator</h1>

            <div style={styles.uploadContainer}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                <button
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    style={styles.uploadButton}
                >
                    Choose Image
                </button>
            </div>

            {imagePreview && (
                <div style={styles.previewContainer}>
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={styles.imagePreview}
                    />
                </div>
            )}

            {error && (
                <div style={styles.error}>{error}</div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!selectedFile || loading}
                style={{
                    ...styles.generateButton,
                    ...((!selectedFile || loading) && styles.disabledButton)
                }}
            >
                {loading ? 'Generating...' : 'Generate Caption'}
            </button>

            {caption && (
                <div style={styles.captionContainer}>
                    <h2 style={styles.captionTitle}>Generated Caption:</h2>
                    <p style={styles.captionText}>{caption}</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
    },
    uploadContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    fileInput: {
        display: 'none',
    },
    uploadButton: {
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    previewContainer: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    imagePreview: {
        maxWidth: '100%',
        maxHeight: '400px',
        borderRadius: '8px',
    },
    error: {
        color: '#f44336',
        textAlign: 'center',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#ffebee',
        borderRadius: '4px',
    },
    generateButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px',
    },
    disabledButton: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
    captionContainer: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
    },
    captionTitle: {
        color: '#333',
        marginBottom: '10px',
        fontSize: '18px',
    },
    captionText: {
        color: '#666',
        lineHeight: '1.6',
        fontSize: '16px',
    },
};

export default ImageCaptionGenerator;