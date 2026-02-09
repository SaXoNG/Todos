const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export default isValidObjectId;
