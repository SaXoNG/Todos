import mongoose from "mongoose";

type WithId = {
  _id: mongoose.Types.ObjectId | string;
  __v?: any;
  [key: string]: any;
};

const prepareForResponse = <T extends WithId | WithId[]>(input: T) => {
  const cleanObj = (obj: WithId) => {
    const { _id, __v, ...rest } = obj;
    return { id: _id.toString(), ...rest };
  };

  if (Array.isArray(input)) {
    return input.map(cleanObj);
  } else {
    return cleanObj(input);
  }
};

export default prepareForResponse;
