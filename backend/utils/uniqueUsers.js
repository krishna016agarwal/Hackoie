export const collectUniqueUsers = (ticket) => {
  const map = new Map();

  if (ticket.createdBy?.email) {
    map.set(ticket.createdBy.email, ticket.createdBy);
  }

  for (const member of ticket.members || []) {
    if (member?.email) {
      map.set(member.email, member);
    }
  }

  return [...map.values()];
};
