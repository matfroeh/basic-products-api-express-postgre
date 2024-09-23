import express from 'express';
import { createPost, deletePost, getPosts, getPostById, updatePost } from './crudOperations.js';
import { regex, returnErrorWithMessage } from './utils.js';

