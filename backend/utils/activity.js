const ActivityLog = require("../models/ActivityLog");

async function recordActivity({ action, actorId, targetType, targetId, details }) {
  try {
    await ActivityLog.create({ action, actorId, targetType, targetId, details });
  } catch (error) {
    console.error("[Activity Log]", error.message);
  }
}

module.exports = { recordActivity };
