/**
 * Saves user data to localStorage.
 * @param {object} data - The user data object from the API response.
 */

export const saveUserData = (data) => {
  console.log('SaveUserData', data);
  const { role_id, role_name, person, username, email, optionMenu } = data.data;
  const userData = {
    firstName: person.first_name,
    middleName: person.middle_name,
    lastName: person.last_name,
    roleId: role_id,
    roleName: role_name,
    username: username,
    email: person.email,
  };
  localStorage.setItem("userData", JSON.stringify(userData));
  if (optionMenu && optionMenu.length > 0) {
    localStorage.setItem("menus", JSON.stringify(optionMenu));
  }
};

/**
 * Retrieves user data from localStorage.
 * @returns {object|null} The parsed user data object or null if not found.
 */
export const getUserData = () => {
  const userDataJSON = localStorage.getItem('userData');
  if (userDataJSON) {
    return JSON.parse(userDataJSON);
  }
  return null;
};

/**
 * Removes user data and token from localStorage.
 */
export const clearUserData = () => {
  localStorage.clear();
};
