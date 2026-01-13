const buildUserTokens = (user) => {
  return [
    ...(user.skills || []),
    user.gender,
    user.college,
    user.branch,
    user.about
  ]
    .filter(Boolean)
    .map(v => v.toLowerCase());
};

export default buildUserTokens;
