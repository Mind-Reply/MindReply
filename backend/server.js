const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock State for Demo (Replace with MongoDB in production)
let userCredits = 5;

// MRagent Logic
app.post('/api/agent/chat', async (req, res) => {
    const { message, category } = req.body;
    
    // Simulate AI latency
    await new Promise(r => setTimeout(r, 1500));

    let response = "An exquisite question. I recommend focusing on transparent intention and empathetic validation.";
    if (category === 'restructuring') {
        response = "An exquisite question. For restructuring communications, I recommend a framework of transparent intention, empathetic validation, and future-oriented reassurance. Would you like me to refine a draft with these principles?";
    } else if (category === 'client-correspondence') {
        response = "For client correspondence, I suggest leading with value demonstration and maintaining professional warmth. Shall we draft a subject line that optimizes for open rates?";
    }

    userCredits -= 1;

    res.json({
        response,
        analysis: {
            clarity: 96,
            trustResonance: 92,
            persuasiveSubtext: 89,
            professionalIntuition: 98
        },
        remainingCredits: userCredits
    });
});

// Micro-Tools Logic
app.post('/api/tools/use', (req, res) => {
    const { toolName, input } = req.body;
    const costs = { 'Text Refiner': 1, 'Email Polisher': 2, 'Call Scripter': 2 };
    const cost = costs[toolName] || 1;

    if (userCredits < cost) {
        return res.status(402).json({ error: 'Insufficient credits' });
    }

    userCredits -= cost;
    
    // Mock Tool Processing
    let result = input;
    if (toolName === 'Email Polisher') {
        result = `[Professional Subject]: Strategic Alignment Update\n\nDear Colleague,\n\n${input}\n\nBest regards,\n[Your Name]`;
    } else if (toolName === 'Text Refiner') {
        result = input.replace(/\b(gonna|wanna)\b/gi, match => match === 'gonna' ? 'going to' : 'want to');
    }

    res.json({ result, remainingCredits: userCredits });
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', credits: userCredits }));

app.listen(PORT, () => console.log(`🚀 MindReply API running on port ${PORT}`));
