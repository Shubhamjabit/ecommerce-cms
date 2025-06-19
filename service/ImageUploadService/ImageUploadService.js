import HTTP from "service/HttpService/HttpService";

export const imageUpload = async () => {
const ORDER ={}

  const res = await HTTP.post(`http/ggfggffgfg`, ORDER);
  return res.data ? res.data : false;
};
