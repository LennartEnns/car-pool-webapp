const usernameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
const realNameBeforeTitleCaseRegex = /^([A-Za-z]+)([\s-][A-Za-z]+)*$/;
const usernameQueryRegex = /^[A-Za-z0-9_]+$/;
const realNameQueryRegex = /^([A-Za-z]+[\s-])+$/;

export function validateUsername(username: string): boolean {
    return usernameRegex.test(username);
}

export function validateRealNameBeforeTitleCase(realName: string): boolean {
    return realNameBeforeTitleCaseRegex.test(realName);
}

export function validateUsernameSearchQuery(query: string): boolean {
    return usernameQueryRegex.test(query);
}

export function validateRealNameSearchQuery(query: string): boolean {
    return realNameQueryRegex.test(query);
}
