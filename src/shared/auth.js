
export const saveUserData = (data) => {
  const { role_id, role_name, person, username, email, optionMenu, referral_code } = data.data;
  const userData = {
    firstName: person.first_name,
    middleName: person.middle_name,
    lastName: person.last_name,
    roleId: role_id,
    roleName: role_name,
    username: username,
    email: person.email,
    referralCode: referral_code,
  };
  localStorage.setItem("userData", JSON.stringify(userData));
  if (optionMenu && optionMenu.length > 0) {
    localStorage.setItem("menus", JSON.stringify(optionMenu));
  }
};

export const getUserData = () => {
  const userDataJSON = localStorage.getItem('userData');
  if (userDataJSON) {
    return JSON.parse(userDataJSON);
  }
  return null;
};

export const clearUserData = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("menus");
};
