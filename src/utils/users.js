export const mapNameToId = (name, users) => {
  const filteredArray = users.filter((user) => user.name === name);

  if (filteredArray[0]) return filteredArray[0]._id;

  return false;
};

export const mapNamesToIds = (names, usersArray) => {

    const userIdArray = names.map((name) => mapNameToId(name, usersArray) );

    return userIdArray;

}