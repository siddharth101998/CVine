import React, { useState } from 'react';
import axios from 'axios';

function ChatComponent() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [bottleName, setBottleName] = useState('');
    const [recommendation, setRecommendation] = useState('');

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

    return (
        <div>
            <h2>Chat with AI</h2>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
            <p><strong>AI:</strong> {response}</p>

            <h2>Wine Recommendation</h2>
            <input
                type="text"
                value={bottleName}
                onChange={(e) => setBottleName(e.target.value)}
                placeholder="Enter bottle name"
            />
            <button onClick={recommendWine}>Recommend</button>
            <p><strong>Recommended Wine:</strong> {recommendation}</p>
        </div>
    );
}

export default ChatComponent;