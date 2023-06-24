const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const REGEX_PASSWORD = /^(?=.*[A-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
const REGEX_EMAIL = /.+@.+\..+/;

module.exports = {
  REGEX_PASSWORD,
  REGEX_EMAIL,
  REGEX_URL,
};
