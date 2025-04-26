const express = require('express');
const app = express();
app.use(express.json());

let impulses = []; // Pamięć RAM na przechowywane impulsy

// Endpoint POST /api/store - przyjmowanie impulsów
app.post('/api/store', (req, res) => {
    const { recipient_id, pulse_text, pulse_type, valid_until } = req.body;

    if (!recipient_id || !pulse_text || !pulse_type) {
        return res.status(400).json({ success: false, message: "Brakuje wymaganych pól." });
    }

    impulses.push({
        recipient_id,
        pulse_text,
        pulse_type,
        valid_until: valid_until || null
    });

    console.log(`[STORE] Impuls zapisany dla: ${recipient_id}`);
    res.json({ success: true, message: "Impuls zapisany." });
});

// Endpoint POST /api/check - sprawdzanie impulsów
app.post('/api/check', (req, res) => {
    const { recipient_id } = req.body;

    if (!recipient_id) {
        return res.status(400).json({ found: false, message: "Brak recipient_id." });
    }

    const now = new Date();
    const index = impulses.findIndex(pulse => 
        pulse.recipient_id === recipient_id &&
        (!pulse.valid_until || new Date(pulse.valid_until) > now)
    );

    if (index !== -1) {
        const pulse = impulses[index];
        impulses.splice(index, 1); // Usuń impuls po odebraniu
        console.log(`[CHECK] Impuls znaleziony i wydany dla: ${recipient_id}`);
        return res.json({ found: true, pulse });
    } else {
        console.log(`[CHECK] Brak impulsu dla: ${recipient_id}`);
        return res.json({ found: false });
    }
});

// Endpoint GET / - test serwera
app.get('/', (req, res) => {
    res.send('PRTS Impulse Memory Server is live!');
});

// Serwer start
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`PRTS Impulse Memory Server running on port ${port}`);
});
