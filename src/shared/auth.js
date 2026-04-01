
export const saveUserData = (data) => {
  const { role_id, role_name, person, username, email, options, referral_code } = data.data;
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
  if (options && options.length > 0) {
    localStorage.setItem("menus", JSON.stringify(options));
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
  localStorage.removeItem("auth_token");
};
