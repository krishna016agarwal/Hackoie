import User from "../models/user.js";
import Recommendation from "../models/recommendation.js";

export const findMatchingUsers = async (
  requirements = [],
  excludeUserId,
  ticketId,
  hackathonKey,
  limit = 10
) => {
  if (!Array.isArray(requirements) || requirements.length === 0) {
    return;
  }

  const WEIGHTS = {
    SKILL: 2,
    COLLEGE: 2,
    YEAR: 1,
    GENDER: 1
  };

  const normalizedRequirements = requirements.map(r =>
    r.toString().trim().toLowerCase()
  );

  const users = await User.find(
    {
      isProfileComplete: true,
      _id: { $ne: excludeUserId }
    },
    { password: 0 }
  ).lean();

  const recommendations = users
    .map(user => {
      let score = 0;
      const matchedSkills = [];

      // Skills
      if (Array.isArray(user.skills)) {
        user.skills.forEach(skill => {
          if (
            normalizedRequirements.includes(
              skill.toString().trim().toLowerCase()
            )
          ) {
            matchedSkills.push(skill);
            score += WEIGHTS.SKILL;
          }
        });
      }

      // College
      if (
        user.college &&
        normalizedRequirements.includes(user.college.toLowerCase())
      ) {
        score += WEIGHTS.COLLEGE;
      }

      // Year
      if (
        user.year &&
        normalizedRequirements.includes(user.year.toLowerCase())
      ) {
        score += WEIGHTS.YEAR;
      }

      // Gender
      if (
        user.gender &&
        normalizedRequirements.includes(user.gender.toLowerCase())
      ) {
        score += WEIGHTS.GENDER;
      }

      if (score === 0) return null;

      return {
        user: user._id,
        score,
        matchedSkills
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (!recommendations.length) return;

  // 🔐 Prevent duplicate recommendation generation
  await Recommendation.findOneAndUpdate(
    { ticket: ticketId },
    {
      ticket: ticketId,
      hackathonKey,
      createdBy: excludeUserId,
      recommendations
    },
    { upsert: true, new: true }
  );
};