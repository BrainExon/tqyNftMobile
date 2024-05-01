import {isArray} from './util';
/**
 * Update Challenge User's list with userId
 * @param jsonData
 * @param userId
 * @returns {{data: string, success: boolean, error: string}}
 */
export const insertChallengeUser = async (data, userId) => {
  console.log(
    `\n====\n[insertChallengeUser] TYPEOF data: ${typeof data}\n=====\n`,
  );
  console.log(`[insertChallengeUser] data: ${JSON.stringify(data)}`);
  console.log(
    `[insertChallengeUser] data.users: ${JSON.stringify(data.users)}`,
  );
  console.log(
    `[insertChallengeUser] isArray(data.users): ${JSON.stringify(
      isArray(data.users),
    )}`,
  );
  if (data && isArray(data.users)) {
    console.log('[insertChallengeUser] ADDING USER TO USERS Array');
    data.users.push(userId);
    //const updatedJsonData = JSON.stringify(data);
    return {success: true, data: data, error: ''};
  } else {
    console.log(
      `[insertChallengeUser] isArray(data.users): ${JSON.stringify(
        isArray(data.users),
      )}`,
    );
    return {
      success: false,
      data: '',
      error: "Error: 'users' array not found in the Challenge JSON data",
    };
  }
};
