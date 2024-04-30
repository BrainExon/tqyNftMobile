/**
 * Update Challenge User's list with userId
 * @param jsonData
 * @param userId
 * @returns {{data: string, success: boolean, error: string}}
 */
export const insertChallengeUser = async (data, userId) => {
  if (data.data && Array.isArray(data.data.users)) {
    data.data.users.push(userId);
    const updatedJsonData = JSON.stringify(data);
    return {success: true, data: JSON.stringify(updatedJsonData), error: ''};
  } else {
    return {
      success: false,
      data: '',
      error: "Error: 'users' array not found in the Challenge JSON data",
    };
  }
};
