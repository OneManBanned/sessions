import bcrypt from "bcryptjs";

export function validatePassword(password, hash, salt) {
  const hashVerify = bcrypt.hashSync(password, salt);
    return hash === hashVerify;
}

export function genPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const genHash = bcrypt.hashSync(password, salt);

  return { hash: genHash, salt: salt };
}
