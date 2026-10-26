const { validationResult } = require("express-validator");
const User = require("../models/User");
const { signToken } = require("../utils/token");
const { recordActivity } = require("../utils/activity");

function validationError(res, req) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(422).json({ message: "Please correct the form fields.", errors: errors.array() });
  return true;
}

function profilePayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    organizationName: user.organizationName,
    organizationMission: user.organizationMission,
    createdAt: user.createdAt,
  };
}

async function signup(req, res, next) {
  try {
    if (validationError(res, req)) return;
    const { name, email, password, role = "donor", phone, address, organizationName, organizationMission } = req.body;
    if (!["donor", "ngo"].includes(role)) {
      return res.status(400).json({ message: "New accounts can be created only as donors or NGOs." });
    }
    if (role === "ngo" && (!organizationName || !organizationMission)) {
      return res.status(422).json({ message: "NGO registration requires an organization name and mission." });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: "An account with this email already exists." });

    const user = await User.create({ name, email, password, role, phone, address, organizationName, organizationMission });
    await recordActivity({ action: "Account created", actorId: user._id, targetType: "User", targetId: user._id, details: `${role} account registered` });
    return res.status(201).json({ token: signToken(user), user: profilePayload(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    if (validationError(res, req)) return;
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }
    if (!user.isActive) return res.status(403).json({ message: "This account has been disabled." });
    await recordActivity({ action: "User signed in", actorId: user._id, targetType: "User", targetId: user._id, details: "JWT session issued" });
    return res.json({ token: signToken(user), user: profilePayload(user) });
  } catch (error) {
    return next(error);
  }
}

async function getMe(req, res) {
  return res.json({ user: profilePayload(req.user) });
}

async function updateMe(req, res, next) {
  try {
    if (validationError(res, req)) return;
    const allowed = ["name", "phone", "address", "organizationName", "organizationMission"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    await req.user.save();
    await recordActivity({ action: "Profile updated", actorId: req.user._id, targetType: "User", targetId: req.user._id, details: "Profile information changed" });
    return res.json({ user: profilePayload(req.user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { signup, login, getMe, updateMe };
