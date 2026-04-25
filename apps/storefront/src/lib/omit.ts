// CRIT-5 fix: loop variable 'key' was never used — was always deleting user['password']
// Changed to delete user[key] inside the loop
export function omitUser<User, Key extends keyof User>(
   user: User,
   ...keys: Key[]
): Omit<User, Key> {
   for (const key of keys) {
      delete user[key]
   }
   return user
}
