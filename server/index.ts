import express from 'express';
import type { Application, Request, Response } from 'express';
import { readFile } from 'fs/promises';
import path from 'path';

import schema from 'schema';

const port = process.env.PORT ?? 3000;
const delayTimeout = 5000;

const app: Application = express();

/* Imitating 5 seconds delay on server */
app.use((req, res, next) => {
  setTimeout(next, delayTimeout);
});

app.get('/api/users', async (req: Request, res: Response) => {
  const { email, number } = req.query;

  /* Validation */
  try {
    await schema.validate(req.query);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({
        message: error.message,
      });
    }
  }

  try {
    /* Reading data from JSON */
    const pathToData = path.join(process.cwd(), '../', 'data', 'users.json');
    const json = await readFile(pathToData, { encoding: 'utf-8' });
    const users = JSON.parse(json);

    /* Filtering users */
    const filteredUsers = users.filter((user: { email: string; number?: string }) => {
      if (number === undefined) {
        return user.email === email;
      }
      return user.email === email && user.number === number;
    });

    return res.status(200).send({
      users: filteredUsers,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Unexpected error occured during reading data on server. Try again later.',
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
