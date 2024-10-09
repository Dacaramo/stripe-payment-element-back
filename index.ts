import express, { Request, Response } from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripeClient = new Stripe('SECRET_KEY');
const port = 5000;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.post('/payment-intents', async (req: Request, res: Response) => {
  try {
    const { currency } = req.body;

    const { id, client_secret } = await stripeClient.paymentIntents.create({
      amount: 1000,
      currency,
    });

    res.json({
      clientSecret: client_secret,
      paymentIntentId: id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch(
  '/payment-intents/:paymentIntentId',
  async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.params;
      const { currency } = req.body;

      const { client_secret } = await stripeClient.paymentIntents.update(
        paymentIntentId,
        {
          amount: 1000,
          currency,
        }
      );

      res.json({
        clientSecret: client_secret,
      });
    } catch (error) {
      console.error('Error update payment intent:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
