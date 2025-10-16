export const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || '23ui23uiu23ubib2ui23'
);
export const expiresIn: string = '9h';
