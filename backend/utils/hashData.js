import bcrypt from "bcrypt";

export const hashData = async (data, saltRounds = 10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw error;
  }
};

export const verifyHashData = async (unhashed, hashed) => {
  try {
    const match = await bcrypt.compareSync(unhashed, hashed);
    return match;
  } catch (error) {
    throw error;
  }
};

export const comparePassword = async (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};

