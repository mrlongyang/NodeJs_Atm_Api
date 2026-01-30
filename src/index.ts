import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.post("/atm/withdraw", (req: Request, res: Response) => {
    const { amount } = req.body as { amount: number };

    const MIN = 10000;
    const MAX = 2000000;


    // Validate amount 
    if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
    }

    if (amount < MIN || amount > MAX) {
        return res.status(400).json({ 
            message: `Amount must be between &{MIN} and &{MAX}`,
        });
    }

    if (amount % 10000 !== 0) {
        return res.status(400).json({
            message: "Amount must be divisible by 10,000",
        });
    }

    // Banknote 
    const notes = [100000, 50000, 20000, 10000];
    let remaining = amount;

    const result: Record<number, number> = {};

    for (const note of notes) {
        const count = Math.floor(remaining / note);
        if (count > 0) {
            result[note] = count;
            remaining -= note * count;
        }
    }
    
    res.json({
        amount,
        banknotes: result,
    });
})

const port = 4000;

app.listen(port, () => {
    console.log(`ATM API is running on http://localhost:${port}`);
});