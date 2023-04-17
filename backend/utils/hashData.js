import bcrypt from "bcrypt";

const hashData = async (data, saltRounds = 10) => {
  try {
    const hashedData = bcrypt.hashSync(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw error;
  }
};

export default hashData;
