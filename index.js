const express = require('express');
const app = express();
app.use(express.json());

let impulses = []; // Pamięć RAM na impulsy

// Endpoint do przyjmowania impulsów
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

    res.json({ success: true, message: "Impuls zapisany." });
});

// Endpoint do sprawdzania impulsów
app.post('/api/check', (req, res) => {
    const { recipient_id } = req.body;

    if (!recipient_id) {
        return res.status(400).json({ found: false, message: "Brak recipient_id." });
    }

    // Wyszukaj pierwszy impuls dla tego odbiorcy
    const now = new Date();
    const index = impulses.findIndex(pulse => 
        pulse.recipient_id === recipient_id &&
        (!pulse.valid_until || new Date(pulse.valid_until) > now)
    );

    if (index !== -1) {
        const pulse = impulses[index];
        // Usuwamy impuls po odebraniu
        impulses.splice(index, 1);

        return res.json({ found: true, pulse });
    } else {
        return res.json({ found: false });
    }
});

// Endpoint GET do sprawdzenia działania serwera
app.get('/', (req, res) => {
    res.send('PRTS Impulse Memory Server is live!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`PRTS Impulse Memory Server running on port ${port}`);
});
