import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt);
  return pass;
}
export const comparePassword = async (input, exist) => {
  return await bcrypt.compare(input, exist);
}