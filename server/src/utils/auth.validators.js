// src/utils/auth.validators.js
export const isEmail = (email) => typeof email === 'string' && email.includes('@') && email.length <= 254;

export const isUsername = (username) =>
  typeof username === 'string' && username.trim().length >= 2 && username.trim().length <= 20;

export const isPassword = (password) => typeof password === 'string' && password.length >= 8 && password.length <= 50;
