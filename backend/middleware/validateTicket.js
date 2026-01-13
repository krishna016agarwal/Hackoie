export const validateTicketBody = (req, res, next) => {
  const { title, requirementsText } = req.body;

  if (!title || title.length < 5) {
    return res.status(400).json({
      message: "Invalid ticket title"
    });
  }

  if (requirementsText && requirementsText.length > 100) {
    return res.status(400).json({
      message: "Requirements too long"
    });
  }

  next();
};