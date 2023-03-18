import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  "CIopPGYk+6qV5/WCx21c43D8g0cyODl4sFCEF4IAiBFaOTTN+ehIXDapd527xMp/kXoiQq2P/t8D3X6/IIJaOA==";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  "CIopPGYk+6qV5/WCx21c43D8g0cyODl4sFCEF4IAiBFaOTTN+ehIXDapd527xMp/kXoiQq2P/t8D3X6/IIJaOA==";
const ACCESS_TOKEN_EXPIRATION = {
  expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "1440m",
};
const REFRESH_TOKEN_EXPIRATION = {
  expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "30m",
};

export const createTokens = async (payload) => {
  const accessToken = jwt.sign(
    payload,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION
  );

  const refreshToken = jwt.sign(
    payload,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION
  );

  let tokens = { accessToken /*refreshToken*/ };
  return tokens;
};

export const verifyAccessToken = async (accessToken) => {
  const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
  return decoded;
};

export const verifyRefreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  return decoded;
};
