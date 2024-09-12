const ensureOwner = (user, query = {}) => {
    if (!user) throw new Error('Not authenticated');
    return { ...query, owner: user.userId };
  };
  
  module.exports = { ensureOwner };