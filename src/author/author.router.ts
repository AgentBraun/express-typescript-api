import express, { request } from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as AuthorService from './author.service';

export const authorRouter = express.Router();

// GET List of all Authors
authorRouter.get('/', async (request: Request, response: Response) => {
  try {
    const authors = await AuthorService.listAuthors();
    return response.status(200).json(authors);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

// GET author by ID
authorRouter.get('/:id', async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const author = await AuthorService.getAuthor(id);
    if (author) {
      return response.status(200).json(author);
    } else {
      return response.status(404).json('Author could not be found.');
    }
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//POST: Create a author
//params: firstname, lastname
authorRouter.post(
  '/',
  body('firstName').isString(),
  body('lastName').isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const author = request.body;
      const newAuthor = await AuthorService.createAuthor(author);
      return response.status(201).json(newAuthor);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//PUT: Updating an Author
//params: firstname, lastname
authorRouter.put(
  '/:id',
  body('firstName').isString(),
  body('lastName').isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
      const author = request.body;
      const updatedAuthor = await AuthorService.updateAuthor(author, id);
      return response.status(200).json(updatedAuthor);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//DELETE: Delete an Author
//params: id
authorRouter.delete('/:id', async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await AuthorService.deleteAuthor(id);
    return response.status(204).json('Author has been succesfully deleted.');
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
