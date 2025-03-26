import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Grid, Input } from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
function ChatComponent() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [bottleName, setBottleName] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [processing, setProcessing] = useState(false);
    const [wineDetails, setWineDetails] = useState('');

    // Function to handle chat
    const sendMessage = async () => {
        try {
            console.log("input", input);
            const res = await axios.post('http://localhost:5002/api/chat', { message: input });
            setResponse(res.data.reply);
        } catch (error) {
            console.error('Error fetching response:', error);
            setResponse("Error getting response from AI.");
        }
    };

    // Function to recommend wine
    const recommendWine = async () => {
        if (!bottleName) {
            alert("Please enter a bottle name.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5002/api/recommend", { bottleName });
            setRecommendation(res.data.recommendation);
        } catch (error) {
            console.error("Error fetching recommendation:", error);
            setRecommendation("Error getting wine recommendation.");
        }
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageUrl(URL.createObjectURL(file)); // Show preview
        }
    };


    const processImage = async () => {
        if (!image) {
            alert("Please upload an image first.");
            return;
        }

        setProcessing(true);
        try {
            console.log("📌 Uploading image to Firebase...");


            const currentDateTime = new Date().toISOString().replace(/:/g, "-");
            const fileName = `uploaded_images/${currentDateTime}-${image.name}`;

            // Convert image file to blob
            const fileBlob = await fetch(URL.createObjectURL(image)).then((res) => res.blob());
            const fileType = "image/jpeg";  // Adjust based on file type if needed

            // Create storage reference
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, fileBlob, { contentType: fileType });

            // Monitor upload progress
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload Progress: ${progress}%`);
                },
                (error) => {
                    console.error("❌ Upload error:", error);
                    alert("Upload failed. Check Firebase Storage permissions.");
                    setProcessing(false);
                },
                async () => {
                    // ✅ Get the Firebase Image URL
                    const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log("✅ Firebase Image URL:", imageUrl);

                    // ✅ Send the Firebase URL to the backend
                    console.log("📌 Sending image URL to backend...");
                    const res = await axios.post("http://localhost:5002/process-image", { imageUrl });
                    if (res.data.message) {
                        // If backend returns an error message
                        setWineDetails({ message: res.data.message });
                    } else {
                        // If wine is found
                        setWineDetails(res.data);
                    }
                    alert("✅ Image uploaded successfully!");
                    setProcessing(false);
                }
            );
        } catch (err) {
            console.error("❌ Error uploading image:", err);
            setProcessing(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Grid container spacing={3}>
                {/* Left Side - Chat & Recommendation */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3, borderRadius: 3, boxShadow: 3 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>Chat with AI</Typography>
                        <TextField
                            fullWidth
                            label="Ask something..."
                            variant="outlined"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        <Button variant="contained" color="primary" fullWidth onClick={sendMessage}>
                            Send
                        </Button>
                        <Typography variant="body1" sx={{ marginTop: 2 }}><strong>AI:</strong> {response}</Typography>
                    </Paper>

                    <Paper sx={{ padding: 3, borderRadius: 3, boxShadow: 3, marginTop: 3 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>Wine Recommendation</Typography>
                        <TextField
                            fullWidth
                            label="Enter bottle name"
                            variant="outlined"
                            value={bottleName}
                            onChange={(e) => setBottleName(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        <Button variant="contained" color="secondary" fullWidth onClick={recommendWine}>
                            Recommend
                        </Button>
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            <strong>Recommended Wine:</strong> {recommendation}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Right Side - Image Upload & Processing */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3, borderRadius: 3, boxShadow: 3 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>Upload and Process Image</Typography>

                        {/* Image Upload */}
                        <Input type="file" onChange={handleImageUpload} sx={{ marginBottom: 2 }} />
                        {imageUrl && (
                            <Box sx={{ marginY: 2 }}>
                                <img src={imageUrl} alt="Preview" style={{ width: "100%", borderRadius: 10 }} />
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={processImage}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Process Image"}
                        </Button>

                        {/* Wine Details */}
                        {wineDetails && (
                            <Box sx={{ marginTop: 3, padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                                {wineDetails.message ? (
                                    <Typography variant="body1" sx={{ color: "red" }}>
                                        {wineDetails.message}
                                    </Typography>
                                ) : (
                                    <>
                                        <Typography variant="h6">
                                            <strong>Wine Name:</strong> {wineDetails.name}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Winery:</strong> {wineDetails.Winery}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Region:</strong> {wineDetails.region}
                                        </Typography>
                                        <img src={wineDetails.imageUrl} alt={wineDetails.name} style={{ width: "100%", borderRadius: 10 }} />
                                    </>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ChatComponent;