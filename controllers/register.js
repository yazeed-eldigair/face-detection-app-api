const handleRegister = (req, res, bcrypt, db) => {
  const { email, name, password } = req.body;
  if(!email || !name || !password) {
      return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);

  // User transaction when modifying database items
  db.transaction((trx) => {
    trx("login")
      .insert({
        hash: hash,
        email: email,
      })
      .returning("email")
      .then((loginEmail) => {
        trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            console.log(user[0]);
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};
