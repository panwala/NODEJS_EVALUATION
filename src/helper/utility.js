import bcrypt from "bcryptjs";
import qs from "qs";

export const encrypt = async (data) => {
  const salt = await bcrypt.genSalt(10);
  let mystr = await bcrypt.hash(data, salt);
  return mystr;
};

export const decrypt = async (data, hashData) => {
  const match = await bcrypt.compare(data, hashData);
  return match;
};

export const standardStructureStringToJson = (queryString) => {
  return qs.parse(queryString);
};

export const standardStructureJsonToString = (standardJson) => {
  return qs.stringify(standardJson);
};

export const handleResponse = (res, dataObject, statusCode = 200) => {
  const { message, count, data } = dataObject;
  res.status(statusCode).json({
    error: false,
    statusCode,
    message,
    count,
    data,
  });
};

export const createResponse = (message, data = {}, count = 0) => {
  let response = {
    message,
    count,
    data,
  };

  return response;
};
export const databaseparser = (data) => {
  return data["message"]["errors"][0]["message"];
};

export const getMINPadvalue = (value) => {
  value = value.toString();
  let hexStr = value.padStart(4, "0");
  return hexStr;
};

export const filterMac = (macId) => {
  let MAC = macId.split(":").join("");
  return MAC;
};
