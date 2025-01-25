const usernameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
const realNameBeforeTitleCaseRegex = /^([A-Za-z]+)([\s-][A-Za-z]+)*$/;

export function validateUsername(username: string): boolean {
    return usernameRegex.test(username);
}

export function validateRealNameBeforeTitleCase(realName: string): boolean {
    return realNameBeforeTitleCaseRegex.test(realName);
}
